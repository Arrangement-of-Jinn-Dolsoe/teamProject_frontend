import React, { useRef } from 'react';
import { Box, Button, Flex, Text, Image } from '@chakra-ui/react';
import { toPng } from 'html-to-image';

const EditScreen = ({ uploadedImage }) => {
    const screenshotRef = useRef(null);

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

    return (
        <Box ref={screenshotRef} p={4} h="100vh" bg="#EEEEEE">
            <Box position="relative">
                <Button colorScheme="green" onClick={handleDownload} position="absolute" right="25px" style={{ width: "150px", height: "30px" }}>
                이미지 다운로드
                </Button>
            </Box>

            <Text fontSize={35} mb={4}>
                그럼 이 이미지를 참고해서 정리를 시작하자!
            </Text>
            <Flex justify="space-between" h="77vh">
                <Box bg="#FFFFFF" p={8} w="48%" borderRadius="xl">
                    {uploadedImage && <Image src={uploadedImage} alt="Uploaded" />}
                </Box>
                <Box bg="#FFFFFF" p={8} w="48%" borderRadius="xl">
                    {/* 이 속에 생성한 이미지 배치함 */}
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
