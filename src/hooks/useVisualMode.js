import { useState } from "react";

export default function useVisualMode (initial) {
    const [ mode, setMode ] = useState(initial);
    const [ history, setHistory ] = useState([initial]);
    let prevHistory = history[history.length - 1];


    function transition(newMode, replace = false) {
        if (replace) {
            setMode(newMode);
            prevHistory =  newMode;
        } else {
            setMode(newMode);
            setHistory(prev => [...prev, newMode]);
        }
    }

    function back() {
        history.pop();
        const prevMode = prevHistory;
        setMode(prevMode);
    }

    return { mode, transition, back }
}
