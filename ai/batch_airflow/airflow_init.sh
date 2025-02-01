#!/bin/bash

# Set the current directory as AIRFLOW_HOME
export AIRFLOW_HOME=$(pwd) #매우중요

# Print the AIRFLOW_HOME path for confirmation
echo "AIRFLOW_HOME is set to: $AIRFLOW_HOME"

# Initialize the Airflow database
echo "Initializing the Airflow database..."
poetry run airflow db init #매우 중요

# Check if the initialization was successful
if [ $? -eq 0 ]; then
    echo "Airflow database initialized successfully."
else
    echo "Failed to initialize the Airflow database." >&2
    exit 1
fi



# PostgreSQL 설정
# 1. sudo apt install -y postgresql postgresql-contrib (PostgreSQL 설치),
# 1.1. pip install psycopg2-binary (Python과 PostgreSQL 연결 라이브러리 설치)
# 2. service postgresql start (PostgreSQL 실행)
# 3. sudo -u postgres psql (PostgreSQL 터미널 진입)
# 4. CREATE ROLE root WITH SUPERUSER LOGIN PASSWORD ‘password1234’; (root 계정 생성)

# AIRFLOW와 PostgreSQL 연결 설정
# 1. CREATE DATABASE airflow_db; (AIRFLOW가 사용할 DB airflow_db 생성)
# 2. AIRFLOW에서 사용할 계정 생성
: <<'COMMENT'
poetry run airflow users create \
--username admin \
--password 1234 \
--firstname jeongwan \
--lastname kang \
--role Admin \
--email gangjeong22@gmail.com
COMMENT
# 3. airflow.cfg 파일 수정
# 3.1. sql_alchemy_conn = postgresql+psycopg2://root:password1234@localhost/airflow_db
# 3.2. executor = LocalExecutor

# DAGs에서 사용할 Database(testdb) 연결하기
: <<'COMMENT'
poetry run airflow connections add 'my_postgres_conn' \
    --conn-type 'postgres' \
    --conn-host 'localhost' \
    --conn-schema 'testdb' \
    --conn-login 'root' \
    --conn-password 'password1234' \
    --conn-port '5432'
COMMENT

#poetry run airflow webserver --port 8080
#poetry run airflow scheduler
# 포트 프로세스 Kill
#  - 스케줄러: kill -9 $(lsof -i :8793)
#  - 웹 서버: kill -9 $(lsof -i :8080)
