import { Checkbox } from "../utils/checkbox"
import { Hovertext } from "../utils/hovertext"

export function Register() {
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

function register() {

}