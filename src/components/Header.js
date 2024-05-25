import React from 'react';
import { Flex, Button, Text } from '@chakra-ui/react';

const Header = ({ onHomeClick }) => {
    return (
        <Flex justifyContent="space-between" p={4} bg="#FDFFF9">
            <Text fontWeight="bold" cursor="pointer" onClick={onHomeClick} fontSize={28}>
                웹 앱 이름
            </Text>
            <Button onClick={onHomeClick} bg="#5E8D52" color="#FFFFFF" _hover={{bg:'#426D3C'}}>Home</Button>
        </Flex>
    );
};

export default Header;
