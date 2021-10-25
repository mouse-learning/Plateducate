import os, sys; sys.path.append(os.path.dirname(os.path.realpath(__file__)))
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from dotenv import load_dotenv

load_dotenv()
url = "mysql+pymysql://{}:{}@{}/{}".format(os.getenv("SQL_USERNAME"), os.getenv("SQL_PASS"), os.getenv("URL"), os.getenv("SQL_DATABASE"))
engine = create_engine(url, pool_size=20, max_overflow=100)
db = scoped_session(sessionmaker(bind=engine))