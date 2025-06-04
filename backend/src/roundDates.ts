export class roundDates {
    readonly year = 2025

    readonly eventDates: Round[] = [
        { round: 1, time: [5, 1, 0], type: "start" }, 
        { round: 1, time: [6, 3, 0], type: "song" }, 
        { round: 2, time: [6, 6, 0], type: "prompt" }, 
        { round: 2, time: [6, 9, 0], type: "song" }, 
        { round: 3, time: [6, 11, 0], type: "prompt" }, 
        { round: 3, time: [6, 14, 0], type: "song" },
        { round: 4, time: [6, 16, 0], type: "prompt" }, 
        { round: 4, time: [6, 19, 0], type: "song" }, 
        { round: 5, time: [6, 21, 0], type: "prompt" },
        { round: 5, time: [6, 24, 0], type: "song" }, 
        { round: 6, time: [7, 3, 0], type: "end" }, 
    ]

    timeToUTC(time: [number, number, number]): number {
        return new Date(this.year, ...time).getTime();
    }

    findCurrentRound(): Round {
        const currentTime = new Date().getTime();
        let currentRound: Round = this.eventDates[0];
        for (let i: number = 0; i < this.eventDates.length; i++) {
            const round: Round = this.eventDates[i];
            console.log(this.timeToUTC(round.time), currentTime)
            if (this.timeToUTC(round.time) < currentTime) {
                currentRound = { round: round.round, time: this.eventDates[Math.min(i + 1, this.eventDates.length - 1)].time, type: round.type }
            }
        }
        return currentRound;
    }
}

interface Round {
    round: number,
    time: [number, number, number],
    type: string,
}