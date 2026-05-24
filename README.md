# Woxa Broker

เว็บแอป Full Stack สำหรับจัดการข้อมูล Broker ตามโจทย์ทดสอบ WOXO Full Stack Developer ครอบคลุมระบบสมัครสมาชิก/เข้าสู่ระบบ, หน้าเพิ่ม Broker ที่ต้องผ่านการยืนยันตัวตน, การค้นหาและกรองข้อมูลจากฝั่ง Backend, หน้า Detail ตาม `slug`, การเชื่อมต่อ PostgreSQL และการรันทั้งระบบด้วย Docker Compose

## Tech Stack ที่ใช้

- Frontend: Next.js 15 App Router, React 18, TypeScript, Tailwind CSS
- Backend: Express, TypeScript, Prisma ORM, Zod validation
- Database: PostgreSQL
- Authentication: JWT จาก `POST /api/login` และเก็บ session ด้วย HTTP-only cookie
- Delivery: Docker Compose สำหรับรัน PostgreSQL, API และ Frontend พร้อมกัน

## เหตุผลในการเลือก Tech Stack

โจทย์เปิดให้เลือก Tech Stack ได้อิสระและแนะนำ Next.js, NestJS และ TypeScript โปรเจกต์นี้เลือกใช้ Next.js + TypeScript ฝั่ง Frontend และใช้ Express + Prisma + PostgreSQL ฝั่ง Backend เพราะ API ที่ต้องทำมีขนาดกระชับ เป็น auth/CRUD/search/filter เป็นหลัก Express จึงช่วยให้โครงสร้างตรงไปตรงมา อ่านง่าย และตรวจงานได้เร็ว ขณะเดียวกันยังแยก route ชัดเจน ใช้ Zod ตรวจ validation ใช้ Prisma จัดการฐานข้อมูล และรองรับ Docker ได้ครบถ้วน

## โครงสร้างโปรเจกต์

```text
woxo-broker/
  backend/
    prisma/              Prisma schema, migrations และ seed data
    src/
      lib/               Prisma client และ auth helpers
      routes/            REST API route handlers
      test/              Vitest API contract tests
  frontend/
    app/                 Next.js routes
    components/          Shared UI components
    hooks/               Reusable React hooks
    lib/                 Frontend API helpers
  docker-compose.yml     PostgreSQL, API และ web services
```

## ฟีเจอร์ที่ครอบคลุมตามโจทย์

- หน้า Login: `/login`
- หน้า Register: `/register`
- หน้า Create Broker: `/create`
- หน้า Broker List พร้อม debounce search และ filter ตาม `broker_type`: `/`
- หน้า Broker Detail แบบ dynamic route และมี SEO metadata: `/broker/[slug]`
- หน้า Create Broker ฝั่ง Frontend ตรวจ session ผ่าน `GET /api/me`
- API เพิ่ม Broker ตรวจสิทธิ์ผ่าน JWT cookie หรือ `Authorization: Bearer <token>`
- ค้นหาและกรองข้อมูลฝั่ง Backend ผ่าน `GET /api/brokers?search=exness&type=cfd`
- จำกัดค่า `broker_type` เป็น `cfd`, `bond`, `stock`, `crypto`
- Bonus ที่ทำเพิ่ม: debounce search, frontend/backend validation, Docker Compose, SEO metadata, robots/sitemap, JSON-LD และ local broker shortlist

## Environment

สร้างไฟล์ `backend/.env`:

```env
DATABASE_URL="postgresql://woxa@localhost:5432/woxa_broker"
JWT_SECRET="local-development-jwt-value"
API_PORT=3001
FRONTEND_URL="http://localhost:3000"
```

สร้างไฟล์ `frontend/.env.local`:

```env
API_URL="http://localhost:3001"
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

`API_URL` ใช้สำหรับ Next.js rewrites และหน้า Detail ที่ render ฝั่ง server ส่วน request จาก browser จะยิงไปที่ `/api/*` บน frontend origin แล้ว Next.js proxy ต่อไปที่ backend

## ติดตั้ง Dependencies

```powershell
npm install
cd backend
npm install
cd ../frontend
npm install
```

## Setup Database

เริ่ม PostgreSQL:

```powershell
docker compose up -d db
```

รัน migration และ seed data:

```powershell
cd backend
npm run db:migrate
npm run db:seed
```

บัญชี demo หลัง seed:

```text
email: demo@woxa.test
password: Password123!
```

## รันแบบ Local

เปิด Backend:

```powershell
cd backend
npm run dev
```

เปิด Frontend:

```powershell
cd frontend
npm run dev
```

URL หลัก:

- Frontend: `http://localhost:3000`
- Backend health check: `http://localhost:3001/api/health`
- PostgreSQL: `localhost:5432`

## รันด้วย Docker

```powershell
docker compose up --build
```

เมื่อรันด้วย Docker ตัว API container จะรัน Prisma migrations และ seed data ก่อนเริ่ม Express server

## REST API

```http
GET /api/health
POST /api/register
POST /api/login
POST /api/logout
GET /api/me
GET /api/brokers?search=&type=
GET /api/brokers/:slug
POST /api/brokers
```

### Authentication

`POST /api/login` จะคืน JWT ใน response body และตั้งค่า token เดียวกันเป็น HTTP-only cookie โดย protected endpoint รองรับทั้ง cookie และ header `Authorization: Bearer <token>`

### Broker Payload

`POST /api/brokers` ต้องเข้าสู่ระบบก่อน Backend รองรับทั้ง field แบบ snake_case ตามโจทย์และ camelCase ที่ใช้ใน Frontend:

```json
{
  "name": "Exness",
  "slug": "exness",
  "description": "Leading forex and CFD broker.",
  "logo_url": "https://logo.clearbit.com/exness.com",
  "website": "https://www.exness.com",
  "broker_type": "cfd"
}
```

## การตรวจสอบก่อนส่งงาน

Backend API tests:

```powershell
cd backend
npm test -- --run
```

Frontend production build:

```powershell
cd frontend
npm run build
```

ตรวจ Docker Compose config:

```powershell
docker compose config --quiet
```

หมายเหตุ: โปรเจกต์นี้ยังไม่ได้ตั้งค่า frontend unit test ดังนั้นการตรวจฝั่ง Frontend ใช้ `npm run build` และ browser smoke test แทน
