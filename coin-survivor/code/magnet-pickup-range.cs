    private float GetUpgradedMagnetRange()
    {
        float tunedBaseRange = Mathf.Max(0f, baseMagnetRange);

        if (baseData == null || upgradeStat == null || baseData.magnetRange <= 0f)
            return tunedBaseRange;

        // 현재 런타임 기준 반경은 유지하면서 로비 업그레이드의 배율만 반영한다.
        float upgradeMultiplier = upgradeStat.magnetRange / baseData.magnetRange;
        return tunedBaseRange * Mathf.Max(0f, upgradeMultiplier);
    }
