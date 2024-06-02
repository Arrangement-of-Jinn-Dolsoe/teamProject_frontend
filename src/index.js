import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  // Chakra UI의 컴포넌트들을 사용할 수 있도록 ChakraProvider로 App을 감싸준다.
  <ChakraProvider>
    <App />
  </ChakraProvider>
);
