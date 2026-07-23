# 메시지 계약

> **이 프로젝트의 뼈대.** 웹·브리지·스텁·UE5가 모두 이 계약만 바라본다.
> 완벽하게 만들려 하지 말 것. 바뀌는 것을 전제로 하며, 바뀌는 과정 자체가 나중에 쓸 이야기다.
>
> 출처: [uxv-station-roadmap.md](uxv-station-roadmap.md) 7장

---

## 설계 원칙

- **v0는 WebSocket 직결**로 가되, **메시지 구조는 처음부터 ROS2로 옮기기 쉽게** 설계한다.
- 좌표는 전부 **로컬 좌표(미터)**. 위경도는 v1 후반 또는 v2에서 변환 계층을 얹는다.
- 각도는 전부 **라디안(rad)**.

---

## 차량 → 관제기 (10Hz)

### VehicleState

```
VehicleState
  timestamp
  position   : x, y, z            (로컬 좌표, m)
  attitude   : yaw, pitch, roll   (rad)
  velocity   : linear, angular
  gimbal     : pan, tilt          (rad)
  mode       : IDLE | AUTO | EMERGENCY_STOP | LINK_LOST
```

### Heartbeat

```
Heartbeat
  timestamp
```

하트비트가 일정 시간 끊기면 관제기는 **통신두절**로 표시하고, 차량은 **안전 정지**로 전환한다.
타임아웃 값은 구현 시점에 정하고, 정했으면 [decisions/](decisions/)에 ADR로 남긴다.

---

## 관제기 → 차량

### SetWaypoints

```
SetWaypoints
  points : [(x, y), ...]
```

### SetGimbalTarget

```
SetGimbalTarget
  type   : POINT | ENTITY
  value  : (x, y, z) 또는 entity_id
```

- `POINT` — L0 지점 지향. 지도에서 좌표를 클릭.
- `ENTITY` — L1 표적 지정 추적. 화면 속 개체를 클릭. **v1은 여기까지.**

### EmergencyStop

```
EmergencyStop
```

---

## 변경 이력

계약이 바뀌면 여기에 한 줄씩 적는다. 왜 바꿨는지가 나중에 케이스 스터디 재료가 된다.

| 날짜 | 변경 | 이유 |
|---|---|---|
| — | 초안 작성 | 로드맵 7장에서 분리 |
