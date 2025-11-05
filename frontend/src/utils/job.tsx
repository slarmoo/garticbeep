import { TimeCounter } from "./timeCounter";

export function JobEL(props: jobProps) {
    return <div>
        <h2>
            JOB: {props.job.isPrompt ? "Submit Song" : "Submit Prompt"} 
        </h2>
        <TimeCounter utc1={props.currentTime} utc2={props.job.timeOpened} isJob={true} />
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
    job: Job,
    currentTime: number
}