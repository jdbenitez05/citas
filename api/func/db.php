<?php
    // $server = "localhost";      $user   = "root";
    // $pwd    = "";               $db     = "mydb";

    // include("../libs/adodb5/adodb-exceptions.inc.php");
    // include("../libs/adodb5/adodb.inc.php");

    // $conexion = NewADOConnection("mysql");          //crea la coneccion a la DB
    // $conexion -> Connect($server, $user, $pwd, $db);    //conecta al server

	/*
     //Datos para la conexión con el servidor
    $servidor   = "localhost";
    $nombreBD   = "mydb";
    $usuario    = "root";
    $contrasena = "";
    //Creando la conexión, nuevo objeto mysqli
    $conexion = new mysqli($servidor,$usuario,$contrasena,$nombreBD);
    //Si sucede algún error la función muere e imprimir el error
    if($conexion -> connect_error){
        die("Error en la conexion : ".$conexion -> connect_errno.
                                  "-".$conexion -> connect_error);
    }
	*/

    require_once('db_config.php');
    /*require_once('functions.php');*/
    $conexion = new mysqli(HOST, USER, PASSWORD, DATABASE);

    if($conexion -> connect_error){
        die("Error en la conexion : ".$conexion -> connect_errno.
                                  "-".$conexion -> connect_error);
    }
?>