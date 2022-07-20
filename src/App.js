import { useState } from "react";
import { createAudioContext, changeAudioEngine } from "./core/audioEffects.js" 

import AudioApp from "./view/AudioApp/AudioApp.js";
import Header from "./view/Header/Header.js";
import DragFiles from "./view/DragFiles.js";

import './App.scss';


//COMPONENTS
//App Component
function App() {
  const hasAudioContext = window.AudioContext || window.webkitAudioContext;
  const [startApp, setStartApp] = useState(false);
  const [engine, setEngine] = useState("audioBuffer");

  const handleAcceptOnClick = () => {
    createAudioContext();
    setStartApp(() => true)
  };

  const handleRadioOnChange = (e) => {
    changeAudioEngine(e.target.value);
    setEngine(() => e.target.value);
  }
  const handleRadioOnClick = (val) => {
    changeAudioEngine(val);
    setEngine(() => val);
  }
  return (
    <DragFiles
      className="flex-column"
      start={startApp}
      style={{
        width: '100%',
        height: '100%',
        minWidth: '100vw',
        minHeight: '100vh',
      }}
    >
      {isDragActive => (
        <>
          <section className="header-section flex-column align-c justify-c">
            <Header />
          </section>
          { hasAudioContext
            ? (
              <>
              { startApp 
                ? <AudioApp isDragActive={isDragActive}/>
                : (
                  <section className="init-section flex-column align-c justify-c">
                    <div className="flex-column align-c justify-c">
                      <div className="init-message flex-column align-c justify-c">
                        <h2 className="fs-title text-center">inSets Composition App</h2>
                      </div>
                      <div className="init-message flex-column align-c justify-c">
                        <p className="fs-text text-center">This project was created by</p>
                        <p className="fs-text-l text-center">Axel Ariel Saravia</p>
                      </div>
                      <div className="init-message flex-column justify-c"> 
                        <p className="fs-text-l text-center">Audio Engine:</p>
                        <label className="audioEngine-button">
                          <input 
                            type="radio" 
                            name="audioEngine" 
                            value="audioBuffer" 
                            onChange={handleRadioOnChange} 
                            checked={engine === "audioBuffer"}
                          />
                          <div className="flex-row align-c ">
                            <button 
                              className="checkmark" 
                              role="switch" 
                              aria-checked={engine === "audioBuffer"}
                              onClick={() => handleRadioOnClick("audioBuffer")}
                            />
                            <span className="fs-text text-bold">AudioBuffers:</span>
                            <span className="fs-text">(preferred)</span>
                          </div>
                            <p className="fs-text">It uses AudioBuffer to handle audio files. It has better audio quality but needs more computer resources.</p>
                        </label>
                        <label className="audioEngine-button">
                          <input 
                            type="radio"
                            name="audioEngine"
                            value="audioNode"
                            onChange={handleRadioOnChange} 
                            checked={engine === "audioNode"}
                          />
                          <div className="flex-row align-c ">
                            <button
                              className="checkmark" 
                              role="switch" 
                              aria-checked={engine === "audioNode"} 
                              onClick={() => handleRadioOnClick("audioNode")}
                            />
                            <span className="fs-text text-bold">AudioNodes:</span>
                          </div>
                          <p className="fs-text">It uses HTMLAudioElement to handle audio files. It has optimized computer resources, but less audio quality.</p>
                        </label>
                      </div>
                      <div className="init-message">
                        <button 
                          className="startApp-button fs-text-l" 
                          type="button" 
                          onClick={handleAcceptOnClick}
                        >
                          Start App
                        </button>
                      </div>
                    </div>
                  </section>
                )
              }
              </>
            )
            : (
              <section className="init-section flex-column align-c justify-c">
                <div className="flex-column align-c justify-c">
                  <div style={{padding: "20px 0"}}>
                    <p className="fs-text-l text-center">Your browser does NOT have AudioContext🎵❗❗</p>
                  </div>
                  <div style={{padding: "20px 0"}}>
                    <p className="fs-text-l text-center">We CAN NOT run the app 😭</p>
                  </div>
                  <div style={{padding: "20px 0"}}>
                    <p className="fs-text-l text-center">Please, use any other actualized browser.</p>
                  </div>
                </div>
              </section>
            )
          }
        </>
      )}
    </DragFiles>
  );
}

export default App;