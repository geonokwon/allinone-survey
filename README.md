# All-in-One Survey

상담 신청을 위한 **풀스택 설문 웹 애플리케이션**입니다.  
한 번의 상담으로 매장 운영에 필요한 기본 서비스(인터넷·TV·전화·CCTV·포스기 등)를 구축할 수 있도록, 고객 정보 수집·검증·이메일 자동 발송까지 한 번에 처리합니다.

---

## 프로젝트 소개

-   **목적**: B2B 상담 신청 폼을 통한 리드 수집 및 이메일 기반 자동 응답·알림
-   **대상**: 관심 고객(업종·지역·필요 상품·상담 가능 시간 등 수집)
-   **흐름**: 사용자 설문 제출 → 사용자에게 감사 이메일 발송 → 사내 담당자에게 신청 내용 알림 이메일 발송

### 주요 기능

| 기능              | 설명                                                          |
| ----------------- | ------------------------------------------------------------- |
| **폼 검증**       | 필수 항목 검증, 터치 시 에러 표시, 첫 번째 오류 필드로 스크롤 |
| **연락처 포맷**   | 전화번호 입력 시 자동 하이픈 포맷 (예: 010-1234-5678)         |
| **다중 선택**     | 필요한 상품 다중 선택 + 기타 직접 입력                        |
| **이메일 자동화** | Nodemailer 기반 사용자 감사 메일 + 사내 알림 메일 동시 발송   |
| **반응형 UI**     | MUI Grid·Container 기반 모바일/데스크톱 대응                  |

---

## 기술 스택

| 구분            | 기술                                                                                                     |
| --------------- | -------------------------------------------------------------------------------------------------------- |
| **Framework**   | [Next.js 13](https://nextjs.org/) (App Router 이전 Pages Router)                                         |
| **UI**          | [React 18](https://react.dev/), [Material-UI (MUI) v5](https://mui.com/), [Emotion](https://emotion.sh/) |
| **HTTP Client** | [Axios](https://axios-http.com/)                                                                         |
| **이메일**      | [Nodemailer](https://nodemailer.com/) (Gmail SMTP)                                                       |
| **스타일**      | CSS (globals), Pretendard 웹폰트                                                                         |
| **배포**        | [Docker](https://www.docker.com/) · Docker Compose                                                       |

-   **Next.js API Routes**: 서버 사이드에서 이메일 발송 처리 (클라이언트에 SMTP 비밀노출 방지)
-   **컴포넌트 분리**: 페이지(`pages/index.js`)와 폼 로직·UI(`components/SurveyForm.js`) 분리로 유지보수성 확보
-   **폼 상태 관리**: React `useState` 기반 단일 폼 객체 + 터치/에러 상태로 UX 개선
-   **HTML 이메일 템플릿**: 인라인 스타일 기반 반응형 메일 (사용자용·사내용 각각 템플릿)
-   **Docker 멀티스테이지**: Node 18 Alpine 기반 경량 이미지, `npm run build` 후 프로덕션 실행
-   **환경 변수**: `EMAIL_USER`, `EMAIL_PASS`, `COMPANY_EMAIL` 등 비밀정보 분리

---

## 프로젝트 구조

```
allinone-survey/
├── components/          # 재사용 컴포넌트
│   └── SurveyForm.js    # 상담 신청 폼 (검증, 제출, 로딩/다이얼로그)
├── pages/
│   ├── _app.js          # 앱 래퍼, 전역 스타일 로드
│   ├── index.js         # 메인 페이지 (설문 폼 노출)
│   └── api/
│       └── submit-survey.js   # POST 설문 수신 → 이메일 발송 API
├── public/              # 정적 자산
│   ├── fonts/           # Pretendard 웹폰트
│   ├── top_benner.gif   # 상단 배너
│   └── favicon.png
├── styles/
│   └── globals.css      # 전역 스타일, @font-face
├── Dockerfile           # Node 18 Alpine 빌드/실행
├── docker-compose.yml   # 로컬/서버 실행용
└── package.json
```

---

## 시작하기

### 요구 사항

-   Node.js 18+
-   npm (또는 yarn)

### 설치 및 실행

```bash
# 저장소 클론
git clone git@github.com:geonokwon/allinone-survey.git
cd allinone-survey

# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:3000)
npm run dev
```

### 환경 변수

이메일 발송을 사용하려면 프로젝트 루트에 `.env.local`을 만들고 아래 값을 설정하세요.

| 변수            | 설명                                   |
| --------------- | -------------------------------------- |
| `EMAIL_USER`    | Gmail 주소 (발신자)                    |
| `EMAIL_PASS`    | Gmail 앱 비밀번호 (2단계 인증 사용 시) |
| `COMPANY_EMAIL` | 신청 내용을 받을 사내 이메일 주소      |

---

## 빌드 및 프로덕션

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

---

## Docker로 실행

```bash
# 이미지 빌드 및 컨테이너 실행 (포트 8005 → 3000)
docker-compose up -d

# .env.local을 컨테이너에 마운트하여 이메일 설정 사용
```

-   접속: `http://localhost:8005`
-   `docker-compose.yml`에서 `restart: always`로 설정되어 있어 서버 재부팅 시에도 자동 기동 가능

---

## 스크립트 요약

| 명령어          | 설명                   |
| --------------- | ---------------------- |
| `npm run dev`   | 개발 서버 (Hot reload) |
| `npm run build` | 프로덕션 빌드          |
| `npm start`     | 프로덕션 서버 실행     |
| `npm run lint`  | ESLint 실행            |

---
