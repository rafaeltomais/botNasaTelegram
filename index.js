const Axios = require('axios');
const express = require("express");

const app = express();
app.use(express.json());
const port = 3000;

const BOT_TOKEN = "6268049973:AAHa1fSTqMLzyTBjsb1Y5I4_q3yNm9c5bvs";
const BASE_URL = `https://api.telegram.org/bot${BOT_TOKEN}/`;

// Rota POST
app.post("/", async (req, res) => {
    const receivedJSON = req.body;
    const chat_id = receivedJSON.message.chat.id;
    
    const imageNasaData = await getNasaData();
    
    await sendMessage(chat_id, "Olá, seja muito bem vindo ao bot. Temos uma foto do espaço todos os dias por aqui!");
    await sendImage(chat_id, imageNasaData);

    res.json(receivedJSON);
});

async function sendMessage(chat_id, textMessage) {

    const sendMessageUrl = `sendMessage?chat_id=${chat_id}&text=${textMessage}`;
    const urlFinal = BASE_URL + sendMessageUrl;

    await Axios.get(urlFinal);
}

async function sendImage(chat_id, imageNasaData) {

    const { title, url } = imageNasaData

    const sendPhotoUrl = `sendPhoto?chat_id=${chat_id}&photo=${url}&caption=${title}`;
    const urlFinal = BASE_URL + sendPhotoUrl;

    await Axios.get(urlFinal);
}

async function getNasaData() {
    const { data } = await Axios.get("https://api.nasa.gov/planetary/apod?api_key=6x4eNSnuNwmEeFfgymn5A4fxM5mR14gP5qTNEjDq");
    return data
}

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});