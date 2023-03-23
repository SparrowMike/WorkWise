import { createContext, useContext, useState } from "react";
import { PreferenceInterface } from "../interfaces/user";

interface PreferenceContextProps {
  preference: PreferenceInterface;
  setPreference: (preference: PreferenceInterface) => void;
}

export const PreferenceContext = createContext<PreferenceContextProps>({
  preference: {} as PreferenceInterface,
  setPreference: () => {},
});

const PreferenceProvider = ({ children }: any) => {
  const [state, setState] = useState<PreferenceInterface>(
    useContext(PreferenceContext).preference 
  );
  const setPreference = (preference: PreferenceInterface) => {
    setState(preference);
  };

  const preferenceContext: PreferenceContextProps = {
    preference: state,
    setPreference,
  };

  return (
    <PreferenceContext.Provider value={preferenceContext}>
      {children}
    </PreferenceContext.Provider>
  );
};

export default PreferenceProvider;
