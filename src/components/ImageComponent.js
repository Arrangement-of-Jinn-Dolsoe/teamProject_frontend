// import React, { useState, useEffect } from 'react';
// import { Image } from '@chakra-ui/react';

// const ImageComponent = ({selectedImage}) => {
//     const [windowSize, setWindowSize] = useState({
//         width: window.innerWidth,
//         height: window.innerHeight
//     });

//     useEffect(() => {
//         const handleResize = () => {
//             setWindowSize({
//                 width: window.innerWidth,
//                 height: window.innerHeight
//             });
//         };

//         window.addEventListener('resize', handleResize);

//         return () => {
//             window.removeEventListener('resize', handleResize);
//         };
//     }, []);

//     return (
//         <Image src={selectedImage} w={windowSize.width} h={windowSize.height} />
//     );
// };

// export default ImageComponent;
