# 판매와 상점 진입 코드

두 사례와 관련된 Unity C# 메서드입니다. 전체 클래스가 아니므로 각 파일을 단독으로 실행할 수는 없습니다.

| 코드 | 확인할 내용 | 관련 사례 |
| --- | --- | --- |
| [무기 판매 처리](weapon-sale.cs) | 판매한 무기의 ID와 레벨을 제거 이벤트에 전달하는 부분 | [무기 판매 오류 확인](../cases/sold-weapon-keeps-attacking.md) |
| [상점 진입 판단](shop-entry-costs.cs) | 상점 진입 비용을 차감한 뒤의 잔액을 확인하는 부분 | [구매와 가방 확장 비용](../cases/shop-and-bag-costs.md) |

판매 처리 코드는 AI가 보완했고, 저는 수정된 동작을 Unity Play Mode에서 확인했습니다.

| 파일 | 원본 클래스 | 발췌일 |
| --- | --- | --- |
| 무기 판매 처리 | InventoryUiService.cs | 2026-10-01 |
| 상점 진입 판단 | PlayerLevelManager.cs | 2026-09-30 |

[Coin Survivor 소개](../README.md)
