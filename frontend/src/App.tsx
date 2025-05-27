// import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import { useState } from 'react'
import { Unauthenticated } from './pages/unauthenticated'
import { Register } from './pages/register';
import { SubmitSong } from './pages/submitSong';
import { SubmitPrompt } from './pages/submitPrompt';

function App() {
  return (
    <BrowserRouter>
      <div id="title">
          <h1>Gartic Beep!</h1>
          <img id="logo" src="garticBeep.png" />
      </div>

      <Routes>
        <Route path="/" element={<Unauthenticated />} />
        <Route path="/register" element={<Register />} />
        <Route path="/submitSong" element={<SubmitSong />} />
        <Route path="/submitPrompt" element={<SubmitPrompt />} />
      </Routes>

      <br />
      <footer>
          <a className="blob" href="https://github.com/slarmoo/garticbeep">Github</a>
      </footer>
      <div id="background"></div>

      

    </BrowserRouter>
  )
}

export default App
