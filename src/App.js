import React, { useState } from 'react';
import { ChakraProvider, Box } from '@chakra-ui/react';
import Header from './components/Header';
import UploadScreen from './components/UploadScreen';
import EditScreen from './components/EditScreen';

const App = () => {
  const [screen, setScreen] = useState('upload');

  const handleHome = () => {
    setScreen('upload');
  };

  return (
    <ChakraProvider>
      <Box textAlign="center" fontSize="xl">
        <Header onHomeClick={handleHome} />
        {screen === 'upload' && <UploadScreen onSelectImage={() => setScreen('edit')} />}
        {screen === 'edit' && <EditScreen />}
      </Box>
    </ChakraProvider>
  );
};

export default App;
