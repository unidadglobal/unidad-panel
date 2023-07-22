
    <a href="inicio.php" class="logo">
          <!-- mini logo for sidebar mini 50x50 pixels -->
          <span class="logo-mini"><b>UG</b>TV</span>
          <!-- logo for regular state and mobile devices -->
          <span class="logo-lg"><b>Unidad Global</b></span>
    </a>
<!-- Header Navbar -->
        <nav class="navbar navbar-static-top" role="navigation">
          <!-- Sidebar toggle button-->
          <div style="float:left;margin-top:-25px">
            <a href="#" class="sidebar-toggle" data-toggle="offcanvas" role="button">
              <span class="sr-only">Abrir/Cerrar menú</span>
            </a>
          </div>
          <!-- Navbar Right Menu -->
          <div class="navbar-custom-menu">
            <ul class="nav navbar-nav">
              <!-- Notifications Menu -->
              
               <!-- User Account Menu -->
              <li class="dropdown user user-menu">
                <!-- Menu Toggle Button -->
                <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                  <!-- The user image in the navbar-->
                  <img src="<?php 
                        if ($_SESSION['imageUrl'] != NULL){
                          echo $_SESSION["imageUrl"];
                        }
                        else{
                          echo "dist/img/avatar.png";
                        }
                      ?>" class="avatar user-image" onerror="this.src='dist/img/avatar.png';">
                  <!-- hidden-xs hides the username on small devices so only the image appears. -->
                  <span class="hidden-xs"><?php echo $_SESSION['nombre_de_usuario']; ?></span>
                </a>
                <ul class="dropdown-menu">
                  <!-- The user image in the menu -->
                  <li class="user-header">
                    <img src="<?php 
                        if ($_SESSION['imageUrl'] != NULL){
                          echo $_SESSION["imageUrl"];
                        }
                        else{
                          echo "dist/img/avatar.png";
                        }
                      ?>" class="avatar img-circle" onerror="this.src='dist/img/avatar.png';">
                    <p>
                      Usuario: <?php echo $_SESSION['nombre_de_usuario']; ?>
                      <!--<small>Member since Nov. 2012</small>-->
                    </p>
                  </li>
                  <!-- Menu Footer-->
                  <li class="user-footer">
                    
                    <a class="btn btn-danger btn-block btn-exit-system"><i class='fa fa-power-off'></i> Salir</a>
                  </li>
                </ul>
              </li>
              <!-- Control Sidebar Toggle Button -->
              <!--<li>
                <a href="#" data-toggle="control-sidebar"><i class="fa fa-gears"></i></a>
              </li>-->
            </ul>
          </div>
        </nav>
