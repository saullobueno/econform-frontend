import React from 'react';

import { AuthProvider } from './auth';
import { LoadingProvider } from './loading';

const AppProvider = ({ children }) => (
  <LoadingProvider>
    <AuthProvider>{children}</AuthProvider>
  </LoadingProvider>
);

export default AppProvider;
