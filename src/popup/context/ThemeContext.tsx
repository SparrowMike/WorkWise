import { createContext, useState } from 'react';

interface ThemeContextProps {
  isDark: boolean;
  toggleTheme: (theme: boolean) => void;
}

export const ThemeContext = createContext<ThemeContextProps>({
  isDark: false,
  toggleTheme: () => {},
});

const ThemeProvider = ({ children }: any) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = (theme: boolean) => {
    setIsDark(theme);
  };

  const themeContext: ThemeContextProps = {
    isDark,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={themeContext}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;