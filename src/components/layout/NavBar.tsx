import { useMemo, useState } from "react";
import { Dropdown } from "./Dropdown";

type NavItem = { id: string; label: string; href?: string; active?: boolean };

export function NavBar({
  activeId,
  onNavigate,
}: {
  activeId: string;
  onNavigate: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const items: NavItem[] = useMemo(
    () => [
      { id: "inicio", label: "Inicio" },
      { id: "institucional", label: "Institucional" },
      { id: "productos", label: "Productos" },
      { id: "faq", label: "Acceso Clientes" }, // este es dropdown en tu estética
      { id: "servicios", label: "Servicios" },
      { id: "contacto", label: "Contacto" },
      { id: "pagos", label: "Pagos" },
      { id: "blog", label: "Blog" },
    ],
    []
  );

  return (
    <div className="nav">
      <div className="container navRow">
        <div className="navLinks">
          {items.map((it) => {
            if (it.id === "faq") {
              return (
                <div key={it.id} className="dropdown">
                  <button
                    className={`navLink ${activeId === it.id ? "isActive" : ""}`}
                    onClick={() => setOpen((v) => !v)}
                  >
                    {it.label} ▾
                  </button>

                  <Dropdown
                    open={open}
                    onClose={() => setOpen(false)}
                    items={[
                      { id: "crm", label: "Portal CRM", icon: "↪", onClick: () => alert("Ir a Portal CRM") },
                      { id: "docs", label: "HGIDocs", icon: "📄", onClick: () => alert("Ir a HGIDocs") },
                      { id: "pay", label: "Pagos en línea", icon: "💳", onClick: () => alert("Ir a pagos") },
                    ]}
                  />
                </div>
              );
            }

            return (
              <button
                key={it.id}
                className={`navLink ${activeId === it.id ? "isActive" : ""}`}
                onClick={() => onNavigate(it.id)}
              >
                {it.label}
              </button>
            );
          })}
        </div>

        <button className="iconPill" onClick={() => alert("Llamar / WhatsApp / Contacto")}>
          CONTACTO: 300 914 21 30
        </button>
      </div>
    </div>
  );
}
