import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import type { DiscordData } from "../utils/Config";
import { EventRound } from "../Context";

export function DiscordAuth(props: DiscordAuthProps) {
    const { round } = EventRound();
    const navigate = useNavigate();

    const [discordData, setDiscordData] = useState<DiscordData>();

    useEffect(() => {
        const fragment = new URLSearchParams(window.location.hash.slice(1));
        const [accessToken, tokenType] = [fragment.get('access_token'), fragment.get('token_type')];

        if (!accessToken) {
            navigate('/');
        }

        fetch('https://discord.com/api/users/@me', {
            headers: {
                authorization: `${tokenType} ${accessToken}`,
            },
        })
            .then(result => result.json())
            .then(response => {
                setDiscordData(response as DiscordData);
                switch (round[1]) {
                    case "start":
                        navigate("/register");
                        break;
                    case "song":
                        navigate("/submitSong");
                        break;
                    case "prompt":
                        navigate("/submitPrompt");
                        break;
                    case "end":
                        navigate("/results");
                        break;
                  }
            })
    }, [])

    useEffect(() => {
        if (discordData) {
            props.getDiscordData(discordData);
        }
    }, [discordData])

    return (
        <>
            <div>Redirecting...</div>
            <br />
        </>
    )
}

interface DiscordAuthProps {
    getDiscordData: (data: DiscordData) => void
}