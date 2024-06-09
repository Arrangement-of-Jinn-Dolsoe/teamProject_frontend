import { Button, Box, Image, VStack, Text } from '@chakra-ui/react';
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import setCanvasPreview from "../setCanvasPreview";
import ReactCrop, { centerCrop, convertToPercentCrop, convertToPixelCrop, makeAspectCrop } from "react-image-crop";
import 'react-image-crop/dist/ReactCrop.css';
import { LayoutGroup } from 'framer-motion';

const MIN_DIMENSION = 150;

// 선반 사이즈를 재기 위한 화면을 표시하는 컴포넌트
const SizeScreen = ({ selectedImage, onSelectSize }) => {
  const imgRef = useRef(null); // 이미지를 참조하기 위한 ref
  const previewCanvasRef = useRef(null); // 이미지를 Preview 하기 위한 ref
  const [crop, setCrop] = useState(); // 이미지를 Crop하기 위한 상태변수
  const [cropDetails, setCropDetails] = useState(null); // 백엔드에 보내는 Crop한 이미지의 정보를 저장하는 상태변수
  const [imageArray, setImageArray] = useState([]); // SelectObjectScreen에 보내는 백엔드에서 가져온 이미지 데이터를 저장하는 상태변수

  useEffect(() => {
    // 백엔드에서 이미지 데이터 배열을 가져옴
    axios.get('http://127.0.0.1:5000/get-yolo-images')
      .then(response => {
        // 이미지 데이터 배열을 setImageArray함수를 사용해서 상태변수 imageArray 를 갱신해서 저장한다.
        setImageArray(response.data);
      })
      .catch(error => {
        console.error("이미지 데이터 취득 에러:", error);
      });
  }, []);

  // 이미지가 로드되면 실행되는 함수.
  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;  // 이미지의 너비와 높이를 가져온다.
    console.log("width", width, "height", height);
    const cropWidthInPercent = (MIN_DIMENSION / width) * 100;
    const initialCrop = makeAspectCrop(
      {
        unit: "%",
        width: cropWidthInPercent,
      },
      width,
      height
    );
    const centeredCrop = centerCrop(initialCrop, width, height);
    setCrop(centeredCrop);
  };

  // 사이즈 재기 완료 버튼을 클릭하면 실행되는 함수.
  const completeCrop = async () => {
    // 이미지가 로드되었고, Cropping된 이미지가 있을 때 실행
    if (imgRef.current && previewCanvasRef.current && crop) {
      // const pixelCrop = convertToPixelCrop(crop, imgRef.current.naturalWidth, imgRef.current.naturalHeight);
      const pixelCrop = convertToPercentCrop(crop, imgRef.current.naturalWidth, imgRef.current.naturalHeight);
      console.log('pixelCrop:', pixelCrop);
      // 이미지를 Preview 하기 위한 함수
      setCanvasPreview(imgRef.current, previewCanvasRef.current, pixelCrop);

      // 아래 변수들은 트리밍된 이미지의 너비, 높이, x, y 좌표를 저장한다.
      const cropWidth = Math.round(pixelCrop.width);
      const cropHeight = Math.round(pixelCrop.height);
      const cropX = Math.round(pixelCrop.x);
      const cropY = Math.round(pixelCrop.y);
      const imgWidth = imgRef.current.naturalWidth;
      const imgHeight = imgRef.current.naturalHeight;

      // 왼쪽 상단 (x1, y1)
      const x1 = cropX;
      const y1 = cropY;

      // 오른쪽 하단 (x2, y2)
      const x2 = cropX + cropWidth;
      const y2 = cropY + cropHeight;

      // 백엔드에 보내기 위해 좌표를 아래 형태의 배열로 저장
      var coordinates = [x1, y1, x2, y2];

      setCropDetails({
        // 이미지 원래 사이즈와 자른 사이즈를 전달
        width: cropWidth,
        height: cropHeight,
        coordinates: coordinates,
        x1: coordinates[0],
        y1: coordinates[1],
        x2: coordinates[2],
        y2: coordinates[3],
        imgSize: `${imgWidth}x${imgHeight}`,
        imgWidth: imgWidth,
        imgHeight: imgHeight
      });

      // 이미지를 원래 사이즈로 만들어준다
      const calculatedX1 = Math.round(imgWidth * x1 * 0.01);
      const calculatedY1 = Math.round(imgHeight * y1 * 0.01);
      const calculatedX2 = Math.round(imgWidth * x2 * 0.01);
      const calculatedY2 = Math.round(imgHeight * y2 * 0.01);

      // 수정된 좌표로 계산한다
      coordinates = [calculatedX1, calculatedY1, calculatedX2, calculatedY2];

      console.log('calculatedX1:', calculatedX1, 'calculatedY1:', calculatedY1, 'calculatedX2:', calculatedX2, 'calculatedY2:', calculatedY2);
      console.log('coordinates', coordinates);

      // 선반 좌표를 서버로 전송
      try {
        const response = await axios.post('http://127.0.0.1:5000/add-shelf-coordinates', { coordinates });
        console.log('서버 응답:', response.data);
        onSelectSize(coordinates, imageArray); // 선반 좌표와 이미지를 전달
      } catch (error) {
        console.error('선반 좌표 업로드 실패:', error);
      }
    }
  };
  console.log('cropDetails:', cropDetails);

  // 보디부분의 화면을 구성하는 컴포넌트를 반환한다.
  return (
    <LayoutGroup>
      <Box bg="#FFFFFF" p={8} w="100%" borderRadius="xl" alignItems="center" justifyContent="center">
        {/*  react-image-crop 라이브러리의 이미지를 Crop하기 위한 ReactCrop 컴포넌트를 사용한다. */}
        <ReactCrop
          crop={crop} // Crop한 이미지의 정보를 저장하는 상태변수
          onChange={(newCrop) => setCrop(newCrop)} // Crop한 이미지의 정보를 갱신하는 함수
          keepSelection
          minWidth={MIN_DIMENSION} // Crop할 이미지의 최소 너비(설정하지 않아도 됨)
        >
          {/* 이미지를 Crop하기 위한 이미지를 표시한다. */}
          <Image
          src={selectedImage}
          ref={imgRef}
          alt="Uploaded"
          objectFit="contain"
          maxH="100%"
          maxW="100%"
          // 이미지가 로드되면 onImageLoad 함수를 실행한다.
          onLoad={onImageLoad}
          ></Image>
        </ReactCrop>
      </Box>
      {/* 사이즈 재기 완료 버튼을 클릭하면 completeCrop 함수를 실행한다. */}
      <Button onClick={completeCrop} mt={4}>
        사이즈 재기 완료
      </Button>
      {/* 이미지를 Preview하기 위한 부분이다. Preview하는 기능은 없애도 됨.*/}
      <Box as="canvas" ref={previewCanvasRef} mt={4} border="1px solid black" width={200} height={200} display="block" mx="auto" />
    {cropDetails && (
      <Box float="right" width="45%" p={4} bg="#FFFFFF" borderRadius="xl">
        <VStack align="start" spacing={4}>
          {/* 개발자가 확인하기 위한 Crop한 이미지의 정보를 표시한다. 유저는 안 보임*/}
          <Text fontSize="xl">Crop한 정보:</Text>
          <Text>픽셀: {cropDetails.width}x{cropDetails.height}</Text>
          <Text>좌표: [{cropDetails.coordinates.join(", ")}]</Text>
          <Text>원본 이미지 사이즈: {cropDetails.imgSize}</Text>
          
          
        </VStack>
      </Box>
    )}
    </LayoutGroup>
  );
}

export default SizeScreen;
