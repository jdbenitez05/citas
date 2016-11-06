<?php
	
	if(!defined('ESPECIALCONSTANT'))die("Acceso denegado");

	require('../func/func.php');

    $app -> get('/', function() use($app) {

        try{
        	$response = getSubopciones();

		    $app -> response -> headers -> set('Content-type', 'application/json');
		    $app -> response -> status(200);
		    $app -> response -> body($response);
		    

        }catch(Exception $e){
        	 echo "Error:  ". $e -> getMessage();
        }
    });

    $app -> run();

?>