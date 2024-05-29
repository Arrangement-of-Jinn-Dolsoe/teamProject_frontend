import React, { useState } from 'react'
import { Box, Button, Flex, useToast, Image } from '@chakra-ui/react'

const SelectObjectScreen = ({onSelectObject, selectedImage}) => {
    const [objectArray, setObjectArray] = useState([selectedImage]); //일시적으로 selectedImage를 넣어놓음
    const toast = useToast();




    // 백엔드에서 받아온 오브젝트를 선택하는 함수
    // const handleSelectObject = () => {

    // }


    const handleUpload = () => {
        if (objectArray.length > 0) {
            onSelectObject(objectArray);
        } else {
            toast({
                title: "오브젝트를 선택해주세요.",
                status: "error",
                duration: 2000,
                isClosable: true,
            });
        }
    }

    const ImageList = () => {
        return (
            <Box>
                {objectArray.map((object, index) => (
                    <Image key={index} src={object} alt={`object ${index}`} maxH="300px" objectFit="contain" />
                ))}
            </Box>
        )
    }


    return (
        <Box>
            <Flex>
                <ImageList object={objectArray} />
            </Flex>
            <Button>
                빼기
            </Button>
            <Button onClick={handleUpload}>
                생성
            </Button>
        </Box>
    )
}

export default SelectObjectScreen