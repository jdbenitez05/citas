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



# -------------------------- EMPLEADOS  ---------------------------------------------------
	
	function getEmpleados($CODIGO){
		global $conexion;
		
		$res = '';
		if($CODIGO != null){
			$sql = "SELECT * FROM empleados WHERE empleadoid = ".$CODIGO;
			$empleados = mysqli_query($conexion, $sql);

			while($row = mysqli_fetch_array($empleados)){
				$sucursal = getSucursales($row['sucursalid']);
				$res = array(
					'ID' => $row['empleadoid'],
					'DOCUMENTO' => $row['empleadonumerodocumento'],
					'NOMBRES' => $row['empleadonombres'],
					'APELLIDOS' => $row['empleadoapellidos'],
					'SUCURSAL' => $sucursal
				);
			}
		}
		else{
			$sql = "SELECT * FROM empleados";
			$empleados = mysqli_query($conexion, $sql);

			while ($row = mysqli_fetch_array($empleados)) {
				$sucursal = getSucursales($row['sucursalid']);
				$res[] = array(
					'ID' => $row['empleadoid'],
					'DOCUMENTO' => $row['empleadonumerodocumento'],
					'NOMBRES' => $row['empleadonombres'],
					'APELLIDOS' => $row['empleadoapellidos'],
					'SUCURSAL' => $sucursal
				);
			}
		}

		return $res;
	}

	// Recibe los datos del empleado en el formato que los envia
	function insertNewEmpleado($datos){
		global $conexion;

		$EMPLEADO = returnJsonDecode($datos);
		$SUCURSAL = returnJsonDecode($EMPLEADO['SUCURSAL']);
		
		$sql = "CALL insert_empleados(
			'".$EMPLEADO['DOCUMENTO']."',
			'".$EMPLEADO['NOMBRES']."',
			'".$EMPLEADO['APELLIDOS']."',
			 ".$SUCURSAL['ID']."
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

	function updateEmpleado($id, $datos){
		global $conexion;

		$data = returnJsonDecode($datos);
		$SUCURSAL = returnJsonDecode($data['SUCURSAL']);


		$sql = "UPDATE empleados set
			empleadonumerodocumento = '".$data['DOCUMENTO']."',
			empleadonombres = '".$data['NOMBRES']."',
			empleadoapellidos = '".$data['APELLIDOS']."',
			sucursalid = ".$SUCURSAL['ID']."
			WHERE
				empleadoid = ".$id."
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

	function deleteEmpleado($id){
		global $conexion;

		$sql= "DELETE FROM empleados WHERE empleadoid = " . $id;

		if(mysqli_query($conexion, $sql)){
			$resp['status'] = 'success';
			$resp['message'] = 'Registro eliminado con Exito';
		}else{
			$resp['status'] = 'error';
			$resp['message'] = 'Error al eliminar registro. Error: ' . mysqli_error($conexion);
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


#--------------------------- SERVICIOS  ---------------------------------------------------
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

	function updateServicio($id, $datos){
		global $conexion;

		$data = returnJsonDecode($datos);
		$sucursal = returnJsonDecode($data['SUCURSAL']);

		$sql = "UPDATE servicios SET
			serviciodescripcion = '".$data['NOMBRE']."',
			serviciotiempo = '".$data['DURACION']."',
			sucursalid = '".$sucursal['ID']."'
			WHERE
				servicioid = ".$id."
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

	function deleteServicio($id){
		global $conexion;

		$sql= "DELETE FROM servicios WHERE servicioid = ".$id;

		if(mysqli_query($conexion, $sql)){
			$resp['status'] = 'success';
			$resp['message'] = 'Registro eliminado con Exito';
		}else{
			$resp['status'] = 'error';
			$resp['message'] = 'Error al eliminar registro. Error: ' . mysqli_error($conexion);
		}

		return json_encode($resp);
	}

#--------------------------- CITAS      ---------------------------------------------------
	function getCitas($CODIGO){
		global $conexion;

		$datos = '';
		if($CODIGO != null){
			$sql = "SELECT * FROM citas WHERE citaid = ".$CODIGO;
			$citas = mysqli_query($conexion, $sql);

			
			while ($row = mysqli_fetch_array($citas)) {
				$sucursal = getSucursales($row['sucursalid']);
				$empleado = getEmpleados($row['empleadoid']);
				$servicio = getServicios($row['servicioid']);

				$datos = array(
					'ID' => $row['citaid'],
					'FECHA' => $row['citafecha'],
					'HORAINI' => $row['citahoraini'],
					'HORAFIN' => $row['citahorafin'],
					'PACIENTE' => $row['paciente'],
					'SUCURSAL' => $sucursal,
					'EMPLEADO' => $empleado,
					'SERVICIO' => $servicio
				);
			}
		}
		else{
			$sql = "SELECT * FROM citas";
			$citas = mysqli_query($conexion, $sql);

			while ($row = mysqli_fetch_array($citas)) {
				$sucursal = getSucursales($row['sucursalid']);
				$empleado = getEmpleados($row['empleadoid']);
				$servicio = getServicios($row['servicioid']);

				$datos[] = array(
					'ID' => $row['citaid'],
					'FECHA' => $row['citafecha'],
					'HORAINICIO' => $row['citahoraini'],
					'HORAFIN' => $row['citahorafin'],
					'PACIENTE' => $row['paciente'],
					'SUCURSAL' => $sucursal,
					'EMPLEADO' => $empleado,
					'SERVICIO' => $servicio
				);
			}
		}

		return $datos;
	}

	function insertNewCita($datos){
		$CITA = returnJsonDecode($datos);
		$SUCURSAL = returnJsonDecode($CITA['SUCURSAL']);
		$EMPLEADO = returnJsonDecode($CITA['EMPLEADO']);
		$SERVICIO = returnJsonDecode($CITA['SERVICIO']);
		global $conexion;

		//$conexion -> debug = true;

		$sql = "CALL insert_citas(
			'".$CITA['FECHA']."',
			'".$CITA['HORAINICIO']."',
			'".$CITA['HORAFIN']."',
			'".$CITA['PACIENTE']."',
			'".$EMPLEADO['ID']."',
			'".$SUCURSAL['ID']."',
			'".$SERVICIO['ID']."'
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

	function updateCita($id, $datos){
		global $conexion;

		$data = returnJsonDecode($datos);
		$sucursal = returnJsonDecode($data['SUCURSAL']);

		$sql = "UPDATE servicios SET
			serviciodescripcion = '".$data['NOMBRE']."',
			serviciotiempo = '".$data['DURACION']."',
			sucursalid = '".$sucursal['ID']."'
			WHERE
				servicioid = ".$id."
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

	function deleteCita($id){
		global $conexion;

		$sql= "DELETE FROM servicios WHERE servicioid = ".$id;

		if(mysqli_query($conexion, $sql)){
			$resp['status'] = 'success';
			$resp['message'] = 'Registro eliminado con Exito';
		}else{
			$resp['status'] = 'error';
			$resp['message'] = 'Error al eliminar registro. Error: ' . mysqli_error($conexion);
		}

		return json_encode($resp);
	}

?>