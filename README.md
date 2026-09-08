# T-VULCAN 시스템 모니터링 React

첨부된 T-VULCAN 인트라넷 화면을 기준으로 상단 헤더/메뉴/테이블 스타일을 유지하고 서버 및 사이트 모니터링 기능을 추가한 React + Vite 프로젝트입니다.

## 1. 요구사항
- Node.js 18+
- npm

## 2. 실행
```bash
cd tvulcan-monitoring-react
npm install
npm run dev
```
브라우저: http://localhost:5173

## 3. 현재 구현
- CPU / 메모리 / 디스크 / 네트워크 모니터링
- 서버 목록 및 검색
- 서버 상세 선택
- 웹사이트/API/DB 상태
- 응답시간
- 장애/경고 이력
- 임계치 표시
- 5초 Mock 데이터 갱신
- 반응형 UI

## 4. 실제 서버 연동 구조
React -> Spring Boot Monitoring API -> Monitoring Agent -> Windows/Linux Server

예상 API:
GET /api/monitor/servers
GET /api/monitor/servers/{id}
GET /api/monitor/services
GET /api/monitor/alerts

실제 운영에서는 브라우저가 서버에 직접 접근하지 않고 Spring Boot API가 서버 Agent에서 CPU/메모리/디스크/네트워크 데이터를 수집하도록 구성하는 것을 권장합니다.
