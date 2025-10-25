import { useState, useEffect } from "react";
import { displayPrompt, displayPromptText } from "../Context";

export function FeedbackPrompt() {
    const [show, setShow] = useState<string>("");
    const { showPrompt, setShowPrompt } = displayPrompt();
    const { promptText } = displayPromptText();

    function hide() {
        setShow("")
        setShowPrompt(false)
    }

    useEffect(() => {
        if (showPrompt) {
            setShow("show")
        }
    }, [showPrompt])

    return (
        <div id="feedbackWrapper" onClick={hide} className={"border " + show} >
            <span id="feedback">{promptText}</span>
            <span id="feedbackX">×</span>
        </div>
    )
}