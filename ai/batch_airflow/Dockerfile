# python 버전 설정
FROM python:3.10.13-slim

# 작업 디렉토리 /backend 폴더 만들기
WORKDIR /ai/batch_airflow

# 빌드 시 환경 변수를 ARG로 설정
ARG NAVER_API_KEY
ARG DB_HOST=host.docker.internal
ARG DB_PASSWORD=password1234

# Poetry + postgresql-client 설치 (최신 버전)
RUN apt update && apt install -y curl postgresql-client python3-dev build-essential && \
    curl -sSL https://install.python-poetry.org | python3 - && \
    ln -s /root/.local/bin/poetry /usr/local/bin/poetry && \
    rm -rf /var/lib/apt/lists/*

# 의존성 설치 (패키지만 설치, 프로젝트 제외)
COPY pyproject.toml poetry.lock ./
RUN poetry install --no-root

# 백엔드 코드 복사
COPY dags/ /ai/batch_airflow/dags/
COPY run_scheduler_webserver.sh /ai/batch_airflow/
COPY prompt.json /ai/batch_airflow/

# .env 파일 생성
RUN echo "NAVER_API_KEY=${NAVER_API_KEY}" > .env && \
echo "AIRFLOW_DIR=/ai/batch_airflow" >> .env

# AirFlow 환경 설정
ENV AIRFLOW_HOME=/ai/batch_airflow
ENV AIRFLOW__DATABASE__SQL_ALCHEMY_CONN=postgresql+psycopg2://root:${DB_PASSWORD}@${DB_HOST}/airflow_db
ENV AIRFLOW__CORE__EXECUTOR=LocalExecutor
ENV DB_HOST=${DB_HOST}

# 컨테이너 실행 명령
ENTRYPOINT ["bash", "/ai/batch_airflow/run_scheduler_webserver.sh", "airflow_db"]
