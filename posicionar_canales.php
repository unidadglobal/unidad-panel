<?php include "./class_lib/sesionSecurity.php"; ?>
<!DOCTYPE html>
<html>
  <head>
    <title>Posicionar Canales</title>
    <?php include "./class_lib/links.php"; ?>
    <?php include "./class_lib/scripts.php"; ?>
    <script src="plugins/moment/moment.min.js"></script>
    <script src="https://cdn.jsdelivr.net/gh/RubaXa/Sortable/Sortable.min.js"></script>
    <script src="dist/js/posicionar_canales.js"></script>
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
        <?php include('loader.php'); ?>
        <!-- Content Header (Page header) -->
        <section class="content-header">
          <h1>
            Posicionar Canales
            <button id="btn-guardarcambios" class="btn btn-success ml-lg-5"><i class="fa fa-save"></i><b> Guardar Cambios</b></button>
          </h1>
          <ol class="breadcrumb">
            <li><a href="inicio.php"> Inicio</a></li>
            <li class="active">Posicionar Canales</li>
          </ol>
        </section>
        <!-- Main content -->
        <section class="content" id="main-content">
            <div class="row">
                <div class="col-md-8">
                    <ul class="list-group" id="listacanales">
                        
                    </ul>
                </div>
            </div>
        </section><!-- /.content -->
        </div><!-- /.content-wrapper -->
      
      <?php
      include('class_lib/main_footer.php');
      ?>
      
      <!-- Add the sidebar's background. This div must be placed
           immediately after the control sidebar -->
      <div class="control-sidebar-bg"></div>
    </div><!-- ./wrapper -->
  

    <!-- REQUIRED JS SCRIPTS -->
    <script src="dist/js/sidebar-negocio.js"></script>
  </body>
</html>