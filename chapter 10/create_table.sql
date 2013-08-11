--
-- Table structure for table `scores`
--

CREATE TABLE `scores` (
  `level` int(11) NOT NULL,
  `name` varchar(128) NOT NULL,
  `time` bigint(20) NOT NULL,
  KEY `level` (`level`)
);