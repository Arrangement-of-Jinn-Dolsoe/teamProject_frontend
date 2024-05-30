import React, { useState } from 'react';
import { VStack, Button, Box, Image, useToast, Flex } from '@chakra-ui/react';

const UploadScreen = ({ onSelectImage }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const toast = useToast();

    // 이미지 선택 시 호출되는 함수
    const handleFileChange = (event) => {
        const file = event.target.files[0]; // 선택된 파일을 가져옴
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result); // 이미지를 base64 형태로 저장
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = () => {
        if (selectedImage) {
            onSelectImage(selectedImage);
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
        <Box h="100vh" bg="#EEEEEE">
            <VStack spacing={8} pt={20} w="100%" h="100%" align="center">
                {/* 여기에 이 웹 앰의 사용 방벙을 표시 */}
                <Box w="95%" h="40%" fontSize={35}>
                    이 웹앱의 사용 방법을 설명하는 텍스트
                </Box>

                <Box bg="#FFFFFF" p={8} h="45%" w="95%" borderRadius="xl" display="flex" alignItems="center" justifyContent="center">
                    <Flex justify="space-between" w="100%">
                        <Box bg="#EEEEEE">
                            <VStack>
                                {/*  보튼을 클릭하면 파일 선택 화면이 나타남 */}
                                <input type="file" id="fileInput" style={{ display: 'none' }} onChange={handleFileChange} />
                                <label htmlFor="fileInput">
                                    <Button m={15} colorScheme="green" style={{ width: "200px", height: "60px" }} fontSize={24} as="span">
                                        이미지 선택
                                    </Button>
                                </label>
                                <Button m={15} colorScheme="green" style={{ width: "200px", height: "60px" }} fontSize={24} onClick={handleUpload}>
                                    업로드
                                </Button>
                            </VStack>
                        </Box>
                        {selectedImage && (
                            <Image src={selectedImage} alt="Selected" maxH="300px" objectFit="contain" />
                        )}
                    </Flex>
                </Box>
            </VStack>
        </Box>
    );
};

export default UploadScreen;
