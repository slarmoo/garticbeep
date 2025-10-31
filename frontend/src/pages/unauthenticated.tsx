export function Unauthenticated() {
    return (
        <>                    
            <div>
                <h3 className="blob">What is Gartic Beep?</h3>
                <p className="blob">Gartic Beep is similar to the game telephone. There will be five rounds each with two phases. In the first phase you will create a prompt, and then in the second phase you will design a short song based on that prompt. In the next round, you'll try to figure out what the original prompt of the song was, and then that gets sent to a new person to make a song based on that. In the last round you'll have a bit more time to create a song if you want to put a bit more effort into it. After everything is done, you'll get to see how prompts evolved over the event and all of the cool songs that came from it. </p>
            </div>
            <div id="loginDiv">
                <a id="login" href="https://discord.com/oauth2/authorize?client_id=1327041279917424840&response_type=token&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Fauth%2Fdiscord&scope=identify"
                    className="bg-discord-blue">
                    <span>Login with Discord</span>
                </a>
            </div>
        </>
    )
}