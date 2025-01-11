// const cookieParser = require('cookie-parser');
// const bcrypt = require('bcrypt');
const express = require('express');
const app = express();
const DB = require('./database.js');

const authCookieName = 'token';

// The service port may be set on the command line
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Use the cookie parser middleware for tracking authentication tokens
// app.use(cookieParser());

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
{
    chain: [
        { //round 1
            promptGiver: "username", prompt: "prompt", onHold: false, songmaker: "username", song: "song", songName: "songName"
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
app.post("/startChain", (request, response) => {
    DB.startChain(request.body.username, request.body.prompt, request.body.onhold);
    console.log("successfully started chain");
    response.status(200);
})

app.post("/appendSong", (request, response) => {
    async function f() {
        const update = await DB.appendSong(request.body.round, request.body.username, request.body.link, request.body.name);
        console.log("successfully appended song: ", update);
        response.status(200);
    }
    f();
})

app.post("/appendPrompt", (request, response) => {
    async function f() {
        const update = await DB.appendPrompt(request.body.round, request.body.username, request.body.prompt);
        console.log("successfully appended prompt: ", update);
        response.status(200);
    }
    f();
})

app.get("/roundNumber", (request, response) => {
    async function f() {
        const round = await DB.getRoundNumber();
        response.send({ round: round });
    }
    f();
})

app.post("/getPrompt", (request, response) => {
    async function f() {
        const prompt = await DB.getPrompt(request.body.username);
        response.send({ prompt: prompt["chain"][request.body.round - 1]["prompt"] });
    }
    f();
})

app.get("/randomizeChains", (request, response) => {
    async function f() {
        const randomized = await DB.randomizeChains(true);
        // console.log(randomized);
        response.send({ r: randomized });
    }
    f();
})

// apiRouter.post('/auth/create', async (req, res) => {
//     if (await DB.getUser(req.body.email)) {
//         res.status(409).send({ msg: 'Existing user' });
//     } else {
//         const user = await DB.createUser(req.body.email, req.body.password);

//         // Set the cookie
//         setAuthCookie(res, user.token);

//         res.send({
//             id: user._id,
//         });
//     }
// });

// apiRouter.post('/auth/login', async (req, res) => {
//     const user = await DB.getUser(req.body.email);
//     if (user) {
//         if (await bcrypt.compare(req.body.password, user.password)) {
//             setAuthCookie(res, user.token);
//             res.send({ id: user._id });
//             return;
//         }
//     }
//     res.status(401).send({ msg: 'Unauthorized' });
// });

// // setAuthCookie in the HTTP response
// function setAuthCookie(res, authToken) {
//     res.cookie(authCookieName, authToken, {
//         secure: true,
//         httpOnly: true,
//         sameSite: 'strict',
//     });
// }

//final
app.use(`/api`, apiRouter);

app.listen(port, () => console.log(`App listening at http://localhost:${port}`));