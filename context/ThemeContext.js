import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    setDarkMode(savedTheme ? JSON.parse(savedTheme) : false);
  }, []);

  const toggleTheme = () => {
    setDarkMode(prev => {
      const newMode = !prev;
      localStorage.setItem('darkMode', newMode);
      return newMode;
    });
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);