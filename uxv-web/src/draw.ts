/**
 * 캔버스에 실제로 그리는 곳.
 *
 * 여기서 좌표를 직접 계산하지 않는다. 월드 좌표(m)로 생각하고,
 * 화면에 찍기 직전에 transform.ts의 worldToScreen을 통과시킨다.
 *
 * W1  격자 + 축
 * W2  차량 아이콘 + 헤딩
 *
 * (매개변수 "사용되지 않음" 경고는 구현을 채우면 사라진다 — transform.ts 주석 참고)
 */

import type { View } from './transform'
import { worldToScreen } from './transform'

export type CanvasSize = { width: number; height: number }

/**
 * 한 프레임을 그린다. MapCanvas가 매 프레임 불러준다.
 *
 * - ctx의 좌표 단위는 CSS 픽셀이다 (고해상도 보정은 MapCanvas가 이미 끝냈다)
 * - 화면 지우기도 MapCanvas가 이미 했다. 여기서는 그리기만 한다
 */
export function drawFrame(
  ctx: CanvasRenderingContext2D,
  _size: CanvasSize,
  view: View,
): void {
  
  ctx.strokeStyle = '#2b2f38'

  // 세로선
  for(let x = -100; x <= 100; x += 10){
        
    ctx.beginPath() // 그리기 시작

    // 월드좌표를 스크린좌표로 변환 
    const startPos = worldToScreen({x, y:-100}, view)
    const endPos = worldToScreen({x, y:100}, view)

    ctx.moveTo(startPos.x, startPos.y) // 시작점
    ctx.lineTo(endPos.x, endPos.y)  // 끝점 
    
    ctx.stroke() // 실제로 그림
  }

  // 가로선 
  for(let y = -100; y <= 100; y += 10){
        
    ctx.beginPath() // 그리기 시작

    // 월드좌표를 스크린좌표로 변환
    const startPos = worldToScreen({x:-100, y}, view)
    const endPos = worldToScreen({x:100, y}, view)

    ctx.moveTo(startPos.x, startPos.y) // 시작점
    ctx.lineTo(endPos.x, endPos.y)  // 끝점 
    
    ctx.stroke() // 실제로 그림
  }

}
