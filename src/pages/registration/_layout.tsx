import { RegistrationProvider } from '@/contexts/RegistrationContext';
import React, { ReactNode } from 'react';

const FolderLayout = ({ children }: { children: ReactNode }) => {
  return (
    <RegistrationProvider>
      {children}
    </RegistrationProvider>
  );
};

export default FolderLayout;
