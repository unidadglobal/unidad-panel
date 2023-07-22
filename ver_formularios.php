<?php include "./class_lib/sesionSecurity.php"; ?>
<!DOCTYPE html>
<html>

<head>
  <title>Formularios</title>
  <?php include "./class_lib/links.php"; ?>
  <?php include "./class_lib/scripts.php"; ?>
  <script src="plugins/moment/moment.min.js"></script>
  <script src="./js/pdf-lib.min.js"></script>
  <script src="./js/download.js"></script>
  <script src="dist/js/ver_formularios.js"></script>
  <script src="dist/js/sidebar-negocio.js"></script>
  
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
          Formularios
        </h1>
        <audio id="alarm" src="sounds/pedido.mp3" muted="true"></audio>
        <ol class="breadcrumb">
          <li><a href="inicio.php">  Inicio</a></li>
          <li class="active">Formularios</li>
        </ol>
      </section>
      <!-- Main content -->
      <section class="content pb-5">
        <!-- Your Page Content Here -->
        <div class='row'>
          <div class='col-md-12'>
            <div class="pb-lg-5 mt-3" id="tabla-container"></div>
          </div>
        </div>
      </section><!-- /.content -->
    </div><!-- /.content-wrapper -->

    <!-- AGREGAR PRODUCTO-->
    <div class="modal fade" id="ModalFormulario" data-backdrop="static" data-keyboard="false" tabindex="-1"
      role="dialog" aria-labelledby="ModalFormularioLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="ModalFormularioLabel">Ver Formulario</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Cerrar">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">

            <div class="row">
              <div class="col-md-6">
                <h5 class="text-primary text-center">DATOS TITULAR</h5>
                <div class="form-group">
                  <label for="nombre-titular" class="col-form-label">Nombre:</label>
                  <input type="text" autocomplete="false" class="form-control" id="nombre-titular" readonly="readonly">
                </div>
                <div class="form-group">
                  <label for="nacionalidad-titular" class="col-form-label">Nacionalidad:</label>
                  <input type="text" autocomplete="false" class="form-control" id="nacionalidad-titular" readonly="readonly">
                </div>
                <div class="form-group">
                  <label for="nacimiento-titular" class="col-form-label">Fecha Nacimiento:</label>
                  <input type="text" autocomplete="false" class="form-control" id="nacimiento-titular" readonly="readonly">
                </div>
                <div class="form-group">
                  <label for="documento-titular" class="col-form-label">Documento:</label>
                  <input type="text" autocomplete="false" class="form-control" id="documento-titular" readonly="readonly">
                </div>
                <div class="form-group">
                  <label for="whatsapp-titular" class="col-form-label">Whatsapp:</label>
                  <input type="text" autocomplete="false" class="form-control" id="whatsapp-titular" readonly="readonly">
                </div>
              </div>
              
              <div class="col-md-6">
                <h5 class="text-success text-center">DATOS CANAL</h5>
                <div class="form-group">
                  <label for="nombre-canal" class="col-form-label">Nombre:</label>
                  <input type="text" autocomplete="false" class="form-control" id="nombre-canal">
                </div>
                <div class="form-group">
                  <label for="contenido-canal" class="col-form-label">Tipo de Contenido:</label>
                  <input type="text" autocomplete="false" class="form-control" id="contenido-canal">
                </div>
                <div class="form-group">
                  <label for="descripcion-canal" class="col-form-label">Descripción:</label>
                  <textarea type="text" style="resize:none" class="form-control" id="descripcion-canal" readonly="readonly"></textarea>
                </div>
                <div class="form-group">
                  <label for="logo-canal" class="col-form-label">Logo:</label>
                  <img id="logo-canal" src="dist/img/noimage.jpg" style="width:200px;height:160px;border-radius:5px;border: 1px solid rgba(124, 124, 124, 0.561)" onerror="this.src = 'dist/img/noimage.jpg';"/>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button id="btn-rechazar" type="button" class="btn btn-danger"
              style="position:fixed;left:15px;">Rechazar</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
            <button id="btn-crear-canal" type="button" class="btn btn-success">Crear Canal</button>
          </div>
        </div>
      </div>
    </div>
    <!--FIN MODAL FORMULARIO-->

    <!-- Modal -->
    <div class="modal fade" id="modalCrearCanal" data-backdrop="static" data-keyboard="false" tabindex="-1"
      role="dialog" aria-labelledby="crearCanalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="crearCanalLabel">Crear Canal</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Cerrar">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col text-center">
                <div class="d-flex justify-content-center">
                  <img id="img-logo" src="" style="display: block;max-width: 100%;width: 400px;height:320px">
                </div>
              </div>
            </div>
            <div class="row mt-3">
              <div class="col">
                <div class="form-group">
                  <label for="select-categoria">Categoría:</label>
                  <select class="form-control" id="select-categoria">
                    <option value="ninguna">Ninguna</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="input-nombre-canal" class="col-form-label">Nombre Canal:</label>
                  <input type="text" autocomplete="false" class="form-control" id="input-nombre-canal" style="text-transform: uppercase;">
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <input id="input-logo" style="display: none;" type="file" accept="image/jpeg,image/png"/>
            <button id="btn-subir-otro" type="button" class="btn btn-primary"
              style="position:fixed;left:15px;">CAMBIAR LOGO</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
            <button id="btn-guardar-canal" type="button" class="btn btn-success">CONFIRMAR</button>
          </div>
        </div>
      </div>
    </div>
    <!--FIN MODAL CREAR CANAL -->



    <!-- Main Footer -->
    <?php
      include('class_lib/main_footer.php');
      ?>

    <!-- Add the sidebar's background. This div must be placed

           immediately after the control sidebar -->

    <div class="control-sidebar-bg"></div>

  </div><!-- ./wrapper -->



  <!-- REQUIRED JS SCRIPTS -->



</body>

</html>