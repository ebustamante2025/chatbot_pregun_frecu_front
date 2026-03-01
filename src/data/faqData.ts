export type FAQQuestion = { id: string; q: string; a: string };
export type FAQCategory = { id: string; title: string; items: FAQQuestion[] };

type TemaApi = { id: number; nombre: string; estado: boolean };
type PreguntaApi = { id: number; tema_id: number; pregunta: string; respuesta: string; estado: boolean };

// URL del backend API (en Docker, nginx hace proxy de /api al backend)
const API_URL = import.meta.env.VITE_API_URL || "";

/** Decodifica la respuesta como UTF-8 para evitar ?? en tildes y ñ */
async function responseJsonUtf8(res: Response): Promise<unknown> {
  const buffer = await res.arrayBuffer();
  const utf8 = new TextDecoder("utf-8").decode(buffer);
  return JSON.parse(utf8);
}

/**
 * Carga temas y preguntas desde la API y los convierte al formato FAQCategory[]
 * Usa UTF-8 explícito para mostrar bien tildes y ñ.
 */
export async function fetchFAQData(): Promise<FAQCategory[]> {
  try {
    const [temasRes, preguntasRes] = await Promise.all([
      fetch(`${API_URL}/api/temas-preguntas`, { headers: { Accept: "application/json; charset=utf-8" } }),
      fetch(`${API_URL}/api/preguntas-frecuentes`, { headers: { Accept: "application/json; charset=utf-8" } }),
    ]);

    if (!temasRes.ok || !preguntasRes.ok) {
      throw new Error("Error al cargar datos de la API");
    }

    const temasData = (await responseJsonUtf8(temasRes)) as { temas?: TemaApi[] };
    const preguntasData = (await responseJsonUtf8(preguntasRes)) as { preguntas?: PreguntaApi[] };
    const temas: TemaApi[] = temasData.temas ?? [];
    const preguntas: PreguntaApi[] = preguntasData.preguntas ?? [];

    const categories: FAQCategory[] = temas
      .filter((t) => t.estado)
      .map((tema) => ({
        id: String(tema.id),
        title: tema.nombre,
        items: preguntas
          .filter((p) => p.tema_id === tema.id && p.estado)
          .map((p) => ({
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
