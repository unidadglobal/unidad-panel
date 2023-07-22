<?php
	$ch = curl_init();
    $clientsecret = "APP_USR-1082021732912090-112117-520924f64452b35883b159a287ba9e6c-315594428";
    $code = $_POST["code"];
    $redirect = "https://peatonalonline.com/panel/auth_vendedor.php";
    $vars = "client_secret=$clientsecret&grant_type=authorization_code&code=$code&redirect_uri=$redirect";
    curl_setopt($ch, CURLOPT_URL,"https://api.mercadopago.com/oauth/token");
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS,$vars);  //Post Fields
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $headers = [
        'accept: application/json',
        'content-type: application/x-www-form-urlencoded',
    ];
    
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    
    $server_output = curl_exec ($ch);
    
    curl_close ($ch);
    
    print  $server_output ;
?>