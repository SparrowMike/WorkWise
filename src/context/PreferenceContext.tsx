import { createContext, useContext, useState } from "react";
import { Preference } from "../interfaces/user";

interface PreferenceContextProps {
  preference: Preference;
  setPreference: (preference: Preference) => void;
}

export const PreferenceContext = createContext<PreferenceContextProps>({
  preference: {
    theme: "light",
    showReminder: true,
    stickyBlob: false,
    hideBlob: false,
    showTime: true,
    showDate: true,
    sprintTiming: 5,
    blobPosition: {
      x: 0,
      y: 0,
    },
  },
  setPreference: () => {},
});

const PreferenceProvider = ({ children }: any) => {
  const [state, setState] = useState<Preference>(
    useContext(PreferenceContext).preference // get the default preference value from the context
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
