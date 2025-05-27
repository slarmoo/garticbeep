import "./hovertext.css";

export function Hovertext(props: hovertextProps) {
    return <label className="hovertext">?<span className="blob border"> {props.text} </span></label>;
}

interface hovertextProps {
    text: string
}

