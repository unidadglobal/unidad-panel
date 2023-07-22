<section class="sidebar">
          <!-- Sidebar user panel (optional) -->
          <div class="user-panel">
            <div class="pull-left image">
              <img src="
                <?php 
                  if ($_SESSION['imageUrl'] != NULL){
                    echo $_SESSION["imageUrl"];
                  }
                  else{
                    echo "dist/img/avatar.png";
                  }
                ?>" class="avatar img-circle" style="cursor:pointer;border-radius: 8px !important;" onerror="this.src='dist/img/avatar.png';">
            </div>
            <div class="pull-left info">
              <p><?php echo $_SESSION['nombre_de_usuario'] ?></p>
              <!-- Status -->
              <a href="#"><i class="fa fa-circle text-success"></i> Conectado</a>
            </div>
          </div>

          <!-- Sidebar Menu -->
          <ul class="sidebar-menu" id="sidebar-menu">
            
            <!-- Optionally, you can add icons to the links -->
            <!--
            <li class="treeview">
              <a href="#"><i class="fa fa-bars"></i> <span>Panel de Control</span> <i class="fa fa-angle-left pull-right"></i></a>
              <ul class="treeview-menu" id="contenedor_modulos">
                
              </ul>
            </li>

            <li id="contenedor_panel" class="treeview">
              
            </li>
            -->
          </ul><!-- /.sidebar-menu -->
        </section>

        