const db = firebase.firestore();
//const fechaform = moment().subtract(1, "years").toDate();
const { PDFDocument } = PDFLib;

function loadFormularios() {
  let dataSet = new Array();
  let i = 1;
  const formsRef = db.collection("usuarios").
    orderBy("formulario").
    limit(100);

  formsRef.get()
    .then((querySnapshot) => {
      if (querySnapshot && querySnapshot.docs && querySnapshot.docs.length) {
        $("#tabla-container").html(`
          <table id='tabla'  class='table display table-bordered table-striped dataTable' style="width:100%">
          </table>
        `)

        for (let j = 0; j < querySnapshot.docs.length; j++) {
          let doc = querySnapshot.docs[j].data();
          if (doc.formulario) {
            let date = null;
            let sortDate;
            let fecha;
            if (doc.formulario.fecha) {
              date = doc.formulario.fecha.toDate();
            }

            if (date){
              sortDate = moment(date).format('YYYYMMDDHHmmss');
              fecha = moment(date).format('DD/MM HH:mm');
            }
            else{
              sortDate = "0000000000"
              fecha = "";
            }
            
            dataSet.push(
              [
                `<span style="display:none" class="td-formulario" x-estado="${doc.formulario.estado}" x-id="${querySnapshot.docs[j].id}">${sortDate}</span>${fecha}`,
                doc.formulario.nombre,
                doc.formulario.canal_nombre,
                doc.formulario.canal_contenido,
                boxEstado(doc.formulario.estado ? doc.formulario.estado : 0),
                `<button class="btn btn-sm btn-primary fa fa-download btn-download"></button>`
              ]);
          }
          i + 1;
        }
        $('#tabla').DataTable({
          data: dataSet,
          "order": [[0, "desc"]],
          "scrollX": true,
          "pageLength": 50,
          columns: [
            { title: "Fecha" },
            { title: "Nombre" },
            { title: "Canal" },
            { title: "Tipo Contenido" },
            { title: "Estado" },
            { title: "" },
          ],
          "language": {
            "lengthMenu": "Mostrando _MENU_ formularios por página",
            "zeroRecords": "Todavía no hay formularios cargados",
            "info": "Página _PAGE_ de _PAGES_",
            "infoEmpty": "No hay formularios",
            "infoFiltered": "(filtrado de _MAX_ formularios en total)",
            "lengthMenu": "Mostrar _MENU_ formularios",
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
      }
      else {
        $("#tabla-container").html(`
          <h2 class="text-danger">Por ahora no hay formularios...</h2>
        `)
      }

      $('#tabla tbody tr').on("click", function (e) {
        const estado = $(this).find(".td-formulario").attr("x-estado");
        if (!$(e.target).hasClass("btn-download")) {
          if (estado == "0" || estado == "-1") {
            const userID = $(this).find(".td-formulario").attr("x-id");
            getFormInfo(userID)
            $('#btn-rechazar').on("click", function () {
              rechazarForm(userID)
            });

            $('#btn-crear-canal').on("click", function () {
              $("#ModalFormulario").modal("hide");
              $.ajax({
                url: 'get_remote_img.php',
                type: 'POST',
                data: { url: $("#logo-canal").attr("src") },
                success: function (x) {
                  if (!x.includes("error")) {
                    $("#img-logo").attr("src", x)
                    $("#img-logo").cropper("destroy");
                    $("#img-logo").cropper({
                      dragMode: "move",
                      minContainerWidth: 300,
                      minContainerHeight: 300,
                      minCanvasWidth: 250,
                      minCanvasHeight: 250,
                      minCropBoxWidth: 250,
                      minCropBoxHeight: 200,
                      cropBoxResizable: false,
                      ready: function () {
                        $("#img-logo").cropper("setCropBoxData", { width: 250, height: 200 });
                      },
                    });

                    $("#btn-subir-otro").on('click', function () {
                      $("#input-logo").on('change', function () {
                        readImage(this);
                      });
                      $("#input-logo").click();
                    });

                    loadCategorias();

                    $("#btn-guardar-canal").on('click', function () {
                      guardarCanal(userID)
                    });

                    $("#modalCrearCanal").modal("show");
                  }
                },
                error: function (jqXHR, estado, error) {
                }
              });
            });
          }
        }
        else { // ES EL BOTON DESCARGAR
          const userID = $(this).find(".td-formulario").attr("x-id");
          downloadForm(userID)
        }
      });
      $(".loading-wrapper").remove();
    });

  let initState = true;

  let observer = formsRef.onSnapshot(docSnapshot => {
    if (initState) {
      initState = false;
    } else {
      if (!docSnapshot.docChanges().empty) {
        docSnapshot.docChanges().forEach(function (change) {
          if (change.type === "added" || change.type === "modified") {
            loadFormularios();
            if (change.type === "added") {
              playSound();
              toastr.options = {
                "closeButton": true,
                "debug": false,
                "newestOnTop": false,
                "progressBar": false,
                "positionClass": "toast-top-right",
                "preventDuplicates": true,
                "onclick": null,
                "showDuration": "300",
                "hideDuration": "1000",
                "timeOut": "600000",
                "extendedTimeOut": "600000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
              }
              toastr.info('Llegó un Formulario nuevo!');
            }
          }
        });
      }
    }
  }, err => {
    console.log(`Encountered error: ${err}`);
  });
}

$(document).ready(function () {
  loadFormularios();
});

function playSound() {
  document.getElementById('alarm').play();
  document.getElementById('alarm').muted = false;
}

function boxEstado(estado) {
  let codigo = null;
  switch (estado) {
    case -1:
      codigo =
        `
            <div class="box-estado cancelado">
                <span class="label-estado">RECHAZADO</span>
            </div>
            `;
      break;
    case 0:
      codigo =
        `
            <div class="box-estado pendiente">
                <span class="label-estado">PENDIENTE</span>
            </div>
            `;
      break;
    case 1:
      codigo =
        `
            <div class="box-estado entregado">
              <span class="label-estado">APROBADO</span>
            </div>
            `;
      break;

    default:
      codigo =
        `
            <div class="box-estado pendiente">
                <span class="label-estado">PENDIENTE</span>
            </div>
            `;
      break;
  }
  return codigo;
}

function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")
}

function getFormInfo(userID) {
  db.collection("usuarios").doc(userID).get().then((doc) => {
    const data = doc.data()
    const { nombre, nacionalidad, whatsapp, documento, fecha_nacimiento, canal_nombre, canal_contenido, canal_descripcion, canal_imagen } = data.formulario;
    const fecha = ("0" + fecha_nacimiento.toDate().getDate()).slice(-2) + "/" + ("0" + (fecha_nacimiento.toDate().getMonth() + 1)).slice(-2) + "/" + fecha_nacimiento.toDate().getFullYear()

    $("#nombre-titular").val(nombre)
    $("#nacionalidad-titular").val(nacionalidad)
    $("#whatsapp-titular").val(whatsapp)
    $("#documento-titular").val(documento)
    $("#nacimiento-titular").val(fecha)
    $("#nombre-canal,#input-nombre-canal").val(canal_nombre)
    $("#contenido-canal").val(canal_contenido)
    $("#descripcion-canal").val(canal_descripcion)
    $("#logo-canal").attr("src", canal_imagen)
  })
  $("#ModalFormulario").modal("show")
}

function downloadForm(userID) {
  db.collection("usuarios").doc(userID).get().then((doc) => {
    const data = doc.data()
    const { nombre, nacionalidad, whatsapp, documento, fecha_nacimiento, canal_nombre, canal_contenido, canal_descripcion, canal_imagen, firma, fecha } = data.formulario;
    const fecha_nac = ("0" + fecha_nacimiento.toDate().getDate()).slice(-2) + "/" + ("0" + (fecha_nacimiento.toDate().getMonth() + 1)).slice(-2) + "/" + fecha_nacimiento.toDate().getFullYear()

    modifyPdf(nombre, nacionalidad, whatsapp, documento, fecha_nac, canal_nombre, canal_contenido, canal_descripcion, canal_imagen, firma, fecha)
  })

}

function rechazarForm(userID) {
  swal("Estás seguro/a de rechazar el Formulario?", "", {
    icon: "warning",
    buttons: {
      cancel: "Cancelar",
      catch: {
        text: "Sí, RECHAZAR",
        value: "catch",
      }
    },
  })
    .then((value) => {
      switch (value) {
        case "catch":
          $("#ModalFormulario").modal("hide")
          db.collection("usuarios").doc(userID).update({
            "formulario.estado": -1
          }).then(() => {
            loadFormularios()
          }).catch((e) => {
            swal("Ocurrió un error al rechazar el Formulario", e.toString(), "error")
          });

          break;

        default:
          break;
      }
    });
}

function readImage(input) {
  if (input.files && input.files[0]) {
    $("#img-logo").cropper("destroy");
    $("#img-logo").attr("src", URL.createObjectURL(input.files[0]))
    $("#img-logo").cropper({
      dragMode: "move",
      minContainerWidth: 300,
      minContainerHeight: 300,
      minCanvasWidth: 250,
      minCanvasHeight: 250,
      minCropBoxWidth: 250,
      minCropBoxHeight: 200,
      cropBoxResizable: false,
      ready: function () {
        $("#img-logo").cropper("setCropBoxData", { width: 250, height: 200 });
      },
    });

    let reader = new FileReader();
    reader.onload = function (e) {
      $("#img-logo").attr("src", e.target.result)
      $("#img-logo").cropper("destroy");
      $("#img-logo").cropper({
        dragMode: "move",
        minContainerWidth: 300,
        minContainerHeight: 300,
        minCanvasWidth: 250,
        minCanvasHeight: 250,
        minCropBoxWidth: 250,
        minCropBoxHeight: 200,
        cropBoxResizable: false,
        ready: function () {
          $("#img-logo").cropper("setCropBoxData", { width: 250, height: 200 });
        },
      });
    }
  }
}

function loadCategorias() {
  $("#select-categoria").html(`<option value="ninguna">Ninguna</option>`);
  db.collection("categorias").
    orderBy("orden", "asc").
    get().then((querySnapshot) => {
      if (querySnapshot && querySnapshot.docs) {
        querySnapshot.forEach((e, i) => {
          $("#select-categoria").append(`
          <option value='${e.id}'>${e.data().nombre.toUpperCase()}</option>
        `)
        })
      }
    });
}

function guardarCanal(userID) {
  const categoria = $("#select-categoria").val();
  const nombre_canal = $("#input-nombre-canal").val().trim();

  if (categoria == "ninguna") {
    swal("Seleccioná una Categoría!", "", "error");
  }
  else if (nombre_canal.length <= 3) {
    swal("El nombre del Canal debe tener al menos 3 letras!", "", "error")
  }
  else {
    $("#modalCrearCanal").modal("hide")
    const canvas = $("#img-logo").data("cropper").getCroppedCanvas({
      fillColor: "#000000",
      width: 250,
      height: 200,
    }).toDataURL();

    const storageRef = firebase.storage().ref();
    const ref = storageRef.child('canales/' + userID + '.jpg');

    ref.putString(canvas, 'data_url', { contentType: "image/jpeg" }).then(function (snapshot) {
      snapshot.ref.getDownloadURL().then(function (imageUrl) {
        db.collection("canales").
          where("categoria", "==", categoria).
          orderBy("orden", "desc").limit(1).get().then((querySnapshot) => {
            let orden = 0;
            if (querySnapshot.docs && querySnapshot.docs.length > 0) {
              orden = querySnapshot.docs[0].data().orden >= 0 ? querySnapshot.docs[0].data().orden + 1 : 0;
            }

            db.collection('canales').doc().set(
              {
                nombre: nombre_canal,
                categoria: categoria,
                thumbnail: imageUrl,
                orden: orden,
                activo: false,
                fecha_creacion: new Date(),
                userID: userID
              }
            ).then(() => {
              swal("Creaste el Canal correctamente!", "", "success")
              db.collection("usuarios").doc(userID).update({
                "formulario.estado": 1
              })
            }).catch((e) => {
              swal("Ocurrió un error al crear el Canal", e.toString(), "error")
            })
          })
      })
    })
  }
}

async function modifyPdf(nombre, nacionalidad, whatsapp, documento, fecha, canal_nombre, canal_contenido, canal_descripcion, canal_imagen, firma, fecha_firma) {
  const url = './formulario.pdf'
  const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer());

  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const { width, height } = firstPage.getSize();
  
  firstPage.drawText(nombre.toUpperCase(), {
    x: 180,
    y: height - 205,
    size: 14,
  });

  firstPage.drawText(documento, {
    x: 180,
    y: height - 240,
    size: 14,
  });

  firstPage.drawText(fecha, {
    x: 180,
    y: height - 275,
    size: 14,
  });

  firstPage.drawText(nacionalidad, {
    x: 180,
    y: height - 350,
    size: 14,
  });

  firstPage.drawText(whatsapp, {
    x: 180,
    y: height - 500,
    size: 14,
  });

  let fecha2 = fecha_firma.toDate();
  let dia = fecha2.getDate().toString().replace(/(^|\D)(\d)(?!\d)/g, '$10$2');
  const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  
  firstPage.drawText(`${dia} de ${meses[fecha2.getMonth()]} de ${fecha2.getFullYear().toString()}`, {
    x: 20,
    y: 15,
    size: 14,
  });

  const pngImage = await pdfDoc.embedPng(firma)

  firstPage.drawImage(pngImage, {
    x: 280,
    y: 230,
    width: 200,
    height: 80,
  })

  const pdfBytes = await pdfDoc.save()
  download(pdfBytes, "formulariofirmado.pdf", "application/pdf");

}