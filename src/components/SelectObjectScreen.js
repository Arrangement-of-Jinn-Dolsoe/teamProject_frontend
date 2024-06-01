import React, { useState, useEffect } from 'react';
import { Box, Button, Flex, Image } from '@chakra-ui/react';

const SelectObjectScreen = ({ selectedImages, onSelectObject }) => {
    const [selectingList, setSelectingList] = useState([]);
    const [excludedList, setExcludedList] = useState([]);

    useEffect(() => {
        setSelectingList(selectedImages);
    }, [selectedImages]);

    const handleSelectImage = (index) => {
        const selectedImage = selectingList[index];
        setSelectingList(selectingList.filter((_, i) => i !== index));
        setExcludedList([...excludedList, selectedImage]);
    };

    const handleExcludeImage = (index) => {
        const excludedImage = excludedList[index];
        setExcludedList(excludedList.filter((_, i) => i !== index));
        setSelectingList([...selectingList, excludedImage]);
    };

    const handleOrganization = () => {
        onSelectObject(selectingList);
    };

    return (
        <Box>
            <Box>
                <Box fontWeight="bold" p={2}>選択中</Box>
                <Flex>
                    {selectingList.map((image, index) => (
                        <Image
                            key={index}
                            src={`http://127.0.0.1:5000/upload-shelf/${image}`}  // 이미지 경로 설정
                            alt={`Selected ${index}`}
                            onClick={() => handleSelectImage(index)}
                            boxSize="150px"
                            m={2}
                            cursor="pointer"
                        />
                    ))}
                </Flex>
            </Box>
            <Box mt={4}>
                <Box fontWeight="bold" p={2}>除外</Box>
                <Flex>
                    {excludedList.map((image, index) => (
                        <Image
                            key={index}
                            src={`http://127.0.0.1:5000/upload-shelf/${image}`}  // 이미지 경로 설정
                            alt={`Excluded ${index}`}
                            onClick={() => handleExcludeImage(index)}
                            boxSize="150px"
                            m={2}
                            cursor="pointer"
                        />
                    ))}
                </Flex>
            </Box>
            <Button mt={4} onClick={handleOrganization}>決定</Button>
        </Box>
    );
};

export default SelectObjectScreen;
