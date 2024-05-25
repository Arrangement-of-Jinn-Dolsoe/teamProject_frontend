import React, { useState } from 'react';
import { ChakraProvider, Box } from '@chakra-ui/react';
import Header from './components/Header';
import UploadScreen from './components/UploadScreen';
import EditScreen from './components/EditScreen';

const App = () => {
  const [screen, setScreen] = useState('upload');
  const [uploadedImage, setUploadedImage] = useState(null);

  const handleSelectImage = (image) => {
    setUploadedImage(image);
    setScreen('edit');
  };

  const handleHome = () => {
    setScreen('upload');
    setUploadedImage(null); // 저장된 이미지 초기화
  };

  return (
    <ChakraProvider>
      {/* Header와 UploadScreen, EditScreen을 렌더링하는 부분 */}
      <Box textAlign="center" fontSize="xl">
        <Header onHomeClick={handleHome} />
        {screen === 'upload' && <UploadScreen onSelectImage={handleSelectImage} />}
        {screen === 'edit' && <EditScreen uploadedImage={uploadedImage} />}
      </Box>
    </ChakraProvider>
  );
};

export default App;
