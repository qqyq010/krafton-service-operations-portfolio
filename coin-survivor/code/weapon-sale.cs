// InventoryUiService.cs — 현재 구현 발췌 (2026-10-01)
// 판매 결과와 실제 무기 제거를 연결하는 부분
    private void ApplySellResult(InventorySellResult result)
    {
        playerCurrencyCore.ModifyGold(result.SellPrice);

        if (result.ShouldPublishItemSoldEvent)
        {
            GameEventBus.PublishItemSold(result.ItemID);
        }

        if (result.ShouldPublishWeaponRemovedEvent)
        {
            GameEventBus.PublishWeaponRemoved(result.ItemID, result.LevelIndex);
        }

        if (result.ShouldPublishPassiveChangedEvent)
        {
            GameEventBus.PublishPassiveInventoryChanged();
            PlaySellSfx();
        }
    }
