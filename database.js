const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');
const url = 'mongodb+srv://' + config.userName + ':' + config.password + '@' + config.hostname;
const client = new MongoClient(url);

const chainCollection = client.db('garticbeep').collection('chains');
const userCollection = client.db('garticbeep').collection('users');

(async function testConnection() {
    await client.connect();
    await client.db('startup').command({ ping: 1 });
})().catch((ex) => {
    console.log(`Unable to connect to database with ${url} because ${ex.message}`);
    process.exit(1);
});

async function startChain(username, prompt, onHold) {
    chainCollection.findOneAndDelete({ "chain.promptGiver": username }, { arrayFilters: [{ "last.promptGiver": username }] });
    userCollection.findOneAndDelete({ "user": username });
    userCollection.insertOne({ user: username, onHold: onHold, strikes: 0 });
    return await chainCollection.insertOne({ chain: [{ promptGiver: username, prompt: prompt }] });
}

function appendSong(round, username, songLink, songName) {
    return chainCollection.updateOne(
        {
            chain: { $size: round }, 
            $expr: {
                $eq: [
                    { $arrayElemAt: ["$chain.songmaker", -1] },
                    username
                ]
            },
        },
        {
            $set: {
                "chain.$[last].song": songLink,
                "chain.$[last].songName": songName
            }
        },
        {
            arrayFilters: [
                { "last.songmaker": username } 
            ]
        }
    );
}

function appendPrompt(round, username, prompt) {
    return chainCollection.updateOne(
        {
            $expr: {
                $eq: [
                    { $arrayElemAt: ["$chain.promptGiver", -1] },
                    username
                ]
            },
            chain: { $size: round }, 
        },
        {
            $set: {
                "chain.$[last].prompt": prompt,
            }
        },
        {
            arrayFilters: [
                { "last.promptGiver": username } 
            ]
        }
    );
}

function getPrompt(username) {
    return chainCollection.findOne({
        $expr: {
            $eq: [
                { $arrayElemAt: ["$chain.songmaker", -1] }, 
                username 
            ]
        }
    });
}

function getSong(username) {
    return chainCollection.findOne({
        $expr: {
            $eq: [
                { $arrayElemAt: ["$chain.promptGiver", -1] },
                username
            ]
        }
    });
}

function isOnHold(username) {
    return userCollection.findOne({user: username}).onHold;
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
    const round = await getRoundNumber();
    const chains = await getAllSongs();
    let submittees = [];
    //shuffle function
    function shuffle() {
        for (let index = submittees.length - 1; index > 0; index--) {
            const randomIndex = Math.floor(Math.random() * index);
            const hold = submittees[index];
            submittees[index] = submittees[randomIndex];
            submittees[randomIndex] = hold;
        }
    }
    if (isNewRound) {
        //get submittees
        for (let i = 0; i < chains.length; i++) {
            const chain = chains[i]["chain"];
            if (chain.length == round && chain[round - 1]["song"]) {
                submittees.push(chain[round - 1]["songmaker"]);
            }
        }
        let success = false;
        while (!success) {
            shuffle();
            const promptGivers = submittees.slice();
            for (let i = 0; i < chains.length; i++) {
                const chain = chains[i]["chain"];
                if (chain.length == round && chain[chain.length - 1].song != null && chain[chain.length - 1].song != undefined) {
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
    } else {
        //get submittees
        for (let i = 0; i < chains.length; i++) {
            const chain = chains[i]["chain"];
            if (chain.length == round && !(await isOnHold(chain[round - 1]["promptGiver"])) && chain[round - 1]["prompt"]) { //don't add someone if they're on hold
                submittees.push(chain[round - 1]["promptGiver"]);
            }
        }
        let success = false;
        while (!success) {
            shuffle();
            const promptGivers = submittees.slice();
            for (let i = 0; i < chains.length; i++) {
                const chain = chains[i]["chain"];
                if (chain.length == round && chain[chain.length - 1].prompt != null && chain[chain.length - 1].prompt != undefined) {
                    const submittee = promptGivers[promptGivers.length - 1];
                    let found = false;
                    for (let j = 0; j < chain.length; j++) {
                        if (chain[j]["promptGiver"] == submittee || chain[j]["songmaker"] == submittee) found = true;
                    }
                    if (!found) {
                        chain[round - 1]["songmaker"] = promptGivers.pop();
                    }
                }
                chains[i]["chain"] = chain;
            }
            if (promptGivers.length == 0) success = true;
            else {
                for (let i = 0; i < chains.length; i++) {
                    const chain = chains[i]["chain"];
                    if (chain.length == round) 
                    chain[round - 1]["songmaker"] = undefined;
                }
            }
        }
        for (let i = 0; i < chains.length; i++) {
            const chain = chains[i]["chain"];
            if (chain.length == round && chain[round - 1]["songmaker"] == undefined)
                delete chain[round - 1]["songmaker"];
        }
    }
    for (let i = 0; i < chains.length; i++) {
        chainCollection.replaceOne({ _id: chains[i]["_id"] }, chains[i]);
    }
    return chains;
}

async function deleteLastRound() { //only to be used in emergencies / testing
    const round = await getRoundNumber();
    const chains = await getAllSongs();
    const statuses = [];
    for (let i = 0; i < chains.length; i++) {
        if (chains[i].chain.length == round) chains[i].chain.pop();
    }
    for (let i = 0; i < chains.length; i++) {
        if (chains[i].chain.length <= 0) {
            statuses[i] = await chainCollection.deleteOne({ _id: chains[i]["_id"] });
            await userCollection.delete({ user: chains[i].chain[0].promptGiver });
        } else {
            statuses[i] = await chainCollection.replaceOne({ _id: chains[i]["_id"] }, chains[i]);
        }
    }
    return statuses;
}

async function generateDebugChains(onHold) { //testing
    const alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
    const statuses = [];
    for (let i = 0; i < alphabet.length; i++) {
        const letter = alphabet[i];
        const oh = onHold && Math.random() < 0.2 ? true : false
        userCollection.insertOne({ user: letter, onHold: oh, strikes: 0 });
        statuses[i] = await chainCollection.insertOne({ chain: [{ promptGiver: letter, prompt: letter + "'s prompt" }] });
    }
    return statuses;
}

async function generateDebugSongs(percentSubmitted = 100) { //testing
    const round = await getRoundNumber();
    const chains = await getAllSongs();
    const statuses = [];
    for (let i = 0; i < chains.length; i++) {
        if (chains[i].chain[round - 1]) {
            const letter = chains[i].chain[round - 1]["songmaker"];
            const songLink = letter + "'s link round " + round;
            const songName = letter + "'s songName round " + round;
            if (Math.random() * 100 <= percentSubmitted) {
                statuses[i] = await chainCollection.updateOne(
                    {
                        chain: { $size: round },
                        $expr: {
                            $eq: [
                                { $arrayElemAt: ["$chain.songmaker", -1] },
                                letter
                            ]
                        },
                    },
                    {
                        $set: {
                            "chain.$[last].song": songLink,
                            "chain.$[last].songName": songName
                        }
                    },
                    {
                        arrayFilters: [
                            { "last.songmaker": letter }
                        ]
                    }
                );
            } else {
                statuses[i] = letter + " didn't submit";
            }
        }
    }
    return statuses;
}

async function generateDebugPrompts(percentSubmitted = 100) { //testing
    const round = await getRoundNumber();
    const chains = await getAllSongs();
    const statuses = [];
    for (let i = 0; i < chains.length; i++) {
        if (chains[i].chain[round - 1]) {
            const letter = chains[i].chain[round - 1]["promptGiver"];
            const prompt = letter + "'s prompt round " + round;
            if (Math.random() * 100 <= percentSubmitted) {
                statuses[i] = chainCollection.updateOne(
                    {
                        $expr: {
                            $eq: [
                                { $arrayElemAt: ["$chain.promptGiver", -1] },
                                letter
                            ]
                        },
                        chain: { $size: round },
                    },
                    {
                        $set: {
                            "chain.$[last].prompt": prompt,
                        }
                    },
                    {
                        arrayFilters: [
                            { "last.promptGiver": letter }
                        ]
                    }
                );
            } else {
                statuses[i] = letter + " didn't submit";
            }
        }
    }
    return statuses;
}

module.exports = { startChain, appendSong, appendPrompt, getAllSongs, getRoundNumber, getPrompt, getSong, randomizeChains, deleteLastRound, isOnHold, generateDebugChains, generateDebugSongs, generateDebugPrompts };