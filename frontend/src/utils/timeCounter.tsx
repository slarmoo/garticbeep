import { useState, useEffect } from "react"
import { EventRound } from "../Context";

export function TimeCounter(props: timeCounterProps) {
    const { round }= EventRound();
    const [timeString, setTimeLeftString] = useState<string>("");

    useEffect(() => {
        let timeDiff: number = props.utc1 - props.utc2;
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
    }, [props.utc1, props.utc2])

    if (props.isJob) {
        return <h3 className="blob" id="eventTime">Time opened: <span id="timeLeft">{timeString}</span></h3>
    }
    switch (round.type) {
        case "start": return (
            <h3 className="blob" id="eventTime">The event will start in <span id="timeLeft">{timeString}</span></h3>
        )
        case "song": 
        case "prompt": return (
            <h3 className="blob" id="eventTime">The next round will start in <span id="timeLeft">{timeString}</span></h3>
        )
        case "end": return (
            <h3 className="blob" id="eventTime">The event is over! Please check out the results below</h3>
        )
    }    
}

interface timeCounterProps {
    utc1: number,
    utc2: number,
    isJob?: boolean
}