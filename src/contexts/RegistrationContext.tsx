import { createContext, useState, useContext, FC, ReactNode } from 'react';

type UserData = Record<string, string>;

interface RegistrationContextProps {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
}

const RegistrationContext = createContext<RegistrationContextProps | undefined>(undefined);

interface RegistrationProviderProps {
  children: ReactNode;
}

export const RegistrationProvider: FC<RegistrationProviderProps> = ({ children }) => {
  const [userData, setUserData] = useState<UserData>({});

  return (
    <RegistrationContext.Provider value={{ userData, setUserData }}>
      {children}
    </RegistrationContext.Provider>
  );
};

export const useRegistration = (): RegistrationContextProps => {
  const context = useContext(RegistrationContext);
  if (!context) {
    throw new Error('useRegistration must be used within a RegistrationProvider');
  }
  return context;
};
