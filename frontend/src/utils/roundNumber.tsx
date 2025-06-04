import { useState, useEffect } from 'react'
import { EventRound } from '../Context';

export function RoundNumber(props: RoundNumberProps) {
    const { round } = EventRound();
    const [roundDisplay, setRoundDisplay] = useState<string>("");


    useEffect(() => {
        setRoundDisplay(round[0] > 0 ? round[0] + "" : "");
        if (props.getRoundNumber) {
            props.getRoundNumber(round[0]);
        }
    }, [round])

    return <h4>Round { roundDisplay }</h4>
}

interface RoundNumberProps {
    getRoundNumber?: (round: number) => void
}