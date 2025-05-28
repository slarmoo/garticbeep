import { useState, useEffect } from "react";
import { displayPrompt, displayPromptText } from "../Context";

export function FeedbackPrompt(props: feedbackPromptProps) {
    const [opacity, setOpacity] = useState<number>(0);
    const { showPrompt, setShowPrompt } = displayPrompt();
    const { promptText } = displayPromptText();

    useEffect(() => {
        if (showPrompt) {
            const definition: number = 0.1;
            setOpacity(1);
            const opacityInterval = setInterval(() => {
                setOpacity(opacity - definition);
                if (opacity <= 0) {
                    clearInterval(opacityInterval);
                    setShowPrompt(false);
                }
            }, (props.timeout * definition * 1000));
        }
    }, [showPrompt])

    return (
        <div id="feedbackWrapper" style={{ opacity: opacity}} className="border">
            <span id="feedback">{ promptText }</span>
        </div>
    )
}

interface feedbackPromptProps {
    timeout: number
}