let edit_mode = false;
const db = firebase.firestore();

function loadCategorias() {
  let dataSet = new Array();
  let i = 1;
  let colRef = db.collection("categorias").orderBy("orden", "asc");

  colRef.get()
    .then((querySnapshot) => {
      if (querySnapshot.docs && querySnapshot.docs.length) {
        $("#tabla-container").html(`
          <table id='tabla' class='table display table-bordered table-striped dataTable w-100 table-responsive d-block d-md-table'>
          </table>
        `)

        for (let j = 0; j < querySnapshot.docs.length; j++) {
          let doc = querySnapshot.docs[j];
          let url = doc.data().thumbnail;
          if (!url) {
            url = "#";
          }

          let tipoContenido = doc.data().tipo == 0 ? "Noticias" : doc.data().tipo == 1 ? "Canales y Videos" : doc.data().tipo == 2 ? "Redirección a otra Web" : "-";
          

          dataSet.push([
            `<img id="imgproducto-${i.toString()}" src="${url}" onerror="this.src='dist/img/noimage.jpg';" style="width:60px;height:60px">`,
            doc.data().nombre != null ? `
              <span class="catid" x-id-categoria="${doc.id}">${doc.data().nombre}</span>
            ` : "",
            `<span>${doc.data().orden}</span>`,
            `<span class='contenido' x-tipo='${doc.data().tipo}' x-link='${doc.data().redireccion ?? ""}'>${tipoContenido}</span>`
          ]);
          i = i + 1;
        }
        $('#tabla').DataTable({
          data: dataSet,
          "order": [[1, "asc"]],
          "pageLength": 50,
          "scrollX": true,
          columns: [
            { title: "" },
            { title: "Nombre" },
            { title: "Orden" },
            { title: "Tipo" },
          ],
          "language": {
            "lengthMenu": "Mostrando _MENU_ categorías por página",
            "zeroRecords": "No hay categorías cargadas",
            "info": "Página _PAGE_ de _PAGES_",
            "infoEmpty": "No hay categorías",
            "infoFiltered": "(filtrado de _MAX_ categorías en total)",
            "lengthMenu": "Mostrar _MENU_ categorías",
            "loadingRecords": "Cargando...",
            "processing": "Procesando...",
            "search": "Buscar:",
            "zeroRecords": "No se encontraron resultados",
            "paginate": {
              "first": "Primera",
              "last": "Última",
              "next": "Siguiente",
              "previous": "Anterior"
            },
            "aria": {
              "sortAscending": ": tocá para ordenar en modo ascendente",
              "sortDescending": ": tocá para ordenar en modo descendente"
            }
          }
        });

        $('#tabla tbody tr').click(function () { //EDITAR CATEGORIA
          edit_mode = true;
          $("#btn-eliminar-categoria").css({ "display": "inline-block" });
          $("#ModalCategoria").find("input").val("");
          $("#ModalCategoria").find("textarea").val("")
          $(".link-group").hide()
          const categoriaID = $(this).find(".catid").attr("x-id-categoria");
          const link = $(this).find(".contenido").attr("x-link");
          $("#ModalCategoria").attr("x-id-categoria", categoriaID);
          $("#ModalCategoriaLabel").html("Editar Categoría");
          $("#nombre-categoria").val($(this).find("td:eq(1)").text().trim());
          $("#link-redireccion").val(link)
          
          const tipo = $(this).find(".contenido").attr("x-tipo");
          if (tipo && tipo != "undefined"){
            $("#select-tipo").val(tipo)
            if (tipo == 2 || tipo == "2"){
              $(".link-group").show()
            }
          }
          else{
            $("#select-tipo").val(0)
          }
          $("#ModalCategoria").modal("show");
        });
      }
      else {
        $("#tabla-container").html(`
          <h2 class="text-danger">No hay categorías registradas</h2>
        `)
      }
      $(".loading-wrapper").remove();
    });
}

$(document).ready(function () {
  loadCategorias();
  $("#btn-agregar-categoria").on("click", function () {
    edit_mode = false;
    $("#btn-eliminar-categoria").css({ "display": "none" });
    $(".link-group").hide()
    $("#ModalCategoria").attr("x-id-categoria", "");
    $("#ModalCategoria").find("input").val("");
    $("#ModalCategoria").find("textarea").val("")
    $("#ModalCategoriaLabel").html("Agregar Categoría");
    $("#ModalCategoria").modal("show");
  });

  $("#select-tipo").on("change", function () {
    if ($(this).val() == "2"){
      $(".link-group").show();
      $("#link-redireccion").focus()
    }
    else{
      $(".link-group").hide();
    }
  });
  $("#btn-eliminar-categoria").on("click", function () {
    if (edit_mode) {
      swal("¿Estás seguro/a de eliminar esta categoría?", "", {
        icon: "warning",
        buttons: {
          cancel: "Cancelar",
          catch: {
            text: "Eliminar",
            value: "catch",
          }
        },
      })
        .then((value) => {
          switch (value) {
            case "catch":
              let categoriaID = $("#ModalCategoria").attr("x-id-categoria");
              if (categoriaID != "") {
                $("#ModalCategoria").modal("hide");
                db.collection("categorias").
                  doc(categoriaID).delete().then(() => {
                    swal("Eliminaste la categoría correctamente!", "", "success");
                    loadCategorias();
                  }).catch((error) => {
                    console.log(error);
                    swal("Ocurrió un error! Intentá de nuevo", "", "error");
                  });
              }
              break;

            default:
              break;
          }
        });
    }
  });

  $("#btn-guardar-categoria").on("click", function () {
    let newName = $("#nombre-categoria").val().trim().replace(/  /g, " ");
    let colRef = db.collection("categorias");

    const tipo = $("#select-tipo option:selected").val();
    const link = $("#link-redireccion").val().trim();
    if (!newName.length) {
      swal("Ingresá el nombre!", "", "error")
      return;
    }

    if (tipo == "2" && (link.length < 5 || !link.includes("http"))){
      swal("Ingresá el Link de la Web!", "", "error")
      return;
    }

    if (!edit_mode) {
      if (!$("#imagen-categoria").val() || !$("#imagen-categoria").prop('files')[0]) {
        swal("Seleccioná una imagen!", "", "error")
        return;
      }
      $(this).attr("disabled", true).html("Guardando...").addClass("btn-danger");
      colRef.
        get()
        .then((querySnapshot) => {
          let puede = true;
          if (querySnapshot.docs && querySnapshot.docs.length) {
            for (let i = 0; i < querySnapshot.docs.length; i++) {
              let doc = querySnapshot.docs[i].data();
              let oldName = doc.nombre;
              if (oldName != null && oldName.toLowerCase() == newName.toLowerCase()) {
                puede = false;
                break;
              }
            }
          }

          if (puede == true) {
            const storageRef = firebase.storage().ref();
            const ref = storageRef.child('categorias/' + new Date().getTime() + '.png');

            ref.put($("#imagen-categoria").prop('files')[0]).then(function (snapshot) {
              snapshot.ref.getDownloadURL().then(function (imageUrl) {
                db.collection("categorias").
                  orderBy("orden", "desc").
                  limit(1).get().then((querySnapshot) => {
                    let orden = 0;
                    if (querySnapshot.docs && querySnapshot.docs.length) {
                      orden = querySnapshot.docs[0].data().orden + 1;
                    }
                    colRef.doc().set({
                      "nombre": newName,
                      "orden": orden,
                      "thumbnail": imageUrl,
                      tipo: parseInt(tipo),
                      "redireccion" : tipo == "2" ? link : null
                    }).then(() => {
                      $("#btn-guardar-categoria").attr("disabled", false).html("Guardar").removeClass("btn-danger");
                      $("#ModalCategoria").modal("hide");
                      swal("Guardaste la nueva categoría correctamente!", "", "success");
                      loadCategorias();
                    }).catch((error) => {
                      console.log(error);
                      swal("Ocurrió un error! Intentá nuevamente", "", "error");
                      $("#btn-guardar-categoria").attr("disabled", false).html("Guardar").removeClass("btn-danger");
                    });
                  });
              });
            }).catch((error) => {
              console.log(error);
              swal("Ocurrió un error! Intentá nuevamente", "", "error");
              $("#btn-guardar-categoria").attr("disabled", false).html("Guardar").removeClass("btn-danger");
            });
          }
          else {
            swal("Ya existe una categoría con ese nombre!", "", "error");
            $("#btn-guardar-categoria").attr("disabled", false).html("Guardar").removeClass("btn-danger");
          }
        }).catch((error) => {
          console.log(error);
          swal("Ocurrió un error! Intentá nuevamente", "", "error");
          $("#btn-guardar-categoria").attr("disabled", false).html("Guardar").removeClass("btn-danger");
        });
    }
    else {
      let categoriaID = $("#ModalCategoria").attr("x-id-categoria");
      $(this).attr("disabled", true).html("Guardando...").addClass("btn-danger");

      //SI NO SE ELIGIO OTRA FOTO
      if (!$("#imagen-categoria").val() || !$("#imagen-categoria").prop('files')[0]) {
        colRef.
          doc(categoriaID)
          .update({
            "nombre": newName,
            tipo: parseInt(tipo),
            "redireccion" : tipo == "2" ? link : null
          }).then(() => {
            $("#btn-guardar-categoria").attr("disabled", false).html("Guardar").removeClass("btn-danger");
            $("#ModalCategoria").modal("hide");
            swal("Editaste la categoría correctamente!", "", "success");
            loadCategorias();
          }).catch((error) => {
            console.log(error);
            swal("Ocurrió un error! Intentá nuevamente", "", "error");
            $("#btn-guardar-categoria").attr("disabled", false).html("Guardar").removeClass("btn-danger");
          });
      }
      // SI SE MODIFICO LA FOTO
      else {
        const storageRef = firebase.storage().ref();
        const ref = storageRef.child('categorias/' + new Date().getTime() + '.png');

        ref.put($("#imagen-categoria").prop('files')[0]).then(function (snapshot) {
          snapshot.ref.getDownloadURL().then(function (imageUrl) {
            colRef.doc(categoriaID).update({
              "nombre": newName,
              "thumbnail": imageUrl,
              tipo: parseInt(tipo),
              "redireccion" : tipo == "2" ? link : null
            }).then(() => {
              $("#btn-guardar-categoria").attr("disabled", false).html("Guardar").removeClass("btn-danger");
              $("#ModalCategoria").modal("hide");
              swal("Modificaste la categoría correctamente!", "", "success");
              loadCategorias();
            }).catch((error) => {
              console.log(error);
              swal("Ocurrió un error! Intentá nuevamente", "", "error");
              $("#btn-guardar-categoria").attr("disabled", false).html("Guardar").removeClass("btn-danger");
            });
          });
        }).catch((error) => {
          console.log(error);
          swal("Ocurrió un error! Intentá nuevamente", "", "error");
          $("#btn-guardar-categoria").attr("disabled", false).html("Guardar").removeClass("btn-danger");
        });
      }
    }
  });

  $('#ModalCategoria').on('shown.bs.modal', function () {
    setTimeout(function () {
      $('#nombre-categoria').focus();
    }, 700);
  });
});