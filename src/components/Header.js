import React from 'react';
import { Flex, Button, Text } from '@chakra-ui/react';

const Header = ({ onHomeClick }) => {
    return (

        /* 화면 상단에 헤더를 표시한다. 
        Flex컴포넌트를 사용해서 자식 컴포넌트들을 가로로 정렬한다.*/
        <Flex justifyContent="space-between" p={4} bg="#FDFFF9">
            {/* "정리의 요정 돌쇠"라는 웹페이지를 초기화하는 버튼을 설치 */}
            <Text fontWeight="bold" cursor="pointer" onClick={onHomeClick} fontSize={28}>
                정리의 요정 돌쇠
            </Text>
            {/* "Home"라는 웹페이지를 초기화하는 버튼을 설치 */}
            <Button onClick={onHomeClick} bg="#5E8D52" color="#FFFFFF" _hover={{bg:'#426D3C'}}>Home</Button>
        </Flex>
    );
};

export default Header;
