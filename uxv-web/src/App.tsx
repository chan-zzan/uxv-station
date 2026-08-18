import { MapCanvas } from './MapCanvas'

// 지도 확대율 — 1m = 8px. 스텁이 반지름 20m 원을 도니까 화면에서 지름 320px이 된다.
// 원점(월드 0,0이 화면 어디인가)은 캔버스 크기를 알아야 해서 MapCanvas가 정한다.
const MAP_SCALE = 8

function App() {

  return (
    <>
      <main className="map-area">
        <MapCanvas scale={MAP_SCALE} />
      </main>

      <aside className="side-panel">
        <h1>uxv-station</h1>
        <p className="dim">텔레메트리 패널 — W2</p>
      </aside>
    </>
  )
}



export default App
