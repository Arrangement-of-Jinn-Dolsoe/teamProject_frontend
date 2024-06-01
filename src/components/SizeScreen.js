import { Button, Box, Image, VStack, Text } from '@chakra-ui/react';
import React, { useState, useRef, useEffect } from 'react';
import setCanvasPreview from "../setCanvasPreview";
import ReactCrop, { centerCrop, convertToPixelCrop, makeAspectCrop } from "react-image-crop";
import 'react-image-crop/dist/ReactCrop.css';
import axios from 'axios';

const MIN_DIMENSION = 150;

const ImageGet = async () => {
    try {
        const response = await axios.get('http://127.0.0.1:5000/separatedImages');
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
    const [cropDetails, setCropDetails] = useState([]);
    const [imageArray, setImageArray] = useState([]);

    useEffect(() => {
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

    const completeCrop = async () => {
        if (imgRef.current && previewCanvasRef.current && crop) {
            const pixelCrop = convertToPixelCrop(crop, imgRef.current.naturalWidth, imgRef.current.naturalHeight);
            setCanvasPreview(imgRef.current, previewCanvasRef.current, pixelCrop);

            const cropWidth = Math.round(pixelCrop.width);
            const cropHeight = Math.round(pixelCrop.height);
            const cropX = Math.round(pixelCrop.x);
            const cropY = Math.round(pixelCrop.y);

            const x1 = cropX;
            const y1 = cropY;
            const x2 = cropX + cropWidth;
            const y2 = cropY + cropHeight;

            setCropDetails([x1, y1, x2, y2]);

            const formData = new FormData();
            formData.append('x1', x1);
            formData.append('y1', y1);
            formData.append('x2', x2);
            formData.append('y2', y2);

            try {
                const response = await axios.post('http://127.0.0.1:5000/coordinateData', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.log('Crop details uploaded successfully', response.data);

                const images = await ImageGet();
                setImageArray(images);
                onCropComplete(images);
            } catch (error) {
                console.error('Error uploading crop details', error);
            }
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
            {cropDetails.length > 0 && (
                <Box float="right" width="45%" p={4} bg="#FFFFFF" borderRadius="xl">
                    <VStack align="start" spacing={4}>
                        <Text fontSize="xl">Crop한 좌표:</Text>
                        <Text>좌표: [{cropDetails.join(", ")}]</Text>
                    </VStack>
                </Box>
            )}
        </Box>
    );
}

export default SizeScreen;
