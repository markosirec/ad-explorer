-- phpMyAdmin SQL Dump
-- version 3.3.9.2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: May 28, 2014 at 12:43 AM
-- Server version: 5.5.9
-- PHP Version: 5.3.6

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `ad_explorer`
--
CREATE DATABASE `ad_explorer` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `ad_explorer`;

-- --------------------------------------------------------

--
-- Table structure for table `item_ad_types`
--

CREATE TABLE `item_ad_types` (
  `ad_type_id` smallint(6) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  PRIMARY KEY (`ad_type_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=10 ;

--
-- Dumping data for table `item_ad_types`
--

INSERT INTO `item_ad_types` VALUES(0, '');
INSERT INTO `item_ad_types` VALUES(1, 'Premium DR Banner');
INSERT INTO `item_ad_types` VALUES(2, 'Rich Media');
INSERT INTO `item_ad_types` VALUES(3, 'Shazam for TV');
INSERT INTO `item_ad_types` VALUES(4, 'Angry Birds');
INSERT INTO `item_ad_types` VALUES(5, 'Social Rich Media');
INSERT INTO `item_ad_types` VALUES(6, 'Video');

-- --------------------------------------------------------

--
-- Table structure for table `item_types`
--

CREATE TABLE `item_types` (
  `type_id` smallint(6) NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL,
  PRIMARY KEY (`type_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `item_types`
--

INSERT INTO `item_types` VALUES(1, 'folder');
INSERT INTO `item_types` VALUES(2, 'file');

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

CREATE TABLE `items` (
  `item_id` int(11) NOT NULL AUTO_INCREMENT,
  `parent_id` int(11) NOT NULL,
  `type_id` smallint(6) NOT NULL,
  `ad_type_id` smallint(6) NOT NULL,
  `title` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  `date_added` datetime NOT NULL,
  `last_update` datetime NOT NULL,
  `deleted` enum('false','true') NOT NULL,
  PRIMARY KEY (`item_id`),
  KEY `parent_id` (`parent_id`),
  KEY `type_id` (`type_id`),
  KEY `ad_type_id` (`ad_type_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=53 ;

--
-- Dumping data for table `items`
--

INSERT INTO `items` VALUES(1, 6, 1, 0, 'Video ads', '', '2014-05-26 02:26:56', '2014-05-26 02:26:58', 'false');
INSERT INTO `items` VALUES(2, 3, 1, 0, 'Shazam ads', '', '2014-05-27 14:10:49', '2014-05-27 14:10:51', 'false');
INSERT INTO `items` VALUES(3, 0, 1, 0, 'Nike campaign', '', '2014-05-27 18:38:55', '2014-05-27 18:38:57', 'false');
INSERT INTO `items` VALUES(4, 0, 1, 0, 'Ford campaign', '', '2014-05-27 18:39:13', '2014-05-27 18:39:15', 'false');
INSERT INTO `items` VALUES(5, 6, 1, 0, 'Spiderman 3', '', '2014-05-27 18:39:41', '2014-05-27 18:39:43', 'false');
INSERT INTO `items` VALUES(6, 0, 1, 0, 'Christmas ads', '', '2014-05-27 18:40:16', '2014-05-27 18:40:18', 'false');
INSERT INTO `items` VALUES(7, 0, 2, 3, '800x400', 'http://www.celtra.com/', '2014-05-27 19:21:52', '2014-05-27 19:21:54', 'false');
INSERT INTO `items` VALUES(8, 0, 2, 1, '800x300 fixed', 'http://www.celtra.com/', '2014-05-27 19:21:52', '2014-05-27 19:21:54', 'false');
INSERT INTO `items` VALUES(9, 0, 2, 2, '800x100 color', 'http://www.celtra.com/', '2014-05-27 19:21:52', '2014-05-27 19:21:54', 'false');
INSERT INTO `items` VALUES(10, 0, 2, 4, '810x400', 'http://www.celtra.com/', '2014-05-27 19:21:52', '2014-05-27 19:21:54', 'false');
INSERT INTO `items` VALUES(11, 1, 2, 1, 'San Francisco', 'http://www.celtra.com/', '2014-05-27 19:21:52', '2014-05-27 19:21:54', 'false');
INSERT INTO `items` VALUES(12, 1, 2, 2, 'Boston', 'http://www.celtra.com/', '2014-05-27 19:21:52', '2014-05-27 19:21:54', 'false');
INSERT INTO `items` VALUES(13, 1, 2, 3, 'New York', 'http://www.celtra.com/', '2014-05-27 19:21:52', '2014-05-27 19:21:54', 'false');
INSERT INTO `items` VALUES(14, 1, 2, 4, 'Los Angeles', 'http://www.celtra.com/', '2014-05-27 19:21:52', '2014-05-27 19:21:54', 'false');
INSERT INTO `items` VALUES(15, 1, 2, 5, 'Memphis', 'http://www.celtra.com/', '2014-05-27 19:21:52', '2014-05-27 19:21:54', 'false');
INSERT INTO `items` VALUES(16, 1, 2, 6, 'Portland', 'http://www.celtra.com/', '2014-05-27 19:21:52', '2014-05-27 19:21:54', 'false');
INSERT INTO `items` VALUES(17, 1, 2, 2, 'Austin', 'http://www.celtra.com/', '2014-05-27 19:21:52', '2014-05-27 19:21:54', 'false');
INSERT INTO `items` VALUES(18, 2, 2, 1, 'Rome', 'http://www.celtra.com/', '2014-05-27 19:21:52', '2014-05-27 19:21:54', 'false');
INSERT INTO `items` VALUES(19, 2, 2, 2, 'Florence', 'http://www.celtra.com/', '2014-05-27 19:21:52', '2014-05-27 19:21:54', 'false');
INSERT INTO `items` VALUES(20, 2, 2, 3, 'Venice', 'http://www.celtra.com/', '2014-05-27 19:21:52', '2014-05-27 19:21:54', 'false');
INSERT INTO `items` VALUES(21, 2, 2, 4, 'Naples', 'http://www.celtra.com/', '2014-05-27 19:21:52', '2014-05-27 19:21:54', 'false');
INSERT INTO `items` VALUES(22, 2, 2, 5, 'Trieste', 'http://www.celtra.com/', '2014-05-27 19:21:52', '2014-05-27 19:21:54', 'false');
INSERT INTO `items` VALUES(23, 2, 2, 6, 'Gorizia', 'http://www.celtra.com/', '2014-05-27 19:21:52', '2014-05-27 19:21:54', 'false');
INSERT INTO `items` VALUES(24, 2, 2, 2, 'Genova', 'http://www.celtra.com/', '2014-05-27 19:21:52', '2014-05-27 19:21:54', 'false');
INSERT INTO `items` VALUES(25, 3, 2, 1, 'Kuskus', 'http://www.celtra.com/', '2014-05-27 19:21:52', '2014-05-27 19:21:54', 'false');
INSERT INTO `items` VALUES(26, 3, 2, 2, 'Pasta', 'http://www.celtra.com/', '2014-05-27 19:21:52', '2014-05-27 19:21:54', 'false');
INSERT INTO `items` VALUES(27, 3, 2, 3, 'Pizza', 'http://www.celtra.com/', '2014-05-27 19:21:52', '2014-05-27 19:21:54', 'false');
INSERT INTO `items` VALUES(28, 3, 2, 4, 'LeBron James', 'http://www.celtra.com/', '2014-05-27 19:21:52', '2014-05-27 19:21:54', 'false');
INSERT INTO `items` VALUES(29, 3, 2, 5, 'Pad Thai', 'http://www.celtra.com/', '2014-05-27 19:21:52', '2014-05-27 19:21:54', 'false');
INSERT INTO `items` VALUES(30, 3, 2, 6, 'Yellow Curry', 'http://www.celtra.com/', '2014-05-27 19:21:52', '2014-05-27 19:21:54', 'false');
INSERT INTO `items` VALUES(31, 3, 2, 2, 'Red Curry', 'http://www.celtra.com/', '2014-05-27 19:21:52', '2014-05-27 19:21:54', 'false');
INSERT INTO `items` VALUES(32, 4, 2, 1, 'A 324', 'http://www.celtra.com/', '2014-05-27 19:21:52', '2014-05-27 19:21:54', 'false');
INSERT INTO `items` VALUES(33, 4, 2, 2, 'B 777', 'http://www.celtra.com/', '2014-05-27 19:21:52', '2014-05-27 19:21:54', 'false');
INSERT INTO `items` VALUES(34, 4, 2, 3, 'C 876', 'http://www.celtra.com/', '2014-05-27 19:21:52', '2014-05-27 19:21:54', 'false');
INSERT INTO `items` VALUES(35, 4, 2, 4, 'D 000', 'http://www.celtra.com/', '2014-05-27 19:21:52', '2014-05-27 19:21:54', 'false');
INSERT INTO `items` VALUES(36, 4, 2, 5, 'E 6/10', 'http://www.celtra.com/', '2014-05-27 19:21:52', '2014-05-27 19:21:54', 'false');
INSERT INTO `items` VALUES(37, 4, 2, 6, 'F 3-3-3', 'http://www.celtra.com/', '2014-05-27 19:21:52', '2014-05-27 19:21:54', 'false');
INSERT INTO `items` VALUES(38, 4, 2, 2, 'G 909', 'http://www.celtra.com/', '2014-05-27 19:21:52', '2014-05-27 19:21:54', 'false');
INSERT INTO `items` VALUES(39, 5, 2, 1, 'Special AD', 'http://www.celtra.com/', '2014-05-27 19:21:52', '2014-05-27 19:21:54', 'false');
INSERT INTO `items` VALUES(40, 5, 2, 2, 'Thanksgiving', 'http://www.celtra.com/', '2014-05-27 19:21:52', '2014-05-27 19:21:54', 'false');
INSERT INTO `items` VALUES(41, 5, 2, 3, 'Summer campaign', 'http://www.celtra.com/', '2014-05-27 19:21:52', '2014-05-27 19:21:54', 'false');
INSERT INTO `items` VALUES(42, 5, 2, 4, 'Non stop partying', 'http://www.celtra.com/', '2014-05-27 19:21:52', '2014-05-27 19:21:54', 'false');
INSERT INTO `items` VALUES(43, 5, 2, 5, 'No more partying', 'http://www.celtra.com/', '2014-05-27 19:21:52', '2014-05-27 19:21:54', 'false');
INSERT INTO `items` VALUES(44, 5, 2, 6, 'Sunny banner pulldown', 'http://www.celtra.com/', '2014-05-27 19:21:52', '2014-05-27 19:21:54', 'false');
INSERT INTO `items` VALUES(45, 5, 2, 2, 'Flashy and tacky', 'http://www.celtra.com/', '2014-05-27 19:21:52', '2014-05-27 19:21:54', 'false');
INSERT INTO `items` VALUES(46, 6, 2, 1, 'Special AD 1', 'http://www.celtra.com/', '2014-05-27 19:21:52', '2014-05-27 19:21:54', 'false');
INSERT INTO `items` VALUES(47, 6, 2, 2, 'Special AD 2', 'http://www.celtra.com/', '2014-05-27 19:21:52', '2014-05-27 19:21:54', 'false');
INSERT INTO `items` VALUES(48, 6, 2, 3, 'Special AD 3', 'http://www.celtra.com/', '2014-05-27 19:21:52', '2014-05-27 19:21:54', 'false');
INSERT INTO `items` VALUES(49, 6, 2, 4, 'Special AD 4', 'http://www.celtra.com/', '2014-05-27 19:21:52', '2014-05-27 19:21:54', 'false');
INSERT INTO `items` VALUES(50, 6, 2, 5, 'Special AD 5', 'http://www.celtra.com/', '2014-05-27 19:21:52', '2014-05-27 19:21:54', 'false');
INSERT INTO `items` VALUES(51, 6, 2, 6, 'Special AD 6', 'http://www.celtra.com/', '2014-05-27 19:21:52', '2014-05-27 19:21:54', 'false');
INSERT INTO `items` VALUES(52, 6, 2, 2, 'Special AD 7', 'http://www.celtra.com/', '2014-05-27 19:21:52', '2014-05-27 19:21:54', 'false');
