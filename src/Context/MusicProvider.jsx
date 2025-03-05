import { createContext, useContext, useState } from "react";

const MusicContext = createContext();

export const MusicProvider = ({children})=>{
    const [musicData, setMusicData] = useState([]);

    const addmusic = (music)=>{
        setMusicData([...musicData, music]);
    }

    return(
        <MusicContext.Provider value={{musicData, addmusic}}>
            {children}
        </MusicContext.Provider>
    )
}

export const useAudio = () => {
    return useContext(MusicContext);
  };
  