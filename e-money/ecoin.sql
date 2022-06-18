-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 19, 2022 at 09:04 AM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 8.1.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ecoin`
--

-- --------------------------------------------------------

--
-- Table structure for table `topup`
--

CREATE TABLE `topup` (
  `id_topup` int(11) NOT NULL,
  `va` varchar(100) NOT NULL,
  `bankname` varchar(250) NOT NULL,
  `id_user` int(11) NOT NULL,
  `credits` float NOT NULL,
  `created_date` date NOT NULL,
  `expiration_date` date NOT NULL,
  `approve` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `topup`
--

INSERT INTO `topup` (`id_topup`, `va`, `bankname`, `id_user`, `credits`, `created_date`, `expiration_date`, `approve`) VALUES
(1, '2147483647', 'BCA', 6, 50000, '0000-00-00', '2022-04-20', 0),
(2, '6002082134567890', 'BCA', 6, 50000, '0000-00-00', '2022-04-20', 0);

-- --------------------------------------------------------

--
-- Table structure for table `transaction`
--

CREATE TABLE `transaction` (
  `id_transaction` int(11) NOT NULL,
  `transmethod` varchar(50) NOT NULL,
  `id_sender` int(11) NOT NULL,
  `id_receiver` int(11) NOT NULL,
  `merchant` varchar(100) NOT NULL,
  `transfermethod` int(11) NOT NULL,
  `amount` decimal(10,0) NOT NULL,
  `date` datetime NOT NULL,
  `description` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `transaction`
--

INSERT INTO `transaction` (`id_transaction`, `transmethod`, `id_sender`, `id_receiver`, `merchant`, `transfermethod`, `amount`, `date`, `description`) VALUES
(1, 'topup', 8, 6, '', 0, '50000', '0000-00-00 00:00:00', 'Top Up 50000'),
(2, 'payment', 6, 9, 'AyoLaundry', 0, '20000', '0000-00-00 00:00:00', 'For laundry'),
(7, 'transfer', 6, 6, '', 1, '5000', '0000-00-00 00:00:00', 'For kind');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id_user` int(11) NOT NULL,
  `user_name` varchar(100) NOT NULL,
  `role` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `credits` float NOT NULL,
  `password` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id_user`, `user_name`, `role`, `email`, `phone`, `credits`, `password`) VALUES
(6, 'arya1233', 'member', 'arya123@temail.com', '082134567890', 45000, '$2a$12$ylkJBiR7GRaN7D9mY6AiEu3q5YyFzGJ15fRWFBfQ.cL4NSgL45cZu'),
(7, 'arya1234', 'member', 'arya1234@temail.com', '082134567891', 15000, '$2a$12$2fZotn7aUgnh55VlCIoZHug42xMdAMhY2/CRG9mGNJUNvj5bQqQ4e'),
(8, 'admin', 'admin', 'admin@temail.com', '0211211211', 0, '$2a$12$idfCjm7o0NxNp5yPx/rzbeJk5IqXuQMjyabnCaWJAFciMrj2Hqpg.'),
(9, 'AyoLaundry', 'member', 'ayolaundry@gmail.com', '021334567', 20000, '$2a$12$K7NABKBhxDC.7sYlF7IhGuQMW/MB.abdTxpcd7mbNQViKOKgjywTS');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `topup`
--
ALTER TABLE `topup`
  ADD PRIMARY KEY (`id_topup`),
  ADD UNIQUE KEY `va` (`va`),
  ADD KEY `FKID2` (`id_user`);

--
-- Indexes for table `transaction`
--
ALTER TABLE `transaction`
  ADD PRIMARY KEY (`id_transaction`),
  ADD KEY `FKID` (`id_receiver`),
  ADD KEY `FKID3` (`id_sender`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id_user`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `topup`
--
ALTER TABLE `topup`
  MODIFY `id_topup` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `transaction`
--
ALTER TABLE `transaction`
  MODIFY `id_transaction` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `topup`
--
ALTER TABLE `topup`
  ADD CONSTRAINT `FKID2` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`);

--
-- Constraints for table `transaction`
--
ALTER TABLE `transaction`
  ADD CONSTRAINT `FKID` FOREIGN KEY (`id_receiver`) REFERENCES `user` (`id_user`),
  ADD CONSTRAINT `FKID3` FOREIGN KEY (`id_sender`) REFERENCES `user` (`id_user`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
