import { Button, Box, Image } from '@chakra-ui/react';
// useToastを一時的に消した
import React, { useState, useRef } from 'react';
import setCanvasPreview from "../setCanvasPreview";
import ReactCrop, { centerCrop, convertToPixelCrop, makeAspectCrop, } from "react-image-crop";

const ASPECT_RATIO = 1;
const MIN_DIMENSION = 150;

// onSelectSizeをproposとして受け取るの一旦消した
const SizeScreen = ({ selectedImage }) => {
    // const [width, setWidth] = useState(0);
    // const [height, setHeight] = useState(0);
    // const toast = useToast();
    const imgRef = useRef(null);
    const previewCanvasRef = useRef(null);
    const [crop, setCrop] = useState();

    const onImageLoad = (e) => {
        const { width, height } = e.currentTarget;
        const cropWidthInPercent = (MIN_DIMENSION / width) * 100;
        const crop = makeAspectCrop(
            {
                unit: "%",
                width: cropWidthInPercent,
            },
            ASPECT_RATIO,
            width,
            height
        );
        const centeredCrop = centerCrop(crop, width, height);
        setCrop(centeredCrop);
    };

    // const handleSizeChange = () => {
    //     const img = document.createElement('img');
    //     img.onload = () => {
    //         setWidth(img.naturalWidth);
    //         setHeight(img.naturalHeight);
    //     };
    //     img.src = selectedImage;
    // };

    // const handleUpload = () => {
    //     if (width && height) {
    //         onSelectSize(width, height);
    //     } else {
    //         toast({
    //             title: "이미지를 선택해주세요.",
    //             status: "error",
    //             duration: 2000,
    //             isClosable: true,
    //         });
    //     }
    // };

    return (
        <Box p={4} h="100vh" bg="#EEEEEE">
            <Box h="77vh" w="50%">
                {/* <Image src={selectedImage} alt="Selected" maxH="300px" objectFit="contain" /> */}

                <ReactCrop
                    crop={crop}
                    onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}
                    circularCrop
                    keepSelection
                    aspect={ASPECT_RATIO}
                    minWidth={MIN_DIMENSION}
                >
                    <Box bg="#FFFFFF" p={8} w="100%" borderRadius="xl" alignItems="center" justifyContent="center">
                        <Image src={selectedImage} ref={imgRef} alt="Uploaded" objectFit="contain" maxH="100%" maxW="100%" justifyContent="center"
                            onLoad={onImageLoad} />
                    </Box>
                </ReactCrop>

                <Button
                    onClick={() => {
                        setCanvasPreview(
                            imgRef.current,
                            previewCanvasRef.current,
                            convertToPixelCrop(
                                crop,
                                imgRef.current.Width,
                                imgRef.current.Height
                            )
                        );
                    }}
                // onClick={handleSizeChange}
                >
                    トリミング完了
                </Button>
            </Box>
            {crop && (
                <Box as="canvas" ref={previewCanvasRef} mt={4} border="1px solid black" objectFit="contain" width={150} height={150}/>
            )}
        </Box>

    )
}

export default SizeScreen