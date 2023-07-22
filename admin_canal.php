<?php include "./class_lib/sesionSecurity.php"; ?>
<!DOCTYPE html>
<html>

<head>
  <title>Canal</title>
  <?php include "./class_lib/links.php"; ?>
  <?php include "./class_lib/scripts.php"; ?>
  <link href="https://cdn.jsdelivr.net/gh/gitbrent/bootstrap4-toggle@3.6.1/css/bootstrap4-toggle.min.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/gh/gitbrent/bootstrap4-toggle@3.6.1/js/bootstrap4-toggle.min.js"></script>
  <script src="dist/js/admin_canal.js"></script>
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
            <div style="padding-top:3px;">
              <div id="container-tiendactiva" style="display: none;">
                <div class="status-container">
                  <div class="d-flex flex-row">
                    <div>
                      <h4 id="label-canal-activo">Canal Inactivo</h4>
                    </div>
                    <div style="padding-top:4px;">
                      <label style="display: inline-block;" class="switch">
                        <input type="checkbox" id="switch-canal">
                        <span id="span-slider" class="slider round"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <button id="btn-guardarcambios" class="btn btn-success ml-lg-5" style="display:none"><i class="fa fa-save"></i><b> Guardar Cambios</b></button>
            </div>
          </div>
        </div>
        <ol class="breadcrumb">
          <li><a href="inicio.php"> Inicio</a></li>
          <li class="active"> Canal</li>
        </ol>
      </section>
      <!-- Main content -->
      <section class="content">
        <!-- Your Page Content Here -->
        <div class="row">
          <div class='col-md-4'>
            <form autocomplete="off">
              <div class="form-group">
                <label for="nombre-canal" class="col-form-label">Nombre del Canal:</label>
                <input type="text" autocomplete="false" class="form-control" id="nombre-canal">
              </div>
              <div class="form-group">
                <label for="select-categoria">Categoría:</label>
                <select class="form-control" id="select-categoria">
                  <option value="ninguna">Ninguna</option>
                </select>
              </div>
              <div class="form-group">
                <label for="link-canal" class="col-form-label">Streaming TV: <i class="fa fa-question-circle text-primary info-tooltip" data-toggle="tooltip" data-placement="top" title="El Link debe ser .m3u8"></i></label>
                <input type="text" autocomplete="false" class="form-control" id="link-canal">
              </div>

              <div class="form-group">
                <label for="select-radio">¿Usar Radio?:</label>
                <select class="form-control" id="select-radio">
                  <option value="principal">Radio Principal</option>
                  <option value="propia">Radio Propia del Canal</option>
                  <option value="desactivar">DESACTIVAR RADIO</option>
                </select>
              </div>

              <div class="form-group container-radio">
                <label for="link-radio" class="col-form-label">Streaming Radio:</label>
                <input type="text" autocomplete="false" class="form-control" id="link-radio" oninput='setChanged(true)' maxLength='100' onpaste='setChanged(true)'>
              </div>

              <div class="form-row mt-5">
                <div class="form-group col" id="eliminar-btn-container">
                  <label for="eliminar-btn" class="col-form-label">Eliminar Canal:</label>
                  <button id="eliminar-btn" class="btn btn-danger">ELIMINAR</button>
                </div>
              </div>

            </form>
          </div>
          <div class="col-md-3">
            <div class="form-group img-negocio">
              <label for="img-canal" class="col-form-label">Logo del Canal</label>
              <img id="img-canal" src="dist/img/noimage.jpg">
              <input id="logo-upload" type="file" accept="image/jpeg,image/png" />
            </div>
          </div>
          <div class="col-md-5">
            <div class="row">
              <div class="col">
                <button class="btn btn-dark text-light btn-block btn-transmitir"><i class='fa fa-video-camera text-danger font-weight-bold'></i> Transmitir en Vivo</button>
              </div>
            </div>
            <div class="row mt-4">
                            <div class="col text-center">
                                <div class="bg-dark pl-3 pr-3 pt-3 pb-3">
                                    <div class="row">
                                        <div class="col">
                                            <label for="input-link" class="text-light font-weight-bold"><i class="fa fa-share-alt"></i> Compartí tu Canal:</label>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col">
                                            <input type="search" autocomplete="false" class="form-control" id="input-link" placeholder="Link del Canal" readonly>    
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
          </div>
        </div>

      </section><!-- /.content -->
    </div><!-- /.content-wrapper -->

    <!-- Modal -->
    <div class="modal fade" id="modalUploadLogo" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">¿Subir esta imagen como Logo?</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col">
                <div class="d-flex justify-content-center w-100">
                  <div style="width: 300px;height:300px">
                    <img id="verificar-subida-logo" src="#" style="display: block;max-width: 100%;">
                  </div>
                </div>
              </div>
            </div>

          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary btn-cerrar" data-dismiss="modal">Cancelar</button>
            <button id="btn-subir-logo" type="button" class="btn btn-primary">SUBIR</button>
          </div>
        </div>
      </div>
    </div>
    <!--FIN MODAL SUBIR LOGO-->

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