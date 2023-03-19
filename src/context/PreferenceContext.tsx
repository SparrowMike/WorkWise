import { createContext, useContext, useState } from "react";
import { Preference } from "../interfaces/user";

interface PreferenceContextProps {
  preference: Preference;
  setPreference: (preference: Preference) => void;
}

export const PreferenceContext = createContext<PreferenceContextProps>({
  preference: {} as Preference,
  setPreference: () => {},
});

const PreferenceProvider = ({ children }: any) => {
  const [state, setState] = useState<Preference>(
    useContext(PreferenceContext).preference 
  );
  const setPreference = (preference: Preference) => {
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
