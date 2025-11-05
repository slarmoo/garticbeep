// import { Checkbox } from "../utils/checkbox"
// import { Hovertext } from "../utils/hovertext"
import { RoundNumber } from "../utils/roundNumber"
import { useState, useEffect } from "react";
import { JobEL, type Job } from "../utils/job";

export function OnHold(props: onHoldProps) {
    const [jobs, setJobs] = useState<Job[]>([]);

    useEffect(() => {
        fetch("/api/getJobs", {
            method: 'get',
            // body: JSON.stringify({ username: props.discordData.username, round: round }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then(result => result.json())
            .then(response => {
                const jobs: Job[] = response.jobs
                jobs.sort((a, b) => a.timeOpened - b.timeOpened)
                setJobs(jobs);
                // setSongName(response.name);
            })
            .catch(console.error);
    }, [])

    return (   
        <div id="formWrapper">
            <div className="blob">
                <RoundNumber />
                <h4>You're on hold. Below are some jobs that you can accept</h4>
            </div>
            <div id="jobsWrapper">
                {jobs.map(job => (
                    <JobEL job={job} currentTime={props.currentTime} />
                ))}
            </div>
            <br />
        </div>
    )
}

interface onHoldProps {
    currentTime: number
}