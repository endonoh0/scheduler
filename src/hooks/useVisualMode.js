import { useState } from "react";

export default function useVisualMode (initial) {
    const [ mode, setMode ] = useState(initial);
    const [ history, setHistory ] = useState([initial]);


    function transition(newMode) {
        setMode(newMode);
        setHistory(prev => [...prev, newMode]);
    }

    function back() {
        history.pop();
        const prevMode = history[history.length - 1];
        setMode(prevMode);
    }

    return {
        mode,
        transition,
        back
    }
}
