# Dump of table user
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `firstName` varchar(25) NOT NULL DEFAULT '',
  `lastName` varchar(25) NOT NULL DEFAULT '',
  `password` varchar(20) NOT NULL DEFAULT '',
  `username` varchar(20) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `user` WRITE;

INSERT INTO `user` (`id`, `firstName`, `lastName`, `password`, `username`)
VALUES
  (1,'Johnny','Doe','123','thedoezer');

UNLOCK TABLES;


# Dump of table user_email
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_email`;

CREATE TABLE `user_email` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userId` int(11) unsigned NOT NULL,
  `email` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `user_email_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `user_email` WRITE;

INSERT INTO `user_email` (`id`, `userId`, `email`)
VALUES
  (1,1,'doezer123@gmail.com');

UNLOCK TABLES;


# Dump of table user_phone
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_phone`;

CREATE TABLE `user_phone` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userId` int(11) unsigned NOT NULL,
  `phone` varchar(12) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `user_phone_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `user_phone` WRITE;

INSERT INTO `user_phone` (`id`, `userId`, `phone`)
VALUES
  (2,1,'801-987-6543');

UNLOCK TABLES;


