// import React from 'react';
import { BrowserRouter, Route, Routes, NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react'
import { Unauthenticated } from './pages/unauthenticated'
import { Register } from './pages/register';
import { SubmitSong } from './pages/submitSong';
import { SubmitPrompt } from './pages/submitPrompt';
import { OnHold } from './pages/onHold';
import { Redirect } from './pages/redirect';
import { DiscordAuth } from './pages/discordAuth';
import type { DiscordData } from './utils/Config';
import { FeedbackPrompt } from './utils/feedbackPrompt';

function App() {
  const [discordData, setDiscordData] = useState<DiscordData>()
  const [avatarSource, setAvatarSource] = useState<string>("");

  useEffect(() => {
    if (discordData) {
      setAvatarSource(`https://cdn.discordapp.com/avatars/${discordData.id}/${discordData.avatar}.jpg`);
    }
  }, [discordData])

  return (
    <BrowserRouter>
      <div id="title">
          <h1>Gartic Beep!</h1>
          <img id="logo" src="../garticBeep.png" />
      </div>

      <div>
        {discordData && (
          <div id="userInfo" className="blob">
            <p id="username">{discordData?.username}</p>
            <img id="avatar" src={avatarSource} />
          </div>
        )}
        <h3 className="blob" id="eventTime">The event will start in <span id="timeLeft">XX days</span></h3>
      </div>

      <Routes>
        <Route path="/" element={<Unauthenticated />} />
        <Route path="/auth/discord" element={<DiscordAuth getDiscordData={setDiscordData} />} />
        {discordData && (<>
          <Route path="/register" element={<Register discordData={discordData} />} />
        {/* // )}
        // {discordData && ( */}
          <Route path="/submitSong" element={<SubmitSong />} />
        {/* // )}
        // {discordData && ( */}
          <Route path="/submitPrompt" element={<SubmitPrompt />} />
        {/* // )}
        // {discordData && ( */}
          <Route path="/onHold" element={<OnHold />} />
          </>)}
        <Route path="*" element={<Redirect />} />
      </Routes>
      {discordData && (<>
        <br />
        <div>
          <NavLink id="logout" to="" className="blob">
            <span>Logout</span>
          </NavLink>
        </div>
      </>)}

      <br />
      <footer>
          <a className="blob" href="https://github.com/slarmoo/garticbeep">Github</a>
      </footer>

      <div id="background"></div>
      <FeedbackPrompt timeout={5} />

    </BrowserRouter>
  )
}

export default App
