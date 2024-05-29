import { Button, Box, Flex, Image, useToast } from '@chakra-ui/react';
import React, { useState } from 'react';

const SizeScreen = ({ onSelectSize, selectedImage }) => {
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const toast = useToast();

    const handleSizeChange = () => {
        const img = document.createElement('img');
        img.onload = () => {
            setWidth(img.naturalWidth);
            setHeight(img.naturalHeight);
        };
        img.src = selectedImage;
    };

    const handleUpload = () => {
        if (width && height) {
            onSelectSize(width, height);
        } else {
            toast({
                title: "이미지를 선택해주세요.",
                status: "error",
                duration: 2000,
                isClosable: true,
            });
        }
    };

    return (
        <Box>
            <Flex>
                <Image src={selectedImage} alt="Selected" maxH="300px" objectFit="contain" />
                <Button onClick={handleSizeChange}>
                    크기 변경
                </Button>
                <Button onClick={handleUpload}>
                    완료
                </Button>
            </Flex>
        </Box>
    )
}

export default SizeScreen