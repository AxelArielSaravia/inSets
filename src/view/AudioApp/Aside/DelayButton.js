import { useState, memo } from "react";

import { GSDelay } from "../../../core/initGlobalState.js";
import initState from "../../../core/initState.json";

import AsideButton from "./AsideButton.js";
import TouchButton from "../TouchButton.js";
import ToolButton from "../ToolButton.js";


function changeLocalStorage(name, value) {
    let localStorageDelay = JSON.parse(localStorage.getItem('delay'));
    localStorageDelay[name] = value;
    localStorage.setItem('delay', JSON.stringify(localStorageDelay)); 
}

export default memo(function DelayButton() {
    let localStorageDelay = JSON.parse(localStorage.getItem('delay'));

    //const [disableAll, setDisableAll] = useState(localStorageDelay.disableAll);
    const [timeMin, setTimeMin] = useState(localStorageDelay.timeMin * 1000);
    const [timeMax, setTimeMax] = useState(localStorageDelay.timeMax * 1000);
    const [feedbackMin, setFeedbackMin] = useState(localStorageDelay.feedbackMin * 100);
    const [feedbackMax, setFeedbackMax] = useState(localStorageDelay.feedbackMax * 100);

    const operationTime = (setTime, operation) => {
        return function(data) {
            if (operation === "add") {
                GSDelay[data] = Number.parseFloat((GSDelay[data] + 0.1).toFixed(1));
            } else {
                GSDelay[data] = Number.parseFloat((GSDelay[data] - 0.1).toFixed(1));
            }
            const val =  GSDelay[data];
            //console.log(data, val)
            changeLocalStorage(data, val);
            setTime(_ => Math.floor(val * 1000));
        }
    }

    const operationFeedback = (setTime, operation) => {
        return function(data) {
            if (operation === "add") {
                GSDelay[data] = Number.parseFloat((GSDelay[data] + 0.01).toFixed(2));
            } else {
                GSDelay[data] = Number.parseFloat((GSDelay[data] - 0.01).toFixed(2));
            }
            const val = GSDelay[data];
            console.log(data, val)
            changeLocalStorage(data, val);
            setTime(_ => Math.floor(val * 100));
        }
    }

    const reset = () => {
        let delay = initState.delay;
        GSDelay.timeMin = delay.timeMin;
        GSDelay.timeMax = delay.timeMax;
        GSDelay.feedbackMin = delay.feedbackMin;
        GSDelay.feedbackMax = delay.feedbackMax;
        GSDelay.disableAll = delay.disableAll;
        localStorage.setItem('delay', JSON.stringify(delay));
        //setDisableAll(_ => delay.disableAll);
        setTimeMin(_ => delay.timeMin * 1000);
        setTimeMax(_ => delay.timeMax * 1000);
        setFeedbackMin(_ => delay.feedbackMin * 100);
        setFeedbackMax(_ => delay.feedbackMax * 100);
    }

    return (
        <AsideButton
            title="Delay"
            description="Change the delay configurations."
        >
            <div className="flex-column align-c justify-c p-3">
                <ToolButton onClick={reset}>Reset</ToolButton>
            </div>
            <div className="flex-column align-c">
                <div style={{width:"240px"}}>
                    <div className="p-2">
                        <div className="p-2 border rounded">
                            <h4 className="fs-text">Time:</h4>
                            <div className="flex-column align-c justify-sb">
                                <div style={{width:"165px"}}>
                                    <div className="flex-row align-c justify-sb p-2">
                                        <span className="fs-text">min:</span>
                                        <TouchButton
                                            textStyle={{width: "45px"}}
                                            orientation="row"
                                            disable="configs"
                                            output={timeMin}
                                            add={operationTime(setTimeMin, 'add')}
                                            subtract={operationTime(setTimeMin, 'subtract')}
                                            data={"timeMin"}
                                        />
                                        <span className="fs-text">ms</span>
                                    </div>
                                    <div className="flex-row align-c justify-sb p-2">
                                        <span className="fs-text">max:</span>
                                        <TouchButton
                                            textStyle={{width: "45px"}}
                                            orientation="row"
                                            disable="configs"
                                            output={timeMax}
                                            add={operationTime(setTimeMax, 'add')}
                                            subtract={operationTime(setTimeMax, 'subtract')}
                                            data={"timeMax"}
                                        />
                                        <span className="fs-text">ms</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-2">
                        <div className="p-2 border rounded">
                            <h4 className="fs-text">Feedback:</h4>
                            <div className="flex-column align-c justify-sb">
                                <div style={{width:"134px"}}>
                                    <div className="flex-row align-c justify-sb p-2">
                                        <span className="fs-text">min:</span>
                                        <TouchButton
                                            textStyle={{width: "25px"}}
                                            orientation="row"
                                            disable="configs"
                                            output={feedbackMin}
                                            add={operationFeedback(setFeedbackMin, 'add')}
                                            subtract={operationFeedback(setFeedbackMin, 'subtract')}
                                            data={"feedbackMin"}
                                            
                                        />
                                        <span className="fs-text">%</span>
                                    </div>
                                    <div className="flex-row align-c justify-sb p-2">
                                        <span className="fs-text">max:</span>
                                        <TouchButton
                                            textStyle={{width: "25px"}}
                                            orientation="row"
                                            disable="configs"
                                            output={feedbackMax}
                                            add={operationFeedback(setFeedbackMax, 'add')}
                                            subtract={operationFeedback(setFeedbackMax, 'subtract')}
                                            data={"feedbackMax"}
                                        />
                                        <span className="fs-text">%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AsideButton>
    );
});