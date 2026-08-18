/**
 * 월드(계약) 좌표 ↔ 화면(canvas) 좌표 변환.
 *
 * 계약 문서의 "변환은 가장자리에서만 한다"가 여기다.
 * 좌표계 차이를 아는 파일은 이것 하나뿐이어야 하고,
 * 나머지 코드는 전부 계약 좌표계(ENU, m)로만 생각한다.
 *
 * ┌─ 구현 전까지 VS Code가 매개변수에 "선언됐지만 사용되지 않음" 경고를 낸다.
 * │  tsconfig.app.json의 noUnusedParameters 때문이고, 구현을 채우면 사라진다. 정상.
 * └─ 개발 서버(npm run dev)는 타입 검사를 하지 않으므로 그대로 돌아간다.
 */

import type { Vec2 } from './contract'

/**
 * 지도의 뷰(카메라) 상태. 이 두 값이 변환의 전부다.
 */
export type View = {
  /** 화면 확대율 — 1미터가 몇 px인가 */
  scale: number
  /** 월드 원점 (0, 0)이 찍히는 화면 좌표 (px) */
  origin: Vec2
}

/**
 * 월드 좌표(m, ENU) → 화면 좌표(px, canvas)
 *
 * 맞춰야 할 어긋남 셋:
 *   1. 단위   m → px                          → scale
 *   2. 원점   월드 (0,0)이 화면의 어디인가      → origin
 *   3. y 방향 ENU는 y가 북(위)으로 증가,
 *            canvas는 y가 아래로 증가          → 부호
 *
 * 육안 검산: 월드 (20, 0)은 원점의 오른쪽, (0, 20)은 원점의 위쪽에 찍혀야 한다.
 */
export function worldToScreen(world: Vec2, view: View): Vec2 {
  
  const screenX = view.origin.x + view.scale * world.x
  const screenY = view.origin.y - view.scale * world.y

  return { x: screenX, y: screenY }
}

/**
 * 화면 좌표(px) → 월드 좌표(m)
 * worldToScreen의 역함수. 지도 클릭 → 웨이포인트(W4)에서 쓴다.
 *
 * 검산: screenToWorld(worldToScreen(p, v), v) 가 p로 돌아와야 한다.
 *       (부동소수 오차 범위 안에서)
 */
export function screenToWorld(screen: Vec2, view: View): Vec2 {
  
  const worldX = (screen.x - view.origin.x) / view.scale
  const worldY = (screen.y - view.origin.y) / -view.scale
  

  return { x: worldX, y: worldY }
}
