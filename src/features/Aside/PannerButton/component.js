import { memo, useCallback, useMemo } from "react";

import AsideButton from "../AsideButton/component.js";

import TouchButton from "../../../components/TouchButton/index.js";
import ToolButton from "../../../components/ToolButton/index.js";
import Switch from "../../../components/SwitchButton/index.js";

export default memo(function PannerButton({panner, setDispatcher}) {
    const {xMin, xMax, yMin, yMax, zMin, zMax} = panner;
    const resZMin = useMemo(() => zMin + 50, [zMin]);
    const resZMax = useMemo(() => zMax + 50, [zMax]);
    const areAllDisable = panner.areAllDisable.value;
    const handleOnClick = () => {
        setDispatcher("panner", "areAllDisable/global", !areAllDisable);
    }
    
    const operation = useCallback((operation, type) => (data) => {
        if (operation === "add") {
            setDispatcher("panner", type, data + 1); 
        } else if (operation === "subtract") {
            setDispatcher("panner", type, data - 1); 
        } 
    }, [setDispatcher]);

    const add_xMin = useMemo(() => operation("add","xMin"), [operation]);
    const add_xMax = useMemo(() => operation("add","xMax"), [operation]);
    const add_yMin = useMemo(() => operation("add","yMin"), [operation]);
    const add_yMax = useMemo(() => operation("add","yMax"), [operation]);
    const add_zMin = useMemo(() => operation("add","zMin"), [operation]);
    const add_zMax = useMemo(() => operation("add","zMax"), [operation]);
    const subtract_xMin = useMemo(() => operation("subtract","xMin"), [operation]);
    const subtract_xMax = useMemo(() => operation("subtract","xMax"), [operation]);
    const subtract_yMin = useMemo(() => operation("subtract","yMin"), [operation]);
    const subtract_yMax = useMemo(() => operation("subtract","yMax"), [operation]);
    const subtract_zMin = useMemo(() => operation("subtract","zMin"), [operation]);
    const subtract_zMax = useMemo(() => operation("subtract","zMax"), [operation]);

    const reset = () => { setDispatcher("panner", "reset", null); }

    return (
        <AsideButton 
            title="Panner"
            description="Change the intervals of panner configurations."
        >
            <div className="flex-row align-c justify-c p-3">
                <Switch
                    onClick={handleOnClick}
                    isDisable={areAllDisable}
                    title="disable all panner effect"
                >
                    <span className="fs-text disable-all_btn">
                        { areAllDisable ? "enable all" : "disable all" }
                    </span>
                </Switch>
            </div>
            <div className="flex-column align-c justify-c p-3">
                <ToolButton onClick={reset}>Reset</ToolButton>
            </div>
            <div className="flex-column align-c">
                <div className="effect-container">
                    <div className="p-2">
                        <div className="p-2 border rounded">
                            <h4 className="fs-text">Position X:</h4>
                            <div className="flex-column align-c justify-sb">
                                <div>
                                    <div className="flex-row align-c justify-sb">
                                        <span className="fs-text p-2">min:</span>
                                        <TouchButton
                                            scroll
                                            touch
                                            textClass="effect-container_text-s"
                                            orientation="row"
                                            disable="configs"
                                            output={xMin}
                                            add={add_xMin}
                                            subtract={subtract_xMin}
                                            data={xMin}
                                        />
                                        <span className="fs-text p-2">%</span>
                                    </div>
                                    <div className="flex-row align-c justify-sb">
                                        <span className="fs-text p-2">max:</span>
                                        <TouchButton
                                            scroll
                                            touch
                                            textClass="effect-container_text-s"
                                            orientation="row"
                                            disable="configs"
                                            output={xMax}
                                            add={add_xMax}
                                            subtract={subtract_xMax}
                                            data={xMax}
                                        />
                                        <span className="fs-text p-2">%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-2">
                        <div className="p-2 border rounded">
                            <h4 className="fs-text">Position Y:</h4>
                            <div className="flex-column align-c justify-sb">
                                <div>
                                    <div className="flex-row align-c justify-sb">
                                        <span className="fs-text p-2">min:</span>
                                        <TouchButton
                                            scroll
                                            touch
                                            textClass="effect-container_text-s"
                                            orientation="row"
                                            disable="configs"
                                            output={yMin}
                                            add={add_yMin}
                                            subtract={subtract_yMin}
                                            data={yMin}
                                        />
                                        <span className="fs-text p-2">%</span>
                                    </div>
                                    <div className="flex-row align-c justify-sb">
                                        <span className="fs-text p-2">max:</span>
                                        <TouchButton
                                            scroll
                                            touch
                                            textClass="effect-container_text-s"
                                            orientation="row"
                                            disable="configs"
                                            output={yMax}
                                            add={add_yMax}
                                            subtract={subtract_yMax}
                                            data={yMax}
                                        />
                                        <span className="fs-text p-2">%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-2">
                        <div className="p-2 border rounded">
                            <h4 className="fs-text">Position Z:</h4>
                            <div className="flex-column align-c justify-sb">
                                <div>
                                    <div className="flex-row align-c justify-sb">
                                        <span className="fs-text p-2">min:</span>
                                        <TouchButton
                                            scroll
                                            touch
                                            textClass="effect-container_text-s"
                                            orientation="row"
                                            disable="configs"
                                            output={resZMin}
                                            add={add_zMin}
                                            subtract={subtract_zMin}
                                            data={zMin}
                                        />
                                        <span className="fs-text p-2">%</span>
                                    </div>
                                    <div className="flex-row align-c justify-sb">
                                        <span className="fs-text p-2">max:</span>
                                        <TouchButton
                                            scroll
                                            touch
                                            textClass="effect-container_text-s"
                                            orientation="row"
                                            disable="configs"
                                            output={resZMax}
                                            add={add_zMax}
                                            subtract={subtract_zMax}
                                            data={zMax}
                                        />
                                        <span className="fs-text p-2">%</span>
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