--
-- Meme App Database
--
-- Current schema by Tristan Mastrodicasa
--

-- Generate database --

SELECT "Re-create the database" AS "INFO";

DROP DATABASE IF EXISTS meme_app;
CREATE DATABASE IF NOT EXISTS meme_app
	CHARACTER SET utf8mb4
	COLLATE utf8mb4_general_ci;

USE meme_app;

-- Clear tables --

SELECT "Clearing Tables" AS "INFO";

DROP TABLE IF EXISTS users,
                     user_statistics,
                     user_settings,
                     user_network,
                     user_activity,
                     canvas,
                     canvas_activity,
                     meme,
                     meme_activity;

-- Create tables --

SELECT "Creating New Tables" AS "INFO";

CREATE TABLE users (
  id          INT          NOT NULL AUTO_INCREMENT,
  fbid        INT,
  username    VARCHAR(25)  NOT NULL,
  firstName   VARCHAR(25)  NOT NULL,
  email       VARCHAR(255),
  profileImg  VARCHAR(64),                          -- Image Path

  PRIMARY KEY (id)
) ENGINE = INNODB;

CREATE TABLE user_statistics (
  id          INT          NOT NULL,
  influence   INT          NOT NULL DEFAULT 0,
  contentNum  INT          NOT NULL DEFAULT 0,      -- Number of Meme's / Canvases etc
  followers   INT          NOT NULL DEFAULT 0,
  following   INT          NOT NULL DEFAULT 0,

  FOREIGN KEY (id) REFERENCES users (id) ON DELETE CASCADE,
	PRIMARY KEY (id)
) ENGINE = INNODB;

-- CREATE TABLE user_settings (
--
-- ) ENGINE = INNODB;

CREATE TABLE user_network (
  id          INT          NOT NULL AUTO_INCREMENT,
  cuid        INT          NOT NULL,                -- Client Userid (The one following)
	huid        INT          NOT NULL,                -- Host Userid
  utc         DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (cuid) REFERENCES users (id) ON DELETE CASCADE,
	FOREIGN KEY (huid) REFERENCES users (id) ON DELETE CASCADE,
  PRIMARY KEY (id)
) ENGINE = INNODB;

CREATE TABLE user_activity (
  id          INT          NOT NULL AUTO_INCREMENT,
  cuid        INT          NOT NULL,
  huid        INT,
  action      ENUM('profile_update'
              )            NOT NULL,                -- The action the client user is taking on the host

  FOREIGN KEY (cuid) REFERENCES users (id) ON DELETE CASCADE,
	FOREIGN KEY (huid) REFERENCES users (id) ON DELETE CASCADE,
  PRIMARY KEY (id)
) ENGINE = INNODB;

CREATE TABLE canvas (
  id          INT          NOT NULL AUTO_INCREMENT,
  uid         INT          NOT NULL,
  description VARCHAR(255),
  imagePath   VARCHAR(64)  NOT NULL,                -- Image Path
  visibility  ENUM('public',
                   'followers',
                   'follow_backs',
                   'specific_users'
                 )         NOT NULL,
  stars       INT          NOT NULL DEFAULT 0,
  utc         DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (uid) REFERENCES users (id) ON DELETE CASCADE,
	PRIMARY KEY (id)
) ENGINE = INNODB;

CREATE TABLE canvas_activity (
  id          INT          NOT NULL AUTO_INCREMENT,
  cid         INT          NOT NULL,
  uid         INT,
  action      ENUM('allowed_access',
                   'updated',
                   'starred'
              )            NOT NULL,
  utc         DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (cid) REFERENCES canvas (id) ON DELETE CASCADE,
  FOREIGN KEY (uid) REFERENCES users (id) ON DELETE CASCADE,
  PRIMARY KEY (id)
) ENGINE = INNODB;

CREATE TABLE meme (
  id          INT          NOT NULL AUTO_INCREMENT,
  cid         INT          NOT NULL,
  uid         INT          NOT NULL,
  imagePath   VARCHAR(64)  NOT NULL,                -- Image Path
  stars       INT          NOT NULL DEFAULT 0,
  listed      TINYINT(1)   NOT NULL,                -- Is the meme listed on their profile
  utc         DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (cid) REFERENCES canvas (id) ON DELETE CASCADE,
  FOREIGN KEY (uid) REFERENCES users (id) ON DELETE CASCADE,
  PRIMARY KEY (id)
) ENGINE = INNODB;

CREATE TABLE meme_activity (
  id          INT          NOT NULL AUTO_INCREMENT,
  mid         INT          NOT NULL,
  uid         INT,
  action      ENUM('updated',
                   'starred'
                 )         NOT NULL,
  utc         DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (mid) REFERENCES meme (id) ON DELETE CASCADE,
  FOREIGN KEY (uid) REFERENCES users (id) ON DELETE CASCADE,
  PRIMARY KEY (id)
) ENGINE = INNODB;

SELECT "Done" AS "INFO";
