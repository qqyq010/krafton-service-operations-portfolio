# 실제 프로젝트 코드 발췌

Codex와 진행한 개인 프로젝트 작업본에서 선별한 코드입니다. AI가 코드 작성과 수정을 수행했습니다.
본인의 기여는 기능 요구, 실사용 오류와 기록 전달, 수정 방향과 확인 기준 제시입니다.

| 파일 | 읽어 볼 부분 |
| --- | --- |
| [ComparisonWorkspace.jsx](ComparisonWorkspace.jsx) | 비교 목적 선택과 설명, 탭 진입과 지원 범위 안내 |
| [comparison-workspace.css](comparison-workspace.css) | A와 B 결과 배치와 글자 및 버튼 가독성 |
| [CurrentBuildComparison.jsx](CurrentBuildComparison.jsx) | 입력 구성, 응답 일치 검사, 입력 변경 시 결과 제거 |
| [CurrentPartyComparison.jsx](CurrentPartyComparison.jsx) | 파티 중복 거부와 연결 근거 차이 표시 |
| [canonical.py](canonical.py) | JSON 중복 키 및 비정상 수치 거부, 결정적인 직렬화와 지문 생성 |

[원본 상대 경로와 SHA256](source-manifest.json)

위 파일은 전체 앱 중 일부입니다. CurrentPartyEffects 등 의존 모듈과 DB, 계정 파일 및 실행 설정은 포함하지 않아 독립 실행되지 않습니다.
원본 DB나 외부 패키지 소스를 공개하는 묶음도 아닙니다.

[입력과 결과 처리 사례](../cases/input-and-result-validation.md) / [실행 확인 기록](../verification.md)
