import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    res.status(200).send({
        message:"Hello from Promptly!",
    })
});

app.post('/', async (req, res) => {
    try{
        const prompt = req.body.prompt;
        const chatSession = await model.startChat({ generationConfig });
        const result = await chatSession.sendMessage(prompt);
        const botResponse = result.response.text();
        res.status(200).send({
            bot: botResponse
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ error });
    }
});

app.listen(port, () => {
    console.log("Server is listening on http://localhost:3000/");
});