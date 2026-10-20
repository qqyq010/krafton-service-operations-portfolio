import { useEffect, useRef, useState } from "react";

const LABELS = {
  "relation:action:provider": "공격 행동 제공", "relation:energy:provider": "에너지 제공",
  "relation:healing:provider": "치유 제공", "relation:hp:consumer": "HP 소모",
  "relation:hp:self": "자신의 HP 변화", "relation:protection:provider": "보호 제공",
  "relation:skill-point:consumer": "전투 스킬 포인트 소비", "relation:skill-point:provider": "전투 스킬 포인트 제공",
  "relation:skill-point:self": "자신의 전투 스킬 포인트 처리", "element:Fire": "화염 속성",
  "element:Quantum": "양자 속성", "path:Elation": "환락 운명의 길", "path:Knight": "보존 운명의 길",
  "path:Mage": "지식 운명의 길", "path:Warlock": "공허 운명의 길", "path:Warrior": "파멸 운명의 길",
};
const label = (id) => LABELS[id] ?? "미해석 기능";
const PATHS = { Warrior: "파멸", Rogue: "수렵", Mage: "지식", Shaman: "화합", Warlock: "공허", Knight: "보존", Priest: "풍요", Memory: "기억", Elation: "환락" };
const formLabel = (form, characters) => {
  const duplicate = characters.some((other) => other.id !== form.id && other.name === form.name && other.path === form.path);
  return `${form.name === "{NICKNAME}" ? "개척자" : form.name}${PATHS[form.path] ? ` · ${PATHS[form.path]}` : ""}${duplicate ? ` · 형태 ${form.id}` : ""}`;
};

export function partyComparisonInput(scope, parties) {
  const cases = parties.map((members, index) => {
    const forms = members.map((id) => scope.characters.find((form) => form.id === id));
    if (!forms.length || forms.some((form) => !form)) throw new Error("각 파티의 캐릭터를 모두 선택해 주세요.");
    if (new Set(forms.map((form) => form.identity_id)).size !== forms.length) throw new Error("같은 인물의 다른 형태를 한 파티에 중복 배치할 수 없습니다.");
    return { case_id: index === 0 ? "A" : "B", members };
  });
  return { profile: scope.profile, expected_source_checksum: scope.source_checksum,
    expected_evidence_checksum: scope.evidence_checksum, expected_engine_checksum: scope.engine_checksum, cases };
}

export function CurrentPartyComparison({ api, defaultOpen = false }) {
  const [scope, setScope] = useState(null);
  const [parties, setParties] = useState([[""], [""]]);
  const [accepted, setAccepted] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const generation = useRef(0);
  useEffect(() => { setScope(null); setResult(null); setBusy(false); return () => { generation.current += 1; }; }, [api]);
  const invalidate = () => { generation.current += 1; setResult(null); setError(""); setBusy(false); };
  const load = async () => {
    invalidate(); setScope(null); setBusy(true); const version = generation.current;
    try {
      const next = await api.currentPartyScope();
      if (generation.current !== version) return;
      if (next.profile !== "hypothetical-party-evidence-comparison" || next.review_state !== "draft" || next.live_recommendation_allowed !== false || !next.characters?.length) throw new Error("파티 비교 범위를 확인할 수 없습니다.");
      setScope(next); setAccepted(false); setParties([[""], [""]]);
    } catch (failure) { if (generation.current === version) setError(failure.message); }
    finally { if (generation.current === version) setBusy(false); }
  };
  const compare = async () => {
    invalidate(); setBusy(true); const version = generation.current;
    try {
      const request = partyComparisonInput(scope, parties);
      const response = await api.compareCurrentParties(request);
      if (generation.current !== version) return;
      if (response.source_checksum !== scope.source_checksum || response.evidence_checksum !== scope.evidence_checksum || response.engine_checksum !== scope.engine_checksum
        || response.current_account_evaluated !== false || response.live_recommendation_allowed !== false || response.effects_applied !== false
        || response.cases?.length !== request.cases.length
        || response.cases.some((item, index) => item.case_id !== request.cases[index].case_id || JSON.stringify(item.participants?.map((p) => p.form_id)) !== JSON.stringify(request.cases[index].members))) throw new Error("파티 입력과 결과 근거가 달라 표시하지 않았습니다. 다시 불러오세요.");
      setResult(response);
    } catch (failure) { if (generation.current === version) setError(failure.message); }
    finally { if (generation.current === version) setBusy(false); }
  };
  const changeParty = (index, members) => { invalidate(); setParties(parties.map((old, i) => i === index ? members : old)); };
  return <details className="current-build-comparison" open={defaultOpen}>
    <summary>DB 후보로 파티 관계 비교</summary>
    <p>파티원을 바꿀 때 어떤 기능의 근거가 연결되거나 사라지는지 확인합니다. 실전 발동·성능 순위는 계산하지 않습니다.</p>
    <button type="button" className="secondary-button" disabled={!api?.currentPartyScope || busy} onClick={load}>파티 비교 자료 불러오기</button>
    {scope && <>
      <p>후보 DB {scope.source.game_version} · 실제 계정과 무관한 파티 가정</p>
      <div className="party-case-inputs">{parties.map((members, index) => <fieldset key={index} className="current-build-controls"><legend>파티 {index === 0 ? "A" : "B"}</legend>
        {members.map((id, slot) => <label key={slot}>파티원 {slot + 1}<select aria-label={`파티 ${index === 0 ? "A" : "B"} 캐릭터 ${slot + 1}`} value={id} onChange={(e) => changeParty(index, members.map((old, i) => i === slot ? e.target.value : old))}>
          <option value="">캐릭터 선택</option>{scope.characters.map((form) => <option key={form.id} value={form.id}>{formLabel(form, scope.characters)}</option>)}
        </select><button type="button" disabled={members.length === 1} aria-label={`파티 ${index === 0 ? "A" : "B"} 캐릭터 ${slot + 1} 제거`} onClick={() => changeParty(index, members.filter((_, i) => i !== slot))}>제거</button></label>)}
        <button type="button" disabled={members.length >= 32} onClick={() => changeParty(index, [...members, ""])}>파티 {index === 0 ? "A" : "B"} 파티원 추가</button>
      </fieldset>)}</div>
      <label><input type="checkbox" checked={accepted} onChange={(e) => { invalidate(); setAccepted(e.target.checked); }} /> 보유 여부·성혼·강화 형태의 실제 선택·장비를 반영하지 않는 후보 관계 비교임을 확인했습니다.</label>
      <button type="button" className="primary-button" disabled={!accepted || busy} onClick={compare}>파티 관계 비교하기</button>
    </>}
    {busy && <p role="status">파티와 현재 원본의 관계 근거를 대조하고 있습니다.</p>}
    {error && <p role="alert">{error}</p>}
    {result && <div role="region" aria-label="파티 관계 비교 결과">
      <h3>파티 관계 비교 결과 · {result.source.game_version}</h3>
      <p>연결 없음은 조합 불가를 뜻하지 않습니다. 근거 수로 우열을 매기거나 버프를 적용하지 않습니다.</p>
      {result.cases.map((item) => <section key={item.case_id}><h4>파티 {item.case_id}</h4>
        {item.participants.map((person) => <section key={person.form_id}><strong>{person.name}</strong>
          {person.source_state !== "SOURCE_UNCHANGED" ? <p>{person.source_state === "SOURCE_CHANGED" ? "현재 원본이 바뀌어 이전 관계 근거를 사용하지 않았습니다." : "현재 캐릭터의 관계 근거가 아직 없습니다."}</p>
          : !person.bindings.length ? <p>검토된 명시적 요구 조건이 없습니다. 모든 조건을 만족한다는 뜻은 아닙니다.</p>
          : person.bindings.map((binding) => <div key={`${binding.fact_id}:${binding.marker_id}`}>
            <p>{binding.state === "UNKNOWN_BINDING" ? "발동 조건 해석 미완료" : binding.state === "PRESSURE_NOT_EVALUATED" ? "자원 경쟁 가능성 기록 · 실제 충돌 미판정" : binding.state === "LINKED_EVIDENCE" ? "다른 파티원에서 연결 근거 확인" : "검토 자료에서 연결 근거를 찾지 못함"}</p>
            {binding.capabilities.map((cap) => <p key={cap.capability_id}>{label(cap.capability_id)}: {cap.providers.map((p) => p.name).join(", ") || "연결 근거 미확인"}</p>)}
            <details><summary>근거 식별자</summary><code>{binding.fact_id}</code></details>
          </div>)}
        </section>)}
        {item.case_id !== result.cases[0].case_id && <><h4>파티 A 대비 달라진 연결</h4>
          {item.added_links.map((edge, i) => <p key={`a${i}`}>추가: {edge.provider_name} → {edge.owner_name} · {label(edge.capability_id)}</p>)}
          {item.removed_links.map((edge, i) => <p key={`r${i}`}>제거: {edge.provider_name} → {edge.owner_name} · {label(edge.capability_id)}</p>)}
          {!item.added_links.length && !item.removed_links.length && <p>검토 범위의 연결 변화가 없습니다.</p>}
        </>}
      </section>)}
    </div>}
  </details>;
}
