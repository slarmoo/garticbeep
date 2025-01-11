const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

const uuid = require('uuid');


const config = require('./dbConfig.json');
const url = 'mongodb+srv://' + config.userName + ':' + config.password + '@' + config.hostname;
const client = new MongoClient(url);

const chainCollection = client.db('garticbeep').collection('chains');
//const userCollection = client.db('startup').collection('users');

(async function testConnection() {
    await client.connect();
    await client.db('startup').command({ ping: 1 });
})().catch((ex) => {
    console.log(`Unable to connect to database with ${url} because ${ex.message}`);
    process.exit(1);
});

function startChain(username, prompt, onHold) {
    chainCollection.insertOne({ chain: [{ promptGiver: username, prompt: prompt, onHold: onHold }] });
}

function appendSong(round, username, songLink, songName) {
    return chainCollection.updateOne(
        {
            chain: { $size: round }, // Matches arrays with size `round`
            "chain.songmaker": username // Ensures the last element has the prompt
        },
        {
            $set: {
                "chain.$[last].song": songLink,
                "chain.$[last].songName": songName
            }
        },
        {
            arrayFilters: [
                { "last.songmaker": username } // Targets the last element with the matching prompt
            ]
        }
    );
}

function appendPrompt(round, username, prompt) {
    return chainCollection.updateOne(
        {
            chain: { $size: round }, // Matches arrays with size `round`
            "chain.promptGiver": username // Ensures the last element has the prompt
        },
        {
            $set: {
                "chain.$[last].prompt": prompt,
            }
        },
        {
            arrayFilters: [
                { "last.promptGiver": username } // Targets the last element with the matching prompt
            ]
        }
    );
}

function getPrompt(username) {
    return chainCollection.findOne({
        $expr: {
            $eq: [
                { $arrayElemAt: ["$chain.songmaker", -1] }, // Get the `songmaker` of the last element
                username // Match it to "slarmoooo"
            ]
        }
    });
}

async function getRoundNumber() {
    const cursor = chainCollection.find();
    const chains = await cursor.toArray();
    longestChain = 0;
    for (i = 0; i < chains.length; i++) {
        if (chains[i]["chain"].length > longestChain) {
            longestChain = chains[i]["chain"].length;
        }
    }
    return longestChain;
}

async function getAllSongs() {
    const cursor = chainCollection.find();
    const chains = await cursor.toArray();
    return chains;
}

//this is the most complex part of the code..
//first get all chains
//then create a list of users who submitted on time
//shuffle list
//then for each chain where there was a submission, tentatively grab the first entry in the list where it is someone not in the current chain
//repeat above two steps until it works
async function randomizeChains(isNewRound) {
    if (isNewRound) {
        const round = await getRoundNumber();
        const chains = await getAllSongs();
        let submittees = [];
        //get submittees
        for (let i = 0; i < chains.length; i++) {
            const chain = chains[i]["chain"];
            if (chain.length == round) {
                submittees.push(chain[round - 1]["songmaker"]); 
            }
        }
        //shuffle
        // submittees = submittees.concat(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]);
        function shuffle() {
            for (let index = submittees.length - 1; index > 0; index--) {
                const randomIndex = Math.floor(Math.random() * index);
                const hold = submittees[index];
                submittees[index] = submittees[randomIndex];
                submittees[randomIndex] = hold;
            }
        }
        let success = false;
        while (!success) {
            shuffle();
            const promptGivers = submittees.slice();
            for (let i = 0; i < chains.length; i++) {
                const chain = chains[i]["chain"];
                if (chain.length == round) {
                    const submittee = promptGivers[promptGivers.length - 1];
                    let found = false;
                    for (let j = 0; j < chain.length; j++) {
                        if (chain[j]["promptGiver"] == submittee || chain[j]["songmaker"] == submittee) found = true;
                    }
                    if (!found) {
                        chain.push({
                            promptGiver: promptGivers.pop(),
                        });
                    }
                }
                chains[i]["chain"] = chain;
            }
            if (promptGivers.length == 0) success = true;
            else {
                for (let i = 0; i < chains.length; i++) {
                    const chain = chains[i]["chain"];
                    if (chain.length > round) {
                        chain.pop();
                    }
                }
            }
        }
        for (let i = 0; i < chains.length; i++) {
            chainCollection.replaceOne(
                {
                    _id: chains[i]["_id"], 
                },
                chains[i]
            );
        }
        return chains;
    } else {

    }
}

// //posts
// async function getPosts() {
//     let d = new Date();
//     let day = d.getDate();
//     if (day.length < 2) {
//         day = "0" + day.toString();
//     }
//     let month = d.getMonth();
//     let date = month.toString() + day.toString();
//     date = Number(date);
//     compare = date - 101;

//     const query = { date: { $gte: compare } };
//     const options = {
//         limit: 12,
//         sort: { date: -1 }
//     };

//     const cursor = postCollection.find(query, options);
//     const posts = await cursor.toArray();
//     return posts;
// }

// async function addPost(data) {
//     postCollection.insertOne(data);
// }

// //login
// function getUser(username) {
//     return userCollection.findOne({ username: username });
// }

// function getToken(authToken) {
//     return userCollection.findOne({ token: authToken });
// }

// async function createUser(username, password) {
//     const passwordHash = await bcrypt.hash(password, 10);
//     const user = {
//         username: username,
//         password: passwordHash,
//         token: uuid.v4(),
//     };
//     await userCollection.insertOne(user);

//     return user;
// }

module.exports = { startChain, appendSong, appendPrompt, getAllSongs, getRoundNumber, getPrompt, randomizeChains };