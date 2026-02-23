import os
import numpy as np
import cv2
import pickle
from insightface.app import FaceAnalysis

# Initialize face analysis model
face_app = FaceAnalysis(name="buffalo_l", providers=["CPUExecutionProvider"])
face_app.prepare(ctx_id=0, det_size=(640, 640))

# Storage path for face encodings
DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
ENCODINGS_FILE = os.path.join(DATA_DIR, "encodings.pkl")

os.makedirs(DATA_DIR, exist_ok=True)


def load_encodings():
    if os.path.exists(ENCODINGS_FILE):
        with open(ENCODINGS_FILE, "rb") as f:
            return pickle.load(f)
    return {}


def save_encodings(data):
    with open(ENCODINGS_FILE, "wb") as f:
        pickle.dump(data, f)


def get_face_embedding(image_bytes):
    """Extract face embedding from image bytes."""
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        return None, "Invalid image"

    faces = face_app.get(img)
    if len(faces) == 0:
        return None, "No face detected"
    if len(faces) > 1:
        return None, "Multiple faces detected"

    return faces[0].embedding, None


def enroll_face(name, image_bytes):
    """Enroll a new face."""
    embedding, error = get_face_embedding(image_bytes)
    if error:
        return False, error

    encodings = load_encodings()
    if name not in encodings:
        encodings[name] = []
    encodings[name].append(embedding)
    save_encodings(encodings)
    return True, f"{name} enrolled successfully"


def recognize_face(image_bytes):
    """Recognize a face from image."""
    embedding, error = get_face_embedding(image_bytes)
    if error:
        return None, error

    encodings = load_encodings()
    if not encodings:
        return None, "No enrolled faces"

    best_match = None
    best_score = 0

    for name, embeddings in encodings.items():
        for stored in embeddings:
            score = np.dot(embedding, stored) / (
                np.linalg.norm(embedding) * np.linalg.norm(stored)
            )
            if score > best_score:
                best_score = score
                best_match = name

    if best_score > 0.4:
        return {"name": best_match, "confidence": round(float(best_score), 3)}, None

    return None, "Face not recognized"