<?php
    require ('../libs/Slim/Slim.php');

    \Slim\Slim::registerAutoloader();
    $app = new \Slim\Slim();
    $app = \Slim\Slim::getInstance();
    
    define('ESPECIALCONSTANT', true);
    require('../func/api_citas.php');
    

?>