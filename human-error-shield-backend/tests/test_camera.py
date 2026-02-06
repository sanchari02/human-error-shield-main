import cv2

print("Testing camera access...")
cap = cv2.VideoCapture(1)

if not cap.isOpened():
    print("❌ Camera not accessible!")
    for i in range(3):
        cap = cv2.VideoCapture(i)
        if cap.isOpened():
            print(f"Camera found at index {i}")
            break
else:
    print("Camera opened successfully")

ret, frame = cap.read()
if ret:
    print(f"Frame captured: {frame.shape}")
    cv2.imshow("Test", frame)
    cv2.waitKey(20000) 
else:
    print("Failed to read frame")

cap.release()
cv2.destroyAllWindows()
