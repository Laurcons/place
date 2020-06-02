CREATE TABLE `place_history` (
  `Id` int(11) NOT NULL,
  `X` int(11) NOT NULL,
  `Y` int(11) NOT NULL,
  `Color` int(11) NOT NULL,
  `UserId` varchar(250) NOT NULL,
  `Timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

CREATE TABLE `place_requests` (
  `Id` int(11) NOT NULL,
  `RequestCode` varchar(250) NOT NULL,
  `UserId` varchar(250) NOT NULL,
  `LastUpdate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

CREATE TABLE `place_tiles` (
  `Id` int(11) NOT NULL,
  `X` int(11) NOT NULL,
  `Y` int(11) NOT NULL,
  `Color` tinyint(4) NOT NULL,
  `LastUserId` varchar(250) DEFAULT NULL,
  `Timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

CREATE TABLE `place_timestamps` (
  `Id` int(11) NOT NULL,
  `UserId` varchar(101) NOT NULL,
  `Timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

ALTER TABLE `place_history`
  ADD PRIMARY KEY (`Id`);

-- --------------------------------------------------------

ALTER TABLE `place_requests`
  ADD PRIMARY KEY (`Id`);

-- --------------------------------------------------------

ALTER TABLE `place_tiles`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `Place_Tiles_Unique` (`Y`,`X`),
  ADD KEY `X` (`X`),
  ADD KEY `Y` (`Y`);

-- --------------------------------------------------------

ALTER TABLE `place_timestamps`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `UserId` (`UserId`);

-- --------------------------------------------------------

ALTER TABLE `place_history`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

-- --------------------------------------------------------

ALTER TABLE `place_requests`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

-- --------------------------------------------------------

ALTER TABLE `place_tiles`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

-- --------------------------------------------------------

ALTER TABLE `place_timestamps`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;