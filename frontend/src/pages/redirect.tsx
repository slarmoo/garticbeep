import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export function Redirect() {
    const navigate = useNavigate();

    useEffect(() => {
       navigate("/");
    }, [])

    return (  
        <>
            <div>Redirecting...</div>
            <br />
        </>
    )
}