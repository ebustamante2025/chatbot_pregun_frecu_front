export type FAQQuestion = { id: string; q: string; a: string };
export type FAQCategory = { id: string; title: string; items: FAQQuestion[] };

// URL del backend API (en Docker, nginx hace proxy de /api al backend)
const API_URL = import.meta.env.VITE_API_URL || "";

/**
 * Carga temas y preguntas desde la API y los convierte al formato FAQCategory[]
 */
export async function fetchFAQData(): Promise<FAQCategory[]> {
  try {
    // Cargar temas y preguntas en paralelo
    const [temasRes, preguntasRes] = await Promise.all([
      fetch(`${API_URL}/api/temas-preguntas`),
      fetch(`${API_URL}/api/preguntas-frecuentes`),
    ]);

    if (!temasRes.ok || !preguntasRes.ok) {
      throw new Error("Error al cargar datos de la API");
    }

    const { temas } = await temasRes.json();
    const { preguntas } = await preguntasRes.json();

    // Convertir al formato FAQCategory[]
    const categories: FAQCategory[] = temas
      .filter((t: { estado: boolean }) => t.estado)
      .map((tema: { id: number; nombre: string }) => ({
        id: String(tema.id),
        title: tema.nombre,
        items: preguntas
          .filter((p: { tema_id: number; estado: boolean }) => p.tema_id === tema.id && p.estado)
          .map((p: { id: number; pregunta: string; respuesta: string }) => ({
            id: String(p.id),
            q: p.pregunta,
            a: p.respuesta,
          })),
      }));

    return categories;
  } catch (error) {
    console.error("Error cargando FAQ:", error);
    return [];
  }
}
