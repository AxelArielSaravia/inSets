import PanelConfigChild from "./PanelConfigChild.js";
import PanelRange from "./PanelRange.js";

function PanelInterval({
    title,
    valueText,
    rangeMax = 100,
    step = 1,
    valueMin,
    valueMax,
    viewMin,
    viewMax,
    onChangeMin,
    onChangeMax
}) {
    return (
        <PanelConfigChild title={title}>
            <div className="flex-column ">
                <PanelRange
                    step={step}
                    max={rangeMax}
                    value={valueMin}
                    onChange={onChangeMin}
                    text="min"
                    valueText={viewMin}
                    valueTextAdd={valueText}
                />
                <PanelRange
                    step={step}
                    max={rangeMax}
                    value={valueMax}
                    onChange={onChangeMax}
                    text="max"
                    valueText={viewMax}
                    valueTextAdd={valueText}
                    reverse
                />
            </div>
        </PanelConfigChild>
    );
}

export default PanelInterval;