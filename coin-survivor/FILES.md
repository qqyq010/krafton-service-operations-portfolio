# 파일 안내

무기 판매 사례는 **[문제와 수정](cases/sold-weapon-keeps-attacking.md) → [테스트 기록](playtest/weapon-sale-test-results.md) → [코드](code/weapon-sale.cs)** 순서로 볼 수 있습니다.

## 소개

| 문서 | 내용 |
|---|---|
| [프로젝트 소개](README.md) | 맡은 일과 대표 사례 |
| [코드 안내](code/README.md) | 원본 클래스와 발췌한 부분 |
| [밸런스 시트 안내](balance/README.md) | 12개 탭의 내용과 입력 방법 |

## 사례와 테스트

| 문서 | 내용 | 함께 볼 자료 |
|---|---|---|
| [무기 판매 버그](cases/sold-weapon-keeps-attacking.md) | 가방에서 사라진 무기가 계속 공격한 문제 | [테스트 기록](playtest/weapon-sale-test-results.md) · [코드](code/weapon-sale.cs) |
| [무기 판매 테스트](playtest/weapon-sale-test-results.md) | 판매·구매·합성을 직접 확인한 결과 | [버그 사례](cases/sold-weapon-keeps-attacking.md) |
| [자석 효과](cases/magnet-pickup-range.md) | 획득 범위 차이가 작았던 문제와 재플레이 결과 | [반경 계산](code/magnet-pickup-range.cs) |
| [한글 깨짐](cases/korean-text-display.md) | 업그레이드 제목·설명 표시 수정 | 보조 UI 사례 |
| [구매·확장 비용](cases/shop-and-bag-costs.md) | 아이템 구매 후 확장비가 부족했던 상황과 조정안 | [밸런스 시트](balance/coin-survivor-balance.xlsx) · [진입 조건](code/shop-entry-costs.cs) |
| [진화 무기 조정](cases/evolved-weapon-balance.md) | 공격 반경·분열 단계·이펙트 조정 | [조정 전 화면](playtest/evolved-weapons-before-adjustment.jpg) |

## 코드와 계산표

| 파일 | 내용 |
|---|---|
| [무기 판매 처리](code/weapon-sale.cs) | ID·레벨을 무기 제거 이벤트에 전달 |
| [획득 반경 계산](code/magnet-pickup-range.cs) | 기본 반경에 로비 업그레이드 배율 적용 |
| [상점 진입 판단](code/shop-entry-costs.cs) | 누적 획득 목표와 진입비 차감 후 잔액 확인 |
| [밸런스 조정안](balance/coin-survivor-balance.xlsx) | 비용·성장·전투 수치와 측정 양식 |

## 플레이 이미지

| 파일 | 장면 |
|---|---|
| [일반 전투](playtest/combat.jpg) | 2026년 7월 전투 화면 |
| [진화 무기 조정 전](playtest/evolved-weapons-before-adjustment.jpg) | 큰 오라와 여러 무기 궤적이 화면을 차지하던 구간 |

일반 전투 사진은 게임 소개용입니다. 판매 버그의 수정 결과는 테스트 기록에서 확인할 수 있습니다.
