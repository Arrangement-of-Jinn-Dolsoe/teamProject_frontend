import React, { useState, useEffect } from 'react';
import { Box, Button, Flex, Image } from '@chakra-ui/react';
import axios from 'axios';

const SelectObjectScreen = ({ selectedImages, onSelectObject }) => {
    const [selectingList, setSelectingList] = useState([]);
    const [excludedList, setExcludedList] = useState([]);
    const [organizedImage, setOrganizedImage] = useState(null);　// 여기에 백엔드에서 받은 이미지 데이터를 저장

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

    const handlOrganization = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:5000/여기에 백엔드와 통신할 주소', {
                images: selectingList,
            }, {
                responseType: 'blob', // blob데이터로 받음
            });

            const blob = new Blob([response.data], { type: 'image/png' });
            const imageUrl = URL.createObjectURL(blob);
            setOrganizedImage(imageUrl);

            onSelectObject(selectingList); // 화면 전환을 위해 선택된 이미지 목록을 전달. 근데 이건 organizedImage로 대체하는 것이 좋다...?
        } catch (error) {
            console.error("Error processing images:", error);
        }
    };


    return (
        <Box>
            <Box>
                <Box fontWeight="bold" p={2}>선택중</Box>
                <Flex>
                    {selectingList.map((image, index) => (
                        <Image
                            key={index}
                            src={image}
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
                <Box fontWeight="bold" p={2}>제외</Box>
                <Flex>
                    {excludedList.map((image, index) => (
                        <Image
                            key={index}
                            src={image}
                            alt={`Excluded ${index}`}
                            onClick={() => handleExcludeImage(index)}
                            boxSize="150px"
                            m={2}
                            cursor="pointer"
                        />
                    ))}
                </Flex>
            </Box>
            <Button mt={4} onClick={handlOrganization}>선반 정리 시작</Button>
        </Box>
    );
};

export default SelectObjectScreen;
