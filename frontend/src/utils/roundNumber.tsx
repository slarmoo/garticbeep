import { useState, useEffect } from 'react'
import { EventRound } from '../Context';

export function RoundNumber(props: RoundNumberProps) {
    const { round } = EventRound();
    const [roundDisplay, setRoundDisplay] = useState<string>("");


    useEffect(() => {
        setRoundDisplay(round.number > 0 ? round.number + "" : "");
        if (props.getRoundNumber) {
            props.getRoundNumber(round.number);
        }
    }, [round])

    return <h4>Round { roundDisplay }</h4>
}

interface RoundNumberProps {
    getRoundNumber?: (round: number) => void
}