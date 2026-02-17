import { useEffect, useMemo, useState } from "react";
import { fetchFAQData } from "../../data/faqData";
import type { FAQCategory } from "../../data/faqData";
import { FAQSidebar } from "./FAQSidebar";
import { FAQAccordion } from "./FAQAccordion";

export function FAQPage() {
  const [categories, setCategories] = useState<FAQCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeCat, setActiveCat] = useState<string>("");
  const [query, setQuery] = useState("");

  // Cargar datos desde la API al montar
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);

    fetchFAQData().then((data) => {
      if (cancelled) return;

      if (data.length > 0) {
        setCategories(data);
        setActiveCat(data[0].id);
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
        onSelect={(id) => setActiveCat(id)}
        query={query}
        setQuery={setQuery}
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
