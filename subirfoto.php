<?php
    $tipofoto = $_POST["tipo"];
    if ($tipofoto == "portada"){
        $canvas = $_POST["canvas"];
        $tiempo = $_POST["time"];
        $negocio = $_POST["negocio"];
        $img = str_replace('data:image/png;base64,', '', $canvas);  
        $img = str_replace(' ', '+', $img);  
        $data = base64_decode($img);  
        $carpeta = "../tiendas/imagenes/".$negocio."/portadas"."/";
        $file = $carpeta."portada-".$tiempo.".png";
        if (!file_exists($carpeta)) {
            mkdir($carpeta, 0755, true);
            chmod($carpeta, 0777);
        }
        $success = file_put_contents($file, $data);  
        chmod($file, 0666);
        echo $success ? "ruta='$file'" : 'error'; 
    }
    else if ($tipofoto == "logotienda"){
        $canvas = $_POST["canvas"];
        $negocio = $_POST["negocio"];
        $img = str_replace('data:image/png;base64,', '', $canvas);  
        $img = str_replace(' ', '+', $img);  
        $data = base64_decode($img);  
        $carpeta = "../tiendas/imagenes/".$negocio."/";
        $file = $carpeta."logo.png";
        if (!file_exists($carpeta)) {
            mkdir($carpeta, 0755, true);
            chmod($carpeta, 0777);
        }
        $success = file_put_contents($file, $data);  
        chmod($file, 0666);
        echo $success ? "ruta='$file'" : 'error'; 
    }
    else if ($tipofoto == "fotoperfil"){
        $canvas = $_POST["canvas"];
        $img = str_replace('data:image/png;base64,', '', $canvas);  
        $img = str_replace(' ', '+', $img);  
        $data = base64_decode($img);  
        $carpeta = "imagenes/fotosperfil/";
        $file = $carpeta."fotito.png";
        if (!file_exists($carpeta)) {
            mkdir($carpeta, 0755, true);
            chmod($carpeta, 0777);
        }
        $success = file_put_contents($file, $data);  
        chmod($file, 0666);
        echo $success ? "ruta='$file'" : 'error'; 
    }
    else{
        if (isset($_FILES["file"])){
            $file = $_FILES["file"];
            $negocio = $_POST["negocio"];
            $canvas = $_POST["canvas"];
            $tiempo = $_POST["time"];
            $nombre = $file["name"];
            $tipo = $file["type"];
            $ruta_provisional = $file["tmp_name"];
            $size = $file["size"];
            $dimensiones = getimagesize($ruta_provisional);
            $width = $dimensiones[0];
            $height = $dimensiones[1];
            $carpeta = "../tiendas/imagenes/";
            
            if (!file_exists($carpeta)) {
                mkdir($carpeta, 0755, true);
                chmod($carpeta, 0777);
            }
            $carpeta = "../tiendas/imagenes/".$negocio."/";
            if (!file_exists($carpeta)) {
                mkdir($carpeta, 0755, true);
                chmod($carpeta, 0777);
            }
            
            if ($tipofoto == "imgproducto"){
                $carpeta = "../tiendas/imagenes/".$negocio."/productos"."/";
                if (!file_exists($carpeta)) {
                    mkdir($carpeta, 0755, true);
                    chmod($carpeta, 0777);
                }
            }
    
            else if ($tipofoto == "imgportada"){
                $carpeta = "../tiendas/imagenes/".$negocio."/portadas"."/";
                if (!file_exists($carpeta)) {
                    mkdir($carpeta, 0755, true);
                    chmod($carpeta, 0777);
                }
            }
    
            if ($tipo != "image/jpg" && $tipo != "image/jpeg" && $tipo != "image/png"){
                echo "Error, el archivo no es una imagen";
            }
            else{
                
                try{
                    $imgData = resize_image($ruta_provisional, 300, 300, $tipo);
                    if ($tipo == "image/jpg" || $tipo == "image/jpeg"){
                        if ($tipofoto == "imgproducto"){
                            $src = $carpeta."producto-".$tiempo.".jpg";
                        }
                        else if ($tipofoto == "imgportada"){
                            $src = $carpeta."portada-".$tiempo.".jpg";
                        }
                        else if ($tipofoto == "logo"){
                            $src = $carpeta."logo.jpg";
                        }
                        else{
                            $src = $carpeta.$negocio."-".$tiempo.".jpg";
                        }
                        
                        imagejpeg($imgData, $src, 70);
                        chmod($src, 0666);
                        echo "ruta='$src'";
                    }
                    else if ($tipo == "image/png"){
                        if ($tipofoto == "imgproducto"){
                            $src = $carpeta."producto-".$tiempo.".png";
                        }
                        else if ($tipofoto == "imgportada"){
                            $src = $carpeta."portada-".$tiempo.".png";
                        }
                        else if ($tipofoto == "logo"){
                            $src = $carpeta."logo.png";
                        }
                        else{
                            $src = $carpeta.$negocio."-".$tiempo.".png";
                        }
                        
                        imagepng($imgData, $src, 5);
                        chmod($src, 0666);
                        echo "ruta=$src";
                    }
                }
                catch (Exception $e) {
                    echo "ERROR: ".$e->getMessage();
                }
            }
        }
    }


   function resize_image($file, $w, $h, $tipo, $crop=false ) {
    list($width, $height) = getimagesize($file);
    $r = $width / $height;
    
        if ($w/$h > $r) {
            $newwidth = $h*$r;
            $newheight = $h;
        } else {
            $newheight = $w/$r;
            $newwidth = $w;
        }
    
    switch($tipo){
        case "image/png":
            $src = imagecreatefrompng($file);
        break;
        case "image/jpg":
        case "image/jpeg":
            $src = imagecreatefromjpeg($file);
        break;
        case "image/gif":
            $src = imagecreatefromgif($file);
        break;
        default:
            $src = imagecreatefromjpeg($file);
        break;
    }
    
    $dst = imagecreatetruecolor($width*0.65, $height*0.65);
    imagecopyresampled($dst, $src, 0, 0, 0, 0, $width*0.65, $height*0.65, $width, $height);

    return $dst;
}
?>