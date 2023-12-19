
-- ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
-- flush privileges;
create database invnetory;
use inventory;



ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
flush privileges;

create database inventory ;
use inventory;
create table suppliers ( `suppliersId` int NOT NULL,  `sname` varchar(60) DEFAULT NULL,  `saddress` varchar(150) DEFAULT NULL ,  `contactinfo` int , PRIMARY KEY (`suppliersId`));

create table categories (`categoryId` int NOT NULL, `categoryname` varchar(60) DEFAULT NULL,`categorydescription` varchar(150) DEFAULT NULL,  PRIMARY KEY (`categoryId`));

create table customers (`cid` int NOT NULL,`cname` varchar(60) DEFAULT NULL, `caddress` varchar(150) DEFAULT NULL ,`phone` int , `email` varchar(150) DEFAULT NULL,  PRIMARY KEY (`cid`) );

create table orders(`orderid` int NOT NULL, `amount` int , `orderdate` date,`cid` int ,KEY `cid_fk_idx` (`cid`),PRIMARY KEY (`orderid`) , CONSTRAINT `cid_fk` FOREIGN KEY (`cid`) REFERENCES `customers` (`cid`));

create table product (`pid` int NOT NULL, `pname` varchar(60) DEFAULT NULL, `pdesc` varchar(150) DEFAULT NULL, `price` float ,`quantity` int,PRIMARY KEY (`pid`), `categoryId` int,`suppliersId` int, KEY `categoryId_fk_idx` (`categoryId`),KEY `suppliersId_fk_idx` (`suppliersId`),
CONSTRAINT `categoryId_fk` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`categoryId`),CONSTRAINT `suppliersId_fk` FOREIGN KEY (`suppliersId`) REFERENCES `suppliers` (`suppliersId`));

create table contains (`pid` int,`orderid` int,KEY `pid_fk_idx` (`pid`),KEY `orderid_fk_idx` (`orderid`),CONSTRAINT `pid_fk` FOREIGN KEY (`pid`) REFERENCES `product` (`pid`),CONSTRAINT `orderid_fk` FOREIGN KEY (`orderid`) REFERENCES `orders` (`orderid`));
 INSERT into categories (categoryId,categoryname,categorydescription) values (1,"Television","contains set of Television");
 insert INTO suppliers (suppliersId,sname,saddress,contactinfo) values (100,"varun","BLVB",98765);

 INSERT into categories (categoryId,categoryname,categorydescription) values (2,"laptop","contains set of Laptop");
 insert INTO suppliers (suppliersId,sname,saddress,contactinfo) values (101,"chandana","BLVB",987651);
 
insert into customers(cid,cname,caddress,phone,email) values (1,"rajeshwar","lakeside",12345,"raj@gmail.com");
insert into customers(cid,cname,caddress,phone,email) values (2,"shiva","lakeside",1234,"shiv@gmail.com");
insert into customers(cid,cname,caddress,phone,email) values (3,"jay","lakeside",12346,"jay@gmail.com");

insert into orders(orderid,amount,orderdate,cid) values (1,1000,'2023-11-24',1);
insert into orders(orderid,amount,orderdate,cid) values (2,1000,'2023-11-25',2);
insert into orders(orderid,amount,orderdate,cid) values (3,1000,'2023-11-26',3);

 INSERT INTO product (pid,pname,pdesc,price,quantity,categoryId,suppliersId) VALUES (1,"sony","good tv",840,10,1,100);
 INSERT INTO product (pid,pname,pdesc,price,quantity,categoryId,suppliersId) VALUES (2,"hp","good laptop",800,44,2,101);
 INSERT INTO product (pid,pname,pdesc,price,quantity,categoryId,suppliersId) VALUES (3,"samsung","good monitor",820,10,3,102);

INSERT into contains (pid,orderid) values (1,1);
INSERT into contains (pid,orderid) values (2,1);
INSERT into contains (pid,orderid) values (2,2);
INSERT into contains (pid,orderid) values (3,2);
INSERT into contains (pid,orderid) values (3,3);
INSERT into contains (pid,orderid) values (2,3);
INSERT into contains (pid,orderid) values (1,3);

INSERT INTO categories (categoryId, categoryname, categorydescription) VALUES 
(10, 'Televisions', 'High-definition and smart televisions of various sizes'),
(20, 'Laptops', 'Portable computers suitable for all your work and gaming needs'),
(30, 'Smartphones', 'Latest and most advanced smartphones from leading brands'),
(40, 'Gaming Consoles', 'Home entertainment gaming consoles and accessories'),
(50, 'Audio Systems', 'Sound systems, speakers, and headphones for high-quality audio experiences');

INSERT INTO customers (cid, cname, caddress, phone, email) VALUES 
(11, 'Alice Smith', '123 Electric Ave, Tech City', 1000000002, 'alice.smith@example.com'),
(12, 'Bob Johnson', '456 Gadget St, Innovate District', 1000000002, 'bob.johnson@example.net'),
(13, 'Charlie Brown', '789 Silicon Blvd, Hardware Town', 1000000003, 'charlie.brown@example.org'),
(14, 'Diana Prince', '101 CPU Lane, Circuit City', 1000000004, 'diana.prince@example.com'),
(15, 'Edward Elric', '202 Transistor Rd, Alchemy Corner', 1000000005, 'edward.elric@example.net');
select * from customers;
INSERT INTO product (pid, pname, pdesc, price, quantity, categoryId, suppliersId) VALUES 
(21, 'Sony Bravia 55"', '55-inch 4K UHD Smart LED TV', 750.00, 15, 10, 100),
(22, 'Dell Inspiron 15', '15-inch laptop with 10th Gen Intel Core i5', 650.00, 30, 20, 101),
(23, 'iPhone 12 Pro', '5G smartphone with A14 Bionic chip', 999.00, 20, 30, 102),
(24, 'PlayStation 5', 'Next-gen gaming console with ultra-high-speed SSD', 499.00, 10, 40, 103),
(25, 'Bose SoundLink', 'Bluetooth speaker with 360-degree sound', 199.00, 25, 50, 104);

INSERT INTO suppliers (suppliersId, sname, saddress, contactinfo) VALUES 
(105, 'Sony Electronics Inc.', '123 Tech Park, Electronics City', 1001234567),
(106, 'Dell Technologies', '234 Silicon Avenue, Innovate District', 1002345678),
(102, 'Apple Inc.', '345 iStreet, Cupertino', 2003456789),
(103, 'Sony Interactive Entertainment', '456 PlayStation Drive, Gaming City', 1004567890),
(104, 'Bose Corporation', '567 Audio Way, Sound Town', 100567890);
select * from suppliers;
INSERT INTO orders (orderid, amount, orderdate, cid) VALUES 
(31, 1500, '2023-01-10', 11),
(32, 2000, '2023-01-15', 12),
(33, 2500, '2023-01-20', 13),
(34, 3000, '2023-01-25', 14),
(35, 3500, '2023-01-30', 15);

INSERT INTO contains (pid, orderid) VALUES 
(21, 31), -- Order 1 contains product 1
(22, 32), -- Order 2 contains product 2
(23, 33), -- Order 3 contains product 3
(21, 34), -- Order 4 contains product 1 again, perhaps another television purchase
(22, 35); -- Order 5 contains product 2, another laptop purchase

SELECT COUNT(pid) AS NumberOfProducts FROM product;
select * from orders;
select * from user_login;
SELECT SUM(amount) AS TotalAmount FROM orders;
SELECT COUNT(pid) AS NumberOfProducts FROM product;
SELECT COUNT(orderid) AS NumberOforders FROM orders;
SELECT SUM(price) AS TotalItemsOrdered FROM product;
