import React, { useState } from 'react';
import { VStack, Button, Box, Image, useToast, Flex } from '@chakra-ui/react';
import axios from 'axios';

// 이미지를 업로드하는 화면을 표시하는 컴포넌트
const UploadScreen = ({ onSelectImage }) => {
    const [selectedImage, setSelectedImage] = useState(null); // 선택된 이미지를 저장하는 상태변수
    const toast = useToast(); // 이미지 업로드 성공/실패 시 메시지를 표시하기 위해 useToast 훅을 사용

    // 이미지 선택 버튼을 클릭하면 실행되는 함수. 파일 선택 창이 나타나고, 선택된 이미지를 setSelectedImage함수를 사용해서 selectedImage 상태변수를 갱신하고 저장한다.
    const handleFileChange = (event) => {
        const file = event.target.files[0]; // 선택된 파일을 가져온다.
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
            };
            // 선택된 파일을 읽어서 이미지로 변환한다.
            reader.readAsDataURL(file);
        }
    };

    // 업로드 버튼을 클릭하면 실행되는 함수. 선택된 이미지를 백엔드로 보낸다.
    const handleUpload = async () => {
        // 파일 선택 창에서 선택된 파일을 가져와서 formData에 저장한다.
        const fileInput = document.getElementById('fileInput');
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const formData = new FormData();
            formData.append('file', file);

            try {
                // 엔드 포인트는 "upload"로 설정하고, 선택된 이미지를 백엔드로 보낸다.
                const response = await axios.post('http://127.0.0.1:5000/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                toast({
                    title: "파일 업로드 성공!",
                    status: "success",
                    duration: 2000,
                    isClosable: true,
                });
                /* 선택된 이미지를 부모 컴포넌트로 보내고 부모 컴포넌트에서는 이 이미지를 SizeScreen 컴포넌트로 보낸다. 
                또, 화면을 SizeScreen에 바꾸기 위한 역할도 있다.*/
                onSelectImage(selectedImage);
                console.log('File uploaded successfully', response.data);
            } catch (error) {
                console.error('Error uploading file', error);

                // 파일 업로드 실패 시 에러 메시지를 표시한다.
                toast({
                    title: "파일 업로드 실패.",
                    status: "error",
                    duration: 2000,
                    isClosable: true,
                });
            }
        } else {
            // 파일을 선택하지 않고 업로드 버튼을 클릭하면 에러 메시지를 표시한다.
            toast({
                title: "이미지를 선택해주세요.",
                status: "error",
                duration: 2000,
                isClosable: true,
            });
        }
    };

    // 보디 부분의 화면을 구성하는 컴포넌트를 반환한다.
    return (
        <Box h="100vh" bg="#EEEEEE">
            <VStack spacing={8} pt={20} w="100%" h="100%" align="center">
                {/* 여기에 이 웹앱의 사용 방식을 표시 */}
                <Box w="95%" h="40%" fontSize={35}>
                    정리하는 이미지를 선택하고 업로드하세요.
                </Box>

                <Box bg="#FFFFFF" p={8} h="45%" w="95%" borderRadius="xl" display="flex" alignItems="center" justifyContent="center">
                    <Flex justify="space-between" w="100%">
                        <Box bg="#EEEEEE">
                            <VStack>
                                {/* 버튼을 클릭하면 파일 선택 화면이 나타남 */}
                                <input type="file" id="fileInput" style={{ display: 'none' }} onChange={handleFileChange} />
                                <label htmlFor="fileInput">
                                    <Button m={15} colorScheme="green" style={{ width: "200px", height: "60px" }} fontSize={24} as="span">
                                        이미지 선택
                                    </Button>
                                </label>
                                 {/* 버튼을 클릭하면 선택된 이미지를 백엔드로 보냄 */}
                                <Button m={15} colorScheme="green" style={{ width: "200px", height: "60px" }} fontSize={24} onClick={handleUpload}>
                                    업로드
                                </Button>
                            </VStack>
                        </Box>
                        {/* 선택된 이미지를 표시 */}
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
