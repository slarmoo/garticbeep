import { chain, chainLink, user } from "./Config";

import { MongoClient } from 'mongodb';
const config = require('./dbConfig.json');
const url = 'mongodb+srv://' + config.userName + ':' + config.password + '@' + config.hostname;
const client = new MongoClient(url);

const chainCollection = client.db('garticbeep').collection<chain>('chains');
const userCollection = client.db('garticbeep').collection<user>('users');

(async function testConnection() {
    await client.connect();
    await client.db('startup').command({ ping: 1 });
})().catch((ex) => {
    console.log(`Unable to connect to database with ${url} because ${ex.message}`);
    process.exit(1);
});

async function startChain(username: string, prompt: string, onHold: boolean) {
    chainCollection.findOneAndDelete({ "chain.promptGiver": username });
    userCollection.findOneAndDelete({ "user": username });
    userCollection.insertOne({ user: username, onHold: onHold, strikes: 0 });
    return await chainCollection.insertOne({ chain: [{ promptGiver: username, prompt: prompt } as chainLink] } as chain);
}

function appendSong(round: number, username: string, songLink: string, songName: string) {
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

function appendPrompt(round: number, username: string, prompt: string) {
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

function getPrompt(username: string) {
    return chainCollection.findOne({
        $expr: {
            $eq: [
                { $arrayElemAt: ["$chain.songmaker", -1] }, 
                username 
            ]
        }
    });
}

function getSong(username: string) {
    return chainCollection.findOne({
        $expr: {
            $eq: [
                { $arrayElemAt: ["$chain.promptGiver", -1] },
                username
            ]
        }
    });
}

async function isOnHold(username: string) {
    const user: user | null = await userCollection.findOne({ user: username });
    return user ? user.onHold : false;
}

async function getRoundNumber() {
    const cursor = chainCollection.find();
    const chains: chain[] = await cursor.toArray();
    let longestChain: number = 0;
    for (let i: number = 0; i < chains.length; i++) {
        if (chains[i].chain.length > longestChain) {
            longestChain = chains[i].chain.length;
        }
    }
    return longestChain;
}

async function getAllSongs() {
    const cursor = chainCollection.find();
    const chains: chain[] = await cursor.toArray();
    return chains;
}

//this is the most complex part of the code..
//first get all chains
//then create a list of users who submitted on time
//shuffle list
//then for each chain where there was a submission, tentatively grab the first entry in the list where it is someone not in the current chain
//repeat above two steps until it works
async function randomizeChains(isNewRound: boolean) {
    const round: number = await getRoundNumber();
    const chains: chain[] = await getAllSongs();
    let submittees: string[] = [];
    //shuffle function
    function shuffle() {
        for (let index: number = submittees.length - 1; index > 0; index--) {
            const randomIndex: number = Math.floor(Math.random() * index);
            const hold: string = submittees[index];
            submittees[index] = submittees[randomIndex];
            submittees[randomIndex] = hold;
        }
    }
    if (isNewRound) {
        //get submittees
        for (let i: number = 0; i < chains.length; i++) {
            const chain: chainLink[] = chains[i].chain;
            if (chain.length == round && chain[round - 1].song) {
                submittees.push(chain[round - 1].songmaker!);
            }
        }
        let success: boolean = false;
        while (!success) {
            shuffle();
            const promptGivers: string[] = submittees.slice();
            for (let i: number = 0; i < chains.length; i++) {
                const chain: chainLink[] = chains[i].chain;
                if (chain.length == round && chain[chain.length - 1].song) {
                    const submittee: string = promptGivers[promptGivers.length - 1];
                    let found: boolean = false;

                    for (let j = 0; j < chain.length; j++) {
                        if (chain[j].promptGiver == submittee || chain[j].songmaker == submittee) found = true;
                    }

                    if (!found) {
                        chain.push({
                            promptGiver: promptGivers.pop(),
                        } as chainLink);
                    }
                }
                chains[i].chain = chain;
            }

            if (promptGivers.length == 0) {
                success = true;
            } else {
                for (let i = 0; i < chains.length; i++) {
                    const chain = chains[i].chain;
                    if (chain.length > round) {
                        chain.pop();
                    }
                }
            }
        }
    } else {
        //get submittees
        for (let i: number = 0; i < chains.length; i++) {
            const chain: chainLink[] = chains[i].chain;
            if (chain.length == round && !(await isOnHold(chain[round - 1].promptGiver)) && chain[round - 1].prompt) { //don't add someone if they're on hold
                submittees.push(chain[round - 1].promptGiver);
            }
        }
        let success: boolean = false;
        while (!success) {
            shuffle();
            const promptGivers: string[] = submittees.slice();
            for (let i: number = 0; i < chains.length; i++) {
                const chain: chainLink[] = chains[i].chain;
                if (chain.length == round && chain[chain.length - 1].prompt) {
                    const submittee: string = promptGivers[promptGivers.length - 1];
                    let found: boolean = false;
                    for (let j = 0; j < chain.length; j++) {
                        if (chain[j].promptGiver == submittee || chain[j].songmaker == submittee) found = true;
                    }
                    if (!found) {
                        chain[round - 1].songmaker = promptGivers.pop();
                    }
                }
                chains[i].chain = chain;
            }
            if (promptGivers.length == 0) {
                success = true;
            } else {
                for (let i: number = 0; i < chains.length; i++) {
                    const chain: chainLink[] = chains[i].chain;
                    if (chain.length == round) 
                    chain[round - 1].songmaker = undefined;
                }
            }
        }
        for (let i = 0; i < chains.length; i++) {
            const chain = chains[i].chain;
            if (chain.length == round && chain[round - 1].songmaker == undefined)
                delete chain[round - 1].songmaker;
        }
    }
    for (let i = 0; i < chains.length; i++) {
        chainCollection.replaceOne({ _id: chains[i]._id }, chains[i]);
    }
    return chains;
}

async function deleteLastRound() { //only to be used in emergencies / testing
    const round: number = await getRoundNumber();
    const chains: chain[] = await getAllSongs();
    const statuses = [];
    for (let i = 0; i < chains.length; i++) {
        if (chains[i].chain.length == round) chains[i].chain.pop();
    }
    for (let i = 0; i < chains.length; i++) {
        if (chains[i].chain.length <= 0) {
            statuses[i] = await chainCollection.deleteOne({ _id: chains[i]["_id"] });
            await userCollection.deleteOne({ user: chains[i].chain[0].promptGiver });
        } else {
            statuses[i] = await chainCollection.replaceOne({ _id: chains[i]["_id"] }, chains[i]);
        }
    }
    return statuses;
}

async function generateDebugChains(onHold: boolean) { //testing
    const alphabet: string[] = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
    const statuses = [];
    for (let i: number = 0; i < alphabet.length; i++) {
        const letter: string = alphabet[i];
        const oh: boolean = onHold && Math.random() < 0.2 ? true : false
        userCollection.insertOne({ user: letter, onHold: oh, strikes: 0 });
        statuses[i] = await chainCollection.insertOne({ chain: [{ promptGiver: letter, prompt: letter + "'s prompt" } as chainLink] } as chain);
    }
    return statuses;
}

async function generateDebugSongs(percentSubmitted: number = 100) { //testing
    const round: number = await getRoundNumber();
    const chains: chain[] = await getAllSongs();
    const statuses = [];
    for (let i: number = 0; i < chains.length; i++) {
        if (chains[i].chain[round - 1]) {
            const letter: string = chains[i].chain[round - 1].songmaker!;
            const songLink: string = letter + "'s link round " + round;
            const songName: string = letter + "'s songName round " + round;
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

async function generateDebugPrompts(percentSubmitted: number = 100) { //testing
    const round: number = await getRoundNumber();
    const chains: chain[] = await getAllSongs();
    const statuses = [];
    for (let i: number = 0; i < chains.length; i++) {
        if (chains[i].chain[round - 1]) {
            const letter: string = chains[i].chain[round - 1].promptGiver;
            const prompt: string = letter + "'s prompt round " + round;
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

export { startChain, appendSong, appendPrompt, getAllSongs, getRoundNumber, getPrompt, getSong, randomizeChains, deleteLastRound, isOnHold, generateDebugChains, generateDebugSongs, generateDebugPrompts };