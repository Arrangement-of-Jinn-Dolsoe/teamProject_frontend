import { Button, Box, Image, Text, VStack } from '@chakra-ui/react';
import React, { useState, useRef } from 'react';
import setCanvasPreview from "../setCanvasPreview";
import ReactCrop, { centerCrop, convertToPixelCrop, makeAspectCrop } from "react-image-crop";
import 'react-image-crop/dist/ReactCrop.css';

const MIN_DIMENSION = 150;

const SizeScreen = ({ selectedImage, onCropComplete }) => {
    const imgRef = useRef(null);
    const previewCanvasRef = useRef(null);
    const [crop, setCrop] = useState();
    const [cropDetails, setCropDetails] = useState(null);

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
                onCropComplete(url);
            }, 'image/png');

            const cropWidth = Math.round(pixelCrop.width);
            const cropHeight = Math.round(pixelCrop.height);
            const cropX = Math.round(pixelCrop.x);
            const cropY = Math.round(pixelCrop.y);
            const imgWidth = imgRef.current.naturalWidth;
            const imgHeight = imgRef.current.naturalHeight;

            

            setCropDetails({
                width: cropWidth,
                height: cropHeight,
                coordinates: [
                    { label: "왼쪽 상단", x: cropX, y: cropY },
                    { label: "오른쪽 하단", x: cropX + cropWidth, y: cropY + cropHeight }
                ],
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
                    선반 사이즈 재기
                </Button>
                <Box as="canvas" ref={previewCanvasRef} mt={4} border="1px solid black" width={200} height={200} display="block" mx="auto"/>
            </Box>
            {cropDetails && (
                <Box float="right" width="45%" p={4} bg="#FFFFFF" borderRadius="xl">
                    <VStack align="start" spacing={4}>
                        <Text fontSize="xl">Crop한 정보:</Text>
                        <Text>픽셀: {cropDetails.width}x{cropDetails.height} </Text>
                        {cropDetails.coordinates.map((coord, index) => (
                            <Text key={index}>
                                {coord.label}: ({coord.x}, {coord.y})
                            </Text>
                        ))}
                        <Text>원본 이미지 사이즈: {cropDetails.imgSize}</Text>
                    </VStack>
                </Box>
            )}
        </Box>
    );
}

export default SizeScreen;
