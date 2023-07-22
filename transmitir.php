<?php include "./class_lib/sesionSecurity.php"; ?>
<!DOCTYPE html>
<html>

<head>
    <title>Transmitir en Vivo</title>
    <?php include "./class_lib/links.php"; ?>
    <?php include "./class_lib/scripts.php"; ?>
    <script type="text/javascript" src="./js/download.js"></script>

    <link rel="stylesheet" href="webcam.css" />
    <link rel="stylesheet" href="css/Chat.css">
    <script src="./js/RecordRTC.js"></script>
    <script src="./js/rtc/RTCMultiConnection.min.js"></script>
    <script src="./js/rtc/adapter.js"></script>
    <script src="./js/rtc/socket.io.js"></script>

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

            <!-- Main content -->
            <section class="content">
                <!-- Your Page Content Here -->
                <div class="row">
                    <div class='col-md-6'>
                        <div class="row">
                            <div class="col">
                                <div class="webcam">
                                    <div class="d-none" id="broadcast-viewers-counter"></div>
                                    <input type="text" id="broadcast-id" value="" class="d-none" autocorrect=off
                                        autocapitalize=off size=20>

                                    <div class="video-outer d-none">
                                        <video id="video-preview" height="100%" width="100%" controls loop></video>
                                    </div>
                                    <div class="no-video-container d-block">
                                        <div class="bg-dark no-video w-100 h-100 d-flex justify-content-center align-items-center"
                                            style="min-height:380px">
                                            <span class="text-light">NO ESTÁS TRANSMITIENDO</span>
                                        </div>
                                    </div>

                                    <div class="webcam-start-stop">
                                        <button id="open-or-join" class="btn btn-success btn-start"><i
                                                class="fa fa-video-camera d-inline-block"></i> VER CÁMARA</button>
                                        <button class="btn btn-danger btn-transmitir d-none">TRANSMITIR</button>
                                        <button class="btn btn-secondary btn-stop" onclick="StopWebCam()"><i
                                                class="fa fa-stop"></i> DETENER</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <div class="row mt-3 mb-3">
                                    <div class="col novideo-msg d-block">
                                        <div class="container bg-danger d-flex justify-content-center align-items-center pt-2 text-center"
                                            style="border-radius:15px">
                                            <h5 class="text-light">ESTADO: NO ESTÁS TRANSMITIENDO</h5>
                                        </div>
                                    </div>
                                    <div class="col live-msg d-none">
                                        <div class="container bg-success d-flex justify-content-center align-items-center pt-2 text-center"
                                            style="border-radius:15px">
                                            <h5 class="text-light">ESTADO: TRANSMITIENDO EN VIVO</h5>
                                        </div>
                                    </div>
                                    <div class="col error-msg d-none">
                                        <div class="container bg-warning d-flex justify-content-center align-items-center pt-2 text-center"
                                            style="border-radius:15px">
                                            <h5 class="text-light">ESTADO: ERROR DE CONEXIÓN</h5>
                                        </div>
                                    </div>
                                </div>
                                <div class="row mb-3 container-grabar d-none">
                                    <div class="col text-center">
                                        <div class="container bg-dark" style="border-radius:15px">
                                            <div
                                                class="d-flex justify-content-center align-items-center p-4 text-center text-light">
                                                <button onclick="setStatusGrabacion(true)" class="btn btn-danger btn-grabar mr-3"><i
                                                        class="fa fa-circle"></i> GRABAR</button>
                                                <button onclick="stopRecording()" class="btn btn-warning btn-stop-grabacion mr-3 visible-grabando d-none"><i
                                                        class="fa fa-stop"></i></button>
                                                <h5 class="mt-1 pt-1 visible-grabando d-none" id="grabando-label">GRABANDO: 00:00</h5>
                                            </div>
                                            
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col text-center">
                                        <div class="container bg-primary d-flex justify-content-center align-items-center pt-2 text-center text-light"
                                            style="border-radius:15px">
                                            <h5 id="viewers-counter">PERSONAS VIENDO: 0</h5>
                                        </div>
                                    </div>
                                </div>
                                <div class="row mt-3">
                                    <div class="col">
                                        <div class="form-group">
                                            <label for="input-titulo" class="col-form-label font-weight-bold">Título de
                                                la Transmisión:</label>
                                            <div class="row">
                                                <div class="col-md-10">
                                                    
                                                        <input type="search" maxlength="50" autocomplete="false" class="form-control w-100"
                                                            id="input-titulo" placeholder="Ingresá un título">
                                                </div>
                                                <div class="col-md-2">
                                                    <button id="btn-guardar-titulo" class="btn btn-primary btn-block"><i class="fa fa-save"></i></button>
                                                </div>
                                                
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
                                            <input maxLength="140" type="search" autocomplete="off"
                                                placeholder="Escribí un mensaje..." id="input-chat" />
                                            <button type="submit">
                                                <i class="fa fa-send text-light"></i>
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row mt-3">
                            <div class="col">
                                <div class="container bg-dark">
                                    <div class="row">
                                        <div class="col-md-6 text-center">
                                            <div class="status-container pt-2">
                                                <div id="container-switch" style="display: none;">
                                                    <div class="status-container">
                                                        <div class="row">
                                                            <div class="col-lg-6">
                                                                <h5 id="label-chat-activo">CHAT<br>OCULTO</h5>
                                                            </div>
                                                            <div class="col-lg-6 pt-2">
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
                                        <div class="col-md-6 text-center">
                                            <div class="status-container2 pt-2">
                                                <div id="container-switch2" style="display: none;">
                                                    <div class="status-container2">
                                                        <div class="row">
                                                            <div class="col-lg-6">
                                                                <h5 id="label-chat-activo2">CHAT<br>BLOQUEADO</h5>
                                                            </div>
                                                            <div class="col-lg-6 pt-2">
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
                                </div>
                            </div>
                        </div>
                        
                        <div class="row mt-3">
                            <div class="col text-center">
                                <div class="bg-dark pl-3 pr-3 pt-3 pb-3">
                                    <div class="row">
                                        <div class="col">
                                            <label for="input-password"
                                                class="text-light font-weight-bold">Contraseña:</label>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-10">
                                            <input type="password" autocomplete="false" class="form-control w-100"
                                                    id="input-password" placeholder="Ingresá una Contraseña">
                                        </div>
                                        <div class="col-md-2">
                                                <button id="btn-confirmar"
                                                    class="btn btn-primary btn-block"><i class="fa fa-save"></i></button>
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
                                            <label for="input-link" class="text-light font-weight-bold"><i
                                                    class="fa fa-share-alt"></i> Compartí tu Canal:</label>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-10">
                                                <input type="search" autocomplete="false" class="form-control w-100"
                                                    id="input-link" placeholder="Link del Canal" readonly>
                                                
                                        </div>
                                        <div class="col-md-2">
                                            <button onclick="abrirLink()"
                                                    class="btn btn-info btn-block"><i class="fa fa-external-link"></i></button>
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

    <script src="dist/js/transmitir.js"></script>

</body>

</html>