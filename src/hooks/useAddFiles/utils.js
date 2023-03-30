import {createAudioState} from "../../state/Audio/index.js";
import {GlobalState} from "../../state/Global/index.js";
import createId from "../../services/createId/service.js";

const AudioTemplate = document.getElementById("audio-template");
/*-
@desc (
    See if the type of the file have a valid audio type
)
isValidAudioType :: (string) -> boolean
*/
function isValidAudioType(type) {
    return (/^audio\/.+$/).test(type);
}


/*-
canPlayType :: (HTMLAudioElement, string) -> "probably" | "maybe" | ""
*/
function canPlayType(HTMLAudio, mediaType) {
    if (!HTMLAudio.canPlayType) {
        throw new Error("HTMLAudioElement.prototype.canPlayType does not find");
    }
    return HTMLAudio.canPlayType(mediaType);
}

/*-
audioFromFile_AudioNode :: (
    File,
    ({id: string, type: string}) -> undefined,
    ({type: string}) -> undefined
) -> undefined
*/
function audioFromFile(file, audioListDispatcher, sumOfAllEventsDispatcher) {
    //ID of AudioState
    const id = createId();

    //available to use in view
    audioListDispatcher({id, type: "addLoading"});

    const html_Audio = AudioTemplate?.cloneNode();
    html_Audio.id = "";
    html_Audio.src = URL.createObjectURL(file);

    if (!canPlayType(html_Audio, file.type)) {
        console.warn(`Can not play this audio type ${file.type}`);
        console.warn(`This file "${file.name}" is deleted from list`);
        audioListDispatcher({id, type: "loadingError"});
    }

    //presersPitch false in playbackrate
    if (html_Audio.preservesPitch !== undefined) {
        html_Audio.preservesPitch = false;
    }

    html_Audio.addEventListener("error", function (e) {
        console.warn("An error happen when the audio was loading");
        console.warn(`This file "${file.name}" is deleted from list`);
        audioListDispatcher({id, type: "loadingError"});
    }, {once: true});

    html_Audio.addEventListener("canplaythrough", function () {
        /* the audio is now playable; play it if permissions allow */
        try {
            const source = GlobalState.audio_context.createMediaElementSource(html_Audio);
            const audioState = createAudioState({
                GlobalState,
                audioEngine: html_Audio,
                duration: html_Audio.duration,
                id,
                source,
                title: file.name,
                type: file.type
            });

            //Add audioState to GlobalState
            GlobalState.audio_list.set(id, audioState);

            //available to use in view
            audioListDispatcher({id, type: "addCompleted"});
            sumOfAllEventsDispatcher({type: "add"});
        } catch (err) {
            console.warn(err);
            console.warn(`This file "${file.name}" is deleted from list`);
            audioListDispatcher({id, type: "loadingError"});
        }
    }, {once: true});
}

export {
    audioFromFile,
    isValidAudioType
};