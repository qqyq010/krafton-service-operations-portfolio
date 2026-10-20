// RotationWorkbench: 입력 변경, 과거 응답 차단, 계산 자료 확인
import {useRef, useState} from "react";
import {ComparisonPicker, ComparisonPortrait} from "./ComparisonPicker";

const num=x=>Math.round(x??0).toLocaleString("ko-KR");
const labels={atk_percent:"공격력 비율",def_percent:"방어력 비율",flat_atk:"고정 공격력",speed:"속도",crit_rate:"치명타 확률",crit_dmg:"치명타 피해",energy_regen:"에너지 회복 효율",damage_bonus:"일반 피해 보너스",healing_bonus:"치유량 보너스"};
const controls={duration_av:"전투 길이 (AV)",enemy_count:"적 수",enemy_level:"적 레벨",resistance:"속성 내성",initial_energy_ratio:"시작 에너지 비율",initial_sp:"시작 SP",reserve_sp:"스파키가 남길 SP",samples:"난수 표본 수",seed:"난수 seed"};

export function RotationWorkbench({api}) {
  const [scope,setScope]=useState(null),[party,setParty]=useState([]),[conditions,setConditions]=useState({});
  const [bonuses,setBonuses]=useState({}),[result,setResult]=useState(null),[error,setError]=useState(""),[busy,setBusy]=useState(false);
  const generation=useRef(0);
  const invalidate=()=>{generation.current++;setResult(null);setError("");setBusy(false);};
  async function load(){
    invalidate();setBusy(true);const version=generation.current;
    try{
      const [catalog,combat]=await Promise.all([api.equipmentRecommendationScope(),api.elationRotationScope()]);
      if(version!==generation.current)return;
      setScope({...combat,characters:catalog.characters});setParty(catalog.default_party);
      setConditions(combat.defaults);setBonuses(combat.bonuses);
    }catch(e){if(version===generation.current)setError(e.message);}
    finally{if(version===generation.current)setBusy(false);}
  }
  async function calculate(){
    invalidate();setBusy(true);const version=generation.current;
    try{
      const data=await api.evaluateElationRotation({...conditions,bonuses,members:party,expected_checksum:scope.checksum});
      if(version!==generation.current)return;
      if(data.checksum!==scope.checksum)throw Error("계산 자료가 변경되었습니다.");
      setResult(data);
    }catch(e){if(version===generation.current)setError(e.message);}
    finally{if(version===generation.current)setBusy(false);}
  }
