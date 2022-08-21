import { memo, useState, useEffect } from "react";

import { IconMusicFile } from "../../icons/index.js";

import useAddFiles from "../../hooks/useAddFiles/index.js";

/**
 * @param {Event} e
 */
const preventDefault = (e) => { e.preventDefault(); };


const DropArea = () => {
    return (
        <> 
            <div className="dragfile flex-row align-c justify-c">
               <IconMusicFile className="icon-drop"/>
            </div>
            <div>
                <p className="fs-text p-2">Drop files</p>
            </div>
        </>
    )
};

/**
 * @param {{ children: Function, className?: string, style?: object}} props 
 * @returns 
 */
const DropFiles = memo(function DropFiles({className, style}) {
    const addFiles = useAddFiles();
    
    useEffect(() => {
        window.addEventListener('dragover', preventDefault, false);
        window.addEventListener('drop', preventDefault, false);
        return () => {
            window.removeEventListener('dragover', preventDefault, false);
            window.removeEventListener('drop', preventDefault, false);
        };
    });

    /**
     * @param {DragEvent} e
     */
    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    };

    /**
     * @param {DragEvent} e
     */
    const handleFileDrop = (e) => {
        e.preventDefault();
        addFiles(e.dataTransfer.files);
    };

    return (
        <div
            style={style}
            onDragOver={handleDragOver}
            onDrop={handleFileDrop}
            className={className}
        >
            <DropArea />
        </div>
    );
});

/**
 * @param {{ children: Function, render: Function, className?: string, style?: object}} props 
 * @returns 
 */
const DragFiles = memo(function DragFiles({ start, className, style, children}) {
    const [isDragActive, setIsDragActive] = useState(false);
    let counter = 1;
    
    const handleDragEnter = () => {
        if (start) {
            counter++;
            setIsDragActive((state) => !state ? !state : state);
        }
    }

    const handleDragLeave = () => {
        if (start) {
            counter--;
            if (counter === 0) {
            setIsDragActive((state) => state? !state : state);
            }
        }
    }

    const handleDrop = () => {
        if (start) {
            counter = 0;
            setIsDragActive(() => false);
        }
    }

    useEffect(() => {
        if (start) {
            if (!isDragActive) {
                document.addEventListener('dragenter', handleDragEnter);
                document.addEventListener('dragleave', handleDragLeave);
                document.addEventListener('drop', handleDrop);
                return () => {
                    document.removeEventListener('dragenter', handleDragEnter);
                    document.removeEventListener('dragleave', handleDragLeave);
                    document.removeEventListener('drop', handleDrop);
                };
            }
        }
    }, [isDragActive, start]);
    

    return (
    <div
        className={className}
        style={style}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
    >
        { children(isDragActive) }
    </div>
    );
});

export {
    DragFiles,
    DropFiles
}