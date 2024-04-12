DROP DATABASE IF EXISTS Community;
CREATE DATABASE Community;
USE Community;

-- hobby vector
CREATE TABLE hobby(
`hid` int PRIMARY KEY NOT NULL AUTO_INCREMENT

-- Interests as int columns
);

-- interest vector
CREATE TABLE interest(
`intid` int PRIMARY KEY NOT NULL AUTO_INCREMENT

-- Interests as int columns
);

-- genre vector
CREATE TABLE genre(
`genreid` int PRIMARY KEY NOT NULL AUTO_INCREMENT
-- Interests as int columns
);


-- User Database
CREATE TABLE User(
`uid` INT PRIMARY KEY AUTO_INCREMENT,
`fname` varchar(50) NOT NULL,
`lname` varchar(50) NOT NULL,
`nickname` varchar(50) NOT NULL,
`pwd` varchar(1000) NOT NULL,
`email` varchar(100) NOT NULL,
`hobby` varchar(1000) NOT NULL,
`interest` varchar(1000) NOT NULL,
`genre` varchar(1000) NOT NULL
);

-- Room Database
CREATE TABLE Room(
`rid` INT PRIMARY KEY AUTO_INCREMENT,
`rname` varchar(50) NOT NULL,
`rdescription` varchar(1000) NOT NULL
);

-- UserRoom Database
CREATE TABLE UserRoom(
`uid` INT,
`rid` INT,
FOREIGN KEY(`uid`) references `User`(`uid`) ON DELETE CASCADE ON UPDATE CASCADE,
FOREIGN KEY(`rid`) references `Room`(`rid`) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Message Database
CREATE TABLE Message(
`mid` INT PRIMARY KEY AUTO_INCREMENT,
`uid` INT,
`rid` INT,
`mcontent` varchar(1000) NOT NULL,
`mdate` DATE NOT NULL,
FOREIGN KEY(`uid`) references `User`(`uid`) ON DELETE CASCADE ON UPDATE CASCADE,
FOREIGN KEY(`rid`) references `Room`(`rid`) ON DELETE CASCADE ON UPDATE CASCADE
);