import { useEffect, useRef, useState } from "react";

export function buildComparisonInput(scope, formId, coneIds, targetStat, targetValue) {
  const form = scope.characters.find((item) => item.id === formId);
  if (!form) throw new Error("비교할 캐릭터를 선택해 주세요.");
  const targets = targetValue === "" ? [] : [{ stat_id: targetStat, value: targetValue, relation: "minimum" }];
  if (targets.length && (!Number.isFinite(Number(targetValue)) || Number(targetValue) < 0)) throw new Error("목표값은 0 이상의 숫자여야 합니다.");
  return {
    profile: "hypothetical-maxed-static-builds",
    expected_source_checksum: scope.source_checksum,
    expected_engine_checksum: scope.engine_checksum,
    expected_prerequisites_checksum: scope.prerequisites_checksum,
    cases: coneIds.map((coneId, index) => {
      const cone = scope.light_cones.find((item) => item.id === coneId);
      if (coneId && !cone) throw new Error("선택한 광추가 DB 후보에 없습니다.");
      return {
        case_id: index === 0 ? "A" : "B", targets,
        character: {
          character_id: formId, level: 80, ascension: 6,
          equipped_light_cone_id: cone?.id ?? null,
          equipped_light_cone_level: cone ? 80 : null,
          equipped_light_cone_ascension: cone ? 6 : null,
          equipped_light_cone_superimposition: cone ? 1 : null,
          equipped_light_cone_path_matches: cone ? cone.path === form.path : null,
          equipped_relics: [], equipped_relic_sets: [],
        },
      };
    }),
  };
}

export function CurrentBuildComparison({ api, defaultOpen = false }) {
  const [scope, setScope] = useState(null);
  const [formId, setFormId] = useState("");
  const [cones, setCones] = useState(["", ""]);
  const [stat, setStat] = useState("SPD");
  const [target, setTarget] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const generation = useRef(0);
  useEffect(() => {
    setScope(null); setResult(null);
    return () => { generation.current += 1; };
  }, [api]);
  const invalidate = () => { generation.current += 1; setResult(null); setError(""); setBusy(false); };
  const loadScope = async () => {
    invalidate(); setScope(null); setBusy(true);
    const version = generation.current;
    try {
      const next = await api.currentBuildScope();
      if (generation.current !== version) return;
      if (next.profile !== "hypothetical-maxed-static-builds" || !next.characters?.length || next.live_recommendation_allowed !== false) throw new Error("DB 후보의 비교 범위를 확인할 수 없습니다.");
      setScope(next); setFormId(next.characters[0].id); setCones(["", ""]); setAccepted(false);
    } catch (failure) { if (generation.current === version) setError(failure.message); }
    finally { if (generation.current === version) setBusy(false); }
  };
  const compare = async () => {
    invalidate(); setBusy(true);
    const version = generation.current;
    try {
      const request = buildComparisonInput(scope, formId, cones, stat, target);
      const response = await api.compareCurrentBuilds(request);
      if (generation.current !== version) return;
      if (response.source_checksum !== scope.source_checksum || response.engine_checksum !== scope.engine_checksum
        || response.prerequisites_checksum !== scope.prerequisites_checksum
        || response.current_account_evaluated !== false || response.live_recommendation_allowed !== false
        || response.cases?.length !== request.cases.length
        || response.cases.some((item, index) => item.case_id !== request.cases[index].case_id || item.character_id !== formId || !Array.isArray(item.sheet?.items))) throw new Error("비교 입력과 응답이 달라 결과를 표시하지 않았습니다. DB 후보를 다시 불러오세요.");
      setResult(response);
    } catch (failure) { if (generation.current === version) setError(failure.message); }
    finally { if (generation.current === version) setBusy(false); }
  };
  const change = (setter, value) => { invalidate(); setter(value); };
  return <details className="current-build-comparison" open={defaultOpen}>
    <summary>DB 후보로 정적 빌드 비교</summary>
    <p>최대 육성 가정에서 광추 후보의 스탯 차이를 확인합니다. 실제 계정·장비 추천이나 전투 점수가 아닙니다.</p>
    <button type="button" className="secondary-button" disabled={!api || busy} onClick={loadScope}>DB 후보 불러오기</button>
    {scope && <>
      <p>후보 DB {scope.source.game_version} · 캐릭터 {scope.characters.length}종 · 광추 {scope.light_cones.length}종</p>
      <div className="current-build-controls">
        <label>비교 캐릭터<select aria-label="빌드 비교 캐릭터" value={formId} onChange={(event) => { change(setFormId, event.target.value); setCones(["", ""]); }}>{scope.characters.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        {cones.map((coneId, index) => <label key={index}>광추 {index === 0 ? "A" : "B"}<select aria-label={`비교 광추 ${index === 0 ? "A" : "B"}`} value={coneId} onChange={(event) => change(setCones, cones.map((value, i) => i === index ? event.target.value : value))}>
          <option value="">광추 없는 가정</option>
          {scope.light_cones.filter((cone) => cone.path === scope.characters.find((item) => item.id === formId)?.path).map((cone) => <option key={cone.id} value={cone.id}>{cone.name}</option>)}
        </select></label>)}
        <label>목표 스탯<select aria-label="비교 목표 스탯" value={stat} onChange={(event) => change(setStat, event.target.value)}>{scope.target_stats.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
        <label>목표 최솟값<input aria-label="비교 목표 최솟값" type="number" min="0" step="any" value={target} onChange={(event) => change(setTarget, event.target.value)} placeholder="선택 입력" /></label>
      </div>
      <label><input type="checkbox" checked={accepted} onChange={(event) => change(setAccepted, event.target.checked)} /> 캐릭터 80레벨·행적 최대, 광추 80레벨·1중첩, 유물 없는 가정으로 비교합니다.</label>
      <p>목표는 직접 입력한 조건입니다. 최적 빌드 목표를 보증하지 않으며 조건부 효과·성혼·팀 버프는 계산에서 제외합니다. 백분율 목표는 50%이면 50을 입력합니다.</p>
      <button type="button" className="primary-button" disabled={!accepted || busy} onClick={compare}>정적 빌드 비교하기</button>
    </>}
    {busy && <p role="status">DB 근거와 정적 스탯을 계산하고 있습니다.</p>}
    {error && <p role="alert">{error}</p>}
    {result && <div role="region" aria-label="정적 빌드 비교 결과">
      <h3>정적 빌드 비교 결과 · {result.source.game_version}</h3>
      {result.cases.map((item) => <section key={item.case_id}>
        <h4>후보 {item.case_id} · {item.character_name}</h4>
        {item.state !== "static-comparison-ready" ? <p>지원하지 않는 속성이 있어 목표 달성을 판정하지 않았습니다.</p> : <>
          <table><thead><tr><th>스탯</th><th>정적 계산값</th><th>첫 후보 대비</th></tr></thead><tbody>{item.sheet.items.map((metric) => <tr key={metric.stat_id}><th>{metric.label}</th><td>{metric.value}{metric.unit === "percent" ? "%" : ""}</td><td>{item.stat_deltas[metric.stat_id] == null ? "비교 불가" : Number(item.stat_deltas[metric.stat_id]).toFixed(2)}</td></tr>)}</tbody></table>
          {item.targets.length ? item.targets.map((metric) => <p key={metric.stat_id}>{metric.label}: {metric.state === "MET" ? "입력 목표 충족" : metric.state === "BELOW_TARGET" ? "입력 목표 미달" : "판정 불가"} · 정확한 계산값 {metric.exact_current_value ?? "미확인"} / 목표 {metric.exact_target_value}</p>) : <p>목표값을 입력하지 않아 달성 여부는 판정하지 않았습니다.</p>}
        </>}
        <EquipmentPrerequisites value={item.equipment_prerequisites} />
      </section>)}
      <p>팀 시너지·실전 성능·현재 장비 사용 가능성은 미평가입니다.</p>
    </div>}
  </details>;
}

function EquipmentPrerequisites({ value }) {
  if (!value) return <p>장비 발동 조건을 확인하지 못했습니다.</p>;
  const states = {
    NOT_REVIEWED: "이 장비의 조건 해석은 아직 지원하지 않습니다.",
    SOURCE_CHANGED: "DB 설명이 검토 당시와 달라 조건 판정을 보류했습니다.",
    PATH_MISMATCH: "운명의 길이 달라 광추 효과가 적용되지 않습니다.",
    SET_INCOMPLETE: "필요한 세트 개수가 부족합니다.",
  };
  return <div aria-label="장비 발동 조건 비교">
    <h4>장비 발동 조건</h4>
    {!value.equipment.length && <p>비교할 장비가 없습니다.</p>}
    {value.equipment.map((equipment) => <section key={`${equipment.kind}:${equipment.id}`}>
      <strong>{equipment.name}</strong>
      {equipment.state !== "PREREQUISITES_COMPARED" ? <p>{states[equipment.state] ?? "조건 판정 불가"}</p> : <>
        {equipment.checks.map((check) => <p key={check.check_id}>
          {check.label} {check.exact_target_value}{check.unit === "percent" ? "%" : ""} {check.relation === "maximum-exclusive" ? "미만" : "이상"}: {check.state === "MET" ? "입력 가정에서 충족" : check.state === "BELOW_TARGET" || check.state === "ABOVE_LIMIT" ? "입력 가정에서 미충족" : "입력 부족으로 미확인"}
          {check.exact_current_value != null && ` · 현재 ${check.exact_current_value}`}
        </p>)}
        <p>{equipment.remaining_conditions}</p>
      </>}
    </section>)}
    <p>고정 DB 설명에서 정리한 후보 조건입니다. 조건부 버프를 스탯에 더하지 않으며 실전 발동·최적 빌드·팀 시너지 점수를 뜻하지 않습니다.</p>
  </div>;
}
