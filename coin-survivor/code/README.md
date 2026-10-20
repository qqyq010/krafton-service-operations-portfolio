# 사례에 첨부한 코드

Unity C# 원본에서 관련 메서드만 가져왔습니다. 전체 클래스가 아니어서 각 파일을 단독으로 실행할 수는 없습니다.

| 코드 | 볼 부분 | 관련 사례 |
|---|---|---|
| [무기 판매 처리](weapon-sale.cs) | 판매한 무기의 ID·레벨을 제거 이벤트로 전달 | [판매 후에도 남은 공격](../cases/sold-weapon-keeps-attacking.md) |
| [획득 반경 계산](magnet-pickup-range.cs) | 기본 반경에 로비 업그레이드 배율 적용 | [자석 효과](../cases/magnet-pickup-range.md) |
| [상점 진입 판단](shop-entry-costs.cs) | 누적 획득 목표와 진입비 차감 후의 잔액 확인 | [구매·확장 비용](../cases/shop-and-bag-costs.md) |

획득 반경 파일은 로비 업그레이드 계산 부분입니다. 자석 패시브의 수정 코드 전체를 담고 있지는 않습니다.

## 원본과 발췌일

| 파일 | 원본 클래스 | 가져온 날짜 |
|---|---|---|
| 무기 판매 처리 | `InventoryUiService.cs` | 2026-10-01 |
| 획득 반경 계산 | `PlayerStatManager.cs` | 2026-09-30 |
| 상점 진입 판단 | `PlayerLevelManager.cs` | 2026-09-30 |

각 날짜에 가져온 구현의 일부이며 수정 전후 비교 파일은 아닙니다.
