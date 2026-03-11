import { useEffect, useMemo, useState } from "react";
import { fetchFAQData } from "../../data/faqData";
import type { FAQCategory } from "../../data/faqData";
import { FAQSidebar } from "./FAQSidebar";
import { FAQAccordion } from "./FAQAccordion";

/**
 * Normaliza para comparar: guiones bajos → espacios, sin tildes, minúsculas.
 * Así "HGI_NÓMINA" (desde chatbot) coincide con "HGI Nomina" o "HGI Nómina" (botones de la página).
 */
function normalizeForMatch(value: string): string {
  const sinTildes = value
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
  return sinTildes
    .replace(/\s+/g, " ")
    .replace(/_/g, " ")
    .trim()
    .toLowerCase();
}

/** Clave en localStorage donde el chatbot guarda el servicio para presionar el botón sin cambiar la URL */
const FAQ_SERVICIO_CHATBOT_KEY = "faq_servicio_chatbot";

/** Obtener servicio a preseleccionar: primero desde localStorage (chatbot), luego desde URL */
function getServicioParaPreseleccionar(): string {
  if (typeof window === "undefined") return "";
  try {
    const desdeChatbot = window.localStorage.getItem(FAQ_SERVICIO_CHATBOT_KEY);
    if (desdeChatbot && desdeChatbot.trim()) {
      window.localStorage.removeItem(FAQ_SERVICIO_CHATBOT_KEY);
      return desdeChatbot.trim();
    }
  } catch (_) {}
  const p = new URLSearchParams(window.location.search);
  const licencia = (p.get("licencia") ?? "").trim();
  const servicio = (p.get("servicio") ?? "").trim();
  return servicio || licencia;
}

export function FAQPage() {
  const [categories, setCategories] = useState<FAQCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeCat, setActiveCat] = useState<string>("");
  const [query, setQuery] = useState("");
  /** Cuando viene servicio por URL/chatbot y coincide, solo mostramos ese botón en el sidebar */
  const [soloServicioId, setSoloServicioId] = useState<string | null>(null);

  // Cargar datos desde la API al montar y aplicar filtros desde URL (chatbot)
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);

    fetchFAQData().then((data) => {
      if (cancelled) return;

      if (data.length > 0) {
        setCategories(data);
        // Lista de servicios: { id, title, cantidadPreguntas } para comparar con el elegido en el chatbot
        const servicios = data.map((c) => ({ id: c.id, title: c.title, cantidadPreguntas: c.items.length }));
        console.log("[Preguntas frecuentes] Botones de servicios:", servicios);

        const servicioEscogidoChatbot = getServicioParaPreseleccionar();
        const servicioChatbotNorm = normalizeForMatch(servicioEscogidoChatbot);
        if (servicioEscogidoChatbot) {
          console.log("[Preguntas frecuentes] Servicio recibido del chatbot (sin guiones para comparar):", {
            recibido: servicioEscogidoChatbot,
            normalizado: servicioChatbotNorm,
          });
        }

        // Comparar servicio del chatbot (normalizado) con cada categoría: igualdad exacta o que uno contenga al otro (ej. "hginet servicios web" con "hginet servicios web")
        let servicioCoincidente: (typeof data)[0] | null = null;
        if (servicioChatbotNorm) {
          for (let i = 0; i < data.length; i++) {
            const servicio = data[i];
            const nombreServicioNorm = normalizeForMatch(servicio.title);
            const esIgual = nombreServicioNorm === servicioChatbotNorm;
            const incluye = nombreServicioNorm.includes(servicioChatbotNorm) || servicioChatbotNorm.includes(nombreServicioNorm);
            if (esIgual || incluye) {
              servicioCoincidente = servicio;
              break;
            }
          }
        }

        // Presionar el evento del servicio que sea igual al que llegó del chatbot; si no existe o no tiene preguntas, alertar
        if (servicioCoincidente) {
          console.log("[Preguntas frecuentes] Botón de servicio presionado (desde chatbot):", {
            id: servicioCoincidente.id,
            title: servicioCoincidente.title,
            cantidadPreguntas: servicioCoincidente.items.length,
          });
          setActiveCat(servicioCoincidente.id);
          setSoloServicioId(servicioCoincidente.id);
          setQuery("");
        } else {
          setActiveCat(data[0].id);
          setSoloServicioId(null);
          setQuery("");
        }
      } else {
        setError(true);
      }
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, []);

  const category = useMemo(
    () => categories.find((c) => c.id === activeCat) ?? categories[0],
    [activeCat, categories]
  );

  if (loading) {
    return (
      <div className="faqLayout">
        <div className="card sidebar" style={{ padding: 24, textAlign: "center" }}>
          <div className="sidebarTitle">Cargando temas...</div>
        </div>
        <div className="card content" style={{ padding: 24, textAlign: "center", color: "var(--hgi-muted)" }}>
          Cargando preguntas frecuentes...
        </div>
      </div>
    );
  }

  if (error || (!loading && categories.length === 0)) {
    return (
      <div className="card content" style={{ padding: 24, textAlign: "center", color: "var(--hgi-muted)" }}>
        No hay temas disponibles. Agrega temas y preguntas desde el panel de administración.
      </div>
    );
  }

  if (!category) {
    return null;
  }

  return (
    <div className="faqLayout">
      <FAQSidebar
        categories={categories}
        activeId={activeCat}
        onSelect={(id) => {
          const servicio = categories.find((c) => c.id === id);
          if (servicio) {
            console.log("[Preguntas frecuentes] Botón de servicio presionado:", {
              id: servicio.id,
              title: servicio.title,
              cantidadPreguntas: servicio.items.length,
            });
          }
          setActiveCat(id);
        }}
        query={query}
        setQuery={setQuery}
        soloMostrarServicioId={soloServicioId}
      />

      <section className="card content">
        <div className="contentHeader">
          <h2>{category.title}</h2>
          <div className="meta">
            {query.trim() ? `Filtrando por: "${query.trim()}"` : "Selecciona una pregunta para ver la respuesta."}
          </div>
        </div>

        <FAQAccordion items={category.items} query={query} />
      </section>
    </div>
  );
}
