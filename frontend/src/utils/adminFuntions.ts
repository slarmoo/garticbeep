import type { DiscordData } from "./Config";

export class Admin {
    private discordData: DiscordData | null = null;

    public setDiscordData(discordData: DiscordData) {
        this.discordData = discordData;
    }

    public async generateFiveRounds(password: string, onHold: boolean, percentSubmitted: number = 100) {
        console.log("beginning chains...");
        await this.generateDebugChains(password, onHold);
        console.log("randomizing...");
        await this.randomize(password, false);
        console.log("generating songs...");
        await this.generateDebugSongs(password, percentSubmitted);
        for (let i: number = 1; i < 5; i++) {
            await this.randomize(password, true);
            console.log("randomizing...");
            await this.generateDebugPrompts(password, percentSubmitted);
            console.log("generating prompts...");
            await this.randomize(password, false);
            console.log("randomizing...");
            await this.generateDebugSongs(password, percentSubmitted);
            console.log("generating songs...");
        }
        console.log("Done!");
    }

    public randomize(password: string, isNewRound: boolean) {
        return new Promise<void>((resolve, reject) => {
            if (this.discordData) {
                fetch('http://localhost:3000/api/randomizeChains', {
                    method: 'post',
                    body: JSON.stringify({ username: this.discordData.username, password: password, isNewRound: isNewRound }),
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
        }
        });
    }

    public deleteLastRound(password: string) {
        return new Promise<void>((resolve, reject) => {
            if (this.discordData) {
                fetch('http://localhost:3000/api/deleteLastRound', {
                    method: 'post',
                    body: JSON.stringify({ username: this.discordData.username, password: password }),
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
            }
        });
    }

    public generateDebugChains(password: string, onHold: boolean) {
        return new Promise<void>((resolve, reject) => {
            if (this.discordData) {
                fetch('http://localhost:3000/api/generateDebugChains', {
                    method: 'post',
                    body: JSON.stringify({ username: this.discordData.username, password: password, onHold: onHold }),
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
            }
        });
    }

    public generateDebugSongs(password: string, percentSubmitted: number = 100) {
        return new Promise<void>((resolve, reject) => {
            if (this.discordData) {
                fetch('http://localhost:3000/api/generateDebugSongs', {
                    method: 'post',
                    body: JSON.stringify({ username: this.discordData.username, password: password, percentSubmitted: percentSubmitted }),
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
            }
        });
    }

    public generateDebugPrompts(password: string, percentSubmitted: number = 100) {
        return new Promise<void>((resolve, reject) => {
            if (this.discordData) {
                fetch('http://localhost:3000/api/generateDebugPrompts', {
                    method: 'post',
                    body: JSON.stringify({ username: this.discordData.username, password: password, percentSubmitted: percentSubmitted }),
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
            }
        });
    }
}