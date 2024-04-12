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
`hid` int,
`intid` int,
`genreid` int,

 FOREIGN KEY(`hid`) references `hobby`(`hid`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY(`intid`) references `interest`(`intid`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY(`genreid`) references `genre`(`genreid`) ON DELETE CASCADE ON UPDATE CASCADE
);

