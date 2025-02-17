from sqlmodel import create_engine, Session

from core.config import config


engine = create_engine(config.db_url)


def get_session():
    with Session(engine) as session:
        yield session
