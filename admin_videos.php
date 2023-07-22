<?php include "./class_lib/sesionSecurity.php"; ?>
<!DOCTYPE html>
<html>

<head>
    <title>Videos</title>
    <?php include "./class_lib/links.php"; ?>
    <?php include "./class_lib/scripts.php"; ?>
    <script src="dist/js/admin_videos.js"></script>
</head>

<body>
    <video style="display: none;" id="myvid">

    </video>
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
                    Videos
                </h1>
                <button id="btn-agregar-video" class="btn btn-success btn-round fa fa-plus-square ml-3" style="display:inline-block"></button>
                <ol class="breadcrumb">
                    <li><a href="inicio.php"> Inicio</a></li>
                    <li class="active">Videos</li>
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

        <div class="modal fade" id="ModalEditarVideo" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-labelledby="ModalEditarVideoLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="ModalEditarVideoLabel">Modificar Video</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Cerrar">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form autocomplete="off">
                            <div class="form-group">
                                <label for="titulo-video-editar" class="col-form-label">Título del Video:</label>
                                <input type="text" autocomplete="false" class="form-control" id="titulo-video-editar">
                            </div>
                            <div class="form-group">
                                <label for="select-categoria2">Categoría:</label>
                                <select class="form-control select-categoria" id="select-categoria2" onchange="loadCanalesSelect(this.value)">
                                    <option value="ninguna">Ninguna</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="select-canal2">Canal:</label>
                                <select class="form-control select-canal" id="select-canal2">
                                    <option value="ninguno">Ninguno</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button id="btn-cancelar" type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                        <button id="btn-guardar" type="button" class="btn btn-primary btn-guardar-video">GUARDAR</button>
                    </div>
                </div>
            </div>
        </div>
        <!--FIN MODAL EDITAR VIDEO-->

        <!-- AGREGAR VIDEO-->
        <div class="modal fade" id="ModalVideo" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-labelledby="ModalEditarVideo" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="ModalEditarVideo">Agregar Video</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Cerrar">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form autocomplete="off">
                            <div class="form-group">
                                <label for="titulo-video" class="col-form-label">Título del Video:</label>
                                <input type="text" autocomplete="false" class="form-control" id="titulo-video">
                            </div>
                            <div class="form-group">
                                <label for="select-categoria">Categoría:</label>
                                <select class="form-control select-categoria" id="select-categoria" onchange="loadCanalesSelect(this.value)">
                                    <option value="ninguna">Ninguna</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="select-canal">Canal:</label>
                                <select class="form-control select-canal" id="select-canal">
                                    <option value="ninguno">Ninguno</option>
                                </select>
                            </div>
                            <div class="form-group input-video-container">
                                <label for="radio-file" class="col-form-label">Subir Video (.mp4):</label>
                                <input type="file" class="form-control" id="input-video" accept="video/mp4">
                            </div>
                            <div class="form-group">
                                <div class="progress" style="height: 30px;">
                                    <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style="width: 0;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">0%</div>
                                </div>
                            </div>
                            <div class='d-none' id="thumbnail"></div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button id="btn-cancelar-video" type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                        <button id="btn-guardar-video" type="button" class="btn btn-primary btn-guardar-video">SUBIR</button>
                    </div>
                </div>
            </div>
        </div>
        <!--FIN MODAL AGREGAR VIDEO-->


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