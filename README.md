# 차선호 서비스운영 포트폴리오

크래프톤 서비스운영 지원을 위해 게임 개발 참여와 AI 활용 경험을 정리한 저장소입니다.
**Coin Survivor의 수정 후 확인 사례**와 **Star Rail Lab의 실제 앱 비교 화면**을 함께 볼 수 있습니다.

## 먼저 볼 자료

| 프로젝트 | 경험 | 바로 보기 |
| --- | --- | --- |
| Star Rail Lab | 개인 도구의 사용 목적과 기능 요구, AI와 제작, 실행 오류 보고와 확인 기준 | [소개와 본인 기여](star-rail-lab/README.md) / [실제 화면과 결과](star-rail-lab/workflow.md) |
| Coin Survivor | 상점과 인벤토리 개발 참여, QA 피드백 반영, 무기 판매 후 동작 확인 | [프로젝트 소개](coin-survivor/README.md) / [무기 판매 사례](coin-survivor/cases/sold-weapon-keeps-attacking.md) |

## Star Rail Lab

붕괴 스타레일에서 캐릭터와 장비, 파티 조건을 바꿔 수치와 관계 근거를 비교하려는 개인 프로젝트입니다.
Codex를 활용해 제작했습니다. 사용자는 필요한 기능과 수용 기준을 제시하고 실행 중 문제를 보고했으며, AI는 코드 변경과 UI 구성, 자동 검사, 화면 캡처를 수행했습니다.

![Star Rail Lab 비교 실험실 시작 화면](star-rail-lab/screens/01-purpose.png)

2026년 10월 20일 실제 로컬 앱에서 캡처한 2560 x 1440 화면입니다.
실제 계정 기록 대신 직접 지정한 가정 입력을 사용하며 고정 DB 후보에 따른 계산을 보여 줍니다.
계정 전체 스캔, 장비 최적화, 실전 성능과 전체 전투 시뮬레이션은 추가 검증이 남아 있습니다.

- [입력부터 결과 해석까지 화면 5장](star-rail-lab/workflow.md)
- [잘못된 결과 노출을 막는 처리](star-rail-lab/cases/input-and-result-validation.md)
- [실제 프로젝트 코드 발췌](star-rail-lab/code/README.md)
- [실행 확인과 검증 범위](star-rail-lab/verification.md)

## Coin Survivor

상점과 인벤토리를 맡은 팀 프로젝트입니다. 아이템 회전과 가방 확장, 합성 기능을 제안하고 개발에 참여했습니다.
구현과 코드 분석에는 AI 도구를 활용했습니다. QA 팀원의 피드백을 받아 담당 기능을 수정하고 직접 플레이해 결과를 확인했습니다.

![Coin Survivor 플레이 화면](coin-survivor/playtest/combat.jpg)

위 이미지는 기존 플레이 영상의 일반 전투 장면입니다.

- [판매한 무기가 계속 공격하는 문제](coin-survivor/cases/sold-weapon-keeps-attacking.md)
- [당시 수정 후 확인 기록](coin-survivor/playtest/weapon-sale-test-results.md)
- [구매와 가방 확장 비용 조정안](coin-survivor/cases/shop-and-bag-costs.md)
- [자석 획득 범위의 재플레이 확인](coin-survivor/cases/magnet-pickup-range.md)
- [코드 발췌](coin-survivor/code/README.md) / [밸런스 시트](coin-survivor/balance/coin-survivor-balance.xlsx)

[Steam 출시 페이지](https://store.steampowered.com/app/5034980/Coin_Survivor/) / [STOVE 출시 페이지](https://store.onstove.com/ko/games/105249)

## 자료의 범위

Star Rail Lab은 개인 프로젝트이고 Coin Survivor는 팀 프로젝트입니다.
본인의 기능 요구와 판단, AI의 구현 지원, 당시 직접 확인한 결과, 추가 검증이 필요한 내용을 구분했습니다.
두 프로젝트의 코드 폴더는 설명을 위한 발췌 자료이며 이 저장소만으로 전체 앱을 실행할 수는 없습니다.

[전체 파일 안내](CONTENTS.md) / [출처와 권리 안내](THIRD_PARTY_NOTICES.md)
