from typing import List
import cv2
import cv2.typing
from YoloObject import YoloObject


class Shelf:
    """
    선반 클래스
    x1: 좌측 상단 x 좌표
    y1: 좌측 상단 y 좌표
    x2: 우측 하단 x 좌표
    y2: 우측 하단 y 좌표
    """
    def __init__(self, x1: int, y1: int, x2: int, y2: int):
        self.x1 = min(x1, x2)  # 좌측 상단 x 좌표
        self.y1 = min(y1, y2)  # 좌측 상단 y 좌표
        self.x2 = max(x1, x2)  # 우측 하단 x 좌표
        self.y2 = max(y1, y2)  # 우측 하단 y 좌표
        self.width = self.x2 - self.x1  # 선반의 너비
        self.height = self.y2 - self.y1  # 선반의 높이

        self.index = 0  # 물체를 배치할 곳의 인덱스
        self.MARGIN = 5  # 물체와의 간격

    def __str__(self):
        return f'x1: {self.x1}, y1: {self.y1}, x2: {self.x2}, y2: {self.y2}'

    def __check_placement(self, obj: YoloObject) -> bool:
        # 물체의 너비와 높이가 남는 공간보다 작거나 같으면
        if obj.width <= self.width - self.index and obj.height <= self.height:
            return True
        else:
            return False

    def __check_position(self, obj: YoloObject) -> list:
        # 물체를 배치할 위치를 계산한다.
        좌측상단x = self.x1 + self.index  # 좌측상단x = 선반의 좌측상단x + 인덱스
        좌측상단y = self.y2 - obj.height  # 좌측상단y = 선반의 우측하단y - 물체의 높이
        우측하단x = self.x1 + self.index + obj.width  # 우측하단x = 선반의 좌측상단x + 인덱스 + 물체의 너비
        우측하단y = self.y2  # 우측하단y = 선반의 우측하단y
        return [좌측상단x, 좌측상단y, 우측하단x, 우측하단y]

    def __add_index(self, obj: YoloObject):
        # 물체를 배치한 후 인덱스를 추가한다.
        self.index += obj.width
        self.index += self.MARGIN

    def print_capacity(self):
        # 선반의 용량을 출력한다.
        print(f"선반의 용량: {self.index}/{self.width}")

    def add_object_in_image(self,
                            image: cv2.typing.MatLike,
                            obj: YoloObject) -> bool:
        # 물체를 선반에 추가한다.
        if self.__check_placement(obj):
            좌측상단x, 좌측상단y, 우측하단x, 우측하단y = self.__check_position(obj)
            """
            필요 없어 보이는 코드 같아요
            # 물체가 선반 영역을 초과하지 않도록 확인
            # if 좌측상단y < 0:
            #     좌측상단y = 0
            #     우측하단y = obj.height

            # if 좌측상단x < 0 or 우측하단x > image.shape[1] or 좌측상단y < 0 or 우측하단y > image.shape[0]:
            #     print(f"객체 {index + 1}: 선반 영역을 초과하여 배치할 수 없습니다.")
            #     return False
            """

            # 객체의 이미지를 전체 그림 중 선반 위치에 추가한다.
            image[좌측상단y:우측하단y, 좌측상단x:우측하단x] = obj.image
            self.__add_index(obj)
            return True
        else:
            return False


def create_shelf_list() -> List[Shelf]:
    """Shelf 클래스의 빈 리스트를 만드는 함수"""
    return list()
