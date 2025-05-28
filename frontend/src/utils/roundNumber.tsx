import { useState, useEffect } from 'react'

export function RoundNumber(props: RoundNumberProps) {
    const [roundNumber, setRoundNumber] = useState<number>(0);
    const [roundDisplay, setRoundDisplay] = useState<string>("");

    useEffect(() => {
        fetch('/roundNumber', {
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
        .then(result => result.json())
        .then(response => {
            setRoundNumber(response.round);
        })
    }, [])

    useEffect(() => {
        setRoundDisplay(roundNumber > 0 ? roundNumber + "" : "");
        if (props.getRoundNumber) {
            props.getRoundNumber(roundNumber);
        }
    }, [roundNumber])

    return <h4>Round { roundDisplay }</h4>
}

interface RoundNumberProps {
    getRoundNumber?: (round: number) => void
}