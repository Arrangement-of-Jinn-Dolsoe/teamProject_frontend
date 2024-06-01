import React, { useState } from 'react';
import { ChakraProvider, Box } from '@chakra-ui/react';
import Header from './components/Header';
import UploadScreen from './components/UploadScreen';
import EditScreen from './components/EditScreen';
import SizeScreen from './components/SizeScreen';
import SelectObjectScreen from './components/SelectObjectScreen';
import 'react-image-crop/dist/ReactCrop.css';

const App = () => {
  const [screen, setScreen] = useState('upload');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [measuredSize, setMeasuredSize] = useState(null);
  const [imageList, setImageList] = useState([]);
  const [organizedObject, setOrganizedObject] = useState(null);

  const handleSelectImage = (image) => {
    setUploadedImage(image);
    setScreen('size');
  };

  const handleSelectSize = (size) => {
    setMeasuredSize(size);
    setScreen('selectObject');
  };

  const handleReceivedOrganizedImage = (objects) => {
    setOrganizedObject(objects);
    setScreen('edit');
  };

  const handleCropComplete = (images) => {
    setImageList(images);
    setScreen('selectObject');
  };

  const handleHome = () => {
    setScreen('upload');
    setUploadedImage(null); // Clear the uploaded image
  };

  return (
    <ChakraProvider>
      <Box textAlign="center" fontSize="xl">
        <Header onHomeClick={handleHome} />
        {screen === 'upload' && <UploadScreen onSelectImage={handleSelectImage} />}
        {screen === 'size' && (
          <SizeScreen
            onSelectSize={handleSelectSize}
            measuredSize={measuredSize}
            selectedImage={uploadedImage}
            onCropComplete={handleCropComplete}
          />
        )}
        {screen === 'selectObject' && (
          <SelectObjectScreen
            selectedImages={imageList}
            onSelectObject={handleReceivedOrganizedImage}
          />
        )}
        {screen === 'edit' && <EditScreen uploadedImage={uploadedImage} organizedObject={organizedObject} />}
      </Box>
    </ChakraProvider>
  );
};

export default App;
