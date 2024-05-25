import React, { useState } from 'react';
import { VStack, Button, Box, Image } from '@chakra-ui/react';

const UploadScreen = ({ onSelectImage }) => {
    const [selectedImage, setSelectedImage] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = () => {
        if (selectedImage) {
            onSelectImage(selectedImage);
        }
    };

    return (
        <Box h="100vh" bg="#EEEEEE">
            <VStack spacing={8} pt={20} w="100%" h="100%" justify="center" align="center">
                <Box fontSize={35}>
                    이 웹앱의 사용 방법을 설명하는 텍스트
                </Box>
                <input type="file" id="fileInput" style={{ display: 'none' }} onChange={handleFileChange} />
                <label htmlFor="fileInput">
                    <Button colorScheme="green" style={{ width: "200px", height: "60px" }} fontSize={24} as="span">
                        이미지 선택
                    </Button>
                </label>
                {selectedImage && (
                    <>
                        <Image src={selectedImage} alt="Selected" maxH="300px" objectFit="contain" />
                        <Button colorScheme="green" style={{ width: "200px", height: "60px" }} fontSize={24} onClick={handleUpload}>
                            업로드
                        </Button>
                    </>
                )}
            </VStack>
        </Box>
    );
};

export default UploadScreen;
