import { useState } from "react";

import { GSFilter } from "../../../core/initGlobalState.js"
import { getGlobalStatesLimit } from "../../../core/states.js"
import initState from "../../../core/initState.json";

import AsideButton from "./AsideButton.js";
import TouchButton from "../TouchButton.js";
import ToolButton from "../ToolButton.js";
import Switch from "../SwitchButton.js";

function changeLocalStorage(name, value) {
    let localStorageFilter = JSON.parse(localStorage.getItem('filter'));
    localStorageFilter[name] = value;
    localStorage.setItem('filter', JSON.stringify(localStorageFilter)); 
}

function FilterTypeButton(props) {
    let index = props.types.indexOf(props.value);
    const [isDisable, setIsDisable] = useState(index === -1);
    const handleOnClick = () => {
        let arr = [...props.types];
        let index = props.types.indexOf(props.value);

        if (isDisable) {
            if (index === -1) arr.push(props.value);
            setIsDisable(_ => false);
        } else if (arr.length > 1){
            arr.splice(index, 1);
            setIsDisable(_ => true);
        }
        console.log(arr);
        changeLocalStorage("types", arr);
        props.setTypes(_ => arr)
    }

    return (
        <Switch 
            onClick={handleOnClick}
            name={props.value}
            isDisable={isDisable}
        />
    );
}

export default function FilterButton() {
    let localStorageFilter = JSON.parse(localStorage.getItem('filter'));
    //const [disableAll, setDisableAll] = useState(localStorageFilter.disableAll);
    const [frequencyMax, setFrequencyMax] = useState(localStorageFilter.frequencyMax);
    const [frequencyMin, setFrequencyMin] = useState(localStorageFilter.frequencyMin);
    const [qMax, setQMax] = useState(Number.parseFloat(localStorageFilter.qMax).toFixed(2));
    const [qMin, setQMin] = useState(Number.parseFloat(localStorageFilter.qMin).toFixed(2));
    const [types, setTypes] = useState(localStorageFilter.types);

    const addQ = (setTime) => {
        return function(data) {
            let v = 0.05;
            if (GSFilter[data] >= 2) v = 0.1; 
            GSFilter[data] = Number.parseFloat((GSFilter[data] + v).toFixed(2));
            let res = GSFilter[data].toFixed(2);
            changeLocalStorage(data, res);
            setTime(() => res);
        }
    }
    const subtractQ = (setTime) => {
        return function(data) {
            let v = 0.05;
            if (GSFilter[data] > 2) v = 0.1; 
            GSFilter[data] = Number.parseFloat((GSFilter[data] - v).toFixed(2))
            let res = GSFilter[data].toFixed(2);
            changeLocalStorage(data, res);
            setTime(() => res);
        }
    }
    const addFrequency = (setTime) => {
        return function(data) {
            let v = 1000;
            if (GSFilter[data] < 200) v = 10;
            else if (GSFilter[data] < 1000) v = 50;
            else if (GSFilter[data] < 10000) v = 100;
            GSFilter[data] += v;
            changeLocalStorage(data, GSFilter[data]);
            setTime(() => GSFilter[data]);
        }
    }
    const subtractFrequency = (setTime) => {
        return function(data) {
            let v = 1000;
            if (GSFilter[data] < 200) v = 10;
            else if (GSFilter[data] < 1000) v = 50;
            else if (GSFilter[data] < 10000) v = 100;
            GSFilter[data] -= v;
            changeLocalStorage(data, GSFilter[data]);
            setTime(() => GSFilter[data]);
        }
    }
    const reset = () => {
        let filter = initState.filter;
        GSFilter.frequencyMax = filter.frequencyMax;
        GSFilter.frequencyMin = filter.frequencyMin;
        GSFilter.qMax = filter.qMax;
        GSFilter.qMin = filter.qMin;
        GSFilter.types = filter.types;
        localStorage.setItem('filter', JSON.stringify(filter));
        setFrequencyMax(_ => filter.frequencyMax);
        setFrequencyMin(_ => filter.frequencyMin);
        setQMax(_ => Number.parseFloat(filter.qMax).toFixed(2));
        setQMin(_ => Number.parseFloat(filter.qMin).toFixed(2));
        setTypes(_ => filter.types);
    }
    
    const handleOnClick = (val) => {
        let arr = [...types];
        let index = types.indexOf(val);
        if (false) {
            if (index === -1) arr.push(val);
        } else {
            arr.splice(index, 1);
        }
        changeLocalStorage("types", arr);
        setTypes(_ => arr)
    }
    return (
        <AsideButton
            title="Filter"
            description="Change the filter configurations."
        >
            <div className="flex-column align-c justify-c p-3">
                <ToolButton onClick={reset}>Reset</ToolButton>
            </div>
            <div className="flex-column align-c">
                <div style={{width:"220px"}}>
                    <div className="p-2">
                        <div className="p-2 border rounded">
                            <h4 className="fs-text">Frequency:</h4>
                            <div className="flex-column align-c justify-sb">
                                <div style={{width:"150px"}}>
                                    <div className="flex-row align-c justify-sb p-2">
                                        <span className="fs-text">min:</span>
                                        <TouchButton
                                            orientation="row"
                                            disable="configs"
                                            output={frequencyMin}
                                            add={addFrequency(setFrequencyMin)}
                                            subtract={subtractFrequency(setFrequencyMin)}
                                            data={"frequencyMin"}
                                        />
                                        <span className="fs-text">Hz</span>
                                    </div>
                                    <div className="flex-row align-c justify-sb p-2">
                                        <span className="fs-text">max:</span>
                                        <TouchButton
                                            orientation="row"
                                            disable="configs"
                                            output={frequencyMax}
                                            add={addFrequency(setFrequencyMax)}
                                            subtract={subtractFrequency(setFrequencyMax)}
                                            data={"frequencyMax"}
                                        />
                                        <span className="fs-text">Hz</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-2">
                        <div className="p-2 border rounded">
                            <h4 className="fs-text">Q:</h4>
                            <div className="flex-column align-c justify-sb">
                                <div style={{width:"110px"}}>
                                    <div className="flex-row align-c justify-sb p-2">
                                        <span className="fs-text">min:</span>
                                        <TouchButton
                                            orientation="row"
                                            disable="configs"
                                            output={qMin}
                                            add={addQ(setQMin)}
                                            subtract={subtractQ(setQMin)}
                                            data={"qMin"}
                                        />
                                    </div>
                                    <div className="flex-row align-c justify-sb p-2">
                                        <span className="fs-text">max:</span>
                                        <TouchButton
                                            orientation="row"
                                            disable="configs"
                                            output={qMax}
                                            add={addQ(setQMax)}
                                            subtract={subtractQ(setQMax)}
                                            data={"qMax"}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-2">
                        <div className="p-2 border rounded">
                            <h4 className="fs-text">Types:</h4>
                            <div className="flex-column align-c justify-sb p-2">
                                <div style={{width:"190px"}}>
                                    <div className="flex-row flex-wrap justify-c">
                                        {getGlobalStatesLimit().filter.types.map((el) => (
                                            <div key={"filter_type-" + el} className="p-2">
                                                <FilterTypeButton 
                                                    value={el}
                                                    types={types}
                                                    setTypes={setTypes}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AsideButton>
    );
}