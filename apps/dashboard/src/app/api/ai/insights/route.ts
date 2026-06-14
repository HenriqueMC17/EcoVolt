import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const dynamic = "force-dynamic";

const STREAMING_TEXTS = [
  "Algoritmo de efici\u00eancia identificou que reprogramar a refrigera\u00e7\u00e3o do Setor C para as 05:30 evita a tarifa de ponta. Economia estimada de R$ 1.840/m\u00eas.",
  "Alerta de Anomalia: O Setor B registrou um consumo 18% maior que a m\u00e9dia hist\u00f3rica durante o hor\u00e1rio de standby. Poss\u00edvel vazamento de corrente ou ar-condicionado deixado ligado.",
  "Previs\u00e3o de Produ\u00e7\u00e3o Solar: Devido \u00e0 aproxima\u00e7\u00e3o de uma frente fria e alta nebulosidade amanh\u00e3, a gera\u00e7\u00e3o solar cair\u00e1 25%. Recomendamos gerenciar a carga das baterias."
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get("eventId");
  
  const headers = {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
  };

  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey !== "dummy") {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      const prompt = `Você é o Ecopilot, assistente de inteligência energética do EcoVolt.
Analise a telemetria do evento com ID ${eventId || "geral"}.
Sugira uma otimização de custo energético, fale sobre um padrão incomum (se houver) e dê uma dica de sustentabilidade em português.
Seja conciso, direto e profissional (máximo de 3 parágrafos).`;

      const resultStream = await model.generateContentStream({
        contents: [{ role: "user", parts: [{ text: prompt }] }]
      });
      
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of resultStream.stream) {
              const chunkText = chunk.text();
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunkText })}\n\n`));
            }
          } catch (e) {
            console.error("Error during stream generation:", e);
          } finally {
            controller.close();
          }
        }
      });
      
      return new Response(stream, { headers });
    } catch (e) {
      console.error("Gemini API Error, falling back to simulated stream", e);
    }
  }

  // Fallback / Development simulated SSE stream
  const randomIndex = eventId ? (eventId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % STREAMING_TEXTS.length) : 0;
  const textToStream = STREAMING_TEXTS[randomIndex];
  const words = textToStream.split(" ");
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let index = 0;
      
      const sendNextWord = () => {
        if (index < words.length) {
          const chunk = words[index] + (index === words.length - 1 ? "" : " ");
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`));
          index++;
          // Simulate SSE natural network delay
          setTimeout(sendNextWord, 80 + Math.random() * 100);
        } else {
          controller.close();
        }
      };

      sendNextWord();
    }
  });

  return new Response(stream, { headers });
}
