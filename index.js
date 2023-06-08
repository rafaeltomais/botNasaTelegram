const Axios = require('axios');
const express = require("express");
require('dotenv').config()

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

const botToken = process.env.BOT_TOKEN;
const baseURL = `${process.env.BASE_URL}/bot${botToken}/`;
const keyApiNasa = process.env.KEY_API_NASA

const bdPhoebePhotos = [
  {
    title: "Phoebe fazendo pose na cama",
    url: "https://lh3.googleusercontent.com/pw/AJFCJaXjSL1ae63wRJpb_dLoyT6qHuGMhq08Z1JgXyOERJ-Yd3CBxkooQHaZBCXnhoZ3f8CQhU3QrsO5Na-8kgzVzwRC-w0CmyG0eGbxhLteXJYJ1T4jddCyaAWB015guJnlr3Tu6t4VGnas3Lf_f-WRDSkuhA=w703-h937-s-no?authuser=0",
  },
  {
    title: "Phoebe barrigudinha deitada na cama",
    url: "https://lh3.googleusercontent.com/pw/AJFCJaWDvKVBn2aOGLDoJmX0hDyAMuynS35f-lskrsYyfrD-9LwHCIKCvjPiKoLsp5uEy7Q-V7Az7fUKioqzq-hAUigbK3tsAJpBv8D23-jSDLyUMRo9W6hJtyhsaz4fhLuae5yWc7gj3n8a0Z8j6C3p4mk6WQ=w1920-h885-s-no?authuser=0",
  },
  {
    title: "Phoebe atenta pois destruiu a caminha",
    url: "https://lh3.googleusercontent.com/pw/AJFCJaW0Nt6hvMdv147nptNaAE8vUTJy8CapqIu5iHqZZut6edKlvH3Svz-qKjldcAr0Axs8wSsjkYumBV7oYufF858vEZ-6A_SI9ZnpVhrsk2ZBmuV205yc2rBnqy3wRB48Tab80zWmKOStqqVw6HA0f169WA=w527-h937-s-no?authuser=0",
  },
  {
    title: "Phoebe morta de cansaço deitada na entrada",
    url: "https://lh3.googleusercontent.com/pw/AJFCJaVGb9_5bnkbouajUh_iNSVft5rlbpXdFHC2e5Fw8loenOwbvXN63Y_d_cddUtxcGELpvExi38zrJRsnDEDLA1twyr8v8qANPum8OQRxAD0aDSE3bdBdY9VVlAp0bQozm2V-fE43SDcwUdbA6ViCuIxBbQ=w527-h937-s-no?authuser=0",
  },
  {
    title: "Phoebe debochada",
    url: "https://lh3.googleusercontent.com/pw/AJFCJaWL-EFq4OI34inTWTW_wJxgnULsRdx3Mb-6_aeDA7NyhIZ0hsy1VsPXxLUhX4Tex9V8snA2xYq92miv619jmJh_YzhGrD_Ia-9uQfj_dy00ABTMhOogNyQyt6UfFFUtKA8pL1ibdE13-GhXGicwMYS1Lw=w527-h937-s-no?authuser=0",
  },
  {
    title: "Phoebe com comida e água fresca e roendo madeira",
    url: "https://lh3.googleusercontent.com/pw/AJFCJaW0RLbMo1S1Ne4S7eUW4XxxaH5i7rfB63kzFH-j_aV1rQoMOju1mmw4Y06Nx_DZJqrQt7dGi_DFWlf4rR0ky8pzp2WqsDEFXCiboHy57yaUM-Pv11nJ1fQq2_Z0BzRjESevFOWLu_a7eGCrXrhPxroZsA=w527-h937-s-no?authuser=0",
  },
  {
    title: "Phoebe curiosa andando de carro",
    url: "https://lh3.googleusercontent.com/pw/AJFCJaX1kUXM4yt4-tZLowea8OFGJmE2FikGCNe5uaJfSZ7v57eiezBga-9JtCQsOdkgmSNNoI4Qen1KXvVQ_nO3vp8PQRlyk-pCIYr4ymVzBdtUcDRw7j00KhK0O2w86qVS-LLq_0sGrGP4vgdwMAm20qh-DQ=w527-h937-s-no?authuser=0",
  },
  {
    title: "Phoebe triste esperando secar no AmigoPet",
    url: "https://lh3.googleusercontent.com/pw/AJFCJaWmncT4jmcBPmCVo-0AU9V1CKhC1uo7C1m0Vz6fhJZ_dDA3X8AA9HpWIxvhHY3oA-DMizdkrkqNVeKUrYMP4cRS-f6xTBmvMyCmgE4SjnpPGKjC4JXqNAoxibcYzolp1qd241ITgVDaW-ojD2P176KZEQ=w527-h937-s-no?authuser=0",
  },
  {
    title: "Phoebe alegre modelando na poltrona",
    url: "https://lh3.googleusercontent.com/pw/AJFCJaVStYxTadhlKdj51Otk0lHZtwTfZg3yb8ISf3EBkcItvtXE8_9LB9LJh_CSfVbBvHAjwWb3IPMQVlDF5ckFRrLi7l3sIzHVWEPv3HmB9OKEyR3jsfUoFTHz04f2p6aU1AmGTh1RG_hz-O2bjeArYU40aw=w703-h937-s-no?authuser=0",
  },
  {
    title: "Phoebe com seu amiguinho Marcelino",
    url: "https://lh3.googleusercontent.com/pw/AJFCJaUZZLWQ8MsT0nv79_jEW3ybkN4ti9DTgLTuG5q_hsKYERapfk5CBli3MhLOJGkWqlshJsY4glLJRZYlfyPpnLpA74eagFUufeEcQPrHcWmAzWmgXtb0Afx4DIc3AmEv-60qr__BGcxxH_LBMToyuv6vvw=w703-h937-s-no?authuser=0",
  },
];

app.post("/", async (req, res) => {
    const receivedJSON = req.body;
    const chat_id = receivedJSON.message.chat.id;
    const userInput = receivedJSON.message.text;

  if (userInput.toLowerCase().includes("foto da nasa") || userInput == 1) {
    await sendMessage(chat_id, "Aqui temos todos os dias uma imagem diferente do espaço fornecida pela NASA!");

    const imageNasaData = await getNasaData();
    
    if(imageNasaData === undefined) {
      await sendMessage(chat_id, "Ops, tivemos um problema para capturar a imagem de hoje, tente novamente mais tarde!%0A%0ADesculpe o transtorno, fique com uma imagem que gostamos muito.");
      const imageDefault = {
        title: "M94: A Double Ring Galaxy",
        url: "https://apod.nasa.gov/apod/image/2306/M94_Brennan_960.jpg"
      }
      await sendImage(chat_id, imageDefault);
    }
    else
      await sendImage(chat_id, imageNasaData);
   
  } 
  else if (userInput.toLowerCase().includes("foto da phoebe") || userInput == 2) {
    const randomIndex = Math.floor(Math.random() * (bdPhoebePhotos.length + 1));
    const imagePhoebe = bdPhoebePhotos[randomIndex];
    
    await sendImage(chat_id, imagePhoebe);
  } 
  else
    await sendMessage(chat_id, "Olá, seja muito bem vindo ao bot de imagens.%0A%0AEscolha uma das opções abaixo:%0A%0A1 - Foto da Nasa%0A2 - Foto da Phoebe");
  res.status(200).json(receivedJSON);
});

async function sendMessage(chat_id, textMessage) {
  try {
    const sendMessageUrl = `sendMessage?chat_id=${chat_id}&text=${textMessage}`;
    const urlFinal = baseURL + sendMessageUrl;

    await Axios.get(urlFinal);
  }
  catch(error) {
    console.error("sendMessage: " + error.message)
  }
}

async function sendImage(chat_id, imageNasaData) {
  try {
    const { title, url } = imageNasaData

    const sendPhotoUrl = `sendPhoto?chat_id=${chat_id}&photo=${url}&caption=${title}`;
    const urlFinal = baseURL + sendPhotoUrl;

    await Axios.get(urlFinal);
  }
  catch(error) {
    console.error("sendImage: " + error.message)
  }
}

async function getNasaData() {
  try {
    const { data } = await Axios.get(`https://api.nasa.gov/planetary/apod?api_key=${keyApiNasa}`);
    return data 
  }
  catch(error) {
    console.error("getNasaImage: " + error.message)
  }
}

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});