const express = require('express');
const app = express();
const DB = require('./database.js');
const config = require('.bin/adminConfig.json');

const authCookieName = 'token';

// The service port may be set on the command line
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Serve up the front-end static content hosting
app.use(express.static('public'));

// Router for service endpoints
var apiRouter = express.Router();

app.get('/', (request, response) => {
    return response.sendFile('public/index.html', { root: '.' });
});

app.get('/auth/discord', (request, response) => {
    return response.sendFile('public/home.html', { root: '.' });
});

app.get('/auth/main.css', (request, response) => {
    return response.sendFile('public/main.css', { root: '.' });
});

app.get('/auth/garticBeep.ico', (request, response) => {
    return response.sendFile('public/garticBeep.ico', { root: '.' });
});

app.get('/auth/garticBeep.png', (request, response) => {
    return response.sendFile('public/garticBeep.png', { root: '.' });
});

//chain format:
const chain = {
    chain: [
        { //round 1
            promptGiver: "username", prompt: "prompt", songmaker: "username", song: "song", songName: "songName"
        }, //if onhold is true this will likely be a snipped chain unless something goes wrong
        { //round 2
            promptGiver: "username", prompt: "prompt", songmaker: "username", song: "song", songName: "songName"
        },
        { //round 3
            promptGiver: "username", prompt: "prompt", songmaker: "username", song: "song", songName: "songName"
        },
        { //round 4
            promptGiver: "username", prompt: "prompt", songmaker: "username", song: "song", songName: "songName"
        },
        { //round 5
            promptGiver: "username", prompt: "prompt", songmaker: "username", song: "song", songName: "songName"
        },
    ]
}

//user format
const user = {
    user: "username",
    onHold: false,
    strikes: 0
}

app.post("/startChain", (request, response) => {
    DB.startChain(request.body.username, request.body.prompt, request.body.onhold);
    console.log("successfully started chain");
    response.status(200);
})

app.post("/appendSong", async (request, response) => {
    const update = await DB.appendSong(request.body.round, request.body.username, request.body.link, request.body.name);
    console.log("successfully appended song: ", update);
    response.send({ update: update });
})

app.post("/appendPrompt", async (request, response) => {
    const update = await DB.appendPrompt(request.body.round, request.body.username, request.body.prompt);
    console.log("successfully appended prompt: ", update);
    response.send({ update: update });
})

app.get("/roundNumber", async (request, response) => {
    const round = await DB.getRoundNumber();
    response.send({ round: round });
})

app.post("/getPrompt", async (request, response) => {
    const prompt = await DB.getPrompt(request.body.username);
    try {
        response.send({ prompt: prompt["chain"][request.body.round - 1]["prompt"] });
    } catch {
        const randomized = await DB.randomizeChains(false);
        console.log(randomized);
        response.send({ message: "you haven't submitted yet or you're on hold" });
    }
})

app.post("/getSong", async (request, response) => {
    const song = await DB.getSong(request.body.username);
    try {
        const link = song["chain"][request.body.round - 2]["song"];
        let name = song["chain"][request.body.round - 2]["songName"];
        console.log(link, name);
        if (!name) {
            name = "Untitled";
        }
        if (link.match(/https?:\/\//)) {
            response.send({ name: name, link: link });
        } else {
            response.send({ message: "previous person did not submit a link. Please either reload the page or reach out to slarmoo" });
        }
    } catch {
        const randomized = await DB.randomizeChains(true);
        console.log(randomized);
        response.send({ prompt: "you haven't submitted yet or you're on hold" });
    }
})

app.post("/isOnHold", async (request, response) => {
    const status = await DB.isOnHold(request.body.username);
    console.log(status);
    response.send({ status: status });
})

app.post("/randomizeChains", async (request, response) => {
    if (request.body.username == config.username && request.body.password == config.password) {
        const randomized = await DB.randomizeChains(request.body.isNewRound);
        console.log(randomized);
        response.send({ r: randomized });
    } else {
        response.status(409).send({ message: "unauthorized access" })
    }
})

app.post("/deleteLastRound", async (request, response) => {
    if (request.body.username == config.username && request.body.password == config.password) {
        const deleted = await DB.deleteLastRound();
        console.log(deleted);
        response.send({ r: deleted });
    } else {
        response.status(409).send({ message: "unauthorized access" })
    }
})

app.post("/generateDebugChains", async (request, response) => {
    if (request.body.username == config.username && request.body.password == config.password) {
        const starts = await DB.generateDebugChains(request.body.onHold);
        console.log(starts);
        response.send({ r: starts });
    } else {
        response.status(409).send({ message: "unauthorized access" })
    }
})

app.post("/generateDebugSongs", async (request, response) => {
    if (request.body.username == config.username && request.body.password == config.password) {
        const starts = await DB.generateDebugSongs(request.body.percentSubmitted);
        // console.log(starts);
        response.send({ r: starts });
    } else {
        response.status(409).send({ message: "unauthorized access" })
    }
})

app.post("/generateDebugPrompts", async (request, response) => {
    if (request.body.username == config.username && request.body.password == config.password) {
        const starts = await DB.generateDebugPrompts(request.body.percentSubmitted);
        // console.log(starts);
        response.send({ r: starts });
    } else {
        response.status(409).send({ message: "unauthorized access" })
    }
})



//final
app.use(`/api`, apiRouter);

app.listen(port, () => console.log(`App listening at http://localhost:${port}`));