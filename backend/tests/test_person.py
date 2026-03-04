import cv2
from ultralytics import YOLO

print("Testing person detection...")

try:
    person_model = YOLO('yolov8n.pt')
    print("✅ Model loaded successfully")
except Exception as e:
    print(f"❌ Failed to load model: {e}")
    exit()

cap = cv2.VideoCapture(1) 

if not cap.isOpened():
    print("❌ Camera not accessible")
    exit()

print("✅ Camera opened. Press 'q' to quit")

while True:
    ret, frame = cap.read()
    if not ret:
        break

    results = person_model(frame, conf=0.3, classes=[0], verbose=False)

    num_persons = 0
    if results and len(results) > 0 and results[0].boxes is not None:
        num_persons = len(results[0].boxes)
        
        for box in results[0].boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(frame, f"Person {box.conf[0]:.2f}", (x1, y1-10),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)
    
    cv2.putText(frame, f"Persons detected: {num_persons}", (10, 30),
               cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
    
    cv2.imshow("Person Detection Test", frame)
    
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
