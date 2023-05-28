const Axios = require('axios');
const express = require("express");

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

const BOT_TOKEN = "6268049973:AAHa1fSTqMLzyTBjsb1Y5I4_q3yNm9c5bvs";
const BASE_URL = `https://api.telegram.org/bot${BOT_TOKEN}/`;

// Rota POST
app.post("/", async (req, res) => {
    const receivedJSON = req.body;
    const chat_id = receivedJSON.message.chat.id;
    const userInput = receivedJSON.message.text;
    
    const imageNasaData = await getNasaData();

    if(userInput.toLowerCase().includes('foto da nasa'))
        await sendImage(chat_id, imageNasaData);
    else if(userInput.toLowerCase().includes('foto da phoebe')) {
        const imagePhoebe = {
            title: "Uma foto da Phoebe aqui",
            url: "https://photos.google.com/share/AF1QipNNvDMyU2_1j0AargNh6OSK7IYBY2duMGGF-6XCRh0Pj9qXNWdXvjGoFlnYbohVqA/photo/AF1QipMosXq6fRhaIuvW7QIM66AdnmxXvyLz3OoiyBfk?key=MlpUMFRlZGNpZkZMT1U2V1Y2UTV5UTlIb05BV293"
        }
        await sendImage(chat_id, imagePhoebe);
        await sendMessage(chat_id, "pronto");
    }
    else
        await sendMessage(chat_id, "Olá, seja muito bem vindo ao bot de imagens.%0A%0A- Temos uma foto do espaço todos os dias por aqui! Basta digitar: 'Foto da Nasa'%0A- Se veio por conta da cachorrinha mais linda, envie 'Foto da Phoebe'");

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