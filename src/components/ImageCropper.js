import React, { useState } from 'react'
import ReactCrop, { centerCrop, makeAspectCrop,} from "react-image-crop";
import { Image, Box } from '@chakra-ui/react';

const ASPECT_RATIO = 1;
const MIN_DIMENSION = 150;

const ImageCropper = ({selectedImage}) => {
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

    return (
        <ReactCrop 
            crop={crop}
            onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}
            circularCrop
            keepSelection
            aspect={ASPECT_RATIO}
            minWidth={MIN_DIMENSION}
        >
        <Box bg="#FFFFFF" p={8} w="48%" borderRadius="xl" alignItems="center" justifyContent="center">
            <Image src={selectedImage} alt="Uploaded" objectFit="contain" maxH="100%" maxW="100%" justifyContent="center"
                onLoad={onImageLoad}/>
        </Box>
        </ReactCrop>
        
    )
}

export default ImageCropper