/**
 * 캔버스 배관.
 *
 * "무엇을 그릴지"는 draw.ts가 정하고, 여기는 "그릴 자리와 시점"만 만든다.
 * 유니티로 치면 Update를 불러주는 엔진 쪽이고, draw.ts가 그 안의 스크립트다.
 *
 * 하는 일
 *   1. 캔버스 버퍼 크기를 표시 크기 × devicePixelRatio 로 맞춘다 (고해상도에서 안 뭉개지게)
 *   2. 매 프레임 캔버스를 지우고 drawFrame을 부른다
 *   3. 창 크기가 바뀌어도 1을 다시 맞춘다
 */

import { useEffect, useRef } from 'react'
import { drawFrame } from './draw'
import type { View } from './transform'

type Props = {
  /** 화면 확대율 — 1미터가 몇 px인가. 원점은 여기서 캔버스 중앙으로 잡는다 */
  scale: number
}

export function MapCanvas({ scale }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // 렌더 루프는 한 번만 만들어 계속 돈다. 그 안에서 최신 scale을 읽기 위한 통로.
  const scaleRef = useRef(scale)
  scaleRef.current = scale

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let frameId = 0

    const render = () => {
      const dpr = window.devicePixelRatio || 1
      const width = canvas.clientWidth
      const height = canvas.clientHeight

      // 표시 크기가 달라졌을 때만 버퍼를 다시 잡는다 (매번 하면 화면이 깜빡인다)
      const bufferWidth = Math.round(width * dpr)
      const bufferHeight = Math.round(height * dpr)
      if (canvas.width !== bufferWidth || canvas.height !== bufferHeight) {
        canvas.width = bufferWidth
        canvas.height = bufferHeight
      }

      // 이 줄 덕분에 이후 그리기 좌표를 CSS 픽셀로 쓸 수 있다.
      // (dpr 배율은 여기서 한 번만 처리하고 draw.ts는 신경 쓰지 않는다)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, width, height)

      // 월드 원점을 캔버스 한가운데에 둔다.
      // 캔버스 크기를 아는 곳이 여기뿐이라 view를 여기서 완성한다.
      // (W4에서 지도 클릭 → screenToWorld 를 할 때도 같은 view가 필요하다)
      const view: View = {
        scale: scaleRef.current,
        origin: { x: width / 2, y: height / 2 },
      }

      drawFrame(ctx, { width, height }, view)

      frameId = requestAnimationFrame(render)
    }

    frameId = requestAnimationFrame(render)

    // 컴포넌트가 사라질 때 루프를 멈춘다. 안 멈추면 유령 루프가 계속 돈다.
    return () => cancelAnimationFrame(frameId)
  }, [])

  return <canvas ref={canvasRef} className="map-canvas" />
}
