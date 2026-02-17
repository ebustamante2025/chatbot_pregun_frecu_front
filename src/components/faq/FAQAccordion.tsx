import { useMemo, useState } from "react";
import type { FAQQuestion } from "../../data/faqData";

/**
 * Convierte URLs en enlaces clickeables dentro de un fragmento de texto
 */
function renderLinks(texto: string, keyPrefix: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const partes = texto.split(urlRegex);

  return partes.map((parte, i) => {
    if (urlRegex.test(parte)) {
      return (
        <a
          key={`${keyPrefix}-${i}`}
          href={parte}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#001689",
            fontWeight: 700,
            textDecoration: "underline",
            wordBreak: "break-all",
          }}
        >
          {parte}
        </a>
      );
    }
    return <span key={`${keyPrefix}-${i}`}>{parte}</span>;
  });
}

/**
 * Detecta si una línea empieza con emoji/viñeta o número (1. 2. etc)
 */
const esLineaConViñeta = /^(\d+[\.\)\-]|[\u2022\u25CB\u25CF\u2713\u2714\u2715\u2716\u2717\u2718\u274C\u274E\u2705\u2611\u2610\u25AA\u25AB\u25B6\u25C0\u2600-\u27BF\u{1F300}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2702}-\u{27B0}][\uFE0F\u200D]*)\s*/u;

/**
 * Renderiza el texto formateando líneas con viñetas/emojis/números como lista
 * y convirtiendo URLs en enlaces clickeables
 */
function renderRespuesta(texto: string) {
  // Separar por saltos de línea reales o por emojis/viñetas al inicio
  const lineas = texto.split(/\n/);

  // Verificar si hay líneas con viñetas
  const tieneViñetas = lineas.some((l) => esLineaConViñeta.test(l.trim()));

  if (!tieneViñetas && lineas.length <= 1) {
    // Texto simple sin formato especial
    return renderLinks(texto, "t");
  }

  // Renderizar como líneas separadas
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {lineas.map((linea, idx) => {
        const trimmed = linea.trim();
        if (!trimmed) return null;

        const esViñeta = esLineaConViñeta.test(trimmed);

        return (
          <div
            key={idx}
            style={{
              paddingLeft: esViñeta ? 4 : 0,
              display: "flex",
              alignItems: "flex-start",
              gap: 4,
            }}
          >
            <span>{renderLinks(trimmed, `l${idx}`)}</span>
          </div>
        );
      })}
    </div>
  );
}

export function FAQAccordion({
  items,
  query,
}: {
  items: FAQQuestion[];
  query: string;
}) {
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (x) =>
        x.q.toLowerCase().includes(q) ||
        x.a.toLowerCase().includes(q)
    );
  }, [items, query]);

  return (
    <div className="faqList">
      {filtered.map((it) => {
        const open = openId === it.id;
        return (
          <div key={it.id} className={`faqItem ${open ? "isOpen" : ""}`}>
            <button
              className="faqQ"
              onClick={() => setOpenId((prev) => (prev === it.id ? null : it.id))}
              aria-expanded={open}
            >
              <span>{it.q}</span>
              <span aria-hidden="true">{open ? "▾" : "▸"}</span>
            </button>
            {open ? <div className="faqA">{renderRespuesta(it.a)}</div> : null}
          </div>
        );
      })}
      {filtered.length === 0 ? (
        <div style={{ padding: 16, color: "var(--hgi-muted)", textAlign: "center" }}>
          No hay resultados para el filtro.
        </div>
      ) : null}
    </div>
  );
}
