    public int GetRequiredGoldForNextLevel()
    {
        return CurrentLevel * BaseProgressPerLevel;
    }

    /// <summary>
    /// 다음 상점을 열기 위해 필요한 이번 런의 누적 획득 골드다.
    /// 단계별 요구량은 50, 100, 150...이고 누적 목표는 50, 150, 300...이 된다.
    /// </summary>
    internal int GetRequiredRunGoldForNextLevel()
    {
        long level = CurrentLevel;
        long target = (long)GetRequiredGoldForNextLevel() * (level + 1L) / 2L;

        return target >= int.MaxValue ? int.MaxValue : (int)target;
    }

    internal int GetShopEntryCost()
    {
        long level = Mathf.Max(1, CurrentLevel);
        long cost = BaseShopEntryCost + level + level * level / 2L;
        return cost >= int.MaxValue ? int.MaxValue : (int)cost;
    }

    internal bool CanOpenShop(int collectedRunGold, int currentGold)
    {
        if (!CanAffordLevelUp(collectedRunGold))
            return false;

        long remainingGold = (long)currentGold - GetShopEntryCost();
        return remainingGold >= Mathf.Max(1, safeGoldMargin);
    }
