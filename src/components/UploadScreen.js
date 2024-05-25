import React from 'react';
import { VStack, Button, Box } from '@chakra-ui/react';


const UploadScreen = ({ onSelectImage }) => {

    // 파일이 선택되면 호출되는 함수
    const handleFileChange = (event) => {
        const file = event.target.files[0]; // 선택된 파일을 가져옴
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onSelectImage(reader.result); // 선택된 파일을 부모 컴포넌트로 전달함
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Box h="100vh" bg="#EEEEEE">
            <VStack spacing={8} pt={20} w="100%" h="100%" justify="center" align="center">
                {/* 여기에 이 웹 앰의 사용 방벙을 표시 */}
                <Box fontSize={35}>
                    이 웹앱의 사용 방법을 설명하는 텍스트
                </Box>

                {/* 보튼을 클릭하면 파일 선택 화면이 나타남 */}
                <input type="file" id="fileInput" style={{ display: 'none' }} onChange={handleFileChange} />
                <label htmlFor="fileInput">
                    <Button colorScheme="green" style={{ width: "200px", height: "60px" }} fontSize={24} as="span">
                        이미지 선택
                    </Button>
                </label>
            </VStack>
        </Box>
    );
};

export default UploadScreen;
