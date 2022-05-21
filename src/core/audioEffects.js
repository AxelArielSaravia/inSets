import { randomDecide, createAudioState, random } from "./states.js";
import { 
    AUDIO_CONTEXT, 
    AUDIO_MAP, 
    GSEngine, 
    GSDelay, 
    GSFilter, 
    GSPanner,
    GSFadeOut,
    GSFadeIn,
    GSPlayBackRate, 
    getGSRandomCurrentTimeDisable,
    GSTimeInterval,
    GSIsStarted
} from "./initGlobalState.js";

/**
 * @typedef {import("./states.js").AudioState} AudioState
 */


const createAudioContext = () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    AUDIO_CONTEXT(new AudioContext());
    AUDIO_CONTEXT().resume();
}

const changeAudioEngine = (val) => GSEngine(val);

const elementsState = {
    panner: GSPanner,
    filter: GSFilter,
    delay: GSDelay,
    playBackRate: GSPlayBackRate,
    randomCurrentTimeDisable: getGSRandomCurrentTimeDisable()
}

/**
 * @param {HTMLAudioElement} HTMLAudio 
 * @param {string} mediaType 
 * @returns {"probably" | "maybe" | ""}
 */
 const canPlayType = (HTMLAudio, mediaType) => {
    if (!HTMLAudio.canPlayType) throw new Error("HTMLAudioElement.prototype.canPlayType does not find");
    return HTMLAudio.canPlayType(mediaType); 
}

const createAudioStatefromFile = (file, id, callback) => {
    if (GSEngine() === "audioNode") {
        return Promise.resolve()
        .then(() => URL.createObjectURL(file))
        .then(url => new Audio(url))
        .then(htmlAudio => {
            if (!canPlayType(htmlAudio, file.type)) {
                console.warn(`Can not play this audio type ${file.type}`);
                return;
            }
            htmlAudio.addEventListener("canplaythrough", () => {
                /* the audio is now playable; play it if permissions allow */
                let source = AUDIO_CONTEXT().createMediaElementSource(htmlAudio); 
                let audioState = createAudioState(id, file.name, file.type, htmlAudio.duration, elementsState);
                audioState.audioEngine = htmlAudio;
                audioState.source = source;
    
                AUDIO_MAP.set(id, audioState);
    
                if (typeof callback === "function") callback();
    
                audioState = source = null;
                console.log(AUDIO_MAP);
            },{once: true});
        })
        .catch(err => console.error(err));
    } else {
        return Promise.resolve()
        .then(() => file.arrayBuffer())
        .then(data => AUDIO_CONTEXT().decodeAudioData(data))
        .then(audioBuffer => {
          let audioState = createAudioState(id, file.name, file.type, audioBuffer.duration, elementsState);
          audioState.audioEngine = audioBuffer;

          AUDIO_MAP.set(id, audioState);

          if (typeof callback !== "undefined") callback();
          
          audioState = null;
          console.log(AUDIO_MAP);
        })
        .catch(err => console.error(err));
    }
}

/**
 * @param {AudioContext} audioCtx 
 * @param {AaudioPannerState} audioPannerState 
 */
 const setAudioContextPannerPosition = (audioCtx) => {
    if (audioCtx.listener.positionX) {
        audioCtx.listener.positionX.value = 6;
        audioCtx.listener.positionY.value = 6;
        audioCtx.listener.positionZ.value = 6;
    } else {
        audioCtx.listener.setPosition(6, 6, 6);
    }
}

/**
 * @param {AudioContext} audioCtx 
 * @param {AudioDelayState} AudioDelayState 
 * @returns {DelayNode}
 */
const createDelay = (audioCtx, audioDelayState) => {

    let DELAY = new DelayNode(audioCtx, {
        delayTime: audioDelayState.delayTime,
        maxDelayTime: audioDelayState.maxDelayTime,
        channelCountMode: audioDelayState.channelCountMode,
        channelInterpretation: audioDelayState.channelInterpretation,
    });

    let feedback = audioCtx.createGain();
    feedback.gain.value = audioDelayState.feedback;

    feedback.connect(DELAY);
    DELAY.connect(feedback);

    return feedback 
}

/**
 * @param {AudioContex} audioCtx 
 * @param {AudioFilterComponent} audioFilterState 
 * @returns {BiquadFilterNode}
 */
const createFilter = (audioCtx, audioFilterState) => {
    return new BiquadFilterNode(audioCtx, {
        type: audioFilterState.type,
        Q: audioFilterState.q,
        detune: audioFilterState.detune,
        frequency: audioFilterState.frequency,
        gain: audioFilterState.gain,
        channelCountMode: audioFilterState.channelCountMode,
        channelInterpretation: audioFilterState.channelInterpretation
    });
}

/**
 * @param {AudioContext} audioCtx 
 * @param {AudioPannerState} audioPannerState 
 * @returns {PannerNode}
 */
const createPanner = (audioCtx, audioPannerState) => {
    let PANNER = audioCtx.createPanner();
    PANNER.panningModel = audioPannerState.panningModel;
    PANNER.distanceModel = audioPannerState.channelCountMode;
    PANNER.refDistance = audioPannerState.refDistance;
    PANNER.maxDistance = audioPannerState.maxDistance;
    PANNER.rolloffFactor = audioPannerState.rolloffFactor;
    PANNER.coneInnerAngle = audioPannerState.coneInnerAngle;
    PANNER.coneOuterAngle = audioPannerState.coneOuterAngle;
    PANNER.coneOuterGain = audioPannerState.coneOuterGain;

    //default parameters
    if (PANNER.positionX) {
        PANNER.positionX.value = audioPannerState.x;
        PANNER.positionY.value = audioPannerState.y;
        PANNER.positionZ.value = audioPannerState.z;
    } else {
        PANNER.setPosition(
            audioPannerState.x, 
            audioPannerState.y, 
            audioPannerState.z
        );
    }
    return PANNER;
}

const changePlayBackRate = (audioState) => {
    audioState.playBackRate.random(GSPlayBackRate);
    if (GSEngine() === "audioNode") {
        audioState.audioEngine.playbackRate = audioState.playBackRate.value;
    } else {
        audioState.source.playbackRate.value = audioState.playBackRate.value;
    }
}

/**
 * @param {AudioContext} audioCtx 
 * @param {AudioState} audioState 
 * @returns {[GainNode, GainNode]}
 */
const createAudioRandomChain = (audioCtx, audioState) => {
    const inputGain = audioCtx.createGain();
    const outputGain = audioCtx.createGain();
    
    //set min gain value to create a fadeIn later
    outputGain.gain.value = 0.01;

    let input = inputGain;

    //the randomDecide() means 50% of posibilities that the effect change randomly
    //PANNER
    if (randomDecide() && !audioState.panner.isDisable) {
        audioState.panner.random(GSPanner);
        const PANNER = createPanner(audioCtx, audioState.panner);
        input.connect(PANNER);
        input = PANNER; 
    }

    //FILTER
    if (randomDecide() && !audioState.filter.isDisable) {
        audioState.filter.random(GSFilter);
        const FILTER = createFilter(audioCtx, audioState.filter);
        input.connect(FILTER)
        input = FILTER;  
    }

    //DELAY
    if (randomDecide() && !audioState.delay.isDisable) {
        audioState.delay.random(GSDelay);
        const feedback = createDelay(audioCtx, audioState.delay);
        input.connect(feedback);
        input = feedback;
    }

    if (randomDecide() && !audioState.playBackRate.isDisable) {
        changePlayBackRate(audioState);
    }

    input.connect(outputGain);
    return [inputGain, outputGain];
}

const setAudioConfiguration = (id) => {
    let audioState = AUDIO_MAP.get(id);

    //CONNECTIONS
    if (GSEngine() === "audioBuffer") {
        audioState.source = AUDIO_CONTEXT().createBufferSource();
        audioState.source.buffer = audioState.audioEngine;
    } 
    let [input, output] = createAudioRandomChain(AUDIO_CONTEXT(), audioState);

    audioState.source.connect(input);
    output.connect(AUDIO_CONTEXT().destination);

    audioState.outputGain = output;

    audioState = input = output = null;
}

const play = (id, cb) => {
    let audioState = AUDIO_MAP.get(id);

    if (audioState) {

        //FADE IN (to a random value)
        audioState.outputGain.gain.exponentialRampToValueAtTime(audioState.volume.get(), AUDIO_CONTEXT().currentTime + GSFadeIn().time / 1000);
  

        //CHANGE THE CURRENT TIME
        let startPoint = audioState.startTimePoint.get();

        if (!audioState.randomCurrentTime.isDisable && !getGSRandomCurrentTimeDisable()) {
            audioState.randomCurrentTime.random(audioState.startTimePoint.get(), audioState.endTimePoint.get());
            startPoint = audioState.randomCurrentTime.value;
        } else {
            audioState.randomCurrentTime.value = startPoint;
        }
        
        if (GSEngine() === "audioNode") {
            audioState.audioEngine.currentTime = startPoint;
            audioState.audioEngine.play();
            
            audioState.audioEngine.ontimeupdate = function(e) {
                if (e.target.currentTime >= audioState.endTimePoint.get()) {
                    //FADE OUT
                    audioState.outputGain.gain.exponentialRampToValueAtTime(0.01, AUDIO_CONTEXT().currentTime + GSFadeOut().time / 1000);
                    wait(GSFadeOut().time)
                    .then(() => stop(id, cb))
                }
            }
        } else {
            let a = audioState.endTimePoint.get() - startPoint;
            let startNum = audioState.startNum.set();

            audioState.source.start(0, startPoint);

            wait(Math.floor(a * 1000))
            .then(() => {
                if (audioState.startNum.get() === startNum && audioState.isPlaying) {
                    stop(id, cb);

                    //FADE OUT; IMPORTANT check!!!
                   /*  
                    const n = Number((AUDIO_CONTEXT().currentTime + GSFadeOut().time / 1000).toFixed(3));
                    audioState.outputGain.gain.exponentialRampToValueAtTime(0.01, n);
                    wait(GSFadeOut().time + 50)
                    .then(() => {
                        if (audioState.startNum.get() === startNum) {
                            console.log("context currentTime: ", AUDIO_CONTEXT().currentTime);
                        }
                    });  
                    */
                }
            });  
        }
        audioState.isPlaying = true;
        if (typeof cb === "function") cb(audioState.isPlaying, audioState.randomCurrentTime.value);
    }
}

const stop = (id, cb) => {
    //stop playing
    let audioState = AUDIO_MAP.get(id);
    if (audioState && audioState.isPlaying) {

        if (GSEngine() === "audioNode") {
            if (audioState.audioEngine && !audioState.audioEngine.paused) audioState.audioEngine.pause();
            audioState.audioEngine.ontimeupdate = null;
        } else {
            if (audioState.source) audioState.source.stop();
        }
        if (audioState.source) audioState.source.disconnect();
        if (audioState.outputGain) audioState.outputGain.disconnect();
        //set source to null
        if (GSEngine() === "audioBuffer") {
            audioState.source = null;
        }
        audioState.randomCurrentTime.value = audioState.startTimePoint.get();
        audioState.outputGain = null;
        audioState.isPlaying = false;

        if (typeof cb === "function") cb(audioState.isPlaying, audioState.randomCurrentTime.value);
    }
}

/**
 * @param {string} id 
 * @param {function} cb example (AUDIO_MAP) => { changeState(() => new Map([...AUDIO_MAP]))} 
 */
const deleteAudio = (id, cb) => {
    stop(id); 
    AUDIO_MAP.delete(id);
    cb(AUDIO_MAP);
}

const changeVolume = (id, val) => {
    let audioState = AUDIO_MAP.get(id);
    if (audioState) {
        audioState.volume.set(val);
        if (audioState.isPlaying) audioState.outputGain.gain.value = audioState.volume.get()
    }
}


/**
 * @param {number} ms 
 * @returns {Promise<number>}
 */
const wait = ms => new Promise(resolve => setInterval(resolve, ms));

const randomTimeExecution = (cb) => {
    if (GSIsStarted()) {
        randomSetsExecution(cb);
        const n = random(GSTimeInterval.min, GSTimeInterval.max);
        console.log("next execution: ", n + " ms");//DEBUGGER
        //fadeTime (ms) is the wait execution of play() because we will fadeout the audio if its playing 
        wait(n).then(() => randomTimeExecution(cb));
    } 
}

const createNewSetExecution = () => {
    //select set size
    const n = random(0, AUDIO_MAP.size);
    console.log("set execution: ",n);//DEBUGGER

    const executeSet = new Set();

    //selects elements for the set
    let posiblesAudios = [...AUDIO_MAP.values()];
    while (executeSet.size < n) {
        let n = random(0, posiblesAudios.length-1);
        executeSet.add(posiblesAudios[n]);
    }
    posiblesAudios = null;

    const newColorSet = `rgb(${random(32, 141)},${random(32, 141)},${random(32, 141)})`;

    return [executeSet, newColorSet];
}

const randomSetsExecution = (cb) => {
    const [executeSet, newColorSet] = createNewSetExecution();

    executeSet.forEach((data) => {
        if (data.isPlaying) {
            //FADE OUT
            data.outputGain.gain.exponentialRampToValueAtTime(0.01, AUDIO_CONTEXT().currentTime + GSFadeOut().time / 1000);
            wait(GSFadeOut().time)
            .then(() => stop(data.id, (isPlaying, rct) => cb(data.id, isPlaying, rct)))
            .then(() => {
                setAudioConfiguration(data.id);
                play(data.id, (isPlaying, rct) => cb(data.id, isPlaying, rct, newColorSet));
            })
        } else {
            wait(GSFadeOut().time)
            .then(() => {
                setAudioConfiguration(data.id);
                play(data.id, (isPlaying, rct) => cb(data.id, isPlaying, rct, newColorSet));
            });
        }
    });
}


const stopAll = (cb) => {
    AUDIO_MAP.forEach(data => {
        if (data.isPlaying) {
            stop(data.id, (isPlaying, rtc) => cb(data.id, isPlaying, rtc));
        }
    });
}


export {
    createAudioContext,
    changeAudioEngine,
    setAudioContextPannerPosition,
    createAudioStatefromFile,
    setAudioConfiguration,
    play,
    stop,
    deleteAudio,
    changeVolume,
    randomTimeExecution,
    stopAll,
}