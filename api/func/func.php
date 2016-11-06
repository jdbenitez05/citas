<?php
	
	require('../func/db.php');

	/*
	function getConexion(){
		if(!isset($conexion))
			require('../func/db.php');
 
		return $conexion;
	}
	*/

	# Devulve un array que nos permite manejarlo
	function returnJsonDecode($arrayJson){
    	$a = '';
        $c = "";
        $v = "";
        foreach ($arrayJson as $key => $value) {
            $c .= $key. ", ";
            $v .= ":".$key. ", ";
            $a[$key] = $value;
        }

        return $a; 
    }



# -------------------------- EMPLEADOS ----------------------------------------------------
	
	function getClientes($CODIGO){
		global $conexion;
		
			$res = '';
			if($CODIGO != null){
			$sql = "SELECT * FROM CLIENTES WHERE CODCLIENTE = ".$CODIGO;
			$clientes = mysqli_query($conexion, $sql);

			while($row = mysqli_fetch_array($clientes)){
				$ciudad = getCiudades($row['CIUDAD']);
				$res = array(
					'ID' => $row['CODCLIENTE'],
					'NIT' => $row['NIT'],
					'NOMBRE' => $row['NIOMBRE'],
					'DIRECCION' => $row['DIRECCION'],
					'TELEFONO' => $row['TELEFONO'],
					'CIUDAD' => $ciudad,
					'EMAIL' => $row['EMAIL'],
					'SITIOWEB' => $row['SITIOWEB']
				);
			}
	}
	else{
			$sql = "SELECT * FROM CLIENTES";
			$clientes = mysqli_query($conexion, $sql);

			while ($row = mysqli_fetch_array($clientes)) {
				$ciudad = getCiudades($row['CIUDAD']);
				$res[] = array(
					'ID' => $row['CODCLIENTE'],
					'NIT' => $row['NIT'],
					'NOMBRE' => $row['NIOMBRE'],
					'DIRECCION' => $row['DIRECCION'],
					'TELEFONO' => $row['TELEFONO'],
					'CIUDAD' => $ciudad,
					'EMAIL' => $row['EMAIL'],
					'SITIOWEB' => $row['SITIOWEB']
				);
			}
		}

		return $res;
	}

	// Recibe los datos del cliente en el formato que los envia
	function insertNewCliente($datos){
		
		global $conexion;

		$CLIENTE = returnJsonDecode($datos);
		$CIUDAD = returnJsonDecode($CLIENTE['CIUDAD']);
		
		$sql = "INSERT INTO CLIENTES(NIT, NIOMBRE, DIRECCION, TELEFONO, CIUDAD, EMAIL, SITIOWEB) VALUES(
			'".$CLIENTE['NIT']."',
			'".$CLIENTE['NOMBRE']."',
			'".$CLIENTE['DIRECCION']."',
			'".$CLIENTE['TELEFONO']."',
			 ".$CIUDAD['ID'].",
			'".$CLIENTE['EMAIL']."',
			'".$CLIENTE['SITIOWEB']."'
		)";

		if($conexion -> Execute($sql)){
			$id = $conexion -> Insert_ID($conexion);
			$resp['status'] = 'success';
			$resp['data'] = $id;
			$resp['message'] = 'Registro creado con Exito';
		}else{
			$resp['status'] = 'error';
			$resp['data'] = 0;
			$resp['message'] = 'Error al crear registro';
		}


		return json_encode($resp);
	}

	function updateCliente($id, $datos){
		global $conexion;

		$data = returnJsonDecode($datos);
		$CIUDAD = returnJsonDecode($data['CIUDAD']);
		$sql = "call updateClientes(
			  ".$id.",
			 '".$data['NIT']."',
			 '".$data['NOMBRE']."',
			 '".$data['DIRECCION']."',
			 '".$data['TELEFONO']."',
			 '".$CIUDAD['ID']."',
			 '".$data['EMAIL']."',
			 '".$data['SITIOWEB']."'
				)";

		if ($conexion -> Execute($sql)) {
			$resp['status'] = 'success';
			$resp['data'] = $id;
			$resp['message'] = 'Registro actualizado con Exito';
		}else{
			$resp['status'] = 'error';
			$resp['data'] = $id;
			$resp['message'] = 'Error al intentar actualizar registro';
		}

		return json_encode($resp);
	}

	function deleteCliente($id){
		global $conexion;

		$sql= "call deleteClientes($id)";

		if($conexion -> Execute($sql)){
			$resp['status'] = 'success';
			$resp['message'] = 'Registro eliminado con Exito';
		}else{
			$resp['status'] = 'error';
			$resp['message'] = 'Error al eliminar registro';
		}

		return json_encode($resp);
	}


#--------------------------- SUCURSALES ---------------------------------------------------
	function getSucursales($CODIGO){
		global $conexion;

		$res = '';
		if($CODIGO != null){
			$sql = "SELECT * FROM SUCURSALES WHERE SUCURSALID =". $CODIGO;
			$sucursales = mysqli_query($conexion, $sql);

			
			while($row = mysqli_fetch_array($sucursales)) {
				
				$res = array(
					'ID' => $row['sucursalid'],
					'NOMBRE' => $row['sucursalnombre'],
					'DIRECCION' => $row['sucursaldireccion'],
					'DISPONIBILIDAD' => $row['sucursaldisponibilidad']
				);
			}
		}
		else{
			$sql = "SELECT * FROM SUCURSALES";
			$sucursales = mysqli_query($conexion, $sql);

			while ($row = mysqli_fetch_array($sucursales)) {
				
				$res[] = array(
				'ID' => $row['sucursalid'],
				'NOMBRE' => $row['sucursalnombre'],
				'DIRECCION' => $row['sucursaldireccion'],
				'DISPONIBILIDAD' => $row['sucursaldisponibilidad']
				);
			}
		}

		return $res;
	}



	function insertNewSucursal($datos){
		global $conexion;
		//$conexion -> debug = true;

		$SUCURSAL = returnJsonDecode($datos);

		$sql = "call insert_sucursales(
			'".$SUCURSAL['NOMBRE']."',
			'".$SUCURSAL['DIRECCION']."',
			".$SUCURSAL['DISPONIBILIDAD']."
		)";

		
		if(mysqli_query($conexion, $sql)){
			$id = mysqli_insert_id($conexion);
			$resp['status'] = 'success';
			$resp['data'] = $id;
			$resp['message'] = 'Registro creado con Exito';			
		}else{
			$resp['status'] = 'error';
			$resp['data'] = 0;
			$resp['message'] = 'Error al crear registro. Error : ' . mysqli_error($conexion);
		}
		
		return json_encode($resp);
	}


	function updateSucursal($id, $datos){
		global $conexion;

		$SUCURSAL = returnJsonDecode($datos);

		$sql = "UPDATE sucursales SET
    		sucursalnombre = '".$SUCURSAL['NOMBRE']."',
    		sucursaldireccion = '".$SUCURSAL['DIRECCION']."',
			sucursaldisponibilidad = '".$SUCURSAL['DISPONIBILIDAD']."'
		WHERE
			sucursalid = ".$id."
		";
				
		if (mysqli_query($conexion, $sql)) {
			$resp['status'] = 'success';
			$resp['data'] = $id;
			$resp['message'] = 'Registro actualizado con Exito';
		}else{
			$resp['status'] = 'error';
			$resp['data'] = $id;
			$resp['message'] = 'Error al intentar actualizar registro. Error: ' . mysqli_error($conexion);
		}
		return json_encode($resp);
	}

	function deletePlanta($id){
		global $conexion;

		$sql= "DELETE FROM sucursales WHERE sucursalid = " . $id;

		if(mysqli_query($conexion, $sql)){
			$resp['status'] = 'success';
			$resp['message'] = 'Registro eliminado con Exito';
		}else{
			$resp['status'] = 'error';
			$resp['message'] = 'Error al eliminar registro. Error: ' . mysqli_error($conexion);
		}

		return json_encode($resp);
	}


#--------------------------- SERVICIOS ----------------------------------------------------
	function getServicios($CODIGO){
		global $conexion;

		$datos = '';
		if($CODIGO != null){
			$sql = "SELECT * FROM servicios WHERE servicioid = ".$CODIGO;
			$servicios = mysqli_query($conexion, $sql);

			
			while ($row = mysqli_fetch_array($servicios)) {
				$sucursal = getSucursales($row['sucursalid']);
				$datos = array(
					'ID' => $row['servicioid'],
					'NOMBRE' => $row['serviciodescripcion'],
					'DURACION' => $row['serviciotiempo'],
					'SUCURSAL' => $sucursal
				);
			}
		}
		else{
			$sql = "SELECT * FROM servicios";
			$servicios = mysqli_query($conexion, $sql);

			while ($row = mysqli_fetch_array($servicios)) {
				$sucursal = getSucursales($row['sucursalid']);
				$datos[] = array(
					'ID' => $row['servicioid'],
					'NOMBRE' => $row['serviciodescripcion'],
					'DURACION' => $row['serviciotiempo'],
					'SUCURSAL' => $sucursal
				);
			}
		}

		return $datos;
	}

	function insertNewServicio($datos){
		$SERVICIO = returnJsonDecode($datos);
		$SUCURSAL = returnJsonDecode($SERVICIO['SUCURSAL']);
		global $conexion;

		//$conexion -> debug = true;

		$sql = "CALL insert_servicios(
			'".$SERVICIO['NOMBRE']."',
			'".$SERVICIO['DURACION']."',
			'".$SUCURSAL['ID']."'
		)";

		if(mysqli_query($conexion, $sql)){
			$id = mysqli_insert_id($conexion);
			$resp['status'] = 'success';
			$resp['data'] = $id;
			$resp['message'] = 'Registro creado con Exito';			
		}else{
			$resp['status'] = 'error';
			$resp['data'] = 0;
			$resp['message'] = 'Error al crear registro. Error: ' . mysqli_error($conexion);
		}
		return json_encode($resp);
	}

	function updateProducto($id, $datos){
		global $conexion;

		$data = returnJsonDecode($datos);

		$sql = "call updateProductos(
			".$id.",
			'".$data['NOMBRE']."',
			'".$data['ABREVIACION']."',
			'".$data['DESCRIPCION']."')
		";
		
		if ($conexion -> Execute($sql)) {
			$resp['status'] = 'success';
			$resp['data'] = $id;
			$resp['message'] = 'Registro actualizado con Exito';
		}else{
			$resp['status'] = 'error';
			$resp['data'] = $id;
			$resp['message'] = 'Error al intentar actualizar registro';
		}

		return json_encode($resp);
	}

	function deleteProducto($id){
		global $conexion;

		$sql= "call deleteProductos($id)";

		if($conexion -> Execute($sql)){
			$resp['status'] = 'success';
			$resp['message'] = 'Registro eliminado con Exito';
		}else{
			$resp['status'] = 'error';
			$resp['message'] = 'Error al eliminar registro';
		}

		return json_encode($resp);
	}

	
#--------------------------- OPCIONES -----------------------------------------------------
	function getOpciones(){
		global $conexion;

		$sql = "SELECT * FROM OPCIONES";
		$opciones = $conexion -> Execute($sql);

		$res = '';
		foreach ($opciones as $row) {
			$res[] = array(
				'ID' => $row['CODOPCION'],
				'REFER' => $row['REFER'],
				'NOMBRE' => $row['NOMBRE'],
				'IMAGE' => $row['IMAGE']
			);
		}

		return json_encode($res);
	}


#--------------------------- SUBOPCIONES---------------------------------------------------
	function getSubopciones(){
		global $conexion;

		$sql = "SELECT + FROM SUBOPCIONES";
		$subopciones = $conexion -> Execute($sql);

		$res = '';
		foreach ($subopciones as $row) {
			$res[] = array(
				'ID' => $row['CODSUBOPCION'],
				'REFER' => $row['REFER'],
				'NOMBRE' => $row['NOMBRE'],
				'IDOPCION' => $row['IDOPCION']
			);
		}

		return json_encode($res);
	}

?>