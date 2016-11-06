<?php 
$app->get('/session', function() {
    $db = new DbHandler();
    $session = $db->getSession();
    $response["CODUSUARIO"] = $session['CODUSUARIO'];
    $response["USUARIO"] = $session['USUARIO'];
    $response["IDROL"] = $session['IDROL'];
    echoResponse(200, $session);
});

$app->post('/login', function() use ($app) {
    require_once 'passwordHash.php';
    $r = json_decode($app->request->getBody());
    verifyRequiredParams(array('USUARIO', 'password'),$r->customer);
    $response = array();
    $db = new DbHandler();
    $password = $r->customer->password;
    $USUARIO = $r->customer->USUARIO;
    $user = $db->getOneRecord("select CODUSUARIO,IDROL,password,USUARIO,created from customers_auth where phone='$USUARIO' or USUARIO='$USUARIO'");
    if ($user != NULL) {
        if(passwordHash::check_password($user['password'],$password)){
        $response['status'] = "success";
        $response['message'] = 'Logged in successfully.';
        $response['IDROL'] = $user['IDROL'];
        $response['CODUSUARIO'] = $user['CODUSUARIO'];
        $response['USUARIO'] = $user['USUARIO'];
        $response['createdAt'] = $user['created'];
        if (!isset($_SESSION)) {
            session_start();
        }
        $_SESSION['CODUSUARIO'] = $user['CODUSUARIO'];
        $_SESSION['USUARIO'] = $USUARIO;
        $_SESSION['IDROL'] = $user['IDROL'];
        } else {
            $response['status'] = "error";
            $response['message'] = 'Login failed. Incorrect credentials';
        }
    }else {
            $response['status'] = "error";
            $response['message'] = 'No such user is registered';
        }
    echoResponse(200, $response);
});
$app->post('/signUp', function() use ($app) {
    $response = array();
    $r = json_decode($app->request->getBody());
    verifyRequiredParams(array('USUARIO', 'IDROL', 'password'),$r->customer);
    require_once 'passwordHash.php';
    $db = new DbHandler();
    $phone = $r->customer->phone;
    $IDROL = $r->customer->IDROL;
    $USUARIO = $r->customer->USUARIO;
    $address = $r->customer->address;
    $password = $r->customer->password;
    $isUserExists = $db->getOneRecord("select 1 from usuarios where phone='$phone' or USUARIO='$USUARIO'");
    if(!$isUserExists){
        $r->customer->password = passwordHash::hash($password);
        $tabble_IDROL = "customers_auth";
        $column_IDROLs = array('phone', 'IDROL', 'USUARIO', 'password', 'city', 'address');
        $result = $db->insertIntoTable($r->customer, $column_IDROLs, $tabble_IDROL);
        if ($result != NULL) {
            $response["status"] = "success";
            $response["message"] = "User account created successfully";
            $response["CODUSUARIO"] = $result;
            if (!isset($_SESSION)) {
                session_start();
            }
            $_SESSION['CODUSUARIO'] = $response["CODUSUARIO"];
            $_SESSION['phone'] = $phone;
            $_SESSION['IDROL'] = $IDROL;
            $_SESSION['USUARIO'] = $USUARIO;
            echoResponse(200, $response);
        } else {
            $response["status"] = "error";
            $response["message"] = "Failed to create customer. Please try again";
            echoResponse(201, $response);
        }            
    }else{
        $response["status"] = "error";
        $response["message"] = "An user with the provided phone or USUARIO exists!";
        echoResponse(201, $response);
    }
});
$app->get('/logout', function() {
    $db = new DbHandler();
    $session = $db->destroySession();
    $response["status"] = "info";
    $response["message"] = "Logged out successfully";
    echoResponse(200, $response);
});
?>