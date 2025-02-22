# python 버전 설정
FROM python:3.10.13-slim

# 작업 디렉토리 /backend 폴더 만들기
WORKDIR /backend

# 빌드 시 환경 변수를 ARG로 설정
ARG ALGORITHM
ARG SECRET_KEY
ARG AI_SERVER_URL=http://10.0.0.9:8001
ARG EXPIRE_MINUTES
ARG DB_HOST=host.docker.internal
ARG DB_PASSWORD=password1234
ARG DB_NAME=arabugi_db
ARG SCHEMA=arabugi

# Poetry 설치 (최신 버전)
RUN apt update && apt install -y curl && \
    curl -sSL https://install.python-poetry.org | python3 - && \
    ln -s /root/.local/bin/poetry /usr/local/bin/poetry && \
    rm -rf /var/lib/apt/lists/*

# 의존성 설치 (패키지만 설치, 프로젝트 제외)
COPY pyproject.toml poetry.lock ./
RUN poetry install --no-root

# 백엔드 코드 복사
COPY api/ /backend/api/
COPY core/ /backend/core/
COPY models/ /backend/models/
COPY schemas/ /backend/schemas/
COPY services/ /backend/services/
COPY app.py /backend/

# .env 파일 생성
#psql -h 10.0.0.7 -U root -d arabugi_db (10.0.0.7 = 사설IP)
# CREATE SCHEMA arabugi; (참고, public은 postgres 꺼라 NCP-postgresql은 사용 못하는 듯)
# SET search_path TO arabugi; <- 그럼 psql 터미널에서 arabugi 접두사 사용 안해도 됨
RUN echo "DB_URL=postgresql+psycopg2://root:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?options=-csearch_path=${SCHEMA}" > .env && \
    echo "ALGORITHM=${ALGORITHM}" >> .env && \
    echo "SECRET_KEY=${SECRET_KEY}" >> .env && \
    echo "AI_SERVER_URL=${AI_SERVER_URL}" >> .env && \
    echo "EXPIRE_MINUTES=${EXPIRE_MINUTES}" >> .env

# 컨테이너 실행 명령
CMD ["poetry", "run", "python3", "app.py"]
# docker run -d --name arabugi-backend -e TZ=Asia/Seoul -p 8000:8000 gj98/arabugi:backend-latest
# docker exec -it arabugi-backend bash
