import OpenAI from "openai";
import config from "../config/env.js";

const client = new OpenAI({
  apiKey: config.OPENAI_API_KEY,
});

const openAiService = async (message) => {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `
Sos un veterinario profesional de Medpet.

Tu tarea es:
- Responder directamente la consulta del usuario.
- Evaluar si los síntomas pueden ser graves.
- Dar recomendaciones claras y responsables.
- Si detectás signos de urgencia, indicá acudir de inmediato a un centro veterinario Medpet.

Reglas:
- NO pidas datos personales.
- NO inicies interrogatorios.
- NO indiques dosis exactas de medicamentos.
- Podés sugerir medidas generales y preventivas.
- Respondé en el mismo idioma del usuario.
- Sé claro, empático y profesional.
`
        },
        {
          role: "user",
          content: message
        }
      ],
    });

    return response.choices[0]?.message?.content || 
      "Lo siento, no pude generar una respuesta en este momento.";
  } catch (error) {
    console.error("❌ Error en openAiService:", error);
    return "Ocurrió un problema al procesar tu consulta. Por favor, intentá nuevamente o comunicate con un centro Medpet.";
  }
};

export default openAiService;