<?php include "./class_lib/sesionSecurity.php"; ?>
<!DOCTYPE html>
<html>

<head>
  <title>Panel Unidad Global TV</title>
  <?php include "./class_lib/links.php"; ?>
  <?php include "./class_lib/scripts.php"; ?>
  <script src="dist/js/source_init.js"></script>

  <script>
      $(document).ready(function () {
        $("#contenedor_modulos").html("");
        
      });
  </script>
</head>

<body>

  <div class="wrapper">
    <header class="main-header">
      <?php
        include('class_lib/nav_header.php');
        ?>
    </header>
    <!-- Left side column. contains the logo and sidebar -->
    <aside class="main-sidebar">
      <!-- sidebar: style can be found in sidebar.less -->
      <?php
        include('class_lib/sidebar.php');
        
        $dias = array("Domingo","Lunes","Martes","Miercoles","Jueves","Viernes","Sábado");
        $meses = array("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
        $fecha=$dias[date('w')]." ".date('d')." de ".$meses[date('n')-1]. " del ".date('Y') ;
        ?>
      <!-- /.sidebar -->
    </aside>

    <!-- Content Wrapper. Contains page content -->
    <div class="content-wrapper">
      <?php include('loader.php'); ?>
      <!-- Content Header (Page header) -->
      <section class="content-header">
        <h1>
          <small>
            <?php echo $fecha; ?>
          </small>
        </h1>
        <ol class="breadcrumb">
          <li><a href="inicio.php">Inicio</a></li>
          <li class="active">Inicio</li>
        </ol>
      </section>
      <!-- Main content -->
      <section class="content">
        <div class='row'>
          <div class="pl-3 pr-3 w-100" id="container-main">
          </div>
        </div>
        <div class="row mt-3 mb-5">
          <div class="col container-radio w-100">

          </div>
          
        </div>
      </section>
    </div>

    <div class="modal fade" id="ModalCanal" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog"
      aria-labelledby="ModalCanalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="ModalCanalLabel">Agregar Canal</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Cerrar">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form autocomplete="off">
              <div class="form-group">
                <label for="nombre-canal" class="col-form-label">Nombre Canal:</label>
                <input type="text" autocomplete="false" class="form-control" id="nombre-canal" autofocus>
              </div>
              <div class="form-group">
                    <label for="select-categoria">Categoría:</label>
                    <select class="form-control" id="select-categoria">
                      <option value="ninguna">Ninguna</option>
                    </select>
                  </div>
              <div class="form-group">
                <label for="link-canal" class="col-form-label">Link Streaming:</label>
                <input type="text" autocomplete="false" class="form-control" id="link-canal" placeholder=".m3u8">
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
            <button id="btn-agregarcanal" type="button" class="btn btn-primary">Agregar</button>
          </div>
        </div>
      </div>
    </div>
    <!-- /.content-wrapper -->
    <!-- Main Footer -->
    <?php include('./class_lib/main_footer.php'); ?>
    <!-- Add the sidebar's background. This div must be placed
           immediately after the control sidebar -->
    <div class="control-sidebar-bg"></div>
  </div><!-- ./wrapper -->

  <script src="dist/js/sidebar-negocio.js"></script>
</body>

</html>