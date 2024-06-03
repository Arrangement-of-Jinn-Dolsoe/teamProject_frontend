from flask import Flask, request, jsonify, send_from_directory
from ultralytics import YOLO
import os
import cv2
from flask_cors import CORS, cross_origin
import uuid
from Shelf import Shelf, create_shelf_list  # Shelf의 관한 모듈을 가져온다.
from YoloObject import YoloObject, create_yolo_list  # YoloObject의 관한 모듈을 가져온다.

app = Flask(__name__)  # Flask 앱 생성
CORS(app, resources={r"/*": {"origins": "*"}})  # CORS 설정

# YOLO 모델 로드
model = YOLO('yolov8x-seg.pt')

shelf_objects = create_shelf_list()  # 선반 객체를 저장할 리스트
yolo_objects = create_yolo_list()  # 탐지된 객체를 저장할 리스트
uploaded_image_path = None  # 업로드된 이미지 경로를 저장할 변수


@app.route('/upload', methods=['POST'])
@cross_origin()
def upload_file():
    global uploaded_image_path  # 전역 변수 사용
    if 'file' not in request.files:
        return jsonify({"error": "파일이 없습니다."}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "선택된 파일이 없습니다."}), 400

    if file:
        filename = file.filename
        filepath = os.path.join('uploads', filename)
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        file.save(filepath)

        uploaded_image_path = filepath  # 업로드된 이미지 경로 저장
        results = model(filepath)

        # 탐지된 객체 처리
        image = cv2.imread(filepath)
        yolo_objects.clear()  # 이전 탐지된 객체 초기화
        detected_images = []

        for index, r in enumerate(results[0].boxes.xyxy):  # YOLOv8에서 탐지된 객체들을 반복 처리
            x1, y1, x2, y2 = map(int, r[:4])
            cropped_img = image[y1:y2, x1:x2]
            height, width = cropped_img.shape[:2]
            new_width = int(width)
            new_height = int(height)
            cropped_img = cv2.resize(cropped_img, (new_width, new_height))

            # 이미지 파일로 저장
            img_filename = f"detected_{uuid.uuid4().hex}.jpg"
            img_path = os.path.join('upload-shelf', img_filename)
            os.makedirs(os.path.dirname(img_path), exist_ok=True)
            cv2.imwrite(img_path, cropped_img)
            detected_images.append({
                "path": img_filename,  # img_path 대신 img_filename 사용
                "width": new_width,
                "height": new_height
            })

            yolo_objects.append(
                YoloObject(r, cropped_img, img_path, new_width, new_height))

            print(f'객체 {index + 1}: {img_path}, 가로 길이: {new_width}, 세로 길이: {new_height}')

        return jsonify({"detected_images": detected_images})


@app.route('/upload-shelf', methods=['POST', 'OPTIONS'])
@cross_origin()
def upload_shelf():
    if request.method == 'OPTIONS':
        response = jsonify({'message': 'CORS preflight request'})
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        return response

    coordinates = request.json.get('coordinates')
    if coordinates:
        x1, y1, x2, y2 = coordinates
        shelf = Shelf(x1, y1, x2, y2)
        shelf_objects.append(shelf)
        return jsonify({"message": "선반 좌표가 성공적으로 업로드되었습니다.", "coordinates": coordinates}), 200
    return jsonify({"error": "좌표가 없습니다."}), 400


@app.route('/arrange-items', methods=['POST'])
@cross_origin()
def arrange_items():
    global uploaded_image_path  # 전역 변수 사용
    if not shelf_objects or not yolo_objects:
        return jsonify({"error": "선반 또는 YOLO 객체가 없습니다."}), 400

    if not uploaded_image_path:
        return jsonify({"error": "업로드된 이미지 경로가 없습니다."}), 400

    shelf = shelf_objects[0]  # 첫 번째 선반 객체 사용
    image = cv2.imread(uploaded_image_path)  # 업로드된 원본 이미지 경로 사용

    # 선반 영역을 표시. RGB에서 G(초록) 색상으로 127로 설정
    image[shelf.y1:shelf.y2, shelf.x1:shelf.x2] = [0, 127, 0]

    print(f"선반의 가로 길이: {shelf.width}")  # 선반의 너비를 출력한다.
    print(f"선반의 세로 길이: {shelf.height}")  # 선반의 높이를 출력한다.
    print(f"선반의 좌표: {shelf.x1}, {shelf.y1}, {shelf.x2}, {shelf.y2}")

    # 객체마다 선반에 추가할 수 있는지 확인하고 추가한다.
    for obj in yolo_objects:
        if shelf.add_object_in_image(image, obj):  # 선반에 물체를 추가한다.
            shelf.print_capacity()  # 선반의 용량을 출력한다.
        else:
            print(f"객체 {yolo_objects.index(obj) + 1}: 선반 영역을 초과하여 배치할 수 없습니다.")

    result_image_path = os.path.join('result', 'arranged_shelf.jpg')
    os.makedirs(os.path.dirname(result_image_path), exist_ok=True)
    cv2.imwrite(result_image_path, image)
    print(f"결과 이미지 저장 경로: {result_image_path}")

    return jsonify({"message": "정리된 이미지가 성공적으로 저장되었습니다.", "result_image": 'arranged_shelf.jpg'}), 200


@app.route('/result/<path:filename>', methods=['GET'])
@cross_origin()
def serve_result_file(filename):
    return send_from_directory('result', filename)


@app.route('/get-shelf-images', methods=['GET'])
@cross_origin()
def get_shelf_images():
    images = [os.path.basename(obj.image_path) for obj in yolo_objects]
    return jsonify(images)


@app.route('/upload-shelf/<path:filename>', methods=['GET'])
@cross_origin()
def serve_file(filename):
    return send_from_directory('upload-shelf', filename)


@app.route('/update-objects', methods=['POST'])
@cross_origin()
def update_objects():
    data = request.json
    excluded_images = data.get('excluded_images', [])

    # 제외된 이미지와 일치하는 yolo_objects를 삭제
    for excluded_image in excluded_images:
        yolo_objects[:] = [obj for obj in yolo_objects if not os.path.basename(obj.image_path) == excluded_image]
        image_path = os.path.join('upload-shelf', excluded_image)
        if os.path.exists(image_path):
            os.remove(image_path)

    return jsonify({"message": "YOLO 객체 업데이트 완료"}), 200


def main():
    if not os.path.exists('uploads'):
        os.makedirs('uploads')
    if not os.path.exists('upload-shelf'):
        os.makedirs('upload-shelf')
    if not os.path.exists('result'):
        os.makedirs('result')
    app.run(debug=True)


if __name__ == '__main__':
    main()
