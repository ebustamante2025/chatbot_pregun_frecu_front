import { useState } from "react";
import { Dropdown } from "./Dropdown";

import logoHgi from "../../assets/logo hgi.png";

type NavId =
  | "inicio"
  | "institucional"
  | "productos"
  | "acceso_clientes"
  | "servicios"
  | "contacto"
  | "pagos"
  | "blog"
  | "faq";

export function SiteHeader({
  activeId,
  onNavigate,
}: {
  activeId: string;
  onNavigate: (id: string) => void;
}) {
  const [openAcceso, setOpenAcceso] = useState(false);
  const isActive = (id: NavId) => activeId === id;

  return (
    <header className="hgiHeader">
      <div className="container hgiHeader__row">
        {/* LOGO IZQUIERDA */}
        <a
          href="#"
          className="hgiHeader__logoLink"
          onClick={(e) => {
            e.preventDefault();
            onNavigate("inicio");
          }}
        >
          <img className="hgiHeader__logo" src={logoHgi} alt="HGI" />
        </a>

        {/* NAV CENTRADO */}
        <nav className="hgiNav" aria-label="Navegación principal">
          <button
            className={`hgiNav__item ${isActive("inicio") ? "isActive" : ""}`}
            onClick={() => onNavigate("inicio")}
            type="button"
          >
            Inicio
          </button>

          <button
            className={`hgiNav__item ${isActive("institucional") ? "isActive" : ""}`}
            onClick={() => onNavigate("institucional")}
            type="button"
          >
            Institucional
          </button>

          <button
            className={`hgiNav__item ${isActive("productos") ? "isActive" : ""}`}
            onClick={() => onNavigate("productos")}
            type="button"
          >
            Productos
          </button>

          {/* Acceso Clientes con dropdown */}
          <div className="hgiNav__dropdown">
            <button
              className={`hgiNav__item ${
                isActive("acceso_clientes") || isActive("faq") ? "isActiveSoft" : ""
              }`}
              onClick={() => setOpenAcceso((v) => !v)}
              type="button"
            >
              <span className="hgiNav__icon" aria-hidden="true">👤</span>
              Acceso Clientes <span className="hgiNav__chev">▾</span>
            </button>

            <Dropdown
              open={openAcceso}
              onClose={() => setOpenAcceso(false)}
              items={[
                { id: "crm", label: "Portal CRM", icon: "↪", onClick: () => alert("Portal CRM") },
                { id: "docs", label: "HGIDocs", icon: "📄", onClick: () => alert("HGIDocs") },
                { id: "faq", label: "Preguntas Frecuentes", icon: "❓", onClick: () => onNavigate("faq") },
                { id: "pay", label: "Pagos en Línea", icon: "💳", onClick: () => onNavigate("pagos") },
              ]}
            />
          </div>

          <button
            className={`hgiNav__item ${isActive("servicios") ? "isActive" : ""}`}
            onClick={() => onNavigate("servicios")}
            type="button"
          >
            Servicios
          </button>

          <button
            className={`hgiNav__item ${isActive("contacto") ? "isActive" : ""}`}
            onClick={() => onNavigate("contacto")}
            type="button"
          >
            Contacto
          </button>

          <button
            className={`hgiNav__item ${isActive("pagos") ? "isActive" : ""}`}
            onClick={() => onNavigate("pagos")}
            type="button"
          >
            <span className="hgiNav__icon" aria-hidden="true">💳</span>
            Pagos
          </button>

          <button
            className={`hgiNav__item ${isActive("blog") ? "isActive" : ""}`}
            onClick={() => onNavigate("blog")}
            type="button"
          >
            Blog
          </button>
        </nav>

        {/* CONTACTO DERECHA */}
        <div className="hgiHeader__right">
          <div className="hgiHeader__contact">
            CONTACTO: <b>300 914 21 30</b>
          </div>
        </div>
      </div>

      {/* LÍNEA AZUL DELGADA BAJO EL HEADER (como tu web) */}
      <div className="hgiHeader__blueLine" />
    </header>
  );
}
