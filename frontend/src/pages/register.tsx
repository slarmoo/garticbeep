import { Checkbox } from "../utils/checkbox"
import type { DiscordData } from "../utils/Config";
import { Hovertext } from "../utils/hovertext"
import { displayPrompt, displayPromptText } from "../Context";

export function Register(props: RegisterProps) {
    const { setShowPrompt } = displayPrompt();
    const { setPromptText } = displayPromptText();

    function register() {
        const statusElement: HTMLInputElement = document.getElementById('statusInput') as HTMLInputElement;
        const promptElement: HTMLInputElement = document.getElementById('initialPrompt') as HTMLInputElement;
        if (promptElement && statusElement) {
            const isOnHold: boolean = statusElement.value == "true";
            fetch("/api/startchain", {
                method: 'post',
                body: JSON.stringify({
                    username: props.discordData.username, onhold: isOnHold, prompt: promptElement.value,
                    url: `https://cdn.discordapp.com/avatars/${props.discordData.id}/${props.discordData.avatar}.jpg`
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            });
            setShowPrompt(true);
            setPromptText("Submitted!");
        }
    }

    return (   
    <div id="formWrapper">
        <div className="blob">
            <div>
                <label>Initial prompt: </label>
                <input type="text" required className="form" id="initialPrompt" />
                <Hovertext text='Your initial prompt should be clear and concise. You should not
                    include music theory, obscure references, instrumentation, length, or any other descriptor of song construction.
                    A few good examples are "A whale battling a shark", "A cat playing with yarn", "dumpster diving with your
                    friends", or "an abandoned spaceship"'/>
            </div>
            <div>
                <label>On hold?</label>
                <Checkbox id="statusInput" classList={["form"]} />
                <Hovertext text='Being on hold means that you can volunteer to submit for empty
                chains, whereas leaving the checkbox unchecked means that you will submit for every round' />
            </div>
            <div>
                <button className="blob border" onClick={register} >Register</button>
                <Hovertext text='You can change your prompt or status as many times as you need up until the deadline' />
            </div>
        </div>
    </div>
    )
}



interface RegisterProps {
    discordData: DiscordData
}