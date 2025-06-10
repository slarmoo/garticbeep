import { Hovertext } from "../utils/hovertext";
import { RoundNumber } from "../utils/roundNumber";
import type { DiscordData } from "../utils/Config";
import { EventRound, displayPrompt, displayPromptText } from "../Context";
import { useState, useEffect } from "react";

export function SubmitPrompt(props: SubmitPromptProps) {
    const { round } = EventRound();
    const { setShowPrompt } = displayPrompt();
    const { setPromptText } = displayPromptText();
    const [songLink, setSongLink] = useState<string>("");
    const [songName, setSongName] = useState<string>("");

    function submitPrompt() {
        const promptElement = document.getElementById('promptInput') as HTMLInputElement;
        if (promptElement) {
            if (promptElement.value != "") {
                fetch("/api/appendPrompt", {
                    method: 'post',
                    body: JSON.stringify({ username: props.discordData.username, round: round.number, prompt: promptElement.value }),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                }).catch(console.error);
                setPromptText("Prompt Submitted!");
                setShowPrompt(true);
            } else {
                setPromptText("Please include a prompt");
                setShowPrompt(true);
            }

        }
    }

    useEffect(() => {
        if(round.type == "prompt") {
            fetch("/api/getSong", {
                method: 'post',
                body: JSON.stringify({ username: props.discordData.username, round: round }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            })
            .then(result => result.json())
            .then(response => {
                setSongLink(response.link);
                setSongName(response.name);
            })
            .catch(console.error);
        }
    }, [round])
    
    return (   
        <div id="formWrapper">
            <div className="blob">
                <RoundNumber />
                <h4>Song: <a id="songDisplay" target="_blank" href={songLink}>{songName}</a></h4>
            </div>
            <div className="blob">
                <div>
                    <label>Prompt: </label>
                    <input type="text" className="form" id="promptInput" />
                    <Hovertext text='Your prompt should be clear and concise, and should describe the tone of the piece, 
                    not the instrumentation or how similar it sounds to an ost. Only include a reference to something else 
                    if the piece explicitly makes said reference (ie, a "mario song" only if it includes a motif from a mario game)' />
                </div>
                <div>
                    <button className="blob border" onClick={submitPrompt}>Submit</button>
                    <Hovertext text="You can submit as many times as you need up until the deadline" />
                </div>
            </div>
        </div>
    )
}

interface SubmitPromptProps {
    discordData: DiscordData
}