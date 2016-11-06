<?php
	
	if(!defined('ESPECIALCONSTANT'))die("Acceso denegado");

	require('../func/func.php');
 
    $app -> get('/', function() use($app) {

        try{
            $response = getClientes(null);

            $res['datos'] = $response;
            $res['status'] = 'success';

            $app -> response -> headers -> set('Content-type', 'application/json');
            $app -> response -> status(200);
            $app -> response -> body(json_encode($res));
            

        }catch(Exception $e){
            $res['message'] = 'Ocurrio un problema al cargar los clientes';
            $res['status'] = 'error';

            $app -> response -> headers -> set('Content-type', 'application/json');
            $app -> response -> status(200);
            $app -> response -> body(json_encode($res));

            echo "Error:  ". $e -> getMessage();
        }
    });

    $app -> post('/', function() use ($app) {
        $data = json_decode($app -> request -> getBody());

        $response = insertNewCliente($data);
        
        $app -> response -> headers -> set('Content-type', 'application/json');
        $app -> response -> status(200);
        $app -> response -> body($response);

        //var_dump($array);
    });

    $app -> put('/:id', function($id) use ($app) {
        
        $data = json_decode($app -> request -> getBody());

        $response = updateCliente($id, $data);
        
        $app -> response -> headers -> set('Content-type', 'application/json');
        $app -> response -> status(200);
        $app -> response -> body(json_encode($response));
        
    });

    $app -> delete('/:id', function($id) use ($app) {
        
        $response = deleteCliente($id);
        
        $app -> response -> headers -> set('Content-type', 'application/json');
        $app -> response -> status(200);
        $app -> response -> body($response);

    });

    $app -> run();


?>