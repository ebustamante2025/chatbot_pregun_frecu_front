import type { FAQCategory } from "../../data/faqData";

export function FAQSidebar({
  categories,
  activeId,
  onSelect,
  query,
  setQuery,
  soloMostrarServicioId = null,
}: {
  categories: FAQCategory[];
  activeId: string;
  onSelect: (id: string) => void;
  query: string;
  setQuery: (v: string) => void;
  /** Si está definido (llegó desde el chatbot con un servicio), solo se muestra ese botón; los demás se ocultan */
  soloMostrarServicioId?: string | null;
}) {
  const serviciosVisibles = soloMostrarServicioId
    ? categories.filter((c) => c.id === soloMostrarServicioId)
    : categories;

  return (
    <aside className="card sidebar">
      <div className="sidebarTitle">Preguntas frecuentes</div>

      <div className="searchBox">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar…"
        />
        {query.trim() ? (
          <button className="clearBtn" onClick={() => setQuery("")} aria-label="Limpiar">
            ✕
          </button>
        ) : null}
      </div>

      <div className="sideGroup">
        {serviciosVisibles.map((c) => (
          <button
            key={c.id}
            className={`sideItem ${c.id === activeId ? "isActive" : ""}`}
            onClick={() => onSelect(c.id)}
          >
            {c.title}
          </button>
        ))}
      </div>
    </aside>
  );
}
