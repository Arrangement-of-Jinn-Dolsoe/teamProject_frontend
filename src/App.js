import React, { useState } from 'react';
import { ChakraProvider, Box } from '@chakra-ui/react';
import axios from 'axios'; // axios 추가
import Header from './components/Header';
import UploadScreen from './components/UploadScreen';
import SizeScreen from './components/SizeScreen';
import SelectObjectScreen from './components/SelectObjectScreen';
import EditScreen from './components/EditScreen';

const App = () => {
  const [screen, setScreen] = useState('upload');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageList, setImageList] = useState([]);
  const [resultImage, setResultImage] = useState(null);

  const handleSelectImage = (image) => {
    setSelectedImage(image);
    setScreen('size');
  };

  const handleSelectSize = (coordinates, images) => {
    setImageList(images);
    setScreen('selectObject');
  };

  const handleSelectObject = async (objects) => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/arrange-items');
      setResultImage(response.data.result_image);
      setScreen('edit');
    } catch (error) {
      console.error('정리 실패:', error);
    }
  };

  const handleHome = () => {
    setScreen('upload');
    setSelectedImage(null);
  };

  return (
    <ChakraProvider>
      <Box textAlign="center" fontSize="xl">
        <Header onHomeClick={handleHome} />
        {screen === 'upload' && <UploadScreen onSelectImage={handleSelectImage} />}
        {screen === 'size' && <SizeScreen selectedImage={selectedImage} onSelectSize={handleSelectSize} />}
        {screen === 'selectObject' && <SelectObjectScreen selectedImages={imageList} onSelectObject={handleSelectObject} />}
        {screen === 'edit' && <EditScreen uploadedImage={selectedImage} resultImage={resultImage} />}
      </Box>
    </ChakraProvider>
  );
};

export default App;
