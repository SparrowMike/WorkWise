import { createContext, useContext, useState } from "react";
import { ReminderInterface } from "../interfaces/user";

interface RemindersContextProps {
  reminders: ReminderInterface[];
  setReminders: (reminders: ReminderInterface[]) => void;
}

export const RemindersContext = createContext<RemindersContextProps>({
  reminders: [],
  setReminders: () => {},
});

const RemindersProvider = ({ children }: any) => {
  const [state, setState] = useState<ReminderInterface[]>(useContext(RemindersContext).reminders);
  
  const setReminders = (reminders: ReminderInterface[]) => {
    setState(reminders);
  };

  const remindersContext: RemindersContextProps = {
    reminders: state,
    setReminders,
  };

  return (
    <RemindersContext.Provider value={remindersContext}>
      {children}
    </RemindersContext.Provider>
  );
};

export default RemindersProvider;
