import { useMemo } from "react";
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
  /** Si viene del chatbot con servicio coincidente, solo se lista ese tema en el lateral */
  soloMostrarServicioId?: string | null;
}) {
  const categoriesToShow = useMemo(() => {
    if (soloMostrarServicioId == null || soloMostrarServicioId === "") {
      return categories;
    }
    return categories.filter((c) => c.id === soloMostrarServicioId);
  }, [categories, soloMostrarServicioId]);

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
        {categoriesToShow.map((c) => (
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
