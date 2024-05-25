import React from 'react';
import { VStack, Button } from '@chakra-ui/react';

const UploadScreen = ({ onSelectImage }) => {
    return (
        <VStack spacing={8} pt={20} bg="#EEEEEE">
            <Button colorScheme="green" onClick={onSelectImage}>
                이미지 선택
            </Button>
        </VStack>
    );
};

export default UploadScreen;
