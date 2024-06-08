import os
import uuid
import cv2
from flask import jsonify
from ultralytics import YOLO
from Shelf import Shelf, create_shelf_list  # Shelf의 관한 모듈을 가져온다.
from YoloObject import YoloObject, create_yolo_list  # YoloObject의 관한 모듈을 가져온다.


class MyYOLOApp():
    """
    YOLO 모델을 사용하는 클래스
    """
    def __init__(self):
        MODEL = "yolov8x-seg.pt"
        self.model = YOLO(model=MODEL)
        self.shelf_objects = create_shelf_list()  # 선반 객체를 저장할 리스트
        self.yolo_objects = create_yolo_list()  # 탐지된 객체를 저장할 리스트
        self.image_path: str = ""
        self.results = None

    def run_model(self, image_path: str = ""):
        self.image_path = image_path
        self.results = self.model(image_path)
        return self.results

    def add_shelf(self, x1: int, y1: int, x2: int, y2: int):
        """
        선반을 추가한다.
        """
        self.shelf_objects.append(Shelf(x1, y1, x2, y2))

    def cut_image(self):
        """
        객체를 탐지하여 자르고
        감지된 이미지를 json 형식으로 반환한다.
        """
        # 탐지된 객체 처리
        image = cv2.imread(self.image_path)
        detected_images = []

        # results의 첫번째 이미지에서 boxes의 xyxy를 가져온다.
        xyxy = self.results[0].boxes.xyxy

        for index, r in enumerate(xyxy):
            # region r에서 x1, y1, x2, y2를 가져와서 이미지를 자른다.
            x1, y1, x2, y2 = map(int, r[:4])
            cropped_img = image[y1:y2, x1:x2]
            height, width = cropped_img.shape[:2]
            new_width = int(width)
            new_height = int(height)
            cropped_img = cv2.resize(cropped_img, (new_width, new_height))
            # endregion

            # 이미지 파일로 저장
            # uuid를 사용하여 중복되지 않는 파일 이름 생성
            img_filename = f"detected_{uuid.uuid4().hex}.jpg"

            img_path = os.path.join('upload-shelf', img_filename)
            os.makedirs(os.path.dirname(img_path), exist_ok=True)  # 폴더가 없으면 생성
            cv2.imwrite(img_path, cropped_img)  # 이미지 저장
            self.yolo_objects.append(
                YoloObject(r, cropped_img, img_path, new_width, new_height))

            detected_images.append({
                "path": self.yolo_objects[index].image_path,
                "width": self.yolo_objects[index].width,
                "height": self.yolo_objects[index].height
            })

            print(f'객체 {index + 1}: {img_path}, 가로 길이: {new_width}, 세로 길이: {new_height}')

        return jsonify({"detected_images": detected_images})

    def arrange_shelf(self):
        """
        물체를 선반에 배치한다.
        """
        # 예외 처리
        if not self.shelf_objects or not self.yolo_objects:
            raise ValueError("선반 또는 YOLO 객체가 없습니다.")

        if not self.image_path:
            raise ValueError("업로드된 이미지 경로가 없습니다.")

        image = cv2.imread(self.image_path)  # 업로드된 원본 이미지 경로 사용

        # region 선반 영역을 표시. RGB에서 G(초록) 색상으로 127로 설정, 선반의 좌표, 너비, 높이를 출력한다.
        for index, shelf in enumerate(self.shelf_objects):
            image[shelf.y1:shelf.y2, shelf.x1:shelf.x2] = [0, 127, 0]
            print(f"선반 {index + 1} ", end="")
            print("-" * 50)
            print(f"선반의 가로 길이: {shelf.width}")  # 선반의 너비를 출력한다.
            print(f"선반의 세로 길이: {shelf.height}")  # 선반의 높이를 출력한다.
            print(f"선반의 좌표: {shelf.x1}, {shelf.y1}, {shelf.x2}, {shelf.y2}")
        # endregion

        # region 선반을 확인하고 물체를 추가할 수 있는지 확인하는 루프를 시작한다.
        # 선반을 차례대로 반복한다.
        for shelf_index, shelf in enumerate(self.shelf_objects):
            # 물체를 차례대로 반복한다.
            for object_index, obj in enumerate(self.yolo_objects):
                # 물체가 추가된 것인지 확인하고 아니다면 추가한다.
                if not obj.appended and shelf.add_object_in_image(image, obj):
                    obj.appended = True
                    print(f"객체 {object_index + 1}: 선반 {shelf_index + 1}에 추가합니다.")
                # 선반에 물체를 추가할 수 없으면 다음 물체로 넘어간다.
                else:
                    print(f"객체 {object_index + 1}: 선반 {shelf_index + 1}에 추가할 수 없습니다.")
            print("다음 선반으로 넘어갑니다.")
        print("모든 객체를 선반에 배치했습니다.")
        # endregion

        return image
