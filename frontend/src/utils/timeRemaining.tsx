import { useState, useEffect } from "react"
import { EventRound } from "../Context";

export function TimeRemaining() {
    const { round }= EventRound();
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [timeLeftString, setTimeLeftString] = useState<string>("");
    

    useEffect(() => {
        setInterval(() => {
            const date = new Date();
            if (date.getTime() != currentTime) {
                setCurrentTime(date.getTime());
            }
        }, 500)
        
    }, [])

    useEffect(() => {
        let timeDiff: number = round.utc - currentTime;
        timeDiff = Math.floor(timeDiff / 1000);
        const seconds: number = timeDiff % 60;
        timeDiff = Math.floor(timeDiff / 60);
        const minutes: number = timeDiff % 60;
        timeDiff = Math.floor(timeDiff / 60);
        const hours: number = timeDiff % 24;
        timeDiff = Math.floor(timeDiff / 24);
        const days: number = timeDiff

        const timeStrings: string[] = [];

        if (days >= 1) timeStrings.push(days + " day" + (days != 1 ? "s" : ""));
        if (hours >= 1) timeStrings.push(hours + " hour" + (hours != 1 ? "s" : ""));
        if (minutes >= 1) timeStrings.push(minutes + " minute" + (minutes != 1 ? "s" : ""));
        if (seconds >= 1) timeStrings.push(seconds + " second" + (seconds != 1 ? "s" : ""));

        let timeString: string = "";
        for (let i: number = 0; i < timeStrings.length; i++) {
            timeString += timeStrings[i];
            if (i < timeStrings.length - 1) {
                timeString += ", ";
            }
            if (i == timeStrings.length - 2) {
                timeString += "and ";
            }
        }
            

        setTimeLeftString(timeString);
    }, [currentTime])

    switch (round.type) {
        case "start": return (
            <h3 className="blob" id="eventTime">The event will start in <span id="timeLeft">{timeLeftString}</span></h3>
        )
        case "song": 
        case "prompt": return (
            <h3 className="blob" id="eventTime">The next round will start in <span id="timeLeft">{timeLeftString}</span></h3>
        )
        case "end": return (
            <h3 className="blob" id="eventTime">The event is over! Please check out the results below</h3>
        )
    }
    
}