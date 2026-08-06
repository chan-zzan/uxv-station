import json
import math
import time

VEHICLE_ID = "uxv-01" # 차량 ID(식별자)


CENTER = (0, 0) # 원의 중심
RADIUS = 20.0 # 차량이 움직일 원의 반지름(미터)
PERIOD = 40.0 # 1바퀴 회전 주기(초)

ANGULAR_VELOCITY = 2 * math.pi / PERIOD # 각속도 = PERIOD초에 2π 회전


# 정규화 함수 : 각도를 입력하면 -π ~ π 사이의 값으로 정규화
def normalize_angle(rad):
    
    # 각도를 0~2π 범위 내의 값으로 변경
    rad %= 2*math.pi

    # 각도를 -π ~ π 범위 내의 값으로 변경
    if rad > math.pi:
        rad -= 2*math.pi    

    return rad

# t초일때의 각도 반환 함수 : 각도 = 각속도 * 시간
def calc_angle(t):
    return ANGULAR_VELOCITY * t

# t초일때의 차량 위치 반환 함수
def calc_position(t):
    angle = calc_angle(t)

    x = CENTER[0] + RADIUS * math.cos(angle)
    y = CENTER[1] + RADIUS * math.sin(angle)

    return (x,y)

# t초일때의 차량 yaw 회전 방향 반환 함수
def calc_yaw(t):

    # 방향계산 : yaw = 현재각도 + π/2
    yaw = calc_angle(t) + math.pi/2

    # 정규화 시킨 값을 반환
    return normalize_angle(yaw)

# 차량 상태를 반환하는 함수
# 순수 함수: 같은 입력을 넣으면 같은 출력이 나오는 함수 + 외부 변수의 상태를 바꾸지 않음.
def make_state(t, start_time):

    (x,y) = calc_position(t)
    yaw = calc_yaw(t)

    return {
        "type": "VehicleState",
        "vehicle_id": VEHICLE_ID,
        "timestamp": start_time + t,
        "position": {"x": x, "y": y, "z": 0.0},        
        "attitude": {"yaw": yaw, "pitch": 0.0, "roll": 0.0},        
        "velocity": {"linear": ANGULAR_VELOCITY * RADIUS, "angular": ANGULAR_VELOCITY},        
        "gimbal": {"pan": 0.0, "tilt": 0.0},        
        "mode": "AUTO",        
    }


def publish_loop(send):

    start_time = time.time() # 시작 시간
    loop_start_time = time.monotonic() # 루프 시작 시간

    count = 0
    
    while True:        
        current_time = time.monotonic() # 현재 시간        
        elapsed_time = current_time - loop_start_time # 지나간 시간

        send(json.dumps(make_state(elapsed_time, start_time))) # 해당 시간의 값을 호출

        time.sleep(0.1) # 0.1초 대기

        count += 1
        if count > 10:
            break


publish_loop(print)

# print(make_state(0, 40))
# print(make_state(0, 50))
# print(make_state(10, 40))
#print(make_state(10))
#print(make_state(20))
#print(make_state(30))