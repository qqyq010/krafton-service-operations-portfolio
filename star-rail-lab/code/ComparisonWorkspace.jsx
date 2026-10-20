import { useState } from "react";
import { ArrowRight, ChartBar, GitBranch, ShieldCheck, SlidersHorizontal } from "@phosphor-icons/react";
import { CurrentBuildComparison } from "./CurrentBuildComparison";
import { CurrentPartyComparison } from "./CurrentPartyComparison";
import { CurrentPartyEffects } from "./CurrentPartyEffects";
import "./comparison-workspace.css";

const views = [
  ["build", "01", "캐릭터·광추 비교", "광추를 바꾸면 정적 스탯과 입력 목표가 어떻게 달라질까요?", ChartBar],
  ["party", "02", "파티 관계 비교", "파티원을 교체했을 때 어떤 요구 조건의 근거가 연결될까요?", GitBranch],
  ["effects", "03", "조건별 효과 비교", "직접 지정한 발동 조건에서 지원되는 수치는 어떻게 바뀔까요?", SlidersHorizontal],
];

export function ComparisonWorkspace({ api }) {
  const [view, setView] = useState("home");
  return <section className={`comparison-workspace ${view !== "home" ? "is-comparing" : ""}`} aria-label="비교 실험실">
    <div className="lab-context"><span><i />가정 입력 · 실제 계정 미사용</span><span>고정 DB 근거 / 로컬 계산</span></div>
    <header className="lab-hero">
      <div><span className="eyebrow">STAR RAIL LAB / COMPARISON WORKSPACE</span>
        <h1>바꾸기 전에,<br />조건과 근거부터 비교하세요.</h1>
        <p>캐릭터와 장비, 파티 조건을 직접 정하고 계산 가능한 차이를 확인합니다.<br />
          입력이 부족하거나 지원하지 않는 규칙은 결과와 구분해 표시합니다.</p>
      </div>
      <aside className="lab-principle"><ShieldCheck size={32} /><h2>계산한 것만 설명합니다</h2>
        <p>정적 수치와 관계 근거를 비교합니다.<br />실전 점수·최적 파티·현재 장비의 사용 가능성을 보증하지 않습니다.</p>
        <span>Scanner 연결 없이 사용 가능</span>
      </aside>
    </header>
    <nav className="lab-tabs" aria-label="비교 실험 선택">
      {[["home", "시작하기"], ...views.map(([id,, title]) => [id, title]), ["limits", "근거와 지원 범위"]].map(([id, label]) =>
        <button key={id} type="button" aria-pressed={view === id} onClick={() => setView(id)}>{label}</button>)}
    </nav>
    {view === "home" && <div className="lab-overview">
      <div className="lab-cards">{views.map(([id, number, title, description, Icon]) =>
        <button className="lab-card" key={id} onClick={() => setView(id)}>
          <div><Icon size={28} /><span>{number}</span></div><h2>{title}</h2><p>{description}</p>
          <strong>비교 시작 <ArrowRight /></strong>
        </button>)}</div>
      <div className="lab-steps"><h2>결과를 확인하는 순서</h2>
        <ol><li><b>01. 입력 조건 선택</b><span>실제 보유 여부와 분리한 가정을 직접 지정</span></li>
          <li><b>02. 같은 기준으로 계산</b><span>DB·계산 근거를 고정해 A/B를 비교</span></li>
          <li><b>03. 차이와 제한 확인</b><span>계산된 값, 미달 조건, 미지원 항목을 함께 확인</span></li></ol>
      </div>
    </div>}
    <div className="lab-panel" hidden={view !== "build"}><CurrentBuildComparison api={api} defaultOpen /></div>
    <div className="lab-panel" hidden={view !== "party"}><CurrentPartyComparison api={api} defaultOpen /></div>
    <div className="lab-panel" hidden={view !== "effects"}><CurrentPartyEffects api={api} defaultOpen allowScanner={false} /></div>
    {view === "limits" && <section className="lab-limits">
      <div><span className="eyebrow">EVIDENCE & LIMITS</span><h2>결과가 말해 주는 것과,<br />아직 알 수 없는 것</h2>
        <p>가정으로 계산한 값을 실제 계정의 성능으로 바꾸어 해석하지 않습니다.</p></div>
      <table><thead><tr><th>확인 항목</th><th>이 화면에서 제공하는 범위</th><th>판정하지 않는 범위</th></tr></thead><tbody>
        <tr><th>캐릭터·광추</th><td>선택한 최대 육성 가정의 정적 스탯과 입력 목표 비교</td><td>실제 육성 상태, 유물 최적화, 전투 피해량</td></tr>
        <tr><th>파티 관계</th><td>검토된 요구 조건과 선택한 파티 구성의 연결 근거</td><td>근거 개수에 따른 우열, 최적 조합 순위</td></tr>
        <tr><th>파티 효과</th><td>지원되는 효과와 직접 지정한 발동 조건의 계산</td><td>자동 전투·회전, 미지원 스킬, 실전 발동 보장</td></tr>
        <tr><th>데이터 출처</th><td>각 결과에 표시된 고정 DB 버전과 근거 검사</td><td>최신 게임 버전 전체 지원</td></tr>
        <tr><th>계정과 Scanner</th><td>이 실험은 계정 기록 없이 가정 입력을 사용</td><td>전체 실스캔 수용, 현재 계정 활성화</td></tr>
      </tbody></table>
      <div className="lab-boundary"><ShieldCheck size={24} /><p><b>모르는 값은 채우지 않습니다.</b><br />근거가 바뀌었거나 입력이 부족한 경우 계산을 보류하고, 판정할 수 없는 이유를 표시합니다.</p></div>
    </section>}
    <footer className="lab-footer"><span>비교 실험실 · UI 2026.10.20</span><span>가정 데이터 / 실전 성능 미평가</span></footer>
  </section>;
}
