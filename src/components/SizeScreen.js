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

            // 左上の座標 (x1, y1)
            const x1 = cropX;
            const y1 = cropY;

            // 右下の座標 (x2, y2)
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
                    トリミング完了
                </Button>
                <Box as="canvas" ref={previewCanvasRef} mt={4} border="1px solid black" width={200} height={200} display="block" mx="auto"/>
            </Box>
            {cropDetails && (
                <Box float="right" width="45%" p={4} bg="#FFFFFF" borderRadius="xl">
                    <VStack align="start" spacing={4}>
                        <Text fontSize="xl">Cropした情報:</Text>
                        <Text>ピクセル: {cropDetails.width}x{cropDetails.height} </Text>
                        <Text>座標: [{cropDetails.coordinates.join(", ")}]</Text>
                        <Text>元画像サイズ: {cropDetails.imgSize}</Text>
                    </VStack>
                </Box>
            )}
        </Box>
    );
}

export default SizeScreen;
