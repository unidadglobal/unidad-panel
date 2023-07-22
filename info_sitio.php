<?php include "./class_lib/sesionSecurity.php"; ?>
<!DOCTYPE html>
<html>

<head>
  <title>Información del Sitio</title>
  <?php include "./class_lib/links.php"; ?>
  <?php include "./class_lib/scripts.php"; ?>
  <script src="dist/js/info_sitio.js"></script>
</head>

<body>

  <div class="wrapper">
    <!-- Main Header -->
    <header class="main-header">
      <!-- Logo -->
      <?php
        include('class_lib/nav_header.php');
        ?>
    </header>
    <!-- Left side column. contains the logo and sidebar -->
    <aside class="main-sidebar">
      <!-- sidebar: style can be found in sidebar.less -->
      <?php
        include('class_lib/sidebar.php');
        ?>
      <!-- /.sidebar -->
    </aside>
    <!-- Content Wrapper. Contains page content -->
    <div class="content-wrapper">
      <?php
          include('loader.php');
        ?>
      <!-- Content Header (Page header) -->
      <section class="content-header">
        <div class="status-container">
          <div class="d-flex flex-row">
            <div>
              <h4>Info del Sitio</h4>
            </div>
            <div>
              <button id="btn-guardarcambios" class="btn btn-success ml-lg-5" style="display:none"><i
                  class="fa fa-save"></i><b> Guardar Cambios</b></button>
            </div>
          </div>
        </div>
        <ol class="breadcrumb">
          <li><a href="inicio.php"> Inicio</a></li>
          <li class="active"> Info del Sitio</li>
        </ol>
      </section>
      <!-- Main content -->
      <section class="content">
        <!-- Your Page Content Here -->
        <div class="row">
          <div class='col-md-4'>
            <form autocomplete="off">
              <div class="form-group">
                <label for="input-instagram" class="col-form-label">Instagram:</label>
                <input type="text" autocomplete="false" class="form-control" id="input-instagram" placeholder="Ej. https://instagram.com/carlosfrancopilar">
              </div>
              <div class="form-group">
                <label for="input-facebook" class="col-form-label">Facebook:</label>
                <input type="text" autocomplete="false" class="form-control" id="input-facebook" placeholder="Ej. https://facebook.com/carlosfrancopilar">
              </div>
              <div class="form-group">
                <label for="input-twitter" class="col-form-label">Twitter:</label>
                <input type="text" autocomplete="false" class="form-control" id="input-twitter" placeholder="Ej. https://twitter.com/carlosfrancopilar">
              </div>
              <div class="form-group">
                <label for="input-footer" class="col-form-label">Pie de Página:</label>
                <input type="text" autocomplete="false" class="form-control" id="input-footer" placeholder="Ej. Creado por Carlos Franco Pilar">
              </div>
              <div class="form-group">
                <label for="input-donaciones" class="col-form-label">Donaciones:</label>
                <input type="text" autocomplete="false" class="form-control" id="input-donaciones" placeholder="Link de MercadoPago o Similares">
              </div>
            </form>
          </div>
        </div>

      </section><!-- /.content -->
    </div><!-- /.content-wrapper -->


    <!-- Main Footer -->
    <?php
      include('class_lib/main_footer.php');
      ?>

    <!-- Add the sidebar's background. This div must be placed
           immediately after the control sidebar -->
    <div class="control-sidebar-bg"></div>
  </div><!-- ./wrapper -->

  <!-- REQUIRED JS SCRIPTS -->
  <script src="dist/js/sidebar-negocio.js"></script>
  
  <script src="plugins/moment/moment.min.js"></script>



</body>

</html>