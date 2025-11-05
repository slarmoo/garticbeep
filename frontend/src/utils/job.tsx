import { useEffect, useState } from "react";

export function JobEL(props: jobProps) {
    return <div>
        <h2>
            JOB: {props.job.isPrompt ? "Submit Song" : "Submit Prompt"} 
        </h2>
        <TimeLeftOpen timeOpened={props.job.timeOpened} />
        <div>
            {props.job.isPrompt ? "Prompt: " : "Song: "} {props.job.promptOrUrl}
        </div>
    </div>
}

export interface Job {
    _id: number,
    isPrompt: boolean,
    promptOrUrl: string,
    timeOpened: number
}

interface jobProps {
    job: Job
}

function TimeLeftOpen(props: timeLeftOpenProps) {
    const [currentTime, setCurrentTime] = useState<number>(0);
        const [timeString, setTimeLeftString] = useState<string>("");
        
    
        useEffect(() => {
            setInterval(() => {
                const date = new Date();
                if (date.getTime() != currentTime) {
                    setCurrentTime(date.getTime());
                }
            }, 500)
            
        }, [])
    
        useEffect(() => {
            let timeDiff: number = currentTime - props.timeOpened;
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
    return <h3 className="blob" id="eventTime">Time opened: <span id="timeLeft">{timeString}</span></h3>
}

interface timeLeftOpenProps {
    timeOpened: number
}