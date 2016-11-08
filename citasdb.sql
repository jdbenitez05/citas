-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 08-11-2016 a las 06:20:18
-- Versión del servidor: 10.1.16-MariaDB
-- Versión de PHP: 7.0.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `citasdb`
--
CREATE DATABASE IF NOT EXISTS `citasdb` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `citasdb`;

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_citas` (`v_fecha` VARCHAR(45), `v_horaini` VARCHAR(255), `V_horafin` VARCHAR(255), `V_paciente` VARCHAR(255), `v_empleadoid` INT, `v_sucursalid` INT, `v_servicioid` INT)  READS SQL DATA
BEGIN
	DECLARE error INT;
	
	START TRANSACTION;
	
	INSERT INTO citas (citas.citafecha, citas.citahoraini, citas.citahorafin, citas.paciente, citas.empleadoid, citas.sucursalid, citas.servicioid, citas.registroestado, citas.registrofecha, citas.registrousuario)
	VALUES(v_fecha, v_horaini, v_horafin, v_paciente, v_empleadoid, v_sucursalid, v_servicioid, 1, now(), 'USERDB');

	IF(error=0)THEN
		ROLLBACK;
	ELSE
		COMMIT;
	END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_empleados` (`v_documento` VARCHAR(45), `v_nombres` VARCHAR(255), `V_apellidos` VARCHAR(255), `v_sucursalid` INT)  READS SQL DATA
BEGIN
	DECLARE error INT;
	
	START TRANSACTION;
	
	INSERT INTO empleados (empleados.empleadonumerodocumento, empleados.empleadonombres, empleados.empleadoapellidos, empleados.registroestado, empleados.registrofecha, empleados.registrousuario, empleados.sucursalid)
    VALUES(v_documento, v_nombres, v_apellidos, 1, now(), 'USERDB', v_sucursalid);

	IF(error=0)THEN
		ROLLBACK;
	ELSE
		COMMIT;
	END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_servicios` (`v_nombre` VARCHAR(150), `v_duracion` INT, `v_sucursalid` INT)  READS SQL DATA
BEGIN
	DECLARE error INT;
	
	START TRANSACTION;
	
	INSERT INTO servicios (servicios.serviciodescripcion, servicios.serviciotiempo, servicios.registroestado, servicios.registrofecha, servicios.registrousuario, servicios.sucursalid) VALUES(v_nombre, v_duracion, 1, now(), 'USERDB', v_sucursalid);

	IF(error=0)THEN
		ROLLBACK;
	ELSE
		COMMIT;
	END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_sucursales` (IN `v_nombre` VARCHAR(255), IN `v_direccion` VARCHAR(255), IN `v_capacidad` INT)  READS SQL DATA
BEGIN
	DECLARE error INT;
	START TRANSACTION;
	
	INSERT INTO sucursales (sucursalnombre, sucursaldireccion, sucursaldisponibilidad, registroestado, registrofecha, registrousuario) VALUES(v_nombre, v_direccion, v_capacidad, 1, now(), 'USERDB');

	IF(error=0)THEN
		ROLLBACK;
	ELSE
		COMMIT;
	END IF;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `citas`
--

CREATE TABLE `citas` (
  `citaid` int(11) NOT NULL,
  `citafecha` date DEFAULT NULL,
  `citahoraini` varchar(4) DEFAULT NULL,
  `citahorafin` varchar(4) DEFAULT NULL,
  `paciente` varchar(255) DEFAULT NULL,
  `empleadoid` int(11) NOT NULL,
  `sucursalid` int(11) NOT NULL,
  `servicioid` int(11) NOT NULL,
  `registroestado` smallint(1) DEFAULT NULL,
  `registrofecha` datetime DEFAULT NULL,
  `registrousuario` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `citas`
--

INSERT INTO `citas` (`citaid`, `citafecha`, `citahoraini`, `citahorafin`, `paciente`, `empleadoid`, `sucursalid`, `servicioid`, `registroestado`, `registrofecha`, `registrousuario`) VALUES
(1, '2016-11-19', '02:0', '03:0', 'MARIO CARDENAS', 1, 3, 1, 1, '2016-11-08 00:09:57', 'USERDB');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empleados`
--

CREATE TABLE `empleados` (
  `empleadoid` int(11) NOT NULL,
  `empleadonumerodocumento` varchar(45) DEFAULT NULL,
  `empleadonombres` varchar(255) DEFAULT NULL,
  `empleadoapellidos` varchar(255) DEFAULT NULL,
  `registroestado` smallint(1) DEFAULT NULL,
  `registrofecha` datetime DEFAULT NULL,
  `registrousuario` varchar(45) DEFAULT NULL,
  `sucursalid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `empleados`
--

INSERT INTO `empleados` (`empleadoid`, `empleadonumerodocumento`, `empleadonombres`, `empleadoapellidos`, `registroestado`, `registrofecha`, `registrousuario`, `sucursalid`) VALUES
(1, '1045704541', 'Juan David', 'Benitez', 1, '2016-11-06 23:18:25', 'USERDB', 5),
(2, '1065126440', 'Marcela', 'Salas', 1, '2016-11-06 23:18:45', 'USERDB', 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicios`
--

CREATE TABLE `servicios` (
  `servicioid` int(11) NOT NULL,
  `serviciodescripcion` varchar(255) DEFAULT NULL,
  `serviciotiempo` smallint(2) DEFAULT NULL,
  `registroestado` smallint(1) DEFAULT NULL,
  `registrofecha` datetime DEFAULT NULL,
  `registrousuario` varchar(45) DEFAULT NULL,
  `sucursalid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `servicios`
--

INSERT INTO `servicios` (`servicioid`, `serviciodescripcion`, `serviciotiempo`, `registroestado`, `registrofecha`, `registrousuario`, `sucursalid`) VALUES
(1, 'LIMPIEZA FACIAL', 10, 1, '2016-11-06 00:07:52', 'USERDB', 3),
(4, 'MASAJE MUSCULAR', 75, 1, '2016-11-06 11:44:54', 'USERDB', 5),
(5, 'MASAJE REDUCTOR', 90, 1, '2016-11-06 12:04:38', 'USERDB', 5),
(6, 'MAQUILLAJE', 60, 1, '2016-11-06 12:06:51', 'USERDB', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sucursales`
--

CREATE TABLE `sucursales` (
  `sucursalid` int(11) NOT NULL,
  `sucursalnombre` varchar(255) DEFAULT NULL,
  `sucursaldireccion` varchar(255) DEFAULT NULL,
  `sucursaldisponibilidad` int(11) DEFAULT NULL,
  `registroestado` smallint(1) DEFAULT NULL,
  `registrofecha` datetime DEFAULT NULL,
  `registrousuario` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `sucursales`
--

INSERT INTO `sucursales` (`sucursalid`, `sucursalnombre`, `sucursaldireccion`, `sucursaldisponibilidad`, `registroestado`, `registrofecha`, `registrousuario`) VALUES
(3, 'SUCURSAL 2', 'CALLE 58 # 64 - 49', 20, 1, '2016-11-05 19:17:14', 'USERDB'),
(4, 'SUCURSAL DANIELA', 'calle 58 # 64 - 49 ed JJ apto 2a', 40, 1, '2016-11-05 19:17:31', 'USERDB'),
(5, 'SUCURSAL JUAN', 'CALLE 58 # 64 - 49', 25, 1, '2016-11-05 19:18:00', 'USERDB');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sucursalhorario`
--

CREATE TABLE `sucursalhorario` (
  `sucursalhorarioid` int(11) NOT NULL,
  `dia` smallint(1) DEFAULT NULL,
  `horainicio` varchar(4) DEFAULT NULL,
  `horafin` varchar(4) DEFAULT NULL,
  `registroestado` smallint(1) DEFAULT NULL,
  `registrofecha` datetime DEFAULT NULL,
  `registrousuario` varchar(45) DEFAULT NULL,
  `sucursalid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `citas`
--
ALTER TABLE `citas`
  ADD PRIMARY KEY (`citaid`),
  ADD KEY `fk_citas_empleados1_idx` (`empleadoid`),
  ADD KEY `fk_citas_sucursales1_idx` (`sucursalid`),
  ADD KEY `fk_citas_servicios1_idx` (`servicioid`);

--
-- Indices de la tabla `empleados`
--
ALTER TABLE `empleados`
  ADD PRIMARY KEY (`empleadoid`),
  ADD KEY `fk_empleados_sucursales1_idx` (`sucursalid`);

--
-- Indices de la tabla `servicios`
--
ALTER TABLE `servicios`
  ADD PRIMARY KEY (`servicioid`),
  ADD KEY `fk_servicios_sucursales1_idx` (`sucursalid`);

--
-- Indices de la tabla `sucursales`
--
ALTER TABLE `sucursales`
  ADD PRIMARY KEY (`sucursalid`);

--
-- Indices de la tabla `sucursalhorario`
--
ALTER TABLE `sucursalhorario`
  ADD PRIMARY KEY (`sucursalhorarioid`),
  ADD KEY `fk_sucursalhorario_sucursales_idx` (`sucursalid`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `citas`
--
ALTER TABLE `citas`
  MODIFY `citaid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT de la tabla `empleados`
--
ALTER TABLE `empleados`
  MODIFY `empleadoid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT de la tabla `servicios`
--
ALTER TABLE `servicios`
  MODIFY `servicioid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT de la tabla `sucursales`
--
ALTER TABLE `sucursales`
  MODIFY `sucursalid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT de la tabla `sucursalhorario`
--
ALTER TABLE `sucursalhorario`
  MODIFY `sucursalhorarioid` int(11) NOT NULL AUTO_INCREMENT;
--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `citas`
--
ALTER TABLE `citas`
  ADD CONSTRAINT `fk_citas_empleados1` FOREIGN KEY (`empleadoid`) REFERENCES `empleados` (`empleadoid`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_citas_servicios1` FOREIGN KEY (`servicioid`) REFERENCES `servicios` (`servicioid`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_citas_sucursales1` FOREIGN KEY (`sucursalid`) REFERENCES `sucursales` (`sucursalid`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `empleados`
--
ALTER TABLE `empleados`
  ADD CONSTRAINT `fk_empleados_sucursales1` FOREIGN KEY (`sucursalid`) REFERENCES `sucursales` (`sucursalid`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `servicios`
--
ALTER TABLE `servicios`
  ADD CONSTRAINT `fk_servicios_sucursales1` FOREIGN KEY (`sucursalid`) REFERENCES `sucursales` (`sucursalid`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `sucursalhorario`
--
ALTER TABLE `sucursalhorario`
  ADD CONSTRAINT `fk_sucursalhorario_sucursales` FOREIGN KEY (`sucursalid`) REFERENCES `sucursales` (`sucursalid`) ON DELETE NO ACTION ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
