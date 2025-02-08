# python 버전 설정
FROM python:3.10.13-slim

# 작업 디렉토리 /ai/realtime_fastapi 폴더 만들기
WORKDIR /ai/realtime_fastapi

# 빌드 시 환경 변수를 ARG로 설정
ARG CLOVASTUDIO_HOST=https://clovastudio.stream.ntruss.com
ARG CLOVASTUDIO_API_KEY

# ENV 설정 (ARG 값 유지)
ENV CLOVASTUDIO_HOST=${CLOVASTUDIO_HOST}
ENV CLOVASTUDIO_API_KEY=${CLOVASTUDIO_API_KEY}

# Poetry 설치 (최신 버전)
RUN apt update
RUN apt install -y curl
RUN curl -sSL https://install.python-poetry.org | python3 - && \
    ln -s /root/.local/bin/poetry /usr/local/bin/poetry && \
    rm -rf /var/lib/apt/lists/*

# 의존성 설치 (패키지만 설치, 프로젝트 제외)
COPY pyproject.toml poetry.lock ./
RUN poetry install --no-root

# realtime-fastapi 코드 복사
COPY api/ /ai/realtime_fastapi/api/
COPY schemas/ /ai/realtime_fastapi/schemas/
COPY services/ /ai/realtime_fastapi/services/
COPY app.py /ai/realtime_fastapi/

# .env 파일 생성 (WORKDIR에 위치하도록 수정)
RUN echo "CLOVASTUDIO_HOST=${CLOVASTUDIO_HOST}" > /ai/realtime_fastapi/.env && \
    echo "CLOVASTUDIO_API_KEY=${CLOVASTUDIO_API_KEY}" >> /ai/realtime_fastapi/.env

# 컨테이너 실행 명령
CMD ["poetry", "run", "python3", "app.py"]

# docker run -d --name arabugi-realtime-fastapi -e TZ=Asia/Seoul -p 8001:8001 gj98/arabugi:realtime-fastapi-latest
# docker exec -it arabugi-realtime-fastapi bash
