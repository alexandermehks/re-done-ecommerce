-- SQLite

CREATE TABLE if not EXISTS sweater(
propID INTEGER PRIMARY KEY AUTOINCREMENT,
type VARCHAR(100),
name VARCHAR(250),
price INTEGER,
description text,
color VARCHAR(50),
balance INTEGER);

----------------------------------------------------------
CREATE TABLE if not EXISTS pants(
propID INTEGER PRIMARY KEY AUTOINCREMENT,
type VARCHAR(100),
name VARCHAR(250),
price INTEGER,
description text,
color VARCHAR(50),
balance INTEGER);

------------------------------------------------------------
CREATE TABLE if not EXISTS tshirt(
propID INTEGER PRIMARY KEY AUTOINCREMENT,
type VARCHAR(100),
name VARCHAR(250),
price INTEGER,
description text,
color VARCHAR(50),
balance INTEGER);

--------------------------------------------------------------
CREATE TABLE if not EXISTS shoes(
propID INTEGER PRIMARY KEY AUTOINCREMENT,
type VARCHAR(100),
name VARCHAR(250),
price INTEGER,
description text,
color VARCHAR(50),
balance INTEGER);


-------------------------------------------------------------------
DROP TABLE IF EXISTS product;
CREATE TABLE if not EXISTS product(
prodID INTEGER PRIMARY KEY AUTOINCREMENT,
propID INTEGER,
type VARCHAR(100)
);


----------------------------------------------------------------------

DROP TABLE IF EXISTS category;
CREATE TABLE IF NOT EXISTS category(
catID INTEGER PRIMARY KEY AUTOINCREMENT,
category_name VARCHAR(50),
description text
);

--------------------------------------------------------------------

DROP TABLE IF EXISTS user;
CREATE TABLE IF NOT EXISTS user(
userID INTEGER PRIMARY KEY AUTOINCREMENT,
role bit,
name VARCHAR(50),
email VARCHAR(50),
password VARCHAR(255)
);

-----------------------------------------------------------------
DROP TABLE IF EXISTS reviews;
CREATE TABLE IF NOT EXISTS reviews(
reviewID INTEGER PRIMARY KEY AUTOINCREMENT,
prodID INTEGER,
userID INTEGER,
ratingnumber INTEGER,
comment VARCHAR(250),
FOREIGN KEY (prodID) references products(prodID),
FOREIGN KEY (userID) references user(userID)
);


---------------------------------------------------------------------------

DROP TABLE IF EXISTS orderproducts;
CREATE TABLE IF NOT EXISTS orderproducts(
orderprodID INTEGER PRIMARY KEY AUTOINCREMENT,
prodID INTEGER,
orderID INTEGER,
amount INTEGER,
FOREIGN KEY (prodID) references products(prodID),
FOREIGN KEY (orderID) references orders(orderID)
);
--------------------------------------------------------------------------------

DROP TABLE IF EXISTS orders;
CREATE TABLE IF NOT EXISTS orders(
orderID INTEGER PRIMARY KEY AUTOINCREMENT,
orderprodID INTEGER,
userID INTEGER,
date DEFAULT CURRENT_TIMESTAMP,
status VARCHAR(40),
FOREIGN KEY (orderprodID) references orderproducts(orderprodID),
FOREIGN KEY (userID) references user(userID)
);


--------------------------------------------------------------------------------------
DROP TABLE IF EXISTS pic;
CREATE TABLE IF NOT EXISTS pic(
picID INTEGER PRIMARY KEY AUTOINCREMENT,
propID INTEGER,
pictureURL VARCHAR(255),
FOREIGN KEY (propID) references product(prodID)
);



SELECT * FROM sweater WHERE propID = 1;