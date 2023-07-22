<!DOCTYPE html>
<html>
  <head>
    <title>Iniciar Sesión</title>
    <?php include "./class_lib/links.php"; ?>
    <?php include "./class_lib/scripts.php"; ?>
    
  </head>
  <body onLoad="document.getElementById('username').focus();">
    <form id="form-login" class="MainLogin" data-type-form="login" autocomplete="off">
        <div align="center"><img src="logo.png" style="max-width:180px"></img></div>
        <p class="text-center text-muted lead">Panel de Administración</p>
        
        <p class="text-center mt-3">
            <button type="button" id="btn-google" class="btn btn-danger btn-block"><i class="fa fa-google"></i> INGRESAR CON GOOGLE</button>        
        </p>
        
        
        <div class="form-group">
          <label class="control-label" for="UserName">E-mail</label>
          <input class="form-control" name="usuario" id="username" type="text" required="">
        </div>
        <div class="form-group">
          <label class="control-label" for="Pass">Contraseña</label>
          <input class="form-control" name="pass" id="pass" type="password" required="">
        </div>
        
          <center>
          <a id="recuperar-pass" style="text-align:center" href="javascript:;">¿Olvidaste tu Contraseña?</a>
          </center>
        
        <p class="text-center mt-3">
            <button type="submit" class="btn btn-primary btn-block">Ingresar</button>        
        </p>
    </form>
    
    <script src="dist/js/login.js"></script>
  </body>
</html>
