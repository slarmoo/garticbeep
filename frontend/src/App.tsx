// import React from 'react';
import { Route, Routes, NavLink, useNavigate } from 'react-router-dom';
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
import { Admin } from './utils/adminFuntions';
import { ViewChains } from './utils/viewChains';
import { EventRound } from './Context';
import { TimeRemaining } from './utils/timeRemaining';

function App() {
  const navigate = useNavigate();
  const { round, setRound } = EventRound();
  const [discordData, setDiscordData] = useState<DiscordData>()
  const [avatarSource, setAvatarSource] = useState<string>("../garticBeep.png");
  const admin: Admin = new Admin();

  useEffect(() => {
    if (discordData) {
      setAvatarSource(`https://cdn.discordapp.com/avatars/${discordData.id}/${discordData.avatar}.jpg`);
      admin.setDiscordData(discordData);
      (window as any).admin = admin; //expose admin to the console for debugging
      const date = new Date();
      const nextDate = new Date(date.getTime() + 1000 * 60 * 60 * 2);
      document.cookie = "auth=" + JSON.stringify(discordData) + "; expires=" + nextDate.toUTCString() + "; path=/;";
    }
  }, [discordData]);

  useEffect(() => {
    if (discordData) {
      switch (round.type) {
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
    }
  }, [round, discordData])

  useEffect(() => {
    let cookies: string = document.cookie;
    if (cookies.indexOf("auth=") > -1) {
      const auth: DiscordData = JSON.parse(cookies.replace("auth=", ""));
      setDiscordData(auth);
    }
  fetch('/api/getRound', {
      method: 'get',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then(result => result.json())
      .then(response => {
        setRound({ number: response.round, type: response.type, utc: response.utc });
      })
      .catch(console.error);
  }, [])

  return (
    <>
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
        <TimeRemaining />
      </div>

      <Routes>
        <Route path="/" element={<Unauthenticated />} />
        <Route path="/auth/discord" element={<DiscordAuth getDiscordData={setDiscordData} />} />
        {discordData && (<>
          <Route path="/register" element={<Register discordData={discordData} />} />
          <Route path="/submitSong" element={<SubmitSong discordData={discordData} />} />
          <Route path="/submitPrompt" element={<SubmitPrompt discordData={discordData} />} />
          <Route path="/onHold" element={<OnHold />} />
          </>)}
        <Route path="*" element={<Redirect />} />
      </Routes>
      

      <br />
      <footer>
        {discordData && (
            <NavLink id="logout" to="" className="blob">
              <span>Logout</span>
            </NavLink>)}
          <a className="blob" href="https://github.com/slarmoo/garticbeep">Github</a>
      </footer>

      { round.type == "end" &&
        <ViewChains />
      }
      <div id="background"></div>
      <FeedbackPrompt timeout={10} />
    </>
  )
}

export default App
