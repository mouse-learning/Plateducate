from app import mysql

cursor = mysql.connect().cursor()

# cursor.execute("CREATE DATABASE Plateducate")

cursor.execute(
    "CREATE TABLE Users\
    (ID int NOT NULL PRIMARY KEY, \
    FirstName varchar(255) NOT NULL, \
    LastName varchar(255) NOT NULL, \
    Email varchar(255) NOT NULL)"
    )

cursor.execute("SHOW DATABASES")
for db in cursor:
    print(db)
