import { Button, Box, Image, VStack, Text,  } from '@chakra-ui/react';
import React, { useState, useRef, useEffect } from 'react';
import setCanvasPreview from "../setCanvasPreview";
import ReactCrop, { centerCrop, convertToPixelCrop, makeAspectCrop } from "react-image-crop";
import 'react-image-crop/dist/ReactCrop.css';
import axios from 'axios';


const MIN_DIMENSION = 150;

const ImageGet = async () => {
    try {
        const response = await axios.get('http://127.0.0.1:5000/여기에 백엔드와 통신할 주소');
        return response.data;
    } catch (error) {
        console.error("이미지 데이터 취득 에러:", error);
        return [];
    }
};

const SizeScreen = ({ selectedImage, onCropComplete }) => {
    const imgRef = useRef(null);
    const previewCanvasRef = useRef(null);
    const [crop, setCrop] = useState();
    const [cropDetails, setCropDetails] = useState(null);
    const [imageArray, setImageArray] = useState([]); // imageArray 에 백엔드에서 가져온 이미지 데이터를 저장하지만 아직 그걸 호출하는 코드는 없음(SelectedImageScreen컴포넌트에서 호출함)


    useEffect(() => {
        // ImageGet 함수를 호출하여 이미지 데이터를 가져옴
        ImageGet().then(data => {
            setImageArray(data);
        });
    }, []);

    
    const onImageLoad = (e) => {
        const { width, height } = e.currentTarget;
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

    const completeCrop = () => {
        if (imgRef.current && previewCanvasRef.current && crop) {
            const pixelCrop = convertToPixelCrop(crop, imgRef.current.naturalWidth, imgRef.current.naturalHeight);
            setCanvasPreview(imgRef.current, previewCanvasRef.current, pixelCrop);
            const canvas = previewCanvasRef.current;
            canvas.toBlob(blob => {
                const url = URL.createObjectURL(blob);
                const images = ImageGet();
                onCropComplete(url, images);
            }, 'image/png');
            

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

            setCropDetails({
                width: cropWidth,
                height: cropHeight,
                coordinates: [x1, y1, x2, y2],
                imgSize: `${imgWidth}x${imgHeight}`
            });
        }
    };

    return (
        <Box p={4} h="100vh" bg="#EEEEEE">
            <Box h="77vh" w="50%" float="left">
                <ReactCrop
                    crop={crop}
                    onChange={(newCrop) => setCrop(newCrop)}
                    keepSelection
                    minWidth={MIN_DIMENSION}
                >
                    <Box bg="#FFFFFF" p={8} w="100%" borderRadius="xl" alignItems="center" justifyContent="center">
                        <Image
                            src={selectedImage}
                            ref={imgRef}
                            alt="Uploaded"
                            objectFit="contain"
                            maxH="100%"
                            maxW="100%"
                            onLoad={onImageLoad}
                        />
                    </Box>
                </ReactCrop>

                <Button onClick={completeCrop} mt={4}>
                    사이즈 재기 완료
                </Button>
                <Box as="canvas" ref={previewCanvasRef} mt={4} border="1px solid black" width={200} height={200} display="block" mx="auto" />
            </Box>
            {cropDetails && (
                <Box float="right" width="45%" p={4} bg="#FFFFFF" borderRadius="xl">
                    <VStack align="start" spacing={4}>
                    <Text fontSize="xl">Crop한 정보:</Text>
                        <Text>픽셀: {cropDetails.width}x{cropDetails.height} </Text>
                        <Text>자표: [{cropDetails.coordinates.join(", ")}]</Text>
                        <Text>원본 이미지 사이즈: {cropDetails.imgSize}</Text>
                    </VStack>
                    </Box>
            )}
        </Box>
    );
}

export default SizeScreen;
