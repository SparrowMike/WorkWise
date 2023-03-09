import React, { createContext, useState } from 'react';

interface ThemeContextProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextProps>({
  isDark: false,
  toggleTheme: () => {},
});

const ThemeProvider = ({ children }: any) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(prevIsDark => !prevIsDark);
  };

  const themeContext: ThemeContextProps = {
    isDark,
    toggleTheme,
  };

  console.log('children theme context', children)

  return (
    <ThemeContext.Provider value={themeContext}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
