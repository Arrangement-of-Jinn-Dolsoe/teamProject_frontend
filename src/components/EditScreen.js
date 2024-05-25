import React, { useRef } from 'react';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { toPng } from 'html-to-image';

const EditScreen = ({ onDownload }) => {
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
        <Box ref={screenshotRef} p={4}>
            <Text fontSize="xl" mb={4}>
                그럼 이 이미지를 참고해서 정리를 시작하자!
            </Text>
            <Flex justify="space-between">
                <Box border="1px" borderColor="gray.200" p={8} w="45%">
                    <Text>이 속에 업로드한 이미지 배치</Text>
                </Box>
                <Box border="1px" borderColor="gray.200" p={8} w="45%">
                    <Text>이 속에 생성한 이미지 배치</Text>
                </Box>
            </Flex>
            <Button mt={4} colorScheme="green" onClick={handleDownload}>
                이미지 다운로드
            </Button>
        </Box>
    );
};

export default EditScreen;
