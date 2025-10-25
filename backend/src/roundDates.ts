export class roundDates {
    readonly year = 2025

    readonly eventDates: Round[] = [
        { round: 1, time: [9, 1, 0], type: "start" }, 
        { round: 1, time: [9, 3, 0], type: "song" }, 
        { round: 2, time: [9, 6, 0], type: "prompt" }, 
        { round: 2, time: [9, 9, 0], type: "song" }, 
        { round: 3, time: [9, 11, 0], type: "prompt" }, 
        { round: 3, time: [10, 14, 0], type: "song" },
        { round: 4, time: [10, 16, 0], type: "prompt" }, 
        { round: 4, time: [10, 19, 0], type: "song" }, 
        { round: 5, time: [10, 21, 0], type: "prompt" },
        { round: 5, time: [10, 24, 0], type: "song" }, 
        { round: 6, time: [11, 3, 0], type: "end" }, 
    ]

    timeToUTC(time: [number, number, number]): number {
        return new Date(this.year, ...time).getTime();
    }

    findCurrentRound(): Round {
        const currentTime = new Date().getTime();
        let currentRound: Round = this.eventDates[0];
        for (let i: number = 0; i < this.eventDates.length; i++) {
            const round: Round = this.eventDates[i];
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