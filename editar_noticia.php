<?php include "./class_lib/sesionSecurity.php"; ?>
<!DOCTYPE html>
<html>

<head>
  <title>Editar Noticia</title>
  <?php include "./class_lib/links.php"; ?>
  <?php include "./class_lib/scripts.php"; ?>
  <script src="dist/js/editar_noticia.js"></script>
</head>

<body>
  <div id="ocultar">
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
      <div id="contenido" class="content-wrapper">
        <?php include('loader.php'); ?>
        <!-- Content Header (Page header) -->
        <section class="content-header">
          <h1 style="display:inline-block">
            Editar Noticia
          </h1>
          <button id="btn-guardar-noticia" style="margin-left: 20px;display:inline-block"
            class="btn btn-primary">Guardar</button>

          <ol class="breadcrumb">
            <li><a href="inicio.php"> Inicio</a></li>
            <li class="active">Editar Noticia</li>
          </ol>
        </section>
        <!-- Main content -->
        <section class="content pb-5">
          <!-- Your Page Content Here -->
          <div class='row'>
            <div class='col-md-6'>
              <div class="pb-lg-5 mt-2" id="contenedor">
                <form autocomplete="off">
                  <div class="form-group">
                    <label for="titulo-noticia" class="col-form-label">Título:</label>
                    <input type="text" autocomplete="false" class="form-control" id="titulo-noticia"
                      placeholder="Título de la Noticia" autofocus>
                  </div>
                  <div class="form-group">
                    <label for="subtitulo-noticia" class="col-form-label">Subtítulo:</label>
                    <input type="text" autocomplete="false" class="form-control" id="subtitulo-noticia"
                      placeholder="Subtítulo de la Noticia">
                  </div>
                  <div class="form-group">
                    <label for="select-categoria">Categoría:</label>
                    <select class="form-control" id="select-categoria">
                      <option value="ninguna">Ninguna</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label for="contenido-noticia" class="col-form-label">Contenido de la Noticia:</label>
                    <textarea type="text" rows="20" style="resize:none" class="form-control" id="contenido-noticia"></textarea>
                  </div>
                </form>

              </div>
            </div>
            <div class="col-md-6">
              <!-- CONTENEDOR IMAGENES DE LA NOTICIA -->
              <div class="row">
                <h6 style="margin-top:20px">Imágenes</h6>
                <div id="container-img-noticia" class="img-noticia">
                  <div class="image-div">
                    <img id="img-noticia1" class="img-noticia" src="dist/img/noimage.jpg">
                    <input class="img-input" x-data="none" id="img-upload1" type="file" accept="image/*" />
                    <button class="btn btn-danger btn-sm rounded-0 btn-eliminar-foto" type="button"><i
                        class="fa fa-trash"></i></button>
                  </div>

                  <div class="image-div">
                    <img id="img-noticia2" class="img-noticia" src="dist/img/noimage.jpg">
                    <input class="img-input" x-data="none" id="img-upload2" type="file" accept="image/*" />
                    <button class="btn btn-danger btn-sm rounded-0 btn-eliminar-foto" type="button"><i
                        class="fa fa-trash"></i></button>
                  </div>

                  <div class="image-div">
                    <img id="img-noticia3" class="img-noticia" src="dist/img/noimage.jpg">
                    <input class="img-input" x-data="none" id="img-upload3" type="file" accept="image/*" />
                    <button class="btn btn-danger btn-sm rounded-0 btn-eliminar-foto" type="button"><i
                        class="fa fa-trash"></i></button>
                  </div>

                  <div class="image-div">
                    <img id="img-noticia4" class="img-noticia" src="dist/img/noimage.jpg">
                    <input class="img-input" x-data="none" id="img-upload4" type="file" accept="image/*" />
                    <button class="btn btn-danger btn-sm rounded-0 btn-eliminar-foto" type="button"><i
                        class="fa fa-trash"></i></button>
                  </div>

                  <div class="image-div">
                    <img id="img-noticia5" class="img-noticia" src="dist/img/noimage.jpg">
                    <input class="img-input" x-data="none" id="img-upload5" type="file" accept="image/*" />
                    <button class="btn btn-danger btn-sm rounded-0 btn-eliminar-foto" type="button"><i
                        class="fa fa-trash"></i></button>
                  </div>
                  <div style="clear:left;"></div>
                </div>
              </div>
            </div>
            <!--FIN COLUMNA-->
          </div>
        </section><!-- /.content -->
      </div><!-- /.content-wrapper -->

      <!-- Modal FOTO noticia-->
      <div class="modal fade" id="ModalUploadImg" data-backdrop="static" data-keyboard="false" tabindex="-1"
        role="dialog" aria-labelledby="ModalUploadImgLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="ModalUploadImgLabel">¿Subir esta imagen?</h5>
              <span id="id-input" style="display:none"></span>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col text-center">
                  <img id="verificar-subida-img" src="#" style="max-width: 350px;max-height:350px">
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
              <button id="btn-subir-img" type="button" class="btn btn-primary">SUBIR</button>
            </div>
          </div>
        </div>
      </div>
      <!--FIN MODAL FOTO-->


      <!-- Main Footer -->
      <?php
      include('class_lib/main_footer.php');
      ?>

      <!-- Add the sidebar's background. This div must be placed

           immediately after the control sidebar -->

      <div class="control-sidebar-bg"></div>

    </div><!-- ./wrapper -->

  </div> <!-- MODAL FIN -->
  <!-- REQUIRED JS SCRIPTS -->
  <script src="dist/js/sidebar-negocio.js"></script>
  
</body>

</html>