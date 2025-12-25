import './App.css'
import Rotator from "./rotator/Rotator.jsx";
import {useEffect, useState} from "react";

export default function App() {
    const [fontsLoaded, setFontsLoaded] = useState(false);

    useEffect(() => {
        document.fonts.ready.then(() => setFontsLoaded(true));
    }, []);

    return (
        <div className="app-container">
            {fontsLoaded && <Rotator/>}
        </div>
    )
}
