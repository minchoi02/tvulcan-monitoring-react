import {useEffect,useMemo,useState} from 'react';
import {Activity,Database,HardDrive,LayoutDashboard,LogOut,Menu,Monitor,Network,RefreshCw,Search,Server,Settings,ShieldCheck,Wifi, XCircle} from 'lucide-react';
import MetricCard from './components/MetricCard';
import StatusBadge from './components/StatusBadge';
import ProgressBar from './components/ProgressBar';
import ResourceGauge from './components/ResourceGauge';
import LineChart from './components/LineChart';

const initial=[
{id:1,name:'WEB-01',ip:'192.168.10.21',role:'WEB / INTRANET',cpu:34,memory:58,disk:42,network:18,status:'정상',uptime:'18일 04:22:15'},
{id:2,name:'WEB-02',ip:'192.168.10.22',role:'WEB / API',cpu:67,memory:71,disk:61,network:34,status:'주의',uptime:'12일 08:17:41'},
{id:3,name:'APP-01',ip:'192.168.10.31',role:'APPLICATION',cpu:28,memory:49,disk:38,network:12,status:'정상',uptime:'31일 19:31:08'},
{id:4,name:'DB-01',ip:'192.168.10.41',role:'POSTGRESQL / DB',cpu:73,memory:82,disk:74,network:29,status:'위험',uptime:'42일 03:10:52'},
{id:5,name:'FILE-01',ip:'192.168.10.51',role:'FILE / BACKUP',cpu:21,memory:44,disk:69,network:8,status:'정상',uptime:'64일 12:42:02'}];
const services=[['인트라넷','WEB-01','84ms','정상'],['자동차 접수','WEB-02','126ms','주의'],['AOS API','APP-01','71ms','정상'],['PostgreSQL','DB-01','198ms','위험'],['백업 시스템','FILE-01','91ms','정상']];
const menus=['유선접수','견적서','T-벌컨(VULCAN)','잔존물회수의뢰','티벌컨 물품재고관리','물품접수','기술자문','파워트레인'];
function App(){
 const [servers,setServers]=useState(initial),[selectedId,setSelectedId]=useState(1),[query,setQuery]=useState(''),[last,setLast]=useState(new Date()),[mobile,setMobile]=useState(false);
 useEffect(()=>{const t=setInterval(()=>{setServers(s=>s.map(x=>({...x,cpu:clamp(x.cpu+rand(-4,4)),memory:clamp(x.memory+rand(-2,2)),network:clamp(x.network+rand(-3,3))})));setLast(new Date())},5000);return()=>clearInterval(t)},[]);
 const current=servers.find(x=>x.id===selectedId)||servers[0];
 const visible=useMemo(()=>servers.filter(x=>`${x.name} ${x.ip} ${x.role}`.toLowerCase().includes(query.toLowerCase())),[servers,query]);
 const avg=k=>Math.round(servers.reduce((a,x)=>a+x[k],0)/servers.length);
 return <div className="app">
  <header className="hero"><div className="hero-inner"><div><div className="brand">T-벌컨(VULCAN)</div><div className="brand-sub">OFF-LINE접수 · SYSTEM MONITORING</div></div><div className="hero-links"><span>운영정보</span><span>업무접수현황</span><span>통계관리</span><span>경리회계관리</span><b>[관리자님]</b><button><LogOut size={13}/> 로그아웃</button></div></div></header>
  <nav className="nav">{menus.map((m,i)=><div className={i===0?'active':''} key={m}>{m}</div>)}</nav>
  <main className="wrap">
   <div className="page-head"><div><div className="crumb">운영정보 &gt; 시스템 관리 &gt; 서버 모니터링</div><h1>시스템 모니터링</h1><p>웹사이트 · API · 서버 CPU / 메모리 / 디스크 / 네트워크 상태를 통합 관리합니다.</p></div><div className="live"><i/> 실시간 감시 중 <b>{last.toLocaleTimeString('ko-KR')}</b></div></div>
   <div className="metrics"><MetricCard icon={<Activity/>} title="CPU 사용률" value={avg('cpu')} unit="%" detail="전체 서버 평균" level={avg('cpu')>=65?'warn':'ok'}/><MetricCard icon={<Server/>} title="메모리 사용률" value={avg('memory')} unit="%" detail="전체 서버 평균" level={avg('memory')>=80?'danger':avg('memory')>=65?'warn':'ok'}/><MetricCard icon={<HardDrive/>} title="디스크 사용률" value={avg('disk')} unit="%" detail="스토리지 평균" level={avg('disk')>=80?'danger':'ok'}/><MetricCard icon={<ShieldCheck/>} title="서비스 상태" value="4/5" unit="" detail="정상 서비스" level="warn"/></div>
   <div className="top-grid">
    <section className="panel"><div className="panel-head"><b>서버 리소스 현황</b><span className="legend"><i/>정상 <i className="w"/>주의 <i className="d"/>위험</span></div><div className="gauges"><ResourceGauge label="CPU" value={current.cpu}/><ResourceGauge label="MEMORY" value={current.memory}/><ResourceGauge label="DISK" value={current.disk}/><ResourceGauge label="NETWORK" value={current.network}/></div><div className="selected-server"><b>{current.name}</b><span>{current.ip}</span><span>{current.role}</span></div><LineChart data={[35,42,38,51,44,56,49,current.cpu,61,53,current.cpu]}/><div className="chart-caption"><span>최근 60분 CPU 추이</span><span>0% ───────────── 100%</span></div></section>
    <section className="panel"><div className="panel-head"><b>웹사이트 / 서비스 상태</b><small>5초 주기 확인</small></div><div className="services">{services.map(s=><div className="service" key={s[0]}><div><b>{s[0]}</b><small>{s[1]}</small></div><span>{s[2]}</span><StatusBadge status={s[3]}/></div>)}</div></section>
   </div>
   <section className="panel table-panel"><div className="table-head"><div><b>서버 관리 목록</b><small>등록 서버 {servers.length}대 · 자동 새로고침 5초</small></div><div className="tools"><div className="search"><Search size={15}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="서버명 / IP / 역할 검색"/></div><button onClick={()=>setLast(new Date())}><RefreshCw size={14}/> 새로고침</button></div></div><div className="table-scroll"><table><thead><tr><th>No.</th><th>서버명</th><th>IP 주소</th><th>구분</th><th>CPU</th><th>메모리</th><th>디스크</th><th>네트워크</th><th>가동시간</th><th>상태</th><th>관리</th></tr></thead><tbody>{visible.map(s=><tr className={selectedId===s.id?'selected':''} key={s.id}><td>{s.id}</td><td><button className="server-link" onClick={()=>setSelectedId(s.id)}>{s.name}</button></td><td>{s.ip}</td><td>{s.role}</td><td><ProgressBar value={s.cpu}/></td><td><ProgressBar value={s.memory}/></td><td><ProgressBar value={s.disk}/></td><td><ProgressBar value={s.network}/></td><td>{s.uptime}</td><td><StatusBadge status={s.status}/></td><td><button className="view" onClick={()=>setSelectedId(s.id)}>보기</button></td></tr>)}</tbody></table></div></section>
   <div className="bottom-grid"><section className="panel"><div className="panel-head"><b>최근 장애 / 경고 이력</b><small>최근 24시간</small></div><div className="alerts"><p><strong className="warn-t">주의</strong><span>WEB-02 CPU 사용률 70% 근접</span><time>09:24</time></p><p><strong className="danger-t">위험</strong><span>DB-01 메모리 사용률 80% 초과</span><time>09:17</time></p><p><strong className="ok-t">복구</strong><span>자동 점검 완료 / 서비스 정상</span><time>08:42</time></p></div></section><section className="panel"><div className="panel-head"><b>사이트 관리 정책</b></div><div className="policies"><div><b>CPU 임계치</b><span>주의 65% / 위험 80%</span></div><div><b>메모리 임계치</b><span>주의 70% / 위험 85%</span></div><div><b>디스크 임계치</b><span>주의 70% / 위험 85%</span></div><div><b>응답시간</b><span>주의 500ms / 위험 1,000ms</span></div></div></section></div>
  </main><footer>T-VULCAN SYSTEM MONITORING · React + Vite · 실서비스 적용 시 Spring Boot / Monitoring Agent API 연동</footer>
 </div>}
function clamp(v){return Math.max(1,Math.min(98,v))}function rand(a,b){return Math.floor(Math.random()*(b-a+1))+a}export default App;
