<?php include "./class_lib/sesionSecurity.php"; ?>
<!DOCTYPE html>
<html>

<head>
    <title>Transmitir en Vivo</title>
    <?php include "./class_lib/links.php"; ?>
    <?php include "./class_lib/scripts.php"; ?>
    <script type="text/javascript" src="./js/download.js"></script>
    <script type="text/javascript" src="./js/MediaStreamRecorder.js"></script>
    <script type="text/javascript" src="./js/ffmpeg.min.js"></script>

    <link rel="stylesheet" href="webcam.css" />
    <link rel="stylesheet" href="css/Chat.css">
    <link rel="stylesheet" href="css/rtc.css">

    <script src="./js/rtc/RTCMultiConnection.min.js"></script>
    <script src="./js/rtc/adapter.js"></script>
    <script src="./js/rtc/socket.io.js"></script>
    <script src="dist/js/transmitir.js"></script>
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
                <h1>Transmitir en Vivo</h1>
                <ol class="breadcrumb">
                    <li><a href="inicio.php"> Inicio</a></li>
                    <li class="active"> Transmitir en Vivo</li>
                </ol>
            </section>

            <section class="make-center">
      <p style="margin: 0; padding: 0; padding-bottom: 20px;">
          <div class="make-center">
          <input type="text" id="broadcast-id" value="room-xyz" autocorrect=off autocapitalize=off size=20>
          <button id="open-or-join">Open or Join Broadcast</button>

          <div class="make-center" id="broadcast-viewers-counter"></div>
      </p>

      <video id="video-preview" controls loop></video>
  </section>
            <!-- Main content -->
            <section class="content">
                <!-- Your Page Content Here -->
                <div class="row">
                    <div class='col-md-6'>
                        <div class="row">
                            <div class="col">
                                <div class="webcam">
                                    <div class="video-outer d-none">
                                        <video id="video" height="100%" width="100%" autoplay></video>
                                        

                                    </div>
                                    <div class="no-video-container d-block">
                                        <div class="bg-dark no-video w-100 h-100 d-flex justify-content-center align-items-center" style="min-height:380px">
                                            <span class="text-light">NO ESTÁS TRANSMITIENDO</span>
                                        </div>
                                    </div>

                                    <div class="webcam-start-stop">
                                        <button class="btn btn-success btn-start d-flex" onclick="start()">VER CÁMARA</button>
                                        <button class="btn btn-danger btn-transmitir d-none">TRANSMITIR</button>
                                        <button class="btn btn-secondary btn-stop" onclick="StopWebCam()">DETENER</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <div class="row mt-3 mb-3">
                                    <div class="col novideo-msg d-block">
                                        <div class="container bg-danger d-flex justify-content-center align-items-center pt-2 text-center" style="border-radius:15px">
                                            <h5 class="text-light">ESTADO: NO ESTÁS TRANSMITIENDO</h5>
                                        </div>
                                    </div>
                                    <div class="col live-msg d-none">
                                        <div class="container bg-success d-flex justify-content-center align-items-center pt-2 text-center" style="border-radius:15px">
                                            <h5 class="text-light">ESTADO: TRANSMITIENDO EN VIVO</h5>
                                        </div>
                                    </div>
                                    <div class="col error-msg d-none">
                                        <div class="container bg-warning d-flex justify-content-center align-items-center pt-2 text-center" style="border-radius:15px">
                                            <h5 class="text-light">ESTADO: ERROR DE CONEXIÓN</h5>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col">
                                        <div class="form-group">
                                            <label for="input-titulo" class="col-form-label font-weight-bold">Título de la Transmisión:</label>
                                            <div class="d-flex flex-row">
                                                <input type="text" autocomplete="false" class="form-control w-75 mr-2" id="input-titulo" placeholder="Ingresá un título">
                                                <button class="btn btn-primary btn-block w-25">ACTUALIZAR</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="row">
                            <div class="col">
                                <div class="Chat">
                                    <div className="chat-container">
                                        <div id="main">
                                        </div>
                                        <form id="form-chat" onSubmit="sendMessage()">
                                            <input maxLength="140" placeholder="Escribí un mensaje..." id="input-chat" />
                                            <button type="submit">
                                                <i class="fa fa-send text-light"></i>
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row mt-3">
                            <div class="col text-center">
                                <div class="status-container bg-dark pt-2">
                                    <div id="container-switch" style="display: none;">
                                        <div class="status-container">
                                            <div class="d-flex flex-row justify-content-center">
                                                <div>
                                                    <h4 id="label-chat-activo">Chat Oculto</h4>
                                                </div>
                                                <div style="padding-top:4px;">
                                                    <label style="display: inline-block;" class="switch">
                                                        <input type="checkbox" id="switch-chat">
                                                        <span id="span-slider" class="slider round"></span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div class="row mt-3">
                            <div class="col text-center">
                                <div class="status-container2 bg-dark pt-2">
                                    <div id="container-switch2" style="display: none;">
                                        <div class="status-container2">
                                            <div class="d-flex flex-row justify-content-center">
                                                <div>
                                                    <h4 id="label-chat-activo2">Chat Bloqueado</h4>
                                                </div>
                                                <div style="padding-top:4px;padding-left:15px">
                                                    <label style="display: inline-block;" class="switch">
                                                        <input type="checkbox" id="switch-chat2">
                                                        <span id="span-slider2" class="slider round"></span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div class="row mt-3">
                            <div class="col text-center">
                                <div class="bg-dark pl-3 pr-3 pt-3 pb-3">
                                    <div class="row">
                                        <div class="col">
                                            <label for="input-password" class="text-light font-weight-bold">Contraseña:</label>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col">
                                            <div class="d-flex flex-row">
                                                <input type="password" autocomplete="false" class="form-control w-75" id="input-password" placeholder="Ingresá una Contraseña">    
                                                <button id="btn-confirmar" class="btn btn-primary font-weight-bold w-25 ml-3">CONFIRMAR</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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