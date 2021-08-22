from app import mysql

cursor = mysql.connect().cursor()

# cursor.execute("CREATE DATABASE Plateducate")

cursor.execute(
    "CREATE TABLE Plateducate.Users\
    (ID int NOT NULL PRIMARY KEY, \
    Password varchar(255) NOT NULL,\
    FirstName varchar(255) NOT NULL, \
    LastName varchar(255) NOT NULL, \
    Email varchar(255) NOT NULL,\
    ImgSrc varchar(255))"
    )

cursor.execute("SHOW DATABASES")
for db in cursor:
    print(db)