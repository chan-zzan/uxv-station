import math
import time

VEHICLE_ID = "uxv-01" # 차량 ID(식별자)

RADIUS = 20.0 # 차량이 움직일 원의 반지름(미터)
PERIOD = 40.0 # 1바퀴 회전 주기(초)

# 차량 위치 반환 함수
def make_state(t):
    center = (0, 0)
    angular_velocity = 2 * math.pi / PERIOD  # PERIOD초에 2pi 라디안 회전

    angle = angular_velocity * t
    x = center[0] + RADIUS * math.cos(angle)
    y = center[1] + RADIUS * math.sin(angle)

    return {
        "type": "VehicleState",
        "vehicle_id": VEHICLE_ID,
        "timestamp": time.time(),
        "position": {"x": x, "y": y, "z": 0.0},        
    }

print(make_state(0))    # t=0초에서의 
print(make_state(10))   # t=10초에서의 위치
print(make_state(20))   # t=20초에서의 위치
print(make_state(30))   # t=30초에서의 위치