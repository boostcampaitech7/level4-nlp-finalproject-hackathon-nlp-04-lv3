#!/bin/sh

# AirFlow DB 설정에 필요한 변수
DB_HOST=$DB_HOST
DB_NAME=$1

# AirFlow가 사용할 DB airflow_db 생성. 이때, DB가 존재하는지 확인하고, 없으면 생성
if ! psql -h $DB_HOST -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = $DB_NAME;" | grep -q 1; then
  echo "🚀 Creating database $DB_NAME..."
  psql -h $DB_HOST -U postgres -c "CREATE DATABASE $DB_NAME;"
else
  echo "✅ Database $DB_NAME already exists!"
fi

# AirFlow DB 초기화
poetry run airflow db init

# AirFlow에서 사용할 계정 생성, 계정이 존재하는지 확인, 없으면 생성
if ! airflow users list | grep -q "admin"; then
  echo "🚀 Creating admin user..."
  poetry run airflow users create \
    --username admin \
    --password 1234 \
    --firstname jeongwan \
    --lastname kang \
    --role Admin \
    --email gangjeong22@gmail.com
else
  echo "✅ User 'admin' already exists, skipping creation."
fi

# DAGs에서 사용할 DB(arabugi_db) 연결하기
poetry run airflow connections add 'my_postgres_conn' \
    --conn-type 'postgres' \
    --conn-host $DB_HOST \
    --conn-schema 'arabugi_db' \
    --conn-login 'root' \
    --conn-password 'password1234' \
    --conn-port '5432'

# AirFlow 스케줄러 실행 (백그라운드 실행)
poetry run airflow scheduler &
# AirFlow 웹서버 실행
exec poetry run airflow webserver --port 8080
