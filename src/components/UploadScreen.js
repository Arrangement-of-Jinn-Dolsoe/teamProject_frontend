import React from 'react';
import { VStack, Button, Box } from '@chakra-ui/react';

const UploadScreen = ({ onSelectImage }) => {
    const handleFileChange = (event) => {
        const file = event.target.files[0]; // 選択されたファイルを取得
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onSelectImage(reader.result); // 選択されたファイルのデータURLをコールバック関数に渡す
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Box h="100vh" bg="#EEEEEE">
            <VStack spacing={8} pt={20} w="100%" h="100%" justify="center" align="center">
                {/* ファイル選択用のinputを非表示にして、ボタンがクリックされた時にファイル選択ダイアログを開く */}
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
