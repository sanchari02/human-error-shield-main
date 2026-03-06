from ultralytics import YOLO

# Load your custom trained model
model = YOLO('D:\Project\human-error-shield-main\model\PPE-detection\models\safety_detector_v17\weights\best.pt')  # Update path to your .pt file

# Run validation on the dataset defined in data.yaml
# It will compare predictions vs. actual ground truth labels
metrics = model.val(data=r'D:\Project\human-error-shield-main\model\PPE-detection\dataset\data.yaml') 

print(f"--------------------------------")
print(f"Mean Average Precision (mAP@50): {metrics.box.map50:.2f}")
print(f"Precision: {metrics.box.mp:.2f}")
print(f"Recall: {metrics.box.mr:.2f}")
print(f"--------------------------------")