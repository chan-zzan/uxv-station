/**
 * 캔버스에 실제로 그리는 곳.
 *
 * 여기서 좌표를 직접 계산하지 않는다. 월드 좌표(m)로 생각하고,
 * 화면에 찍기 직전에 transform.ts의 worldToScreen을 통과시킨다.
 *
 */

import type { VehicleState } from './contract'
import type { View } from './transform'
import { screenToWorld, worldToScreen } from './transform'

export type CanvasSize = { width: number; height: number }
export type Bounds = {minX: number; maxX: number; minY: number; maxY: number;}


const GRID_STEP_M = 10 // 격자 간격
const VEHICLE_RADIUS_M = 1.5 // 원 반지름(차량을 나타내는 원의 크기)
const HEADING_LENGTH_M = 4 // 헤딩 선 길이(차량의 방향을 나타내는 선의 길이)

const GRID_COLOR = '#2b2f38' // 격자 색
const AXIS_COLOR = '#1daf31' // 축 색
const VEHICLE_COLOR = '#b9e615' // 차량 색
const HEADING_COLOR = '#ee1111' // 헤딩 선 색

/**
 * 한 프레임을 그린다. MapCanvas가 매 프레임 불러준다.
 *
 * - ctx의 좌표 단위는 CSS 픽셀이다 (고해상도 보정은 MapCanvas가 이미 끝냈다)
 * - 화면 지우기도 MapCanvas가 이미 했다. 여기서는 그리기만 한다
 */
export function drawFrame(ctx: CanvasRenderingContext2D, size: CanvasSize, view: View, state: VehicleState): void {
    
  const bounds = calcBounds(size, view)

  drawGrid(ctx, view, bounds)
  drawAxis(ctx, view, bounds)
  drawVehicle(ctx, view, state)
}

export function calcBounds(size: CanvasSize, view: View): Bounds {

  // 좌상단, 우하단 좌표를 월드좌표로 변환
  const topLeft = screenToWorld({x:0, y:0}, view)
  const bottomRight = screenToWorld({x:size.width, y:size.height}, view)
  
  // 각 좌표의 최대/최소값을 GRID_STEP_M의 배수로 맞춤
  const minX = Math.ceil(topLeft.x / GRID_STEP_M) * GRID_STEP_M
  const maxX = Math.floor(bottomRight.x / GRID_STEP_M) * GRID_STEP_M
  const minY = Math.ceil(bottomRight.y / GRID_STEP_M) * GRID_STEP_M
  const maxY = Math.floor(topLeft.y / GRID_STEP_M) * GRID_STEP_M

  return {minX, maxX, minY, maxY}
}

// 격자 그리기 함수
export function drawGrid(ctx: CanvasRenderingContext2D, view: View, bounds: Bounds): void {

  // 좌표 색깔 설정
  ctx.strokeStyle = GRID_COLOR

  ctx.beginPath() // 그리기 시작

  // 세로선
  for(let x = bounds.minX; x <= bounds.maxX; x += GRID_STEP_M){
        
    // 월드좌표를 스크린좌표로 변환 
    const startPos = worldToScreen({x, y:bounds.minY}, view)
    const endPos = worldToScreen({x, y:bounds.maxY}, view)

    ctx.moveTo(startPos.x, startPos.y) // 시작점
    ctx.lineTo(endPos.x, endPos.y)  // 끝점     
  }

  // 가로선 
  for(let y = bounds.minY; y <= bounds.maxY; y += GRID_STEP_M){
        
    // 월드좌표를 스크린좌표로 변환
    const startPos = worldToScreen({x:bounds.minX, y}, view)
    const endPos = worldToScreen({x:bounds.maxX, y}, view)

    ctx.moveTo(startPos.x, startPos.y) // 시작점
    ctx.lineTo(endPos.x, endPos.y)  // 끝점 
  }
    
  ctx.stroke() // 실제로 그림
  
}

// 축 그리기 함수
export function drawAxis(ctx: CanvasRenderingContext2D, view: View, bounds: Bounds): void {

  // 축 색깔 설정 
  ctx.strokeStyle = AXIS_COLOR

  ctx.beginPath() // 그리기 시작

  // x축  
  const startPosX = worldToScreen({x:bounds.minX, y:0}, view)
  const endPosX = worldToScreen({x:bounds.maxX, y:0}, view)

  ctx.moveTo(startPosX.x, startPosX.y) // 시작점
  ctx.lineTo(endPosX.x, endPosX.y)  // 끝점 
  
  // y축
  const startPosY = worldToScreen({x:0, y:bounds.minY}, view)
  const endPosY = worldToScreen({x:0, y:bounds.maxY}, view)

  ctx.moveTo(startPosY.x, startPosY.y) // 시작점
  ctx.lineTo(endPosY.x, endPosY.y)  // 끝점
  
  ctx.stroke() // 실제로 그림

}

// 차량 그리기 함수
export function drawVehicle(ctx: CanvasRenderingContext2D, view: View, state: VehicleState): void {

  // 채우기 색깔 설정 
  ctx.fillStyle = VEHICLE_COLOR

  ctx.beginPath() // 그리기 시작

  // 차량 위치
  const vehiclePos = worldToScreen({x:state.position.x, y:state.position.y}, view)

  // 전부 화면 좌표(px)
  ctx.arc(vehiclePos.x, vehiclePos.y, VEHICLE_RADIUS_M * view.scale, 0, 2 * Math.PI)   

  ctx.fill() // 채우기 

  // 선 색깔 설정 
  ctx.strokeStyle = HEADING_COLOR

  ctx.beginPath() // 그리기 시작

  // 차량 앞 점 위치
  const frontPointX = state.position.x + HEADING_LENGTH_M * Math.cos(state.attitude.yaw)
  const frontPointY = state.position.y + HEADING_LENGTH_M * Math.sin(state.attitude.yaw)
  const frontPointToScreen = worldToScreen({x:frontPointX, y:frontPointY}, view)

  ctx.moveTo(vehiclePos.x, vehiclePos.y)
  ctx.lineTo(frontPointToScreen.x, frontPointToScreen.y)

  ctx.stroke() // 실제로 그림

}
