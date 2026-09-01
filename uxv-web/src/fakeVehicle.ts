import type { VehicleState, Vec2 } from './contract'

const VEHICLE_ID = "uxv-01" // 차량 ID(식별자)

const CENTER = {x:0, y:0}   // 원의 중심
const RADIUS = 20.0     // 차량이 움직일 원의 반지름(미터)
const PERIOD = 40.0     // 1바퀴 회전 주기(초)    
const ANGULAR_VELOCITY = 2 * Math.PI / PERIOD // 각속도 = PERIOD초에 2π 회전    


// 차량 상태를 반환하는 함수
// 순수 함수: 같은 입력을 넣으면 같은 출력이 나오는 함수 + 외부 변수의 상태를 바꾸지 않음.
export function makeState(t: number, startTime: number): VehicleState { 
    
    const pos = calcPosition(t)
    const yaw = calcYaw(t)

    return {
        type: 'VehicleState',
        vehicle_id: VEHICLE_ID,
        timestamp: startTime + t,
        position:{x:pos.x, y:pos.y, z:0.0},
        attitude:{yaw:yaw, pitch:0.0, roll:0.0},
        velocity:{linear:ANGULAR_VELOCITY * RADIUS, angular:ANGULAR_VELOCITY},
        gimbal:{pan:0.0, tilt:0.0},
        mode:'AUTO'
    }
}

// t초일때의 차량 위치 반환 함수
export function calcPosition(t: number): Vec2 {

    const angle = calcAngle(t)

    const x = CENTER.x + RADIUS * Math.cos(angle)
    const y = CENTER.y + RADIUS * Math.sin(angle)

    return {x:x, y:y}
}

// t초일때의 각도 반환 함수 : 각도 = 각속도 * 시간
export function calcAngle(t: number): number {

    return ANGULAR_VELOCITY * t
}

// t초일때의 차량 yaw 회전 방향 반환 함수
export function calcYaw(t: number): number {

    // 방향계산
    const yaw = calcAngle(t) + Math.PI/2

    return normalizeAngle(yaw)
}

// 정규화 함수 : 각도를 입력하면 -π ~ π 사이의 값으로 정규화
export function normalizeAngle(rad: number): number {

    // 각도를 -2π~2π 범위 내의 값으로 변경
    rad = rad % (2 * Math.PI)

    // 각도를 -π ~ π 범위 내의 값으로 변경
    if (rad > Math.PI){

        rad -= 2 * Math.PI
    }    
    else if(rad < -Math.PI){
        rad += 2 * Math.PI
    }

    return rad
}