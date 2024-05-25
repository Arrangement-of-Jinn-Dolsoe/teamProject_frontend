import React, { useRef } from 'react';
import { Box, Button, Flex, Text, Image } from '@chakra-ui/react';
import { toPng } from 'html-to-image';

// 이미지를 업로드한 후 표시되는 화면
const EditScreen = ({ uploadedImage }) => {
    const screenshotRef = useRef(null);

    // 이미지를 다운로드하는 함수(화면 캡쳐하고 이미지로 저장하는 기능)
    const handleDownload = () => {
        if (screenshotRef.current === null) {
            return;
        }
        // html-to-image 라이브러리 사용
        toPng(screenshotRef.current)
            .then((dataUrl) => {
                const link = document.createElement('a');
                link.download = 'screenshot.png';
                link.href = dataUrl; // 이미지 데이터를 이 "dataUrl"에 저장한 형식으로 구현했는데 이걸 백엔드에 전달하는 방식으로 구현해야 할 것 같아요(아마)
                link.click();
            })
            .catch((err) => {
                console.error(err);
            });
    };

    return (
        // Header보다 아래의 UI 구현 부분
        <Box ref={screenshotRef} p={4} h="100vh" bg="#EEEEEE">

            {/*이미지 다운로드 버튼*/}
            <Box position="relative">
                <Button colorScheme="green" onClick={handleDownload} position="absolute" right="25px" style={{ width: "150px", height: "30px" }}>
                    이미지 다운로드
                </Button>
            </Box>

            <Text fontSize={35} mb={4}>
                그럼 이 이미지를 참고해서 정리를 시작하자!
            </Text>

            {/* 정리 전 이미지와 정리 후 이미지를 표시하는 부분 */}
            <Flex justify="space-between" h="77vh">
                <Box bg="#FFFFFF" p={8} w="48%" borderRadius="xl" display="flex" alignItems="center" justifyContent="center">
                    {uploadedImage && <Image src={uploadedImage} alt="Uploaded" objectFit="contain" maxH="100%" maxW="100%" />}
                </Box>
                <Box bg="#FFFFFF" p={8} w="48%" borderRadius="xl" display="flex" alignItems="center" justifyContent="center">
                    {/* 여기서 백엔드에서 생성한 정리 후 가상 이미지 데이터를 취득하고 출력하는 형태가 될 것 같아요(아마) */}
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
