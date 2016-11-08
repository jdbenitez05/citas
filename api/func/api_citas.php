<?php
    
    if(!defined('ESPECIALCONSTANT'))die("Acceso denegado");

    require('../func/func.php');

    $app -> get('/', function() use($app) {

        try{
            $response = getCitas(null);

            $res['datos'] = $response;
            $res['status'] = 'success';

            $app -> response -> headers -> set('Content-type', 'application/json');
            $app -> response -> status(200);
            $app -> response -> body(json_encode($res));
        
        }catch(Exception $e){
            $res['message'] = 'Ocurrio un problema al cargar los servicios. Error: '. $e -> getMessage();;
            $res['status'] = 'error';

            $app -> response -> headers -> set('Content-type', 'application/json');
            $app -> response -> status(200);
            $app -> response -> body(json_encode($res));
        }
    });

    $app -> post('/', function() use ($app) { 
        $data = json_decode($app -> request -> getBody());

        $response = insertNewCita($data);
        
        $app -> response -> headers -> set('Content-type', 'application/json');
        $app -> response -> status(200);
        $app -> response -> body($response);

        //var_dump($array);
    });

  $app -> put('/:id', function($id) use ($app) {
        
        $data = json_decode($app -> request -> getBody());

        $response = updateCita($id, $data);
        
        $app -> response -> headers -> set('Content-type', 'application/json');
        $app -> response -> status(200);
        $app -> response -> body($response);
        
    });

    $app -> delete('/:id', function($id) use ($app) {
        
        $response = deleteCita($id);
        
        $app -> response -> headers -> set('Content-type', 'application/json');
        $app -> response -> status(200);
        $app -> response -> body($response);

    });

    $app -> run();

?>