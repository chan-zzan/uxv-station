import { MapCanvas } from './MapCanvas'
import type { View } from './transform'

// W1 임시 뷰. 1m = 8px, 월드 원점을 화면 (400, 300)에 둔다.
// 스텁이 반지름 20m 원을 도니까 화면에서 지름 320px짜리 원이 된다.
// 원점을 캔버스 한가운데로 옮기는 것은 캔버스 크기를 알아야 하므로 나중에.
const VIEW: View = {
  scale: 8,
  origin: { x: 400, y: 300 },
}

function App() {
  return (
    <>
      <main className="map-area">
        <MapCanvas view={VIEW} />
      </main>

      <aside className="side-panel">
        <h1>uxv-station</h1>
        <p className="dim">텔레메트리 패널 — W2</p>
      </aside>
    </>
  )
}

export default App
