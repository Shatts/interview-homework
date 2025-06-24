-- Create database and user (if needed)
CREATE DATABASE IF NOT EXISTS mydatabase;
CREATE USER IF NOT EXISTS 'myuser'@'%' IDENTIFIED BY 'mypass';
GRANT ALL PRIVILEGES ON mydatabase.* TO 'myuser'@'%';
FLUSH PRIVILEGES;
