import { Button, Box, Flex, Image } from '@chakra-ui/react';
import React, { useState } from 'react';

const sizeScreen = ({ onSelectSize }) => {
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [selectedImage, setSelectedImage] = useState('');

    const handleSizeChange = () => {
        if (selectedImage) {
            const img = new Image();
            img.onload = () => {
                setWidth(img.naturalWidth);
                setHeight(img.naturalHeight);
            };
            img.src = selectedImage;
        }
    };

    const handleUpload = () => {
        if (width && height) {
            onSelectSize(selectedSize);
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
                <Button onclick={handleSizeChange}>
                    크기 변경
                </Button>
                <Button onclick={handleUpload}>
                    완료
                </Button>
            </Flex>
        </Box>
    )
}

export default sizeScreen