<?php
error_reporting(0);
session_start();

include('./class_lib/funciones.php');

$usuario=test_input($_POST['usuario']);
$password=test_input($_POST['pass']);
$uid=test_input($_POST['uid']);
$tipo_usuario=$_POST["tipousuario"];

$_SESSION['nombre_de_usuario']=$_POST["nombre"];
$_SESSION['clave']=$password;
$_SESSION['id_usuario'] = $uid;
$_SESSION['tipo_usuario'] = $tipo_usuario;
$_SESSION['imageUrl'] = $_POST["imagen"];

if ($tipo_usuario == "user" || $tipo_usuario == "admin"){
  $_SESSION['autorizado']=1;
  echo "
  <script>
    document.location.href = 'inicio.php';
  </script>
  ";
}
else{
  echo "
  <script>
    swal('No estás autorizado a ingresar', '', 'error');
  </script>
  ";
}


?>