import { Button, Box, Image, VStack, Text } from '@chakra-ui/react';
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import setCanvasPreview from "../setCanvasPreview";
import ReactCrop, { centerCrop, convertToPercentCrop, convertToPixelCrop, makeAspectCrop } from "react-image-crop";
import 'react-image-crop/dist/ReactCrop.css';
import { LayoutGroup } from 'framer-motion';

const MIN_DIMENSION = 150;

const SizeScreen = ({ selectedImage, onSelectSize }) => {
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [crop, setCrop] = useState();
  const [cropDetails, setCropDetails] = useState(null);
  const [imageArray, setImageArray] = useState([]);

  useEffect(() => {
    // 백엔드에서 이미지 데이터 배열을 가져옴
    axios.get('http://127.0.0.1:5000/get-shelf-images')
      .then(response => {
        setImageArray(response.data);
      })
      .catch(error => {
        console.error("이미지 데이터 취득 에러:", error);
      });
  }, []);

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
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

  const completeCrop = async () => {
    if (imgRef.current && previewCanvasRef.current && crop) {
      // const pixelCrop = convertToPixelCrop(crop, imgRef.current.naturalWidth, imgRef.current.naturalHeight);
      const pixelCrop = convertToPercentCrop(crop, imgRef.current.naturalWidth, imgRef.current.naturalHeight);
      console.log('pixelCrop:', pixelCrop);
      setCanvasPreview(imgRef.current, previewCanvasRef.current, pixelCrop);

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
        const response = await axios.post('http://127.0.0.1:5000/upload-shelf', { coordinates });
        console.log('서버 응답:', response.data);
        onSelectSize(coordinates, imageArray); // 선반 좌표와 이미지를 전달
      } catch (error) {
        console.error('선반 좌표 업로드 실패:', error);
      }
    }
  };
  console.log('cropDetails:', cropDetails);

  return (
    <LayoutGroup>
      <Box bg="#FFFFFF" p={8} w="100%" borderRadius="xl" alignItems="center" justifyContent="center">
        <ReactCrop
          crop={crop}
          onChange={(newCrop) => setCrop(newCrop)}
          keepSelection
          minWidth={MIN_DIMENSION}
        >
          <Image
          src={selectedImage}
          ref={imgRef}
          alt="Uploaded"
          objectFit="contain"
          maxH="100%"
          maxW="100%"
          onLoad={onImageLoad}
          ></Image>
        </ReactCrop>
      </Box>

      <Button onClick={completeCrop} mt={4}>
        사이즈 재기 완료
      </Button>
      <Box as="canvas" ref={previewCanvasRef} mt={4} border="1px solid black" width={200} height={200} display="block" mx="auto" />
    {cropDetails && (
      <Box float="right" width="45%" p={4} bg="#FFFFFF" borderRadius="xl">
        <VStack align="start" spacing={4}>
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
