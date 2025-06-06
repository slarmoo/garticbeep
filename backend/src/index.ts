import express from 'express';
import cors from 'cors';
import { startChain, appendSong, appendPrompt, getAllSongs, getRoundNumber, getPrompt, getSong, randomizeChains, deleteLastRound, isOnHold, generateDebugChains, generateDebugSongs, generateDebugPrompts } from './database';
import { chain, chainLink } from './Config';
import { roundDates } from './roundDates';
const adminConfig = require("./adminConfig.json");

const app = express();
const port: number = 3000;
const dates: roundDates = new roundDates();

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
    startChain(request.body.username, request.body.prompt, request.body.onhold, request.body.url);
    response.status(200);
})

apiRouter.post("/appendSong", async (request, response) => {
    const update = await appendSong(request.body.round, request.body.username, request.body.link, request.body.name);
    console.log("successfully appended song: ", update);
    response.send({ update: update });
})

apiRouter.post("/appendPrompt", async (request, response) => {
    const update = await appendPrompt(request.body.round, request.body.username, request.body.prompt);
    console.log("successfully appended prompt: ", update);
    response.send({ update: update });
})

apiRouter.post("/getPrompt", async (request, response) => {
    const roundNumber = dates.findCurrentRound().round;
    const chain = await getPrompt(request.body.username, roundNumber);
    if (chain) {
        response.send({ prompt: chain[request.body.round - 1].prompt });
    } else {
        response.send({ message: "you haven't submitted yet or you're on hold" });
    }
})

apiRouter.post("/getSong", async (request, response) => {
    console.log("request made");
    const roundNumber = dates.findCurrentRound().round;
    const song = await getSong(request.body.username, roundNumber);
    if(song) {
        const chainLink: chainLink = song[request.body.round - 2];
        const link: string = chainLink.song || "";
        let name: string | undefined = song[request.body.round - 2].songName;
        if (!name) {
            name = "Untitled";
        }
        // if (link.match(/https?:\/\//)) {
            response.send({ name: name, link: link });
        // } else {
        //     response.send({ message: "previous person did not submit a link. Please either reload the page or reach out to slarmoo" });
        // }
    } else {
        response.send({ prompt: "you haven't submitted yet or you're on hold" });
    }
})

apiRouter.get("/getRound", (request, response) => {
    const round = dates.findCurrentRound();
    response.send({ round: round.round, type: round.type, utc: dates.timeToUTC(round.time) });
})

apiRouter.get("/getAll", async (request, response) => {
    const chains: chain[] = await getAllSongs();
    console.log(chains);
    response.send({ chains: chains });
})

//admin functions
apiRouter.post("/randomizeChains", async (request, response) => {
    if (request.body.username == adminConfig.username && request.body.password == adminConfig.password) {
        const roundNumber = dates.findCurrentRound().round;
        const randomized = await randomizeChains(roundNumber, request.body.isNewRound);
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