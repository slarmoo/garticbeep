import type { DiscordData } from "./Config";

export function randomize(password: string, isNewRound: boolean, discordData: DiscordData) { //admin function
    return new Promise<void>((resolve, reject) => {
        fetch('/api/randomizeChains', {
            method: 'post',
            body: JSON.stringify({ username: discordData.username, password: password, isNewRound: isNewRound }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then(result => result.json())
            .then(response => {
                if (response.message) {
                    console.log("message: ", response.message);
                    reject();
                } else {
                    console.log("response: ", response.r);
                    resolve();
                }
            })
            .catch(console.error);
    });
}

export function deleteLastRound(password: string, discordData: DiscordData) { //admin function
    return new Promise<void>((resolve, reject) => {
        fetch('/api/deleteLastRound', {
            method: 'post',
            body: JSON.stringify({ username: discordData.username, password: password }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then(result => result.json())
            .then(response => {
                if (response.message) {
                    console.log("message: ", response.message);
                    reject();
                } else {
                    console.log("response: ", response.r);
                    resolve();
                }
            })
            .catch(console.error);
    });
}

export function generateDebugChains(password: string, onHold: boolean, discordData: DiscordData) { //admin function
    return new Promise<void>((resolve, reject) => {
        fetch('/api/generateDebugChains', {
            method: 'post',
            body: JSON.stringify({ username: discordData.username, password: password, onHold: onHold }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then(result => result.json())
            .then(response => {
                if (response.message) {
                    console.log("message: ", response.message);
                    reject();
                } else {
                    console.log("response: ", response.r);
                    resolve();
                }
            })
            .catch(console.error);
    });
}

export function generateDebugSongs(password: string, percentSubmitted: number = 100, discordData: DiscordData) { //admin function
    return new Promise<void>((resolve, reject) => {
        fetch('/api/generateDebugSongs', {
            method: 'post',
            body: JSON.stringify({ username: discordData.username, password: password, percentSubmitted: percentSubmitted }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then(result => result.json())
            .then(response => {
                if (response.message) {
                    console.log("message: ", response.message);
                    reject();
                } else {
                    console.log("response: ", response.r);
                    resolve();
                }
            })
            .catch(console.error);
    });
}

export function generateDebugPrompts(password: string, percentSubmitted: number = 100, discordData: DiscordData) { //admin function
    return new Promise<void>((resolve, reject) => {
        fetch('/api/generateDebugPrompts', {
            method: 'post',
            body: JSON.stringify({ username: discordData.username, password: password, percentSubmitted: percentSubmitted }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then(result => result.json())
            .then(response => {
                if (response.message) {
                    console.log("message: ", response.message);
                    reject();
                } else {
                    console.log("response: ", response.r);
                    resolve();
                }
            })
            .catch(console.error);
    });
}
