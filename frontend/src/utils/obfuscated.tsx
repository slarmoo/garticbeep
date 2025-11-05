import { useState, useEffect } from "react";


export function Obfuscated() {

    const [obfuscate, setObfuscate] = useState<string>("")
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*-+=_~|/<>";
    function generateRandomString(length: number) {
        let string = "";
        for (let i = 0; i < length; i++) {
            string += chars[Math.floor(Math.random() * chars.length)]
        }
        return string;
    }

    useEffect(() => {
        setObfuscate(generateRandomString(12));
    }, [])

    return <>
        {obfuscate}
    </>
}