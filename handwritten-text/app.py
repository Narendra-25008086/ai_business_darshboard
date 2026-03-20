from flask import Flask, render_template, request, jsonify
import pytesseract
import cv2
import os

app = Flask(__name__)

UPLOAD_FOLDER = "uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# ✅ IMPORTANT (set your path if needed)
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# ✅ Ensure uploads folder exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/upload", methods=["POST"])
def upload():
    try:
        if "image" not in request.files:
            return jsonify({"text": "❌ No file part"})

        file = request.files["image"]

        if file.filename == "":
            return jsonify({"text": "❌ No selected file"})

        filepath = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
        file.save(filepath)

        print("✅ File saved:", filepath)

        # Read image
        img = cv2.imread(filepath)

        if img is None:
            return jsonify({"text": "❌ Image not readable"})

        # 🔥 Better preprocessing
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        blur = cv2.GaussianBlur(gray, (5, 5), 0)
        _, thresh = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

        # OCR
        text = pytesseract.image_to_string(thresh)

        print("🧠 Extracted:", text)

        if text.strip() == "":
            text = "⚠️ No text detected. Try clearer image."

        return jsonify({"text": text})

    except Exception as e:
        print("❌ Error:", str(e))
        return jsonify({"text": "Server Error: " + str(e)})

if __name__ == "__main__":
    app.run(debug=True)