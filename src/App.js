import React, { useState } from 'react';
import { ChakraProvider, Box } from '@chakra-ui/react';
import axios from 'axios'; // axios는 JavaScript로 사용할 수 있는 HTTP 클라이언트 라이브러리이고, 서버와의 통신을 위해 사용한다.
// 화면에 표시할 컴포넌트들을 import한다. 컴포넌트는 components 디렉토리에 있다.
import Header from './components/Header'; 
import UploadScreen from './components/UploadScreen';
import SizeScreen from './components/SizeScreen';
import SelectObjectScreen from './components/SelectObjectScreen';
import EditScreen from './components/EditScreen';

// App 컴포넌트는 화면 전체를 표시하는 컴포넌트
const App = () => {
  /* 헤더보다 아래 보디의 화면을 관리하기 위해 상태변수 screen을 사용한다. 
  이 웹앱은 초기화면이 이미지를 업로드하는 화면이므로 그걸 의미하는 상태의 이름으로 screen을 'upload'로 초기화한다.
  useState 훅을 사용해서 유저가 뭔가 클릭 조작을 할 때마다 upload 상태를 Size나 selectObject, edit로 갱신함으로써 보디부분의 화면 이동을 구현했다.*/
  const [screen, setScreen] = useState('upload');

  // 유저가 업로드한 이미지를 저장하는 상태변수. 업로드된 이미지는 UploadScreen 컴포넌트에서 가져온다.
  const [selectedImage, setSelectedImage] = useState(null); 

  // 백엔드로부터 받은 분리된 이미지의 리스트를 저장하는 상태변수. 이미지 리스트는 SizeScreen 컴포넌트에서 가져온다.
  const [imageList, setImageList] = useState([]);

  // 백엔드로부터 받은 정리된 이미지를 저장하는 상태변수. 정리된 이미지는 SelectObjectScreen 컴포넌트에서 가져온다.
  const [resultImage, setResultImage] = useState(null);

  /* 유저가 이미지를 업로드하면 유저가 선반 사이즈 재기를 하기 위해서 선택한 이미지를 selectedImage에 저장한다(저장된 이미지는 SizeScreen 컴포넌트에 보낸다).
  상태변수 screen을 'size'로 갱신해서 SizeScreen 컴포넌트를 화면표시한다.*/
  const handleSelectImage = (image) => {
    setSelectedImage(image);
    setScreen('size');
  };

  /* 유저가 사이즈 재기 버튼을 클릭하면 SelectObjectScreen 화면에서 유저가 정리하는 물건들을 선택하기 위해서 
  백엔드에서 받은 이미지 리스트를 imageList에 저장한다(저장된 이미지 리스트는 SelectObjectScreen 컴포넌트에 보낸다).
  상태변수 screen을 'selectObject'로 갱신해서 SelectObject 컴포넌트를 화면표시한다.*/
  const handleSelectSize = (coordinates, images) => {
    setImageList(images);
    setScreen('selectObject');
  };

  /* 유저가 정리하는 물건들을 선택하면 EditScreen 화면에서 유저가 정리된 이미지를 확인하기 위해서 
  백엔드에서 받은 정리된 이미지를 resultImage에 저장한다(저장된 이미지는 EditScreen 컴포넌트에 보낸다).
  상태변수 screen을 'edit'로 갱신해서 EditScreen 컴포넌트를 화면표시한다.
  */
  const handleSelectObject = async (objects) => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/arrange-items');
      setResultImage(response.data.result_image);
      setScreen('edit');
    } catch (error) {
      console.error('정리 실패:', error);
    }
  };

  // 홈 버튼을 클릭하면 화면을 초기화면으로 돌아가게 한다(내부적으로는 상태변수 screen을 'upload'로 갱신하며, selectedImage를 null로 초기화한다).
  const handleHome = () => {
    setScreen('upload');
    setSelectedImage(null);
  };

  // 화면을 구성하는 컴포넌트들을 ChakraProvider로 감싸서 Chakra UI를 사용할 수 있게 한다.
  return (
    <ChakraProvider>
      <Box textAlign="center" fontSize="xl">
        {/* Header 컴포넌트는 화면 상단에 항상 표시한다. */}
        <Header onHomeClick={handleHome} />

        {/* screen 상태변수에 저장되어 있는 상태(upload or size or selectObject or edit)에 따라 표시되는 컴포넌트를 변경해서 관리한다 */}
        {screen === 'upload' && <UploadScreen onSelectImage={handleSelectImage} />}
        {screen === 'size' && <SizeScreen selectedImage={selectedImage} onSelectSize={handleSelectSize} />}
        {screen === 'selectObject' && <SelectObjectScreen selectedImages={imageList} onSelectObject={handleSelectObject} />}
        {screen === 'edit' && <EditScreen uploadedImage={selectedImage} resultImage={resultImage} />}
      </Box>
    </ChakraProvider>
  );
};

export default App;
