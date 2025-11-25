const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// Token de verificación (elige uno y ponlo también en Meta Business Manager)
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "afgdl336";

// Token de acceso de Meta Cloud API (lo obtienes en developers.facebook.com)
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;

// ID del número de teléfono en WhatsApp Business (lo ves en el panel de Meta)
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

app.use(bodyParser.json());

// ✅ Endpoint de verificación del webhook
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// ✅ Endpoint para recibir mensajes
app.post('/webhook', async (req, res) => {
  console.log("Mensaje recibido:", JSON.stringify(req.body, null, 2));

  if (req.body.entry) {
    const changes = req.body.entry[0].changes[0].value;
    if (changes.messages) {
      const from = changes.messages[0].from; // Número del remitente
      const text = changes.messages[0].text.body; // Texto recibido

      // Responder automáticamente
      await sendMessage(from, `Bienvenido a Anime Offis 🎨. Recibimos tu mensaje: "${text}"`);
    }
  }

  res.sendStatus(200);
});

// ✅ Función para enviar mensajes
async function sendMessage(to, message) {
  try {
    await axios.post(
      `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: to,
        text: { body: message }
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );
    console.log("Mensaje enviado a:", to);
  } catch (error) {
    console.error("Error al enviar mensaje:", error.response ? error.response.data : error.message);
  }
}

// ✅ Endpoint básico para probar que el servidor corre
app.get('/', (req, res) => {
  res.send('Servidor WhatsApp activo en Railway');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
