import React, { useState, useEffect } from 'react';
import { Box, Button, Flex, Image } from '@chakra-ui/react';

// SelectObjectScreen 컴포넌트는 유저가 정리할 물건들을 선택하는 화면을 표시한다.
const SelectObjectScreen = ({ selectedImages, onSelectObject }) => {
    /* 이 웹페이지를 열릴 때는 백엔드에서 가져온 이미지 리스트로 초기화한다. 유저는 이 이미지 리스트에서 물건을 선택한다.
    최종적으로 여기 리스트에 남은 이미지들이 백엔드에게 보낸다.*/
    const [selectingList, setSelectingList] = useState([]);
    // 유저가 제외한 이미지를 저장하는 상태변수
    const [excludedList, setExcludedList] = useState([]);

    /* 백엔드에서 가져온 이미지 리스트를 setSelectingList함수를 사용해서 상태변수 selectingList를 갱신해서 저장한다.
    백엔드에서 가져오는 코드는 SizeScreen 컴포넌트에 있다. 선택할 이미지가 저장되어 있는 배열 자체는 부모 컴포넌트인 App 컴포넌트에서 가져온다.*/
    useEffect(() => {
        setSelectingList(selectedImages);
    }, [selectedImages]);

    // "선택중"에 있는 이미지를 클릭하면 실행되는 함수. 클릭한 이미지를 selectingList에서 제외하고, excludedList에 추가한다.
    const handleSelectImage = (index) => {
        const selectedImage = selectingList[index];
        setSelectingList(selectingList.filter((_, i) => i !== index));
        setExcludedList([...excludedList, selectedImage]);
    };

    // "제외중"에 있는 이미지를 클릭하면 실행되는 함수. 클릭한 이미지를 excludedList에서 제외하고, selectingList에 추가한다.
    const handleExcludeImage = (index) => {
        const excludedImage = excludedList[index];
        setExcludedList(excludedList.filter((_, i) => i !== index));
        setSelectingList([...selectingList, excludedImage]);
    };

    // 유저가 선택한 이미지의 배열을 부모 컴포넌트인 App 컴포넌트로 보내는 함수.
    const handleOrganization = async () => {
        onSelectObject(selectingList);
        // 선택된 이미지 리스트를 콘솔에 출력한다.
        console.log("selectingList:", selectingList);

        // 제외된 이미지 주소 리스트를 백엔드에 보내는 코드
        try {
            const response = await fetch('http://127.0.0.1:5000/update-objects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ excludedImages: excludedList }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Success:', data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // 보디부분의 화면을 구성하는 컴포넌트를 반환한다.
    return (
        <Box>
            <Box>
                <Box fontWeight="bold" p={2}>선택중</Box>
                <Flex>
                    {/* 선택중인 이미지를 표시한다. 이미지를 클릭하면 handleSelectImage 함수가 실행된다. */}
                    {selectingList.map((image, index) => (
                        <Image
                            key={index}
                            src={`http://127.0.0.1:5000/detected-object-images/${image}`}  // 이미지 경로 설정
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
                <Box fontWeight="bold" p={2}>제외중</Box>
                <Flex>
                    {/* 제외중인 이미지를 표시한다. 이미지를 클릭하면 handleExcludeImage 함수가 실행된다. */}
                    {excludedList.map((image, index) => (
                        <Image
                            key={index}
                            src={`http://127.0.0.1:5000/detected-object-images/${image}`}  // 이미지 경로 설정
                            alt={`Excluded ${index}`}
                            onClick={() => handleExcludeImage(index)}
                            boxSize="150px"
                            m={2}
                            cursor="pointer"
                        />
                    ))}
                </Flex>
            </Box>
            {/* 정리된 이미지 생성 버튼을 클릭하면 handleOrganization 함수를 실행한다. */}
            <Button mt={4} onClick={handleOrganization}>정리된 이미지 생성</Button>
        </Box>
    );
};

export default SelectObjectScreen;
