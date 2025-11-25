const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

// Token de verificación que tú inventas
const VERIFY_TOKEN = "afgdl336";

app.use(bodyParser.json());

// Endpoint de verificación del webhook
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

// Endpoint para recibir mensajes
app.post('/webhook', (req, res) => {
  console.log("Mensaje recibido:", JSON.stringify(req.body, null, 2));

  // Aquí puedes procesar el mensaje y responder
  res.sendStatus(200);
});

// Endpoint básico para probar que el servidor corre
app.get('/', (req, res) => {
  res.send('Servidor WhatsApp activo en Railway');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
