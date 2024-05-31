import React, { useState } from 'react';
import { VStack, Button, Box, Image, useToast, Flex } from '@chakra-ui/react';

const UploadScreen = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [resultImage, setResultImage] = useState(null);
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

    const handleUpload = async () => {
        if (selectedImage) {
            const fileInput = document.getElementById('fileInput').files[0];
            const formData = new FormData();
            formData.append('file', fileInput);

            try {
                const response = await fetch('http://localhost:5000/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('네트워크 응답이 정상이 아닙니다.');
                }

                const data = await response.json();
                setResultImage(data.result_image);
                toast({
                    title: "이미지가 성공적으로 업로드되었습니다.",
                    status: "success",
                    duration: 2000,
                    isClosable: true,
                });
            } catch (error) {
                toast({
                    title: "업로드 중 오류가 발생했습니다.",
                    description: error.message,
                    status: "error",
                    duration: 2000,
                    isClosable: true,
                });
            }
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
                {/* 여기에 이 웹앱의 사용 방법을 표시 */}
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
                {resultImage && (
                    <Box bg="#FFFFFF" p={8} h="45%" w="95%" borderRadius="xl" display="flex" alignItems="center" justifyContent="center">
                        <Image src={`http://localhost:5000/uploads/${resultImage}`} alt="Result" maxH="300px" objectFit="contain" />
                    </Box>
                )}
            </VStack>
        </Box>
    );
};

export default UploadScreen;
