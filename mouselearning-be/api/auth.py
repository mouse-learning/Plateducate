from flask import Flask, Blueprint, render_template, request, redirect, url_for, logging, session, flash
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from passlib.hash import sha256_crypt



#format for create_engine (mysql+pymysql://username:password@localhost/databasename)
#have to install pymysql package
auth = Flask(__name__)
engine = create_engine("mysql+pymysql://root:Password1@localhost/register")
db = scoped_session(sessionmaker(bind=engine))

#auth = Blueprint('main', __name__)

# REDUNDANT, COULD USE IF YOU WANT TO UTILISE flask_sqlalchemy instead of sqlalchemy like here
# class User(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(100), nullable=False)
#     username = db.Column(db.Text, nullable=False)
#     password = db.Column(db.String(20), nullable=False)
#
#     def __repr__(self):
#         return 'User id: ' + str(self.name)


@auth.route('/')
def home():
    return render_template('home.html')


@auth.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        name = request.form.get("name")
        username = request.form.get("username")
        password = request.form.get("password")
        confirm = request.form.get("confirm")
        secure_password = sha256_crypt.encrypt(str(password))

        if password == confirm:
            db.execute("INSERT INTO users(name, username, password) VALUES (:name, :username, :password)",
                       {"name":name, "username":username, "password":secure_password})
            db.commit()
            flash("you are registered and can login", "success")
            # new_user = User(name=name, username=username, password=secure_password)
            # db.session.add(new_user)
            # db.session.commit()
            return redirect(url_for('login'))
        else:
            flash("password does not match", "danger")
            return render_template("register.html")

    return render_template('register.html')


@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get("name")
        password = request.form.get("password")

        usernamedata = db.execute("SELECT username FROM users WHERE username=:username", {"username":username}).fetchone()
        passworddata = db.execute("SELECT password FROM users WHERE username=:username", {"username":username}).fetchone()

        if usernamedata is None:
            flash("No username", "danger")
            return render_template("login.html")
        else:
            print(passworddata)
            for password_d in passworddata:
                if sha256_crypt.verify(password, password_d):
                    session["logged_in"] = True # add this session variable into your nav bar to display logout/login options
                    flash("You are now logged in")
                    return redirect(url_for("photo"))
                else:
                    flash("incorrect password", "danger")
                    return render_template('login.html')

    return render_template('login.html')


@auth.route('/logout')
def logout():
    session.clear()
    flash("You are now logged out", "success")
    return redirect(url_for('login'))

# dummy page to display after user successfully logged in
@auth.route('/photo')
def photo():
    return render_template("photo.html")


@auth.route('/add_user', methods=['POST'])
def add_user():
    return 'Successfully Added User', 201


@auth.route('/fetch_movies', methods=['POST'])
def fetch_user():

    users = []
    return users, 201


if __name__ == "__main__":
    auth.secret_key = "somethingaboutmeltingblackfabric"
    auth.run(debug=True)
