/**
 * 메시지 계약 — docs/00-message-contract.md 를 TypeScript 타입으로 옮긴 것.
 *
 * 규약
 *   - 필드명은 snake_case (ROS2 관습). 웹에서 camelCase로 바꾸지 않는다.
 *   - 길이는 m, 각도는 rad. 도(°) 변환은 화면에 찍을 때만 한다.
 *   - 좌표계는 로컬 ENU — x=동, y=북, z=위. yaw 0 = 동쪽(+x), 반시계가 양수.
 *
 * 계약이 바뀌면 문서를 먼저 고치고 이 파일을 맞춘다. 반대 방향은 안 된다.
 */

export type Vec2 = { x: number; y: number }
export type Vec3 = { x: number; y: number; z: number }

export type VehicleMode = 'IDLE' | 'AUTO' | 'EMERGENCY_STOP' | 'LINK_LOST'

// ── 차량 → 관제기 (10Hz) ───────────────────────────────────────────

export type VehicleState = {
  type: 'VehicleState'
  vehicle_id: string
  /** Unix 시각 (초, 소수점 포함) */
  timestamp: number
  /** m, 로컬 ENU */
  position: Vec3
  attitude: {
    /** rad, -π ~ +π */
    yaw: number
    /** rad, -π/2 ~ +π/2 — 축마다 범위가 다르다 (ADR 0004) */
    pitch: number
    /** rad, -π ~ +π */
    roll: number
  }
  velocity: {
    /** m/s */
    linear: number
    /** rad/s */
    angular: number
  }
  /** rad, 차체 기준 상대각. 월드 기준이 필요하면 yaw + pan */
  gimbal: {
    pan: number
    tilt: number
  }
  mode: VehicleMode
}

// ── 관제기 → 차량 ─────────────────────────────────────────────────

export type SetWaypoints = {
  type: 'SetWaypoints'
  vehicle_id: string
  /** m, 로컬 ENU */
  points: Vec2[]
}

export type SetGimbalTarget = {
  type: 'SetGimbalTarget'
  vehicle_id: string
  /** POINT = L0 지점 지향, ENTITY = L1 표적 추적. v1은 L1까지 */
  target_type: 'POINT' | 'ENTITY'
  value: Vec3 | { entity_id: string }
}

export type EmergencyStop = {
  type: 'EmergencyStop'
  vehicle_id: string
}

// ── 묶음 ──────────────────────────────────────────────────────────
// 최상위 type 필드로 갈라지는 유니온. 받은 메시지를 type으로 분기하면
// 그 가지 안에서는 해당 타입으로 좁혀진다.

export type VehicleMessage = VehicleState
export type OperatorMessage = SetWaypoints | SetGimbalTarget | EmergencyStop
