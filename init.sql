CREATE DATABASE IF NOT EXISTS shopping_cart;
USE shopping_cart;
-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: shopping_cart
-- ------------------------------------------------------
-- Server version	8.0.34

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `CartItems`
--

DROP TABLE IF EXISTS `CartItems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CartItems` (
  `id` int NOT NULL AUTO_INCREMENT,
  `CartId` int DEFAULT NULL,
  `ProductId` int DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CartItems`
--

LOCK TABLES `CartItems` WRITE;
/*!40000 ALTER TABLE `CartItems` DISABLE KEYS */;
INSERT INTO `CartItems` VALUES (1,2,6,3,'2023-08-29 03:43:23','2023-08-29 03:43:23'),(2,2,10,3,'2023-08-29 03:43:23','2023-08-29 03:43:23'),(3,2,8,3,'2023-08-29 03:43:23','2023-08-29 03:43:23'),(4,3,2,1,'2023-08-29 03:43:23','2023-08-29 03:43:23'),(5,2,10,5,'2023-08-29 03:43:23','2023-08-29 03:43:23'),(6,1,9,3,'2023-08-29 03:43:23','2023-08-29 03:43:23'),(7,2,3,5,'2023-08-29 03:43:23','2023-08-29 03:43:23'),(8,3,4,5,'2023-08-29 03:43:23','2023-08-29 03:43:23'),(9,2,7,3,'2023-08-29 03:43:23','2023-08-29 03:43:23'),(10,3,7,4,'2023-08-29 03:43:23','2023-08-29 03:43:23'),(11,3,1,2,'2023-08-29 03:43:23','2023-08-29 03:43:23'),(12,2,6,5,'2023-08-29 03:43:23','2023-08-29 03:43:23'),(13,3,7,3,'2023-08-29 03:43:23','2023-08-29 03:43:23'),(14,2,9,5,'2023-08-29 03:43:23','2023-08-29 03:43:23'),(15,1,9,4,'2023-08-29 03:43:23','2023-08-29 03:43:23'),(16,3,3,2,'2023-08-29 03:43:23','2023-08-29 03:43:23'),(17,3,7,1,'2023-08-29 03:43:23','2023-08-29 03:43:23'),(18,3,2,4,'2023-08-29 03:43:23','2023-08-29 03:43:23'),(19,3,4,2,'2023-08-29 03:43:23','2023-08-29 03:43:23'),(20,1,10,3,'2023-08-29 03:43:23','2023-08-29 03:43:23'),(21,4,2,1,'2023-08-29 08:20:48','2023-08-29 08:20:48'),(22,4,7,1,'2023-08-29 08:20:50','2023-08-29 08:20:50'),(24,6,6,1,'2023-08-29 16:07:09','2023-08-29 16:07:09'),(25,7,6,1,'2023-08-29 16:08:08','2023-08-29 16:08:08'),(26,8,5,2,'2023-08-30 02:52:10','2023-08-30 02:52:13');
/*!40000 ALTER TABLE `CartItems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Carts`
--

DROP TABLE IF EXISTS `Carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Carts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Carts`
--

LOCK TABLES `Carts` WRITE;
/*!40000 ALTER TABLE `Carts` DISABLE KEYS */;
INSERT INTO `Carts` VALUES (1,'2023-08-29 03:43:23','2023-08-29 03:43:23'),(2,'2023-08-29 03:43:23','2023-08-29 03:43:23'),(3,'2023-08-29 03:43:23','2023-08-29 03:43:23'),(4,'2023-08-29 08:20:48','2023-08-29 08:20:48'),(5,'2023-08-29 15:24:33','2023-08-29 15:24:33'),(6,'2023-08-29 16:07:09','2023-08-29 16:07:09'),(7,'2023-08-29 16:08:08','2023-08-29 16:08:08'),(8,'2023-08-30 02:52:10','2023-08-30 02:52:10');
/*!40000 ALTER TABLE `Carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Categories`
--

DROP TABLE IF EXISTS `Categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `status` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Categories`
--

LOCK TABLES `Categories` WRITE;
/*!40000 ALTER TABLE `Categories` DISABLE KEYS */;
INSERT INTO `Categories` VALUES (1,'食物','2023-08-29 03:43:23','2023-08-29 15:48:53',1),(11,'衣物','2023-08-29 03:43:23','2023-08-29 03:43:23',1),(21,'休閒娛樂','2023-08-29 03:43:23','2023-08-29 03:43:23',1),(31,'住家裝飾','2023-08-29 03:43:23','2023-08-29 03:43:23',1),(41,'書籍','2023-08-29 03:43:23','2023-08-29 03:43:23',1),(51,'其它','2023-08-29 03:43:23','2023-08-29 03:43:23',1);
/*!40000 ALTER TABLE `Categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Favorites`
--

DROP TABLE IF EXISTS `Favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Favorites` (
  `id` int NOT NULL AUTO_INCREMENT,
  `UserId` int DEFAULT NULL,
  `ProductId` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Favorites`
--

LOCK TABLES `Favorites` WRITE;
/*!40000 ALTER TABLE `Favorites` DISABLE KEYS */;
INSERT INTO `Favorites` VALUES (1,2,2,'2023-08-29 08:20:47','2023-08-29 08:20:47'),(2,2,1,'2023-08-29 08:20:52','2023-08-29 08:20:52'),(3,1,2,'2023-08-29 15:27:41','2023-08-29 15:27:41'),(5,1,6,'2023-08-29 15:28:51','2023-08-29 15:28:51'),(6,1,7,'2023-08-29 15:58:26','2023-08-29 15:58:26');
/*!40000 ALTER TABLE `Favorites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `OrderItems`
--

DROP TABLE IF EXISTS `OrderItems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `OrderItems` (
  `id` int NOT NULL AUTO_INCREMENT,
  `price` int DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `OrderId` int DEFAULT NULL,
  `ProductId` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `subtotal` int DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `OrderItems`
--

LOCK TABLES `OrderItems` WRITE;
/*!40000 ALTER TABLE `OrderItems` DISABLE KEYS */;
INSERT INTO `OrderItems` VALUES (1,319,9,2,1,'2023-08-29 03:43:23','2023-08-29 03:43:23',0),(2,322,1,2,2,'2023-08-29 03:43:23','2023-08-29 03:43:23',0),(3,64,2,2,5,'2023-08-29 03:43:23','2023-08-29 03:43:23',0),(4,421,10,1,2,'2023-08-29 03:43:23','2023-08-29 03:43:23',0),(5,214,10,2,5,'2023-08-29 03:43:23','2023-08-29 03:43:23',0),(6,179,2,1,3,'2023-08-29 03:43:23','2023-08-29 03:43:23',0),(7,163,9,2,8,'2023-08-29 03:43:23','2023-08-29 03:43:23',0),(8,200,2,2,9,'2023-08-29 03:43:23','2023-08-29 03:43:23',0),(9,113,1,1,7,'2023-08-29 03:43:23','2023-08-29 03:43:23',0),(10,334,1,1,3,'2023-08-29 03:43:23','2023-08-29 03:43:23',0),(11,965,1,3,2,'2023-08-29 08:21:01','2023-08-29 08:21:01',965),(12,833,1,3,7,'2023-08-29 08:21:01','2023-08-29 08:21:01',833),(13,128,2,4,5,'2023-08-30 02:52:23','2023-08-30 02:52:23',256);
/*!40000 ALTER TABLE `OrderItems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Orders`
--

DROP TABLE IF EXISTS `Orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `amount` int DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `sn` bigint DEFAULT NULL,
  `payment_status` varchar(255) DEFAULT NULL,
  `shipping_status` varchar(255) DEFAULT NULL,
  `UserId` int DEFAULT NULL,
  `PaymentMethodId` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Orders`
--

LOCK TABLES `Orders` WRITE;
/*!40000 ALTER TABLE `Orders` DISABLE KEYS */;
INSERT INTO `Orders` VALUES (1,'Practical Rubber Bike',83764,'744-352-1885 x7185','1291 Mina Villages',72229,'已付款','出貨完成',1,21,'2023-08-29 03:43:23','2023-08-29 03:43:23'),(2,'Practical Metal Keyboard',10377,'(332) 233-1691 x1162','93203 Osinski Springs',20991,'未付款','已出貨',1,21,'2023-08-29 03:43:23','2023-08-29 03:43:23'),(3,'321',1798,'321','321',1693297651463,'款項待確認','出貨準備中',2,1,'2023-08-29 08:21:01','2023-08-29 09:12:03'),(4,'22',256,'12','12',NULL,'尚未付款','尚未出貨',1,11,'2023-08-30 02:52:23','2023-08-30 02:52:23');
/*!40000 ALTER TABLE `Orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PaymentMethods`
--

DROP TABLE IF EXISTS `PaymentMethods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PaymentMethods` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `description` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PaymentMethods`
--

LOCK TABLES `PaymentMethods` WRITE;
/*!40000 ALTER TABLE `PaymentMethods` DISABLE KEYS */;
INSERT INTO `PaymentMethods` VALUES (1,'ATM轉帳',1,'ATM轉帳','2023-08-29 03:43:23','2023-08-29 03:43:23'),(11,'信用卡',1,'信用卡','2023-08-29 03:43:23','2023-08-29 03:43:23'),(21,'現金',1,'現金','2023-08-29 03:43:23','2023-08-29 03:43:23');
/*!40000 ALTER TABLE `PaymentMethods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Payments`
--

DROP TABLE IF EXISTS `Payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `amount` int DEFAULT NULL,
  `sn` bigint DEFAULT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  `paid_at` datetime DEFAULT NULL,
  `params` text,
  `OrderId` int DEFAULT NULL,
  `PaymentMethodId` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Payments`
--

LOCK TABLES `Payments` WRITE;
/*!40000 ALTER TABLE `Payments` DISABLE KEYS */;
INSERT INTO `Payments` VALUES (1,2296,31851,'3','2023-08-29 03:43:23',NULL,2,21,'2023-08-29 03:43:23','2023-08-29 03:43:23'),(2,98661,23317,'1','2023-08-29 03:43:23',NULL,2,21,'2023-08-29 03:43:23','2023-08-29 03:43:23'),(3,43123,36744,'3','2023-08-29 03:43:23',NULL,2,21,'2023-08-29 03:43:23','2023-08-29 03:43:23'),(4,39039,45013,'1','2023-08-29 03:43:23',NULL,1,21,'2023-08-29 03:43:23','2023-08-29 03:43:23'),(5,74563,86282,'1','2023-08-29 03:43:23',NULL,1,21,'2023-08-29 03:43:23','2023-08-29 03:43:23');
/*!40000 ALTER TABLE `Payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Products`
--

DROP TABLE IF EXISTS `Products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `price` int DEFAULT NULL,
  `description` text,
  `image` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `CategoryId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Products_CategoryId_foreign_idx` (`CategoryId`),
  CONSTRAINT `Products_CategoryId_foreign_idx` FOREIGN KEY (`CategoryId`) REFERENCES `Categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Products`
--

LOCK TABLES `Products` WRITE;
/*!40000 ALTER TABLE `Products` DISABLE KEYS */;
INSERT INTO `Products` VALUES (1,'Small Concrete Bacon',589,'Computer/Refined Wooden Table','https://shopping-cart-tj.s3.ap-southeast-1.amazonaws.com/sushi-8113165_1280.jpg','2023-08-29 03:43:23','2023-08-29 03:43:23',41),(2,'Sleek Soft Bacon',965,'Shirt/Handmade Frozen Hat','https://shopping-cart-tj.s3.ap-southeast-1.amazonaws.com/macbook-459196_1280.jpg','2023-08-29 03:43:23','2023-08-29 03:43:23',51),(3,'Unbranded Frozen Pizza',367,'Towels/Gorgeous Cotton Chicken','https://shopping-cart-tj.s3.ap-southeast-1.amazonaws.com/bird-8155768_1280.jpg','2023-08-29 03:43:23','2023-08-29 03:43:23',51),(4,'Small Metal Mouse',757,'Computer/Ergonomic Steel Mouse','https://shopping-cart-tj.s3.ap-southeast-1.amazonaws.com/asparagus-2169305_1280.jpg','2023-08-29 03:43:23','2023-08-29 03:43:23',31),(5,'Refined Soft Shirt',128,'Table/Small Soft Bacon','https://shopping-cart-tj.s3.ap-southeast-1.amazonaws.com/ice-cream-1274894_1280.jpg','2023-08-29 03:43:23','2023-08-29 03:43:23',1),(6,'Unbranded Granite Soap',857,'Towels/Gorgeous Steel Bike','https://shopping-cart-tj.s3.ap-southeast-1.amazonaws.com/lemon-butterflyfish-380037_1280.jpg','2023-08-29 03:43:23','2023-08-29 03:43:23',31),(7,'Handmade Metal Bacon',833,'Table/Handmade Rubber Shoes','https://shopping-cart-tj.s3.ap-southeast-1.amazonaws.com/macarons-2548827_1280.jpg','2023-08-29 03:43:23','2023-08-29 03:43:23',51),(8,'Ergonomic Granite Pants',151,'Sausages/Refined Plastic Hat','https://shopping-cart-tj.s3.ap-southeast-1.amazonaws.com/beef-20678_1280.jpg','2023-08-29 03:43:23','2023-08-29 03:43:23',31),(9,'Refined Wooden Gloves',36,'Car/Handmade Rubber Pizza','https://shopping-cart-tj.s3.ap-southeast-1.amazonaws.com/tea-783352_1280.jpg','2023-08-29 03:43:23','2023-08-29 03:43:23',31),(10,'Unbranded Fresh Cheese',273,'Tuna/Licensed Plastic Fish','https://shopping-cart-tj.s3.ap-southeast-1.amazonaws.com/cherry-cake-8152717_1280.jpg','2023-08-29 03:43:23','2023-08-29 03:43:23',41),(11,'123',123,'123','','2023-08-30 03:18:40','2023-08-30 03:18:40',31),(12,'321',321,'321','','2023-08-30 03:18:47','2023-08-30 03:18:47',31),(13,'222',222,'222','','2023-08-30 03:18:52','2023-08-30 03:18:52',31);
/*!40000 ALTER TABLE `Products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SequelizeMeta`
--

DROP TABLE IF EXISTS `SequelizeMeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SequelizeMeta` (
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SequelizeMeta`
--

LOCK TABLES `SequelizeMeta` WRITE;
/*!40000 ALTER TABLE `SequelizeMeta` DISABLE KEYS */;
INSERT INTO `SequelizeMeta` VALUES ('20211001150020-create-product.js'),('20211001150043-create-cart.js'),('20211001150110-create-cart-item.js'),('20211001150211-create-order.js'),('20211001150328-create-orderitem.js'),('20211001150505-create-payment.js'),('20211001150607-create-user.js'),('20211014151138-add-isAdmin-to-Users.js'),('20211022160341-add-subtotal-to-OrderItems.js'),('20211028162740-create-favorite.js'),('20211208134540-create-category.js'),('20211208134655-add-categoryId-to-product.js'),('20230814145052-add-status-to-category.js'),('20230819140930-create-payment-method.js'),('20230822140521-add-columns-to-user.js');
/*!40000 ALTER TABLE `SequelizeMeta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `isAdmin` tinyint(1) DEFAULT '0',
  `name` varchar(255) DEFAULT NULL,
  `gender` tinyint(1) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (1,'root@example.com','$2a$06$mcm4jcSuujtzwd/HoIBW0OcfXWjOawZ69waEUck/UFS/I4GhzRJ/q',NULL,'2023-08-29 03:43:23','2023-08-29 03:43:23',1,NULL,NULL,NULL,NULL),(2,'321@321.com','$2a$06$aQngEBucTBbwr0uqSo6BgeuU3loGEhuiv.h2CYCJBCgEspZPVPfMK',NULL,'2023-08-29 03:45:47','2023-08-29 03:45:47',0,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-09-05 12:04:40
