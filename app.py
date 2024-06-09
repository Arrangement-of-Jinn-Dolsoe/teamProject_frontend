from flask import Flask, request, jsonify, send_from_directory
import os
import cv2
from flask_cors import CORS, cross_origin
from MyYOLOApp import MyYOLOApp

# Flask 앱 생성
app = Flask(__name__)

# CORS 설정
CORS(app, resources={r"/*": {"origins": "*"}})


@app.route('/upload', methods=['POST'])
@cross_origin()
def upload_file():
    # region 파일이 있는지 없는지 검사하는 부분
    if 'file' not in request.files:
        return jsonify({"error": "파일이 없습니다."}), 400

    file = request.files['file']
    print(f"파일: {file}")

    if file.filename == '':
        return jsonify({"error": "선택된 파일이 없습니다."}), 400
    # endregion

    if file:
        filename = file.filename  # 파일 이름을 가져온다.
        filepath = os.path.join('uploads', filename)  # 파일 경로를 만든다.
        os.makedirs(os.path.dirname(filepath), exist_ok=True)  # 폴더가 없으면 생성한다.
        file.save(filepath)  # 파일을 저장한다.

        # YoloApp 객체 생성
        global yolo_app
        yolo_app = MyYOLOApp()
        yolo_app.run_model(filepath)  # 모델 실행
        json_data = yolo_app.cut_image()

        return json_data


# 선반의 좌표를 추가하는 엔드포인트
@app.route('/add-shelf-coordinates', methods=['POST', 'OPTIONS'])
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
        yolo_app.add_shelf(x1, y1, x2, y2)  # 선반 추가
        return jsonify({"message": "선반 좌표가 성공적으로 업로드되었습니다.", "coordinates": coordinates}), 200
    return jsonify({"error": "좌표가 없습니다."}), 400


@app.route('/arrange-items', methods=['POST'])
@cross_origin()
def arrange_items():
    try:
        # 정리된 물체의 이미지를 가져온다.
        image = yolo_app.arrange_shelf()
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    # 결과 이미지 경로 result/arranged_shelf.jpg
    result_image_path = os.path.join('result', 'arranged_shelf.jpg')
    os.makedirs(os.path.dirname(result_image_path), exist_ok=True)  # 폴더가 없으면 생성
    cv2.imwrite(result_image_path, image)
    print(f"결과 이미지 저장 경로: {result_image_path}")

    return jsonify({"message": "정리된 이미지가 성공적으로 저장되었습니다.", "result_image": 'arranged_shelf.jpg'}), 200


@app.route('/result/<path:filename>', methods=['GET'])
@cross_origin()
def serve_result_file(filename):
    return send_from_directory('result', filename)


@app.route('/get-yolo-images', methods=['GET'])
@cross_origin()
def get_shelf_images():
    image_names = yolo_app.get_detected_image_names()
    return jsonify(image_names)


@app.route('/detected-object-images/<path:filename>', methods=['GET'])
@cross_origin()
def serve_file(filename):
    return send_from_directory('detected-object-images', filename)


@app.route('/update-objects', methods=['POST'])
@cross_origin()
def update_objects():
    """
    제외된 이미지를 받아서 yolo_objects에서 제외한다.
    """
    data = request.json
    excluded_images = data.get('excludedImages', [])
    for image in excluded_images:
        print(f"제외된 이미지: {image}")

    # 제외된 이미지와 일치하는 yolo_objects를 삭제
    message = yolo_app.remove_objects(excluded_images)

    return jsonify({"message": message}), 200


def main():
    # Flask 앱 실행
    app.run(debug=True)


if __name__ == '__main__':
    main()
