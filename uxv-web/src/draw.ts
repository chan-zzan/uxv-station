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
import { screenToWorld, worldToScreen } from './transform'

export type CanvasSize = { width: number; height: number }

/**
 * 한 프레임을 그린다. MapCanvas가 매 프레임 불러준다.
 *
 * - ctx의 좌표 단위는 CSS 픽셀이다 (고해상도 보정은 MapCanvas가 이미 끝냈다)
 * - 화면 지우기도 MapCanvas가 이미 했다. 여기서는 그리기만 한다
 */
export function drawFrame(ctx: CanvasRenderingContext2D, size: CanvasSize, view: View,): void {
  
  // 좌표 색깔 설정
  ctx.strokeStyle = '#2b2f38'

  // 좌상단, 우하단 좌표를 월드좌표로 변환
  const topLeft = screenToWorld({x:0, y:0}, view)
  const bottemRight = screenToWorld({x:size.width, y:size.height}, view)
  
  // 각 좌표의 최대/최소값을 10의 배수로 맞춤
  const minX = Math.ceil(topLeft.x / 10) * 10
  const maxX = Math.floor(bottemRight.x / 10) * 10
  const minY = Math.ceil(bottemRight.y / 10) * 10
  const maxY = Math.floor(topLeft.y / 10) * 10

  ctx.beginPath() // 그리기 시작

  // 세로선
  for(let x = minX; x <= maxX; x += 10){
        
    // 월드좌표를 스크린좌표로 변환 
    const startPos = worldToScreen({x, y:minY}, view)
    const endPos = worldToScreen({x, y:maxY}, view)

    ctx.moveTo(startPos.x, startPos.y) // 시작점
    ctx.lineTo(endPos.x, endPos.y)  // 끝점     
  }

  // 가로선 
  for(let y = minY; y <= maxY; y += 10){
        
    // 월드좌표를 스크린좌표로 변환
    const startPos = worldToScreen({x:minX, y}, view)
    const endPos = worldToScreen({x:maxX, y}, view)

    ctx.moveTo(startPos.x, startPos.y) // 시작점
    ctx.lineTo(endPos.x, endPos.y)  // 끝점 
  }
    
  ctx.stroke() // 실제로 그림

  // 축 색깔 설정 
  ctx.strokeStyle = '#1daf31'

  ctx.beginPath() // 그리기 시작

  // x축  
  const startPosX = worldToScreen({x:minX, y:0}, view)
  const endPosX = worldToScreen({x:maxX, y:0}, view)

  ctx.moveTo(startPosX.x, startPosX.y) // 시작점
  ctx.lineTo(endPosX.x, endPosX.y)  // 끝점 
  
  // y축
  const startPosY = worldToScreen({x:0, y:minY}, view)
  const endPosY = worldToScreen({x:0, y:maxY}, view)

  ctx.moveTo(startPosY.x, startPosY.y) // 시작점
  ctx.lineTo(endPosY.x, endPosY.y)  // 끝점
  
  ctx.stroke() // 실제로 그림
}
