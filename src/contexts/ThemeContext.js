// src/contexts/ThemeContext.js
import React, { createContext, useState, useContext } from 'react';

const colors = {
    light: {
        background: '#ffffff',
        text: '#000000',
        header: '#ffffff',
    },
    dark: {
        background: '#333333',
        text: '#ffffff',
        header: '#333333',
    },
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('light');

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ colors: colors[theme], toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    );
};

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
