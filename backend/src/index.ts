import express from 'express';
import cors from 'cors';
import { DB } from './database';
import { chain, chainLink } from './Config';
import { roundDates } from './roundDates';
const adminConfig = require("./adminConfig.json");

const app = express();
const port: number = 3000;
const dates: roundDates = new roundDates();
const db = new DB();

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

apiRouter.use((req, res, next) => {
    console.log(req.url, req.params, req.body)
    
    next()
})

apiRouter.post("/startChain", (request, response) => {
    db.startChain(request.body.username, request.body.prompt, request.body.onhold, request.body.url);
    response.status(200);
})

apiRouter.post("/appendSong", async (request, response) => {
    const update = await db.appendSong(request.body.round, request.body.username, request.body.link, request.body.name);
    response.send({ update: update });
})

apiRouter.post("/appendPrompt", async (request, response) => {
    const update = await db.appendPrompt(request.body.round, request.body.username, request.body.prompt);
    response.send({ update: update });
})

apiRouter.post("/getPrompt", async (request, response) => {
    const roundNumber = dates.findCurrentRound().round;
    const chain = await db.getPrompt(request.body.username, roundNumber);
    if (chain) {
        response.send({ prompt: chain[request.body.round - 1].prompt });
    } else {
        response.send({ message: "you haven't submitted yet or you're on hold" });
    }
})

apiRouter.post("/getSong", async (request, response) => {
    const roundNumber = dates.findCurrentRound().round;
    const song = await db.getSong(request.body.username, roundNumber);
    if(song) {
        const chainLink: chainLink = song[roundNumber - 2];
        const link: string = chainLink.song || "";
        let name: string | undefined = song[roundNumber - 2].songName;
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

apiRouter.post("/isOnHold", (request, response) => {
    const isOnHold = db.isOnHold(request.body.username);
    response.send({ isOnHold: isOnHold })
})

apiRouter.get("/getJobs", async (request, response) => {
    const round = dates.findCurrentRound();
    const jobs = await db.getJobs(round.type, round.round, dates);
    response.send({ jobs: jobs })
    
})

apiRouter.get("/getRound", (request, response) => {
    const round = dates.findCurrentRound();
    // db.resetCurrentlyRandomizing();
    response.send({ round: round.round, type: round.type, utc: dates.timeToUTC(round.time) });
})

apiRouter.get("/getAll", async (request, response) => {
    const chains: chain[] = await db.getAllSongs();
    response.send({ chains: chains });
})

//admin functions
apiRouter.post("/randomizeChains", async (request, response) => {
    if (request.body.username == adminConfig.username && request.body.password == adminConfig.password) {
        const roundNumber = dates.findCurrentRound().round;
        const randomized = await db.randomizeChains(roundNumber, request.body.isNewRound);
        response.send({ r: randomized });
    } else {
        response.status(409).send({ message: "unauthorized access" })
    }
})

apiRouter.post("/deleteLastRound", async (request, response) => {
    if (request.body.username == adminConfig.username && request.body.password == adminConfig.password) {
        const deleted = await db.deleteLastRound();
        response.send({ r: deleted });
    } else {
        response.status(409).send({ message: "unauthorized access" })
    }
})

apiRouter.post("/generateDebugChains", async (request, response) => {
    if (request.body.username == adminConfig.username && request.body.password == adminConfig.password) {
        const starts = await db.generateDebugChains(request.body.onHold);
        response.send({ r: starts });
    } else {
        response.status(409).send({ message: "unauthorized access" })
    }
})

apiRouter.post("/generateDebugSongs", async (request, response) => {
    if (request.body.username == adminConfig.username && request.body.password == adminConfig.password) {
        const starts = await db.generateDebugSongs(request.body.percentSubmitted);
        response.send({ r: starts });
    } else {
        response.status(409).send({ message: "unauthorized access" })
    }
})

apiRouter.post("/generateDebugPrompts", async (request, response) => {
    if (request.body.username == adminConfig.username && request.body.password == adminConfig.password) {
        const starts = await db.generateDebugPrompts(request.body.percentSubmitted);
        response.send({ r: starts });
    } else {
        response.status(409).send({ message: "unauthorized access" })
    }
})  

//final
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});