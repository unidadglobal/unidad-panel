const db = firebase.firestore();

function loadNoticias() {
  let dataSet = new Array();
  let i = 1;
  let colRef = db.collection("noticias").orderBy("fecha", "desc");

  colRef.get()
    .then((querySnapshot) => {
      if (querySnapshot.docs && querySnapshot.docs.length) {
        $("#tabla-container").html(`
          <table id='tabla' class='table display table-bordered table-striped dataTable w-100 table-responsive d-block d-md-table'>
          </table>
        `)

        for (let j = 0; j < querySnapshot.docs.length; j++) {
          const doc = querySnapshot.docs[j];
          let url = "";
          if (doc.data().imagenes && doc.data().imagenes.length && doc.data().imagenes[0]) {
            url = doc.data().imagenes[0];
          }

          let date = null;
          if (doc.data().fecha) {
            date = doc.data().fecha.toDate();
          }
          else {
            date = new Date();
          }

          let sortDate = moment(date).format('YYYYMMDDHHmmss');
          let fecha = moment(date).format('DD/MM HH:mm');

          dataSet.push([
            `<img src="${url}" onerror="this.src='dist/img/noimage.jpg';" style="width:100px;height:60px">`,
            `<span style="display:none" class="td-noticia" x-id-noticia="${doc.id}">${sortDate}</span>${fecha}`,
            doc.data().titulo ? `
              <span class="notid" x-id-noticia="${doc.id}">${doc.data().titulo}</span>
            ` : "",
            doc.data().categoria && doc.data().categoria.nombre ? doc.data().categoria.nombre : "-",
            `<button class='btn btn-danger fa fa-trash' onclick='eliminarNoticia("${doc.id}")'></button>`
          ]);
          i = i + 1;
        }
        $('#tabla').DataTable({
          data: dataSet,
          "order": [[1, "desc"]],
          "scrollX": true,
          "pageLength": 25,
          columns: [
            { title: "" },
            { title: "Fecha" },
            { title: "Título" },
            { title: "Categoría" },
            { title: "" }
          ],
          "language": {
            "lengthMenu": "Mostrando _MENU_ noticias por página",
            "zeroRecords": "No hay noticias cargadas",
            "info": "Página _PAGE_ de _PAGES_",
            "infoEmpty": "No hay noticias",
            "infoFiltered": "(filtrado de _MAX_ noticias en total)",
            "lengthMenu": "Mostrar _MENU_ noticias",
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

        $('#tabla tbody tr').click(function (e) { //EDITAR NOTICIA
          if (!e.target.className.includes("btn")){
            const noticiaID = $(this).find(".notid").attr("x-id-noticia");
            location.href = "editar_noticia.php?id=" + noticiaID;
          }
        });
      }
      else {
        $("#tabla-container").html(`
          <h2 class="text-danger">No hay noticias registradas</h2>
        `)
      }
      $(".loading-wrapper").remove();
    });
}

$(document).ready(function () {
  loadNoticias();
});

function eliminarNoticia(id) {
  swal("¿Estás seguro/a de eliminar esta Noticia?", "Esta acción no puede deshacerse.", {
    icon: "warning",
    buttons: {
      cancel: "Cancelar",
      catch: {
        text: "ELIMINAR",
        value: "catch",
      }
    },
  })
    .then((value) => {
      switch (value) {
        case "catch":
          db.collection("noticias").doc(id).delete().then(() => {
            swal("Eliminaste la Noticia correctamente!", "", "success")
            loadNoticias();
          }).catch((error) => {
            console.log(error)
            swal("Ocurrió un error. Intentá nuevamente", "Revisá tu conexión", "error");
          });
          break;

        default:
          break;
      }
    });
}