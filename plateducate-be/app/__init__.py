from flask import Flask
from flaskext.mysql import MySQL

app = Flask(__name__)

app.config.from_pyfile('config.py')

mysql = MySQL()
mysql.init_app(app)

if __name__ == '__main__':
    app.run()