import { useEffect, useState } from "react";
import "./styles/theme.css";
import "./styles/site.css";
import { HeroStrip } from "./components/layout/HeroStrip";
import { PageShell } from "./components/layout/PageShell";
import { FAQPage } from "./components/faq/FAQPage";
import { validarAccesoFAQ, canjearHandoffFAQ } from "./data/faqData";

const FAQ_ACCESS_TOKEN_KEY = "faq_access_token";

function getTokenFromUrl(): string | null {
  if (typeof window === "undefined") return null;
  const p = new URLSearchParams(window.location.search);
  return p.get("token")?.trim() || null;
}

function getOtkFromUrl(): string | null {
  if (typeof window === "undefined") return null;
  const p = new URLSearchParams(window.location.search);
  return p.get("otk")?.trim() || null;
}

/**
 * La página de preguntas frecuentes no muestra nada hasta que el usuario
 * se haya validado con NIT y usuario en el chatbot (el widget abre la FAQ con un token).
 */
export default function App() {
  const [accesoPermitido, setAccesoPermitido] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      let token: string | null = null;
      const otk = getOtkFromUrl();
      if (otk) {
        token = await canjearHandoffFAQ(otk);
        if (token && typeof window !== "undefined") {
          try {
            const url = new URL(window.location.href);
            url.searchParams.delete("otk");
            window.history.replaceState({}, "", url.pathname + (url.search || "") + (url.hash || ""));
          } catch (_) {}
        }
      }
      if (!token) {
        token =
          getTokenFromUrl() ||
          (typeof window !== "undefined" ? window.sessionStorage.getItem(FAQ_ACCESS_TOKEN_KEY) : null);
      }

      if (!token) {
        if (!cancelled) setAccesoPermitido(false);
        return;
      }

      const ok = await validarAccesoFAQ(token);
      if (cancelled) return;
      setAccesoPermitido(ok);
      if (ok) {
        try {
          window.sessionStorage.setItem(FAQ_ACCESS_TOKEN_KEY, token);
          const url = new URL(window.location.href);
          url.searchParams.delete("token");
          url.searchParams.delete("otk");
          window.history.replaceState({}, "", url.pathname + (url.search || "") + (url.hash || ""));
        } catch (_) {}
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (accesoPermitido === null) {
    return (
      <div
        className="faq-loading-access"
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <p style={{ color: "var(--hgi-muted, #676B72)", fontSize: 16 }}>Verificando acceso...</p>
      </div>
    );
  }

  if (!accesoPermitido) {
    return (
      <div
        className="faq-sin-acceso"
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          textAlign: "center",
          fontFamily: "Nunito, system-ui, sans-serif",
        }}
      >
        <div style={{ maxWidth: 480 }}>
          <h1 style={{ fontSize: 22, color: "#1f2535", marginBottom: 12 }}>
            Acceso a Preguntas Frecuentes
          </h1>
          <p style={{ fontSize: 16, color: "#676B72", lineHeight: 1.5, marginBottom: 24 }}>
            Para ver las preguntas frecuentes debe validarse con su <strong>NIT</strong> y{" "}
            <strong>usuario</strong> en el chat de soporte. Abra el chatbot, ingrese el NIT de su
            empresa, valide el director (usuario) y seleccione la licencia. Luego pulse
            &quot;Preguntas frecuentes&quot; en el menú del chat.
          </p>
          <p style={{ fontSize: 14, color: "#94A3B8" }}>
            Hasta entonces no podrá ver el contenido de esta página.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <HeroStrip
        title="Centro de Ayuda / Preguntas Frecuentes"
        subtitle="Encuentra guías rápidas, respuestas y pasos para resolver tus dudas."
      />

      <PageShell>
        <FAQPage />
      </PageShell>
    </>
  );
}
