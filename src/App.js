import React, { useState } from 'react';
import { ChakraProvider, Box } from '@chakra-ui/react';
import Header from './components/Header';
import UploadScreen from './components/UploadScreen';
import EditScreen from './components/EditScreen';
import SizeScreen from './components/SizeScreen';
import SelectObjectScreen from './components/SelectObjectScreen';


const App = () => {
  const [screen, setScreen] = useState('upload');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [measuredSize, setMeasuredSize] = useState(null);
  const [selectedObjects, setSelectedObjects] = useState([]);

  const handleSelectImage = (image) => {
    setUploadedImage(image);
    setScreen('size');
  };

  const handleSelectSize = (size) => {
    setMeasuredSize(size);
    setScreen('selectObject');
  };

  const handleSelectObject = (objects) => {
    setSelectedObjects(objects);
    setScreen('edit');
  }


  const handleHome = () => {
    setScreen('upload');
    setUploadedImage(null); // Clear the uploaded image
  };

  return (
    <ChakraProvider>
      <Box textAlign="center" fontSize="xl">
        <Header onHomeClick={handleHome} />
        {screen === 'upload' && <UploadScreen onSelectImage={handleSelectImage} />}
        {screen === 'size' && (<SizeScreen onSelectSize={handleSelectSize} measuredSize={measuredSize} selectedImage={uploadedImage} />)}
        {screen === 'selectObject' && (<SelectObjectScreen 
          onSelectObject={handleSelectObject} 
          selectedObjects={selectedObjects} 
          selectedImage={uploadedImage} 
        />)}
        {screen === 'edit' && <EditScreen uploadedImage={uploadedImage} />}
      </Box>
    </ChakraProvider>
  );
};

export default App;
