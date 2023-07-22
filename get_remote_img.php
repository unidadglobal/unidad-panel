<?php
  session_start();
  date_default_timezone_set("America/Argentina/Buenos_Aires");
  
  if($_SESSION['autorizado']<>1){
    header("Location: index.php");
  }
  
  $url = $_POST["url"];
  
  try {
    $b64image = base64_encode(file_get_contents($url));
    echo "data:image/jpeg;base64,".$b64image;
  } catch (\Throwable $th) {
    echo "error:".$th;
  }
  
?>