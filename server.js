
// Cargar variables de entorno lo antes posible
import 'dotenv/config';

// Deshabilitamos la validación global de TLS para desarrollo (opcional)
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';


import express from "express";
import axios from "axios";
import fs from "fs";
import https from "https";

// Instancia de Axios configurada para omitir la validación de certificados en pruebas
const agent = new https.Agent({
  rejectUnauthorized: false // Ignora el certificado, útil para pruebas locales o con proxy
});
const axiosInstance = axios.create({ httpsAgent: agent });


const app = express();
app.use(express.json());

const { WEBHOOK_VERIFY_TOKEN, API_TOKEN, BUSINESS_PHONE, API_VERSION, PORT } = process.env;

app.post("/webhook", async (req, res) => {
  // log incoming messages
  console.log("Incoming webhook message:", JSON.stringify(req.body, null, 2));

  // check if the webhook request contains a message
  // details on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
  const message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];
  console.log('Msj entry => ', req.body.entry)
  console.log('PRE MENSJ =>', req.body.entry?.[0]?.changes[0]?.value?.messages)
  console.log('MSJ => ', message)
  console.log("FROM:", message.from)
  // check if the incoming message contains text
  if (message?.type === "text") {
    try {
      // send a reply message como indican los docs
      await axiosInstance({
        method: "POST",
        url: `https://graph.facebook.com/${API_VERSION}/${BUSINESS_PHONE}/messages`,
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
        data: {
          messaging_product: "whatsapp",
          to: message.from,
          text: { body: "Echo: " + message.text.body },
          context: {
            message_id: message.id, // shows the message as a reply to the original user message
          },
        },
      });

      // marcar el mensaje como leído
      await axiosInstance({
        method: "POST",
        url: `https://graph.facebook.com/${API_VERSION}/${BUSINESS_PHONE}/messages`,
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
        data: {
          messaging_product: "whatsapp",
          status: "read",
          message_id: message.id,
        },
      });
    } catch (error) {
      console.error("Error al comunicarse con WhatsApp Graph API:");
      if (error.response) {
        // La solicitud se realizó y el servidor respondió con un código de estado
        // que no está en el rango de 2xx
        console.error("Data:", JSON.stringify(error.response.data, null, 2));
      } else if (error.request) {
        // La solicitud se realizó pero no se recibió respuesta
        console.error("No se recibió respuesta:", error.request);
      } else {
        // Algo sucedió al configurar la solicitud que provocó un error
        console.error("Mensaje de error:", error.message);
      }
    }
  }

  res.sendStatus(200);
});

// accepts GET requests at the /webhook endpoint. You need this URL to setup webhook initially.
// info on verification request payload: https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  // check the mode and token sent are correct
  if (mode === "subscribe" && token === WEBHOOK_VERIFY_TOKEN) {
    // respond with 200 OK and challenge token from the request
    res.status(200).send(challenge);
    console.log("Webhook verified successfully!");
  } else {
    // respond with '403 Forbidden' if verify tokens do not match
    res.sendStatus(403);
  }
});

app.get("/", (req, res) => {
  res.send(`<pre>Nothing to see here.
Checkout README.md to start.</pre>`);
});

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});