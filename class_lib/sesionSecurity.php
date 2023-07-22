<?php
  session_start();
  date_default_timezone_set("America/Argentina/Buenos_Aires");
   
  if($_SESSION['autorizado']<>1 || ($_SESSION['tipo_usuario'] != "admin" && $_SESSION['tipo_usuario'] != "user")){
    header("Location: index.php");
  }
?>