import React, { useRef } from 'react';
import { Box, Button, Flex, Text, Image } from '@chakra-ui/react';
import { toPng } from 'html-to-image';

// 유저가 업로드한 이미지와 정리된 이미지를 표시하는 컴포넌트
const EditScreen = ({ uploadedImage, croppedImage, resultImage }) => {
    const screenshotRef = useRef(null);

    // 이미지 다운로드 버튼을 클릭하면 실행되는 함수. 이미지를 다운로드할 수 있다.
    const handleDownload = () => {
        if (screenshotRef.current === null) {
            return;
        }
        toPng(screenshotRef.current)
            .then((dataUrl) => {
                const link = document.createElement('a');
                link.download = 'screenshot.png';
                link.href = dataUrl;
                link.click();
            })
            .catch((err) => {
                console.error(err);
            });
    };

    // 보디부분의 화면을 구성하는 컴포넌트를 반환한다.
    return (
        <Box ref={screenshotRef} p={4} h="100vh" bg="#EEEEEE">
            <Box position="relative">
                {/** 이미지 다운로드 버튼을 클릭하면 handleDownload 함수가 실행된다. */}
                <Button colorScheme="green" onClick={handleDownload} position="absolute" right="25px" style={{ width: "150px", height: "30px" }}>
                    이미지 다운로드
                </Button>
            </Box>

            <Text fontSize={35} mb={4}>
                그럼 이 이미지를 참고해서 정리를 시작하자!
            </Text>

            <Flex justify="space-between" h="77vh">
                {/* 유저가 업로드한 이미지를 표시한다. */}
                <Box bg="#FFFFFF" p={8} w="48%" borderRadius="xl" display="flex" alignItems="center" justifyContent="center">
                    {uploadedImage && <Image src={uploadedImage} alt="Uploaded" objectFit="contain" maxH="100%" maxW="100%" />}
                </Box>
                {/* 정리된 이미지를 표시한다. */}
                <Box bg="#FFFFFF" p={8} w="48%" borderRadius="xl" display="flex" alignItems="center" justifyContent="center">
                    {resultImage && <Image src={`http://127.0.0.1:5000/result/${resultImage}`} alt="Result" objectFit="contain" maxH="100%" maxW="100%" />}
                </Box>
            </Flex>
            <Flex justify="space-between">
                <Text fontSize={28} w="49%" mt={2}>정리 전 이미지</Text>
                <Text fontSize={28} w="49%" mt={2}>정리 후 이미지</Text>
            </Flex>
        </Box>
    );
};

export default EditScreen;
