import config from '../config/env.js';
import messageHandler from '../services/messageHandler.js';

class WebhookController {
  async handleIncoming(req, res) {
    console.log("Incoming webhook message:", JSON.stringify(req.body, null, 2));

    const value = req.body.entry?.[0]?.changes?.[0]?.value;

    const message = value?.messages?.[0];

    if (!message) {
      console.log(
        "Evento entrante pero no es un mensaje (status, reaction, delivery, etc)."
      );
      return res.sendStatus(200);
    }

    const fullMessage = {
      ...message,
      contact: value?.contacts?.[0]   // 👈 ACÁ ESTÁ LA CLAVE
    };

    console.log("Mensaje válido recibido de:", fullMessage.from);

    await messageHandler.handleIncomingMessage(fullMessage);

    res.sendStatus(200);
  }

  verifyWebhook(req, res) {
    console.log('Verificado y entrando');

    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === config.WEBHOOK_VERIFY_TOKEN) {
      console.log('Webhook verified successfully!');
      return res.status(200).send(challenge);
    }

    res.sendStatus(403);
  }
}

export default new WebhookController();