import "./styles/theme.css";
import "./styles/site.css";
import { HeroStrip } from "./components/layout/HeroStrip";
import { PageShell } from "./components/layout/PageShell";
import { FAQPage } from "./components/faq/FAQPage";

export default function App() {
  return (
    <>
      <HeroStrip
        //crumb="Inicio / Centro de ayuda"
        title="Centro de Ayuda / Preguntas Frecuentes"
        subtitle="Encuentra guías rápidas, respuestas y pasos para resolver tus dudas."
      />

      <PageShell>
        <FAQPage />
      </PageShell>
    </>
  );
}
