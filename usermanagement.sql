-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Feb 08, 2023 at 11:42 AM
-- Server version: 10.1.16-MariaDB
-- PHP Version: 5.6.24

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `usermanagement`
--

-- --------------------------------------------------------

--
-- Table structure for table `districts`
--

CREATE TABLE `districts` (
  `DistrictId` int(4) NOT NULL,
  `DistrictName` varchar(50) NOT NULL,
  `ProvinceId` int(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `districts`
--

INSERT INTO `districts` (`DistrictId`, `DistrictName`, `ProvinceId`) VALUES
(1, 'ເມືອງ ສີສັດຕະນາກ', 1),
(2, 'ເມືອງ ໄຊທານີ', 1),
(3, 'ເມືອງ ໄຊເສດຖາ', 1),
(4, 'ວຽງຄຳ', 2),
(5, 'ໂພນໂຮງ', 2),
(6, 'ແກ້ວອຸດົມ', 2),
(7, 'ພູກູດ', 3),
(8, 'ແປກ', 3),
(9, 'ໜອງແຮດ', 3),
(10, 'ຄຳ', 3),
(12, 'ທ່າໂທມ', 4),
(13, 'ລ້ອງຊານ', 14),
(14, 'ໜອງວຽງຄຳ', 13),
(15, 'ໄຊທານີ', 13),
(16, 'ຫາດຊາຍຟອງ', 13),
(17, 'ຈັນທະບູລີ', 13),
(18, 'ຄຳເກີດ', 5),
(19, 'ນາຊາຍທອງ', 6),
(20, 'ນ້ຳລ້ອນ', 18);

-- --------------------------------------------------------

--
-- Table structure for table `historylogin`
--

CREATE TABLE `historylogin` (
  `LoginId` int(4) NOT NULL,
  `History` date NOT NULL,
  `Htime` time NOT NULL,
  `UserId` int(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `historylogin`
--

INSERT INTO `historylogin` (`LoginId`, `History`, `Htime`, `UserId`) VALUES
(1, '2023-01-22', '12:02:52', 11),
(2, '2023-01-22', '12:41:53', 11),
(3, '2023-01-23', '08:56:04', 11),
(4, '2023-01-23', '08:56:05', 11),
(5, '2023-01-23', '08:56:06', 11),
(6, '2023-01-23', '09:31:21', 21),
(7, '2023-01-23', '09:34:24', 11),
(8, '2023-01-24', '19:09:38', 11),
(9, '2023-01-29', '10:10:09', 26),
(10, '2023-01-29', '11:11:41', 11),
(11, '2023-01-29', '11:14:41', 11),
(12, '2023-01-29', '11:41:37', 26),
(13, '2023-01-29', '11:48:35', 11),
(14, '2023-01-29', '11:48:58', 26),
(15, '2023-01-29', '12:08:48', 26),
(16, '2023-01-29', '12:30:27', 11),
(17, '2023-01-29', '12:32:51', 11),
(18, '2023-01-29', '12:32:53', 11),
(19, '2023-01-29', '12:33:52', 11),
(20, '2023-01-29', '18:52:55', 11),
(21, '2023-01-30', '10:02:54', 11),
(22, '2023-01-30', '11:05:06', 26),
(23, '2023-01-30', '11:12:42', 11),
(24, '2023-01-31', '18:01:12', 11),
(25, '2023-01-31', '18:39:03', 26),
(26, '2023-01-31', '18:43:33', 11),
(27, '2023-01-31', '19:07:06', 11),
(28, '2023-02-02', '18:17:02', 11),
(29, '2023-02-02', '20:12:26', 26),
(30, '2023-02-04', '10:53:15', 11),
(31, '2023-02-04', '12:52:40', 11),
(32, '2023-02-04', '12:54:00', 25),
(33, '2023-02-04', '12:55:46', 11),
(34, '2023-02-04', '16:12:07', 11),
(35, '2023-02-04', '16:31:58', 11),
(36, '2023-02-04', '16:32:25', 11),
(37, '2023-02-04', '16:41:18', 26),
(38, '2023-02-04', '16:41:44', 11),
(39, '2023-02-04', '19:39:40', 11),
(40, '2023-02-04', '19:40:25', 3),
(41, '2023-02-04', '19:40:58', 11),
(42, '2023-02-04', '20:07:37', 21),
(43, '2023-02-07', '18:51:26', 11),
(44, '2023-02-07', '19:46:48', 11);

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `PermissionId` int(4) NOT NULL,
  `RoleId` int(4) NOT NULL,
  `UserId` int(4) NOT NULL,
  `PermCreate` int(2) NOT NULL,
  `PermRead` int(2) NOT NULL,
  `PermUpdate` int(2) NOT NULL,
  `PermDelete` int(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`PermissionId`, `RoleId`, `UserId`, `PermCreate`, `PermRead`, `PermUpdate`, `PermDelete`) VALUES
(2, 3, 2, 1, 1, 1, 0),
(3, 2, 3, 0, 1, 1, 0),
(9, 1, 11, 1, 1, 1, 1),
(22, 2, 20, 1, 0, 0, 0),
(23, 2, 21, 1, 1, 0, 0),
(24, 2, 22, 1, 1, 0, 0),
(26, 2, 24, 1, 1, 0, 0),
(27, 2, 25, 0, 1, 0, 0),
(28, 3, 26, 1, 1, 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `profiles`
--

CREATE TABLE `profiles` (
  `ProfileId` int(4) NOT NULL,
  `FirstName` varchar(30) NOT NULL,
  `LastName` varchar(30) NOT NULL,
  `Gender` varchar(6) NOT NULL,
  `Dob` date NOT NULL,
  `Img` varchar(255) NOT NULL,
  `VillageName` varchar(40) NOT NULL,
  `DistrictId` int(4) NOT NULL,
  `ProvinceId` int(4) NOT NULL,
  `UserId` int(4) NOT NULL,
  `updatedAt` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `profiles`
--

INSERT INTO `profiles` (`ProfileId`, `FirstName`, `LastName`, `Gender`, `Dob`, `Img`, `VillageName`, `DistrictId`, `ProvinceId`, `UserId`, `updatedAt`) VALUES
(2, 'Thortou', 'HER', 'ຊາຍ', '2023-01-05', 'image-1674188877928.jpg', 'ນ້ຳປົ່ງ', 13, 14, 2, '2023-01-20'),
(3, 'yeng', 'yang', 'ຍິງ', '2023-01-11', 'image-1673706134471.jpg', 'ນ້ຳຈັດ', 7, 3, 3, '2023-01-14'),
(9, 'ຊີ', 'ວ່າງ', 'ຊາຍ', '1999-09-10', 'image-1673757296678.png', 'ນ້ຳຈັດ', 7, 3, 11, '2023-01-15'),
(18, 'ຫວາກົ້ງ', 'ຢ່າງ', 'ຊາຍ', '2003-01-20', 'image-1673702289971.png', 'viengkham', 4, 2, 20, '2023-01-20'),
(19, 'ແສງເດືອນ', 'ສິຫາລາດ', 'ຍິງ', '2023-02-03', 'image-1673919140882.png', 'ໜອງຕັ່ງ', 7, 3, 21, '2023-02-04'),
(20, 'ດົງປະລາໄຊ', 'ຫະນະດອນ', 'ຍິງ', '2023-01-20', 'image-1674189151881.jpg', 'ຫນອງແຕ່ງ', 16, 13, 22, '2023-01-20'),
(22, 'ເຢັ່ງຢ່າງ', 'ສິຫາລາດ', 'ຊາຍ', '2006-01-16', 'image-1673879648617.jpg', 'ວັນສະໃໝ່', 8, 3, 24, '0000-00-00'),
(23, 'ແຢ້', 'ຫາວັນ', 'ຊາຍ', '1998-05-10', 'image-1673879760362.jpg', 'ນ້ຳຈັດ', 7, 3, 25, '0000-00-00'),
(24, 'kongYaj', 'yaj', 'female', '0000-00-00', 'image-1674961773043.png', 'ນ້ຳຈັດ', 7, 3, 26, '2023-01-30');

-- --------------------------------------------------------

--
-- Table structure for table `provinces`
--

CREATE TABLE `provinces` (
  `ProvinceId` int(4) NOT NULL,
  `ProvinceName` varchar(40) NOT NULL,
  `document` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `provinces`
--

INSERT INTO `provinces` (`ProvinceId`, `ProvinceName`, `document`) VALUES
(2, 'ວຽງຈັນ', 'ເມືອງເກົ່າໄຜ່ໜາມ ລືນນານອ່ານນໍ້າງື່ມ ຕຳນານເດີນລາຍງ້າວ ອູ້ເຂົ້າຊາວເມືອງ ຄົນເຮືອງຂັບງື່ມ ດຶ່ມດຳທຳມະຊາດ ປະຊາລາດສາມັກຄີ'),
(3, 'ຊຽງຂວາງ', 'ພູກູດມີໄຊ ທົ່ງໄຫຫີນລືນາມ ສາວງາມເມືອງພວນ ເຊີນຊວນທ່ຽວແຂວງວິລະຊົນ'),
(4, ' ຜົ້ງສາລີ', ' ຜົ້ງສາລີ ປຽບຄືດັ່ງສະຫວັນສັ່ງ ວິມານດ່ານແດນພູດອຍ ເປັນດິນແດນວິລະຊົນ ຮັກຄອນພົງພັນເຊື້ອ ງາມເຫຼືອຫຼາຍພູຟ້າ ທະເລຫຼວງໝອກໃຫຍ່ ເຊີນຊີມປາພູຟ້າ ດື່ມເຫຼົ້າຂຽວເອ່ວສະຖານທີ່ ເບິ່ງຮີດຄອງປະເພນີ ເອກະລັດຫຼາຍເຜົ່າເຊື້ອ ເປັນຂອງຕ້ອນທ່ານຜູ້ຊົມ'),
(5, 'ບໍລິຄຳໄຊ', 'ຖິ່ນອາໃສສາວເມີ້ຍຜູ້ໂສພາ ຖິ່ນຢູ່ໂຕເສົາຫຼາ ໄມ້ເກດສະໜາຄ່າແພງ ທົ່ງນາແຊງກ້ວາງໃກພະບາດໃຫຍ່ໂພນສັນ ຄົນຊ່າລີກ່າວເອີ້ນ ແດນກຸຫຼາບປາກຊັນ'),
(6, 'ສະຫວັນນະເຂດ', 'ສະຫວັນນະເຂດຜືນແຜ່ນດິນຄຳ ພະທາດອີງຮັງສະຖານບູຮານງານສະຫງ່າສັດໂລກ ໄດໂນເຊົາຮ້ອຍລ້ານປີ ປະເພນີວັດທະນາທຳລ້ຳເລີດ ກຳເນີດຂັບລຳ 4 ຈັງຫວະ\n'),
(7, 'ສາລະວັນ', 'ໝາກພ້າວນາໄຊ ປີ້ງໄກ່ນາປົ່ງ ເຫຼົ້າຂາວເມືອງຄົງ ລຳວົງສາລະວັນ'),
(8, 'ບໍ່ແກ້ວ', 'ບໍ່ແກ້ວມະນີລໍ້າຄ່າ ຊົມປ່າດອກງີ້ວບານ ເທດສະການບັນດາເຜົ່າ ຖິ່ນເມືອງເກົ່າສຸວັນນະໂຄມຄຳ ຊົມຖໍ້ານໍ້າຍູ້ ອູ້ສາວລາວຢວນ ຊວນຊົມວັດຈອມເຂົາມະນີລັດ ໄຫວ້ພະທາດສຸວັນນະຜາຄຳ'),
(10, 'ຫຼວງພະບາງ', 'ຫຼວງພະບາງເມືອງງາມ ອາຮາມຮຸ່ງເຮືອງ ງາມພູຕັ້ງຢູ່ກາງເມືອງ ເລືອງລືວັດທະນະທຳ ເມືອງ ນຸ່ງສິ້ນໄໝ ຂວັນໃຈນັກທ່ອງທ່ຽວ ເອາະຫຼາມໃສ່ສະຂ່ານ ງາມຊ່ວງເຮືອເດືອນ 9 ເມືອງກ້ຽງຄຳຫວານ ຕຳນານເມືອງ ຂຳທຸ່ມ ວັດເກົ່າແກ່ມາກມີ ຕາດກວາງຊີ ແລະ ຖໍ້າຕິ່ງເປັນເມືອງມໍລະດົກໂລກ'),
(13, 'ນະຄອນຫຼວງວຽງຈັນ', 'ມາວຽງຈັນ ຊົມຂົວມິດຕະພາບ ກາບໄຫ້ຫໍພຼະແກ້ວ ຊົມສວນປະຕູໄຊ ໄຫ້ວພຼະທາດຫຼວງມິ່ງຂວັນ ຊົມວິວທິວທັດແຄມຂອງ ຫາດຊາຍສີທອງດອນຈັນ ຊີມລົດອາຫານນາໆຊາດ ເທີງຫໍຜາສາດສີ່ສິບຊັ້ນພັກຜ່ອນເທີງວິມານສະຫວັນ ໂຮງແຮມດອນຈັນພາເລດ ລືນາມ'),
(14, 'ໄຊສົມບຸນ', 'Welcome to xaysomboun'),
(15, 'ຄຳມ່ວນ', 'ຄຳມ່ວນດິນແດນທຳມະຊາດ ປະຫວັດສາດວິລະຊົນ ຕົ້ນກຳເນີດລຳພະຫຍາມະຫາໄຊ ກິນຊູບໜໍ່ໄມ້ ແກງໄມ້ໃສ່ສາມ ນະມັດສະການພະທາດສີໂຄດຕະບອງ ເປັນເຈົ້າຂອງເຂົ້າໜົມປ່ານ ປະສານປວງປະຊາເລັ່ງລັດພັດທະນາ ຊ່ວຍປະຊາໃຫ້ມີສຸກ'),
(16, 'ໄຊຍະບູລີ', 'ງາມທາດປວກ ເມືອງ ຄອບ ປະນົມນ້ອມພະທາດມັດຄຳ ເມືອງ ເງິນແສນເພີດເພີນພະທາດຊຽງລົມ ເມືອງ ຊຽງຮ່ອນ ອອນຊອນບຸນບັ້ງໄຟ ເມືອງ ປາກລາຍ ງາມເຫຼືອຫຼາຍ ສາວດອກຝ້າຍຈັນເມືອງ ແກ່ນທ້າວ ຫວານນ້ຳໜາກພ້າວ ເມືອງ ບໍ່ແຕນ ແດນພູເຂົາຊ້າງ ເມືອງ ຫົງສາ - ເມືອງ ທົ່ງ ຮວງເຂົ້າກົ່ງເມືອງພຽງສຽງຂັບລຳລ່ອ'),
(17, 'ອຸດົມໄຊ', 'ທ່ຽວອຸດົມໄຊ ໄປຊົມທຳມະຊາດ ນໍ້າຕົກຕາກຫົວນໍ້າກັດ ຊົມວັດທະນະທຳຊົນເຜົ່າ ໄຫ້ວພຼະເຈົ້າສິງຄຳ ດື່ມນໍ້າຊາພັນປີ ຂີ່ເຮືອທ່ອງທ່ຽວ ຊົມທຳມະຊາດແຄມຂອງ'),
(18, 'ຫຼວງນ້ຳທາ', 'ບັ້ນຮົບຫຼວງນໍ້າທາ ພະທາດໃຫຍ່ຊຽງເປງ ຊາບຊຶ້ງກັບວັນທະນະທຳຫຼາວເຜົ່າ ເຂົ້າຊອຍແຊບເມືອງສິງ ລີງລາຍແພໄໝມ້ອນ ເມືອງ ຫຼວງນໍ້າທາ ທ່ຽວປ່າສະຫງວນແຫ່ງຊາກນ້ຳຮ່າ ເຂດພັດທະນາ ເສດຖຸກິດພິເສດບໍ່ເຕັມແດນຄຳ ຮ່ວມເຕັ້ນແຊນຳສາວໄຕດຳ ງາມແທ້ລະກຳ'),
(19, 'ຈຳປາສັກ', 'ເອກະລັກວັດພູ ກຸຫລາບປາກເຊ ກາເຟປາກຊ່ອງ ນໍ້າຂອງໂຕນຄອນ ສີພັນດອນລືນາມ\n'),
(20, 'ອັດຕະປື', 'ລຳນໍ້າໃສປ່າໄມ້ຂຽວ ທ່ອງທ່ຽວໜອງຟ້າ ຊົມຜາຮຽງຊານໄຊ ໄຫ້ວພະອົງແສນ ພັກແດນສາມັກຄີ'),
(21, 'ຫົວພັນ', 'ງົມງາມພູຜາ ນໍ້າມ້ສ່ອງໃສ ວຽງໄຊປະຫວັດສາດ ຜ້າໄໝຊຳໃຕ້ ຫີນຕັ້ງຫົວເມືອງ ຖິ່ນພູສາມເຊົ່າ ຄົກເຂົ້ານໍ້າລິນ ແຜ່ນດິນວິລະຊົນ'),
(22, 'ເຊກອງ', 'ເອກະລັກພູນາງລາວ ແວວວາວຄ່ານ່າຊື່ນໃຈ ທ່ຽວວັງໄວດື່ມເຫຼົ້າໄຫ ເມືອງ ດາກຈຶງ ຄະນຶງຫາ ສາຍທາລາຕົກຕາດແສກ ແປດພະໄທຢ່າລືມໄປຂໍປັນກອບ ບອກຄວາມສາມັກຄີ ໄປຮູ້ຈັກບຸນປະເພນີບັນດາເຜົ່າ');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `RoleId` int(4) NOT NULL,
  `RoleName` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`RoleId`, `RoleName`) VALUES
(1, 'admin'),
(2, 'user'),
(3, 'manager');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `UserId` int(4) NOT NULL,
  `randId` varchar(50) NOT NULL,
  `UserName` varchar(40) NOT NULL,
  `Password` text NOT NULL,
  `Mobile` varchar(30) NOT NULL,
  `Email` varchar(50) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`UserId`, `randId`, `UserName`, `Password`, `Mobile`, `Email`, `createdAt`) VALUES
(2, '554609', 'thortou', '$2b$10$FqBtbga2GEW6boe0sTsZt.rCOIJ1mVZO0u/a6HRN5Q6lENVyh7Vmm', '02098980098', 'thortou@gmail.com', '2023-01-06 03:11:49'),
(3, '554583', 'YengYaj', '$2b$10$IatJUYDGcR7QcxZAOxR0..D4GbvWK6Iyd6AZK5Vvp0xE/v4FqzVxK', '02097878989', 'YengYaj55@gmail.com', '2023-01-06 03:11:49'),
(11, '554907', 'seeVang', '$2b$10$m4lbiwVinEXeN4fzAOiEyu4P2VUjauZrgqbr92pMvC9A7BidYuaYq', '02076968199', 'SeeVang-1999@gmail.com', '2023-01-06 03:11:49'),
(20, '555227', 'vangkouYang', '$2b$10$yer.1eEZITvB2HI/MhUJguHBdDUxsVM/qAv2AuSwZkdssxnbStKMq', '02077332287', 'vangkou1@gmail.com', '2023-01-10 08:02:16'),
(21, '554933', 'jameDev', '$2b$10$0UB0I6SSSo3lfGMGtSx8J.E4niHixiI.kvbIYRCzKui75523z6dCy', '02095728872', 'JameDev@gmail.com', '2023-01-12 06:52:19'),
(22, '554652', 'Chome', '$2b$10$v.NFqFYWmtHqiFq5wMC7Bu2I9Wqhh/rQ6ol82l65.wHYVV7qljGCW', '02099775508', 'chome@yahoo.com', '2023-01-13 03:38:31'),
(24, '555047', 'YeejNiam', '$2b$10$FmDY1eDNDPYAsAujwNKPPuHoXNHfufQ1tF.JcPUhtB7FKOuhDIWby', '02099873445', 'YeejNiam@yahoo.com', '2023-01-16 14:34:09'),
(25, '554682', 'yebHam', '$2b$10$A7pSCSU5J.f4xpAZgqSNDu1SqP/.moImRc5yArlvYRtdAgvbj8vZS', '02059904410', 'YebHam95@yahoo.com', '2023-01-16 14:36:00'),
(26, '554453', 'kongYaj', '$2b$10$2gOuwSo/lv7VjO3r8BlJ5uuvdcwlroq8hu.TM6Rtb6di7qxVVhhcG', '02099633234', 'kong@yahoodai.com', '2023-01-29 03:09:33');

-- --------------------------------------------------------

--
-- Table structure for table `users_has_roles`
--

CREATE TABLE `users_has_roles` (
  `UserId` int(4) NOT NULL,
  `RoleId` int(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users_has_roles`
--

INSERT INTO `users_has_roles` (`UserId`, `RoleId`) VALUES
(2, 3),
(3, 2),
(11, 1),
(20, 2),
(21, 2),
(22, 2),
(24, 2),
(25, 2),
(26, 3);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `districts`
--
ALTER TABLE `districts`
  ADD PRIMARY KEY (`DistrictId`),
  ADD KEY `ProvinceId` (`ProvinceId`);

--
-- Indexes for table `historylogin`
--
ALTER TABLE `historylogin`
  ADD PRIMARY KEY (`LoginId`),
  ADD KEY `UserId` (`UserId`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`PermissionId`),
  ADD KEY `RoleId` (`RoleId`),
  ADD KEY `UserId` (`UserId`);

--
-- Indexes for table `profiles`
--
ALTER TABLE `profiles`
  ADD PRIMARY KEY (`ProfileId`),
  ADD KEY `DistrictId` (`DistrictId`),
  ADD KEY `ProvinceId` (`ProvinceId`),
  ADD KEY `UserId` (`UserId`);

--
-- Indexes for table `provinces`
--
ALTER TABLE `provinces`
  ADD PRIMARY KEY (`ProvinceId`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`RoleId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`UserId`);

--
-- Indexes for table `users_has_roles`
--
ALTER TABLE `users_has_roles`
  ADD KEY `UserId` (`UserId`),
  ADD KEY `RoleId` (`RoleId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `districts`
--
ALTER TABLE `districts`
  MODIFY `DistrictId` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;
--
-- AUTO_INCREMENT for table `historylogin`
--
ALTER TABLE `historylogin`
  MODIFY `LoginId` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;
--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `PermissionId` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;
--
-- AUTO_INCREMENT for table `profiles`
--
ALTER TABLE `profiles`
  MODIFY `ProfileId` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;
--
-- AUTO_INCREMENT for table `provinces`
--
ALTER TABLE `provinces`
  MODIFY `ProvinceId` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;
--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `RoleId` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `UserId` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `districts`
--
ALTER TABLE `districts`
  ADD CONSTRAINT `districts_ibfk_1` FOREIGN KEY (`ProvinceId`) REFERENCES `provinces` (`ProvinceId`);

--
-- Constraints for table `historylogin`
--
ALTER TABLE `historylogin`
  ADD CONSTRAINT `historylogin_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `users` (`UserId`);

--
-- Constraints for table `permissions`
--
ALTER TABLE `permissions`
  ADD CONSTRAINT `permissions_ibfk_1` FOREIGN KEY (`RoleId`) REFERENCES `roles` (`RoleId`),
  ADD CONSTRAINT `permissions_ibfk_2` FOREIGN KEY (`UserId`) REFERENCES `users` (`UserId`);

--
-- Constraints for table `profiles`
--
ALTER TABLE `profiles`
  ADD CONSTRAINT `profiles_ibfk_1` FOREIGN KEY (`DistrictId`) REFERENCES `districts` (`DistrictId`),
  ADD CONSTRAINT `profiles_ibfk_2` FOREIGN KEY (`ProvinceId`) REFERENCES `provinces` (`ProvinceId`),
  ADD CONSTRAINT `profiles_ibfk_3` FOREIGN KEY (`UserId`) REFERENCES `users` (`UserId`);

--
-- Constraints for table `users_has_roles`
--
ALTER TABLE `users_has_roles`
  ADD CONSTRAINT `users_has_roles_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `users` (`UserId`),
  ADD CONSTRAINT `users_has_roles_ibfk_2` FOREIGN KEY (`RoleId`) REFERENCES `roles` (`RoleId`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
