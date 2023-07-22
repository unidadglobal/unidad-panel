$(document).ready(function () {
    $.ajaxSetup({ cache: false })
    $.get('get_session_variable.php', { requested: "tipo_usuario" }, function (data) {
        tipoUsuario = data.trim();
        if (tipoUsuario == "admin"){
            $("#sidebar-menu").html(
                `
                    <li>
                        <a href="inicio.php">
                        <i class="fa fa-arrow-circle-right"></i> 
                        <span>Canales y Radios</span>
                        </a>
                    </li>
                    <li>
                      <a href="posicionar_canales.php">
                      <i class="fa fa-arrow-circle-right"></i> 
                      <span>Posicionar Canales</span>
                      </a>
                  </li>
                  <li>
                      <a href="admin_videos.php">
                      <i class="fa fa-arrow-circle-right"></i> 
                      <span>Videos</span>
                      </a>
                  </li>
                  <li>
                      <a href="admin_noticias.php">
                      <i class="fa fa-arrow-circle-right"></i> 
                      <span>Noticias</span>
                      </a>
                  </li>
                  <li>
                      <a href="admin_categorias.php">
                      <i class="fa fa-arrow-circle-right"></i> 
                      <span>Categorías</span>
                      </a>
                  </li>
                  <li>
                      <a href="posicionar_categorias.php">
                      <i class="fa fa-arrow-circle-right"></i> 
                      <span>Posicionar Categorías</span>
                      </a>
                  </li>
                  <li>
                      <a href="admin_publicidad.php">
                      <i class="fa fa-arrow-circle-right"></i> 
                      <span>Publicidad</span>
                      </a>
                  </li>
                  <li>
                      <a href="ver_formularios.php">
                      <i class="fa fa-arrow-circle-right"></i> 
                      <span>Formularios</span>
                      </a>
                  </li>
                  <li>
                      <a href="info_sitio.php">
                      <i class="fa fa-arrow-circle-right"></i> 
                      <span>Información del Sitio</span>
                      </a>
                  </li>
                `
            );
        }
        else if (tipoUsuario == "user"){
            $("#sidebar-menu").html(
                `
                    <li>
                        <a href="inicio.php">
                        <i class="fa fa-arrow-circle-right"></i> 
                        <span>Canales y Radios</span>
                        </a>
                    </li>
                  <li>
                      <a href="admin_videos.php">
                      <i class="fa fa-arrow-circle-right"></i> 
                      <span>Videos</span>
                      </a>
                  </li>
                `
            );
        }
    });
    
});