import express, { response } from 'express';
import cors from 'cors';
import { startChain, appendSong, appendPrompt, getAllSongs, getRoundNumber, getPrompt, getSong, randomizeChains, deleteLastRound, isOnHold, generateDebugChains, generateDebugSongs, generateDebugPrompts } from './database';
import { chain } from './Config';
const adminConfig = require("./adminConfig.json");

const app = express();
const port: number = 3000;

const authCookieName: string = 'token';

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

// Router for service endpoints
const apiRouter = express.Router();
app.use(`/api`, apiRouter);

app.get('/', (_req, res) => {
    res.send('Hello');
});

apiRouter.post("/startChain", (request, response) => {
    startChain(request.body.username, request.body.prompt, request.body.onhold);
    response.status(200);
})

apiRouter.get("/getAll", async (request, response) => {
    const chains: chain[] = await getAllSongs();
    console.log(chains);
    response.send({ chains: chains });
})

//admin functions
apiRouter.post("/randomizeChains", async (request, response) => {
    if (request.body.username == adminConfig.username && request.body.password == adminConfig.password) {
        const randomized = await randomizeChains(request.body.isNewRound);
        response.send({ r: randomized });
    } else {
        response.status(409).send({ message: "unauthorized access" })
    }
})

apiRouter.post("/deleteLastRound", async (request, response) => {
    if (request.body.username == adminConfig.username && request.body.password == adminConfig.password) {
        const deleted = await deleteLastRound();
        response.send({ r: deleted });
    } else {
        response.status(409).send({ message: "unauthorized access" })
    }
})

apiRouter.post("/generateDebugChains", async (request, response) => {
    if (request.body.username == adminConfig.username && request.body.password == adminConfig.password) {
        const starts = await generateDebugChains(request.body.onHold);
        response.send({ r: starts });
    } else {
        response.status(409).send({ message: "unauthorized access" })
    }
})

apiRouter.post("/generateDebugSongs", async (request, response) => {
    if (request.body.username == adminConfig.username && request.body.password == adminConfig.password) {
        const starts = await generateDebugSongs(request.body.percentSubmitted);
        response.send({ r: starts });
    } else {
        response.status(409).send({ message: "unauthorized access" })
    }
})

apiRouter.post("/generateDebugPrompts", async (request, response) => {
    if (request.body.username == adminConfig.username && request.body.password == adminConfig.password) {
        const starts = await generateDebugPrompts(request.body.percentSubmitted);
        response.send({ r: starts });
    } else {
        response.status(409).send({ message: "unauthorized access" })
    }
})  

//final
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});