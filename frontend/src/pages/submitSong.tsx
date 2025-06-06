import type { DiscordData } from "../utils/Config";
import { Hovertext } from "../utils/hovertext";
import { RoundNumber } from "../utils/roundNumber";
import { EventRound, displayPrompt, displayPromptText } from "../Context";
import { useState, useEffect } from "react";

export function SubmitSong(props: SubmitSongProps) {
    const { round } = EventRound();
    const { setShowPrompt } = displayPrompt();
    const { setPromptText } = displayPromptText();
    const [songPrompt, setSongPrompt] = useState<string>("")

    function submitSong() {
        const linkElement = document.getElementById('linkInput') as HTMLInputElement;
        const songNameElement = document.getElementById('songNameInput') as HTMLInputElement;
        if (linkElement && songNameElement) {
            const link: string = linkElement.value;
            const songName: string = songNameElement.value;
            if (link.indexOf("https://") > -1) {
                fetch("/api/appendSong", {
                    method: 'post',
                    body: JSON.stringify({ username: props.discordData.username, round: round.number, link: link, name: songName }),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                });
                setPromptText("Song Submitted!");
                setShowPrompt(true);
            } else {
                setPromptText("Valid link not included");
                setShowPrompt(true);
            }
        }
    }

    useEffect(() => {
        fetch("/api/getPrompt", {
            method: 'post',
            body: JSON.stringify({ username: props.discordData.username, round: round.number }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
        .then(result => result.json())
        .then(response => {
            setSongPrompt(response.prompt);
        })
        .catch(console.error);
    }, [round])

    return (   
        <div id="formWrapper">
            <div className="blob">
                <RoundNumber />
                <h4>Prompt: {songPrompt}</h4>
            </div>
            <div className="blob">

                <div>
                    <label>Song title: </label>
                    <input type="text" className="form" id="songNameInput" />
                        <Hovertext text="This is optional. Feel free to submit a title if you wish. Please make sure
                        that your link does not include a title however, as this can influence the next person in the chain" />
                </div>
                <div>
                    <label>Song link: </label>
                    <input type="text" className="form" id="linkInput" />
                    <Hovertext text="Please include a valid shortened link to beepbox or one of its mods" />
                </div>
                <div>
                    <button className="blob border" onClick={submitSong}>Submit</button>
                    <Hovertext text="You can submit as many times as you need up until the deadline" />
                </div>
            </div>
        </div>
    )
}

interface SubmitSongProps {
    discordData: DiscordData
}