# 첫 번째 단계: 빌드 환경 구축
FROM node:lts-alpine as build-stage

# 작업 디렉토리 설정
WORKDIR /frontend

ARG BACKEND_ADDRESS

RUN echo "VITE_API_URL=http://{BACKEND_ADDRESS}:8000" > .env.production

# 의존성 파일 복사 및 설치 (캐싱 최적화)
COPY package.json package-lock.json ./
RUN npm install

# 소스 코드 복사
COPY . .

# Vite 프로젝트 빌드 (Vite의 기본 빌드 명령어는 `npm run build`)
RUN npm run build

# 두 번째 단계: Nginx를 사용하여 애플리케이션 서빙
FROM nginx:stable-alpine as production-stage

# Nginx 설정 복사 (선택 사항)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 빌드된 파일을 Nginx 서버로 복사
COPY --from=build-stage /dist /usr/share/nginx/html

# 80 포트 노출
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
