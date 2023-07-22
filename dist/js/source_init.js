const db = firebase.firestore();
let hasChanged = false;

let listaCategorias = [];

async function loadCategorias() {
  $("#select-categoria").html(`
    <option value="ninguna">Ninguna</option>
  `);

  listaCategorias = [];
  const colRef = db
    .collection("categorias")
    .where("tipo", "==", 1)
    .orderBy("nombre", "asc");
  colRef.get().then((querySnapshot) => {
    $("#select-categoria-filtro").html(`
      <option value="ninguna">Todas las Categorías</option>
    `);
    if (querySnapshot.docs && querySnapshot.docs.length) {
      for (let j = 0; j < querySnapshot.docs.length; j++) {
        let doc = querySnapshot.docs[j];
        $("#select-categoria,#select-categoria-filtro").append(
          `
            <option value="${doc.id}">${doc.data().nombre}</option>
            `
        );

        listaCategorias.push({
          id: doc.id,
          nombre: doc.data().nombre,
        });
      }
    }
  });
}

$(document).ready(async function () {
  $("#nombre-canal").on("keypress paste", function (e) {
    let regex = new RegExp("^[a-zA-Z0-9ñÑ'áéíóúÁÉÍÓÚüÜ ]+$");
    let str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
      return true;
    }

    e.preventDefault();
    return false;
  });

  await loadCategorias();
  await loadCanales();

  $("#btn-agregarcanal").on("click", function (e) {
    const nombre = $("#nombre-canal").val().trim();
    const link = $("#link-canal").val().trim();
    const categoria = $("#select-categoria option:selected").val();

    if (nombre.length < 3) {
      swal("Ingresá el Nombre del Canal!", "", "error");
    } else if (!link.length) {
      swal("Ingresá el Link del Streaming!", "", "error");
    } else if (!link.includes(".m3u8")) {
      swal("El Link debe tener el formato .m3u8!", "", "error");
    } else {
      $("#btn-agregarcanal").attr("disabled", true);

      db.collection("canales")
        .where("nombre", "==", nombre)
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.docs && querySnapshot.docs.length) {
            $("#btn-agregarcanal").attr("disabled", false);
            swal(
              "Ya existe un Canal con el mismo nombre!",
              "Elegí otro.",
              "error"
            );
          } else {
            db.collection("canales")
              .where("orden", "!=", null)
              .orderBy("orden", "desc")
              .limit(1)
              .get()
              .then((querySnapshot) => {
                let orden = 0;
                if (querySnapshot.docs && querySnapshot.docs.length) {
                  orden = querySnapshot.docs[0].data().orden + 1;
                }

                db.collection("canales")
                  .doc()
                  .set({
                    nombre: nombre,
                    stream: link,
                    activo: true,
                    categoria: categoria,
                    fecha_creacion: new Date(),
                    orden: orden,
                  })
                  .then(function () {
                    $("#ModalCanal").modal("hide");
                    $("#btn-agregarcanal").attr("disabled", false);
                    swal("Agregaste el Canal correctamente!", "", "success");
                    loadCanales();
                  })
                  .catch((error) => {
                    swal(
                      "Ocurrió un error al crear el Canal",
                      error.toString(),
                      "error"
                    );
                    $("#btn-agregarcanal").attr("disabled", false);
                    console.log(error);
                  });
              });
          }
        })
        .catch((error) => {
          swal("Ocurrió un error. Intentá nuevamente", "", "error");
          console.log(error);
        });
    }
  });
});

function agregarCanal() {
  $("#ModalCanal").find("input").val("");
  $("#ModalCanal").modal("show");
  setTimeout(function () {
    $("#nombre-canal").focus();
  }, 900);
}

async function loadCanales(mostrarEliminados, idCategoria) {
  if (idCategoria == "todas") idCategoria = null;
  let tipoUsuario;
  $.ajaxSetup({ cache: false });
  await $.get(
    "get_session_variable.php",
    { requested: "tipo_usuario" },
    function (data) {
      tipoUsuario = data.trim() ? data.trim() : null;
    }
  );
  let colRef;
  if (tipoUsuario == "admin") {
    $("#container-main").html(`
              <div class="row">
                <div class="col">
                  <div class='d-flex flex-row'>
                    <h4>Canales</h4>
                    <button id="btn-mostrareliminados" class="btn btn-secondary btn-sm ml-3">Mostrar Desactivados</button>
                    <select class="form-control ml-4" onchange="loadCanales(false, this.value)" style="width:250px" id="select-categoria-filtro">
                      
                    </select>
                  </div>
                </div>
              </div>
                <div class="row mt-3" id="rownegocios">
                <div class='col-6 col-md-2'>
                <div class='card' onClick="agregarCanal()">
                  <img class="card-img-top" src='dist/img/addpedido.png' style="padding:50px"/>
                    <div class='card-body'>
                      <div class="title-negocio-wrapper" style="overflow:hidden;height:60px;">
                        <h6 style="overflow:hidden;">Agregar Canal</h6>
                      </div>
                    </div>
                  </div>
                  </div>
                </div>        
              </div>
              `);

    $("#select-categoria-filtro").html(
      `
          <option value="todas">Todas las Categorías</option>
          `
    );
    for (let j = 0; j < listaCategorias.length; j++) {
      let doc = listaCategorias[j];
      $("#select-categoria-filtro").append(
        `
          <option value="${doc.id}">${doc.nombre}</option>
          `
      );
    }

    if (idCategoria){
      $("#select-categoria-filtro").val(idCategoria)
    }

    if (mostrarEliminados == true) {
      colRef = db.collection("canales").orderBy("nombre", "asc");
    } else {
      colRef = db
        .collection("canales")
        .orderBy("nombre", "asc")
        .where("activo", "==", true);
    }
    
    if (idCategoria){
      colRef = colRef.where("categoria", "==", idCategoria)
    }

    $("#btn-mostrareliminados").on("click", function () {
      if (mostrarEliminados != true) {
        loadCanales(true);
      } else {
        loadCanales();
      }
    });
  } else if (tipoUsuario == "user") {
    var userID;
    $.ajaxSetup({ cache: false });
    await $.get(
      "get_session_variable.php",
      { requested: "id_usuario" },
      function (data) {
        userID = data.trim();
      }
    );

    colRef = db
      .collection("canales")
      .orderBy("nombre", "asc")
      .where("activo", "==", true)
      .where("userID", "==", userID);

      // if (idCategoria){
      //   colRef = colRef.where("categoria", "==", idCategoria)
      // }
  }

  colRef.get().then((querySnapshot) => {
    if (querySnapshot.docs && querySnapshot.docs.length) {
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (tipoUsuario == "admin") {
        if (mostrarEliminados != true) {
          $("#btn-mostrareliminados").removeClass("btn-danger");
          $("#btn-mostrareliminados").addClass("btn-secondary");
          $("#btn-mostrareliminados").html(`
                    Mostrar Desactivados
                  `);
        } else {
          $("#btn-mostrareliminados").addClass("btn-danger");
          $("#btn-mostrareliminados").removeClass("btn-secondary");
          $("#btn-mostrareliminados").html(`
                    Ocultar Desactivados
                  `);
        }
      } else if (tipoUsuario == "user") {
        $("#container-main").html(`
              <div class="row">
                <div class="col">
                  <div class='d-flex flex-row'>
                    <h4>Canales</h4>
                  </div>
                </div>
              </div>
                <div class="row mt-3" id="rownegocios">
                </div>        
              
              `);
      }

      data.forEach((negocio) => {
        let url = negocio["thumbnail"];
        if (url == null) {
          url = "dist/img/noimage.jpg";
        }
        let clase = "label-negocio";
        if (negocio["activo"] != true) {
          clase = "text-danger";
        }
        $("#rownegocios").append(`
                    <div class="col-6 col-md-2">
                      <div class="card">
                        <a href="admin_canal.php?id=${negocio["id"]}"><img src="${url}" onerror="this.src='dist/img/noimage.jpg';" class="card-img-top"></a>
                          <div class="card-body">
                            <div class="title-negocio-wrapper" style="overflow:hidden;height:60px;">
                              <h6 style="overflow:hidden;" class="${clase}">${negocio["nombre"]}</h6>
                            </div>
                          </div>
                      </div>
                    </div>
                  `);
      });
    } else {
      if (tipoUsuario == "user") {
        $("#container-main").html(
          `<div class='callout callout-danger'><b>Todavía no tenés canales activos, aguardá nuestra aprobación o comunicate con nosotros.</b></div>`
        );
      }
    }

    if (tipoUsuario == "admin") {
      loadRadio();
    } else {
      $(".loading-wrapper").remove();
    }
  });
}

function loadRadio() {
  db.collection("radios")
    .doc("radio")
    .get()
    .then((doc) => {
      $(".container-radio").html(`
      <div class="row">
        <div class="col">
          <div class="status-container">
            <div class="d-flex flex-row">
            <div style="padding-top:3px;">
              <div id="container-tiendactiva">
                <div class="status-container">
                  <div class="d-flex flex-row">
                    <div>
                      <h4>Radio Principal</h4>
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
              <button onClick='guardarCambios()' id="btn-guardar-cambios" style="display:none;margin-top:4px;" class="btn btn-success btn-sm ml-5"><i class='fa fa-save'></i> Guardar cambios</button>
            </div>
          </div>
        </div>
    <div class='row'>
      <div class="form-group col-md-8">
        <label for="link-radio" class="col-form-label">Link del Streaming de Radio:</label>
        <input type="text" autocomplete="false" class="form-control" id="link-radio" oninput='setChanged(true)' maxLength='100' onpaste='setChanged(true)'>
      </div>
    </div>
      `);
      if (doc.exists && doc.data().stream) {
        const activa = doc.data().activa;
        if (activa == true) {
          $("#switch-canal").attr("checked", "checked").prop("checked", true);
          $("#span-slider").addClass("activo");
        }
        $("#switch-canal").click(function (e) {
          toggleRadioActiva(
            $(this).is(":checked") == true ? true : false,
            doc.id
          );
          return false;
        });

        $("#link-radio").val(doc.data().stream);
      }
      $(".loading-wrapper").remove();
    });
}

function setChanged(value) {
  hasChanged = value;
  $("#btn-guardar-cambios").css({ display: value ? "block" : "none" });
}

function guardarCambios() {
  const link = $("#link-radio").val().trim();
  if (!link.length) {
    swal("Ingresá el Link del Streaming para la Radio!", "", "error");
  } else if (/\s/.test(link)) {
    swal("El Link no puede contener espacios!", "", "error");
  } else {
    setChanged(false);
    db.collection("radios")
      .doc("radio")
      .set({
        stream: link,
        activa: true,
      })
      .then(() => {
        swal("Actualizaste la Radio correctamente!", "", "success");
      })
      .catch((e) => {
        swal("Ocurrió un error al actualizar la Radio", "", "error");
        setChanged(true);
      });
  }
}

function toggleRadioActiva(activar, radioID) {
  if (activar == false) {
    swal("¿Estás seguro/a de desactivar la Radio?", "", {
      icon: "warning",
      buttons: {
        cancel: "Cancelar",
        catch: {
          text: "Desactivar",
          value: "catch",
        },
      },
    }).then((value) => {
      switch (value) {
        case "catch":
          db.collection("radios")
            .doc(radioID)
            .update({
              activa: false,
            })
            .then(() => {
              swal("Desactivaste la Radio correctamente!", "", "success");
              $("#switch-canal").removeAttr("checked").prop("checked", false);
            })
            .catch((error) => {
              $("#switch-canal")
                .attr("checked", "checked")
                .prop("checked", true);
              swal("Ocurrió un error al desactivar la Radio", "", "error");
              console.log(error);
            });

          break;

        default:
          $("#switch-canal").attr("checked", "checked").prop("checked", true);
          break;
      }
    });
  } else {
    swal("¿Estás seguro/a?", "La Radio será pública y visible para todos.", {
      icon: "warning",
      buttons: {
        cancel: "Cancelar",
        catch: {
          text: "ACTIVAR",
          value: "catch",
        },
      },
    }).then((value) => {
      switch (value) {
        case "catch":
          db.collection("radios")
            .doc(radioID)
            .update({
              activa: true,
            })
            .then(() => {
              swal("Activaste la Radio correctamente!", "", "success");
              $("#switch-canal")
                .attr("checked", "checked")
                .prop("checked", true);
            })
            .catch((error) => {
              swal("Ocurrió un error al activar la Radio", "", "error");
              $("#switch-canal").removeAttr("checked").prop("checked", false);
              console.log(error);
            });
          break;
        default:
          $("#switch-canal").attr("checked", "checked").prop("checked", true);
          break;
      }
    });
  }
}
