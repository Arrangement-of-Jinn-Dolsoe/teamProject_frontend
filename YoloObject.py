from typing import List
import cv2
import cv2.typing


class YoloObject:
    """
    탐지된 객체를 관리하는 클래스
    object: 탐지된 객체 정보
    image: 객체 이미지
    image_path: 이미지 경로
    width: 이미지 너비
    height: 이미지 높이

    show(): 객체 이미지를 보여준다.
    """
    def __init__(self, object, image, image_path, width, height):
        self.object = object
        self.image: cv2.typing.MatLike = image
        self.image_path: str = image_path
        self.width: int = width
        self.height: int = height
        self.appended = False

    def show(self):
        cv2.imshow("Object", self.image)
        cv2.waitKey(1)
        cv2.destroyAllWindows()


def create_yolo_list() -> List[YoloObject]:
    """YoloObject 클래스의 빈 리스트를 만드는 함수"""
    return list()
