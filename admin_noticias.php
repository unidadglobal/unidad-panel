<?php include "./class_lib/sesionSecurity.php"; ?>
<!DOCTYPE html>
<html>
  <head>
    <title>Noticias</title>
    <?php include "./class_lib/links.php"; ?>
    <?php include "./class_lib/scripts.php"; ?>
    <script src="dist/js/admin_noticias.js"></script>
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
          <h1 style="display:inline-block">
            Noticias
          </h1>
          <button id="btn-agregar-noticia" onclick='location.href = "agregar_noticia.php";' class="btn btn-success btn-round fa fa-plus-square ml-3" style="display:inline-block"></button>
          <ol class="breadcrumb">
            <li><a href="inicio.php">  Inicio</a></li>
            <li class="active">Noticias</li>
          </ol>
        </section>
        <!-- Main content -->
        <section class="content pb-5">
         <!-- Your Page Content Here -->
          <div class='row'>
          <div class='col'>
            <div class="pb-lg-5 mt-3" id="tabla-container"></div>
          </div>
          </div>
        </section><!-- /.content -->
         </div><!-- /.content-wrapper -->

         <!-- AGREGAR CATEGORIA-->
         <div class="modal fade" id="ModalCategoria" data-backdrop="static" data-keyboard="false"  tabindex="-1" role="dialog" aria-labelledby="ModalCategoriaLabel" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="ModalCategoriaLabel">Agregar Categoría</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Cerrar">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <form autocomplete="off">
                  <div class="form-group">
                    <label for="nombre-noticia" class="col-form-label">Nombre:</label>
                    <input type="text" autocomplete="false" class="form-control" id="nombre-noticia" placeholder="Ejemplo: Deportes">
                  </div>
                  <div class="form-group">
                    <label for="descripcion-noticia" class="col-form-label">Descripción (Opcional):</label>
                    <textarea type="text" style="resize:none" class="form-control" id="descripcion-noticia"></textarea>
                  </div>
                  <div class="form-group input-imagen">
                    <label for="imagen-noticia" class="col-form-label">Imagen:</label>
                    <input type="file" class="form-control" id="imagen-noticia" accept="image/jpeg,image/png">
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button id="btn-eliminar-noticia" type="button" class="btn btn-danger" style="position:fixed;left:15px;display:none">Eliminar</button>
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button id="btn-guardar-noticia" type="button" class="btn btn-primary">Guardar</button>
              </div>
            </div>
          </div>
        </div>
        <!--FIN MODAL AGREGAR CAT-->
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