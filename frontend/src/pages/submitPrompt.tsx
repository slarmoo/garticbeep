import { Hovertext } from "../utils/hovertext"
import { RoundNumber } from "../utils/roundNumber"

export function SubmitPrompt() {
    return (   
        <div id="formWrapper">
            <div className="blob">
                <RoundNumber />
                <h4>Song: <a id="songDisplay" target="_blank">Link</a></h4>
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

function submitPrompt() {

}