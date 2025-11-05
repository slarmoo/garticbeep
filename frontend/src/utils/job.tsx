import { Obfuscated } from "./obfuscated";
import { TimeCounter } from "./timeCounter";

export function JobEL(props: jobProps) {
    return <div className="job">
        <h2>
            JOB:  
        </h2>
        <h2>
            {props.job.isPrompt ? "Submit Song" : "Submit Prompt"}
        </h2>
        <TimeCounter utc1={props.currentTime} utc2={props.job.timeOpened} isJob={true} />
        <div>
            {props.job.isPrompt ? "Prompt: " + props.job.promptOrUrl :
                (<>Song: <a href={props.job.promptOrUrl} target="_blank" ><Obfuscated /></a></>)}
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