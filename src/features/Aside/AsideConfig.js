import { useContext, useEffect } from "react";
import { GlobalContext } from "../../app/Globals.js";

import SetsButton from "./SetsButton.js";
import TimeButton from "./TimeButton.js";
import PannerButton from "./PannerButton.js";
import FilterButton from "./FilterButton.js";
import DelayButton from "./DelayButton.js";
import FadeTimeButton from "./FadeTimeButton.js";
import PlayBackRateButton from "./PlayBackRateButton.js";
import RSPButton from "./RSPButton.js";

import "./AsideConfig.scss";

const classText = "configs flex-column align-c";

export default function AsideConfig({active, configButton, onClick }) {
    const [{
        panner, 
        delay,
        filter,
        playBackRate,
        randomStartPoint,
        timeInterval,
        audioListSize,
        probabilityOfSetSize,
        fadeIn,
        fadeOut
    }, globalDispatcher] = useContext(GlobalContext);
    const arrOfProbability = probabilityOfSetSize.arrOfValues;

    const setDispatcher = (variable, type, value , i = null) => {
        globalDispatcher({variable: variable, type: type, value: value, i: i});
    }

    useEffect(() => {
        const el = (e) => { 
          if (e.target.matches(".configs")
            || e.target.matches(".configs *")
            || e.target.matches(".panel")
            || e.target.matches(".panel *")
          ) {
            return;
          }
          onClick();
        }

        if (active) {
            document.addEventListener('click', el);
            return () => {
                document.removeEventListener('click', el);
            } 
        }
      }, [active]);
    
    return (
        <div id="configs" className={active ? classText : classText + " inactive"}>
            <button 
                type="button" 
                className="delete-button"
                onClick={onClick}
            >
                <i className="flex-row align-c fs-text-l bi bi-x"></i>
            </button>
            {   configButton === "SETS"? (
                    <SetsButton
                        arrOfProbability={arrOfProbability}
                        audioListSize={audioListSize}
                        setDispatcher={setDispatcher}
                    />
                ) :
                configButton === "TIME" ? (
                    <TimeButton
                        setDispatcher={setDispatcher}
                        timeInterval={timeInterval}
                    /> 
                ) : configButton === "FADETIME" ? ( 
                    <FadeTimeButton
                        fadeIn={fadeIn}
                        fadeOut={fadeOut}
                        setDispatcher={setDispatcher}
                    /> 
                ) : configButton === "PANNER" ? ( 
                    <PannerButton 
                        panner={panner}
                        setDispatcher={setDispatcher}
                    /> 
                ) : configButton === "FILTER" ? ( 
                    <FilterButton
                        filter={filter}
                        setDispatcher={setDispatcher}
                    /> 
                ) : configButton === "DELAY" ? ( 
                    <DelayButton 
                        delay={delay}
                        setDispatcher={setDispatcher}
                    /> 
                ) : configButton === "RATE" ? ( 
                    <PlayBackRateButton
                        playBackRate={playBackRate}
                        setDispatcher={setDispatcher}
                    /> 
                ) : configButton === "RSP" ? ( 
                    <RSPButton
                        randomStartPoint={randomStartPoint}
                        setDispatcher={setDispatcher}
                    /> 
                ) : null
            }
        </div>
    );
}