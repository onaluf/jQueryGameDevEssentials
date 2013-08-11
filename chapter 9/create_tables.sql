--
-- Table structure for table `enemies`
--

CREATE TABLE `enemies` (
  `name` varchar(32) NOT NULL,
  `type` varchar(32) NOT NULL,
  `x` double NOT NULL,
  `y` double NOT NULL,
  `life` int(11) NOT NULL,
  `defense` int(11) NOT NULL,
  `spawn` double NOT NULL,
  UNIQUE KEY `name` (`name`)
);

--
-- Table structure for table `players`
--

CREATE TABLE `players` (
  `name` varchar(32) NOT NULL,
  `x` double NOT NULL DEFAULT '0',
  `y` double NOT NULL DEFAULT '0',
  `dir` int(11) NOT NULL DEFAULT '0',
  `pw` varchar(256) NOT NULL,
  `state` int(11) NOT NULL,
  `lastupdate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `name` (`name`)
);