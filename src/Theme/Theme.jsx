import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { createContext, useState } from "react";

export const ThemeContext = createContext();

export const Theme = ({children})=>{
    const[mode, setMode] = useState('dark');

    const modetheme = createTheme({
        palette:{
            mode:mode
        }
    });

    const toggle = ()=>{
        setMode((mode==='light'?'dark' : 'light'))
    };

    return(
        <ThemeContext.Provider value={{toggle, mode}}>
            <ThemeProvider theme={modetheme}>
                <CssBaseline/>
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    )
}