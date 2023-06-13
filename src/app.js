import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from 'styles/DefaultTheme';

import Routes from 'routes';
import './config/firebase';

import AppProvider from 'context';
import InjectAxiosInterceptors from 'services/InjectAxiosInterceptores';

function App() {
  return (
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <AppProvider>
          <InjectAxiosInterceptors />
          <Routes />
        </AppProvider>
      </ChakraProvider>
    </BrowserRouter>
  );
}

export default App;
