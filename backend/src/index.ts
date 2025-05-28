import express from 'express';
import { startChain, appendSong, appendPrompt, getAllSongs, getRoundNumber, getPrompt, getSong, randomizeChains, deleteLastRound, isOnHold, generateDebugChains, generateDebugSongs, generateDebugPrompts } from './database';
const adminConfig = require("./adminConfig.json");

const app = express();
const port: number = 3000;

const authCookieName: string = 'token';

app.use(express.json());

// Router for service endpoints
const apiRouter = express.Router();
app.use(`/api`, apiRouter);

app.get('/', (_req, res) => {
    res.send('Hello');
});

apiRouter.post("/startChain", (request, response) => {
    console.log("starting chain");
    startChain(request.body.username, request.body.prompt, request.body.onhold);
    response.status(200);
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});