-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: mysql.metropolia.fi
-- Generation Time: 10.12.2020 klo 16:33
-- Palvelimen versio: 10.1.48-MariaDB
-- PHP Version: 7.4.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tuomasbb`
--

-- --------------------------------------------------------

--
-- Rakenne taululle `ss_food_post`
--

CREATE TABLE `ss_food_post` (
  `food_post_id` int(11) NOT NULL,
  `user` int(11) NOT NULL,
  `title` text NOT NULL,
  `text` text NOT NULL,
  `filename` text NOT NULL,
  `status` varchar(15) DEFAULT 'public'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Rakenne taululle `ss_rating`
--

CREATE TABLE `ss_rating` (
  `id` int(11) NOT NULL,
  `fk_food_post_id` int(11) DEFAULT NULL,
  `likes` int(100) NOT NULL DEFAULT '0',
  `dislikes` int(100) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Rakenne taululle `ss_user`
--

CREATE TABLE `ss_user` (
  `user_id` int(11) NOT NULL,
  `username` text NOT NULL,
  `email` text NOT NULL,
  `password` text NOT NULL,
  `status` varchar(15) DEFAULT 'user'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Vedos taulusta `ss_user`
--

INSERT INTO `ss_user` (`user_id`, `username`, `email`, `password`, `status`) VALUES
(1, 'Admin User 1', 'adminuser1@metropolia.fi', '$2a$10$5RzpyimIeuzNqW7G8seBiOzBiWBvrSWroDomxMa0HzU6K2ddSgixS', 'admin'),
(2, 'Admin User 2', 'adminuser2@metropolia.fi', '$2a$10$H7bXhRqd68DjwFIVkw3G1OpfIdRWIRb735GvvzCBeuMhac/ZniGba', 'admin');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ss_food_post`
--
ALTER TABLE `ss_food_post`
  ADD PRIMARY KEY (`food_post_id`);

--
-- Indexes for table `ss_rating`
--
ALTER TABLE `ss_rating`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `fk_food_post_id` (`fk_food_post_id`);

--
-- Indexes for table `ss_user`
--
ALTER TABLE `ss_user`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ss_food_post`
--
ALTER TABLE `ss_food_post`
  MODIFY `food_post_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ss_rating`
--
ALTER TABLE `ss_rating`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ss_user`
--
ALTER TABLE `ss_user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
