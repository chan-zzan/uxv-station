# uxv-stub — 가짜 차량 퍼블리셔

UE5가 완성되기 전까지 차량 자리를 대신한다.
원을 그리며 도는 차량 한 대를 흉내 내어 `VehicleState`를 **10Hz**로 발행한다.

메시지 형식은 [메시지 계약](../docs/00-message-contract.md)을 따른다.

## 단계

| | 하는 일 | 상태 |
|---|---|---|
| **A** | `VehicleState`를 만들어 자기 콘솔에 출력 | **완료** |
| **B** | 같은 값을 브리지(`ws://localhost:8000/ws/vehicle`)로 전송 | 브리지 이후 |

A→B는 다시 쓰기가 아니라 덧붙이기다. `publish_loop`이 출력 함수를 인자로 받으므로,
`print`를 `websocket.send`로 바꾸는 것 외에 운동 모델은 손대지 않는다.

## 의존성

| 패키지 | 쓰는 곳 |
|---|---|
| `websockets==16.1.1` | B단계 브리지 접속 |

A단계는 표준 라이브러리(`asyncio` / `math` / `time` / `json`)만 쓴다.

버전을 고정하는 이유: 포폴 저장소는 남이 clone해서 돌아가야 한다.
느슨하게 두면 라이브러리 breaking change 때문에 내 잘못 없이 깨진다.

> `requirements.txt`에는 주석·한글을 넣지 않는다. pip이 이 파일을 시스템 기본
> 인코딩(한국어 윈도우는 cp949)으로 읽어서 UTF-8 한글이 있으면 `UnicodeDecodeError`가 난다.

## 차량 파라미터

| 항목 | 값 |
|---|---|
| 궤적 | 반지름 20 m 원, 주기 40초 (약 3.1 m/s) |
| 시간 모델 | **시각 기반** — 상태를 시각 `t`의 함수로 직접 계산 |
| 짐벌 | `pan = 0`, `tilt = 0` 고정 (차체에 고정된 상태) |

시각 기반을 쓰는 이유: 스텁은 시뮬레이터가 아니라 **테스트 픽스처**다.
웹 화면이 이상할 때 스텁을 의심 대상에서 빼려면 재현성이 물리적 사실성보다 중요하다.
(진짜 적분 기반 운동은 작업 순서 [3] UE5 차량 물리에서 한다)

## 실행

이 환경에서 `python`은 Microsoft Store 앱 실행 별칭에 잡혀 있다.
venv를 만들 때만 `py` 런처를 쓰고, 활성화한 뒤에는 `python`이 정상 동작한다.

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python stub.py
```

**종료는 `Ctrl+C`.** 스텁은 멈추라고 할 때까지 계속 발행한다 — 실제 차량과 같다.

`Activate.ps1`이 실행 정책에 막히면 현재 세션에만 허용한다:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned
```

## 확인할 것 (A단계)

- 초당 10줄이 나오는가
- `position`이 원을 그리는가 — x·y가 20을 넘지 않고, 40초마다 시작점으로 돌아오는가
- `yaw`가 진행 방향(원의 접선)을 가리키는가, `-π ~ +π` 안에 있는가
- `velocity.linear`이 약 3.1로 일정한가
