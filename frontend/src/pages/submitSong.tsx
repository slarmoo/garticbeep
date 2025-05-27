import { Hovertext } from "../utils/hovertext"

export function SubmitSong() {
    return (   
        <div id="formWrapper">
            <div className="blob">
                <h4>Round <span className="roundNumber"></span></h4>
                <h4>Prompt: <span id="promptDisplay"></span></h4>
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
                    <Hovertext text="You can submit as many times as you need up until the deadline. Just be sure to 
                    always include a song link when submitting, as an empty field will still overwrite the database" />
                    {/* TODO: empty field doesn't send a request */}
                </div>
            </div>
        </div>
    )
}

function submitSong() {

}