const db = firebase.firestore();
let inputobj = null;
let noticiaDoc;
function readURL(input) {
  inputobj = null;
  if (input.files && input.files[0]) {
    let reader = new FileReader();
    reader.onload = function (e) {
      $('#verificar-subida-img').attr('src', e.target.result);
      inputobj = input;
      $("#ModalUploadImg").modal("show");
    }
    reader.readAsDataURL(input.files[0]);
  }
}

$(document).ready(function () {
  loadCategorias();
  
  noticiaDoc = db.collection("noticias").doc();
  $(".img-noticia").on('click', function () {
    $(this).next().on('change', function () {
      readURL(this);
    });
    $(this).next().click();
  });

  $("#btn-subir-img").on("click", function () {
    if (!$(inputobj).prop('files')[0]) {
      return;
    }

    $("#btn-subir-img").removeClass("btn-danger").html("SUBIR").attr("disabled", false);
    let boton = $("#btn-subir-img").html();
    $("#btn-subir-img").toggleClass("btn-danger");
    $("#btn-subir-img").html("<span style='color:white'><b>Subiendo...</b></span>");

    const storageRef = firebase.storage().ref();
    const ref = storageRef.child('noticias/' + noticiaDoc.id + "_" + new Date().getTime() + '.jpg');

    ref.put($(inputobj).prop('files')[0]).then(function (snapshot) {
      snapshot.ref.getDownloadURL().then(function (imageUrl) {
        //SUBIDO
        let src = $('#verificar-subida-img').attr('src');
        $(inputobj).attr("x-data", imageUrl);
        $(inputobj).prev().attr("src", src)
        $(inputobj).next().css({ "visibility": "visible" });
        $("#ModalUploadImg").modal("hide");
        $("#btn-subir-img").removeClass("btn-danger");
        $("#btn-subir-img").attr("disabled", false);
        $("#btn-subir-img").html(boton);
      });
    }).catch((error) => {
      console.log(error);
      $("#btn-subir-img").attr("disabled", false);
      $("#btn-subir-img").removeClass("btn-danger");
      $("#btn-subir-img").html(boton);
      swal("Ocurrió un error al subir la imagen!", "", "error");
    });
  });

  $(".btn-eliminar-foto").on("click", function () {
    $(this).prev().prev().attr("src", "dist/img/noimage.jpg");
    $(this).prev().val('');
    $(this).prev().attr("x-data", "none");
    $(this).css({ "visibility": "hidden" });
  });

  $("#btn-guardar-noticia").on("click", function () {
    guardarNoticia();
  });
});

function getQueryVariable(variable) {
  const query = window.location.href.substring(window.location.href.indexOf(".php") + 5).replace("#", "&");
  if (query != undefined && query != null && query.trim().length > 0 && query.includes("=")) {
    let vars = query.split("&");
    if (vars.length > 0 && vars[0] != "") {
      for (var i = 0; i < vars.length; i++) {
        let pair = vars[i].split("=");
        if (pair[0] == variable) {
          return pair[1];
        }
      }
    }
  }
  return null;
}

function loadCategorias() {
  $("#select-categoria").html(`
    <option value="ninguna">Ninguna</option>
  `)
  const colRef = db.collection("categorias").where("tipo", "==", 0).orderBy("nombre", "asc");
  colRef.get()
    .then((querySnapshot) => {
      if (querySnapshot.docs && querySnapshot.docs.length) {
        for (let j = 0; j < querySnapshot.docs.length; j++) {
          let doc = querySnapshot.docs[j];
          $("#select-categoria").append(
            `
            <option value="${doc.id}">${doc.data().nombre}</option>
            `
          )
        }
      }
      $(".loading-wrapper").remove();
    });
}

function guardarNoticia() {
  const titulo = $("#titulo-noticia").val().trim();
  const subtitulo = $("#subtitulo-noticia").val().trim();
  const categoria = $("#select-categoria option:selected").text();
  const categoriaID = $("#select-categoria option:selected").val();
  const contenido = $("#contenido-noticia").val().trim();
  if (!titulo.length) {
    swal("Ingresá el título de la Noticia!", "", "error");
  }
  else if (titulo.length <= 3) {
    swal("El título es muy corto!", "", "error");
  }
  else if (categoria == "Ninguna" || categoriaID == "ninguna") {
    swal("Seleccioná una categoría o creá una nueva!", "", "error");
  }
  else if (!contenido.length) {
    swal("Ingresá el contenido de la Noticia!", "", "error");
  }
  else if (contenido.length <= 10) {
    swal("El contenido es muy corto!", "", "error");
  }
  else {
    $("#btn-guardar-noticia").attr("disabled", true);
    let arrFotos = [];
    $('.img-input').each(function (i, obj) {
      if ($(this).attr("x-data") != "none") {
        arrFotos.push($(this).attr("x-data"));
      }
    });

    noticiaDoc.set({
      titulo: titulo,
      subtitulo: subtitulo,
      categoria: {
        nombre: categoria,
        id: categoriaID
      },
      contenido: contenido,
      imagenes: arrFotos.length > 0 ? arrFotos : null,
      fecha: new Date()
    }).then(() => {
      messageNoticiaAgregada();
    }).catch((error) => {
      errorAgregarNoticia(error);
    });
  }
}

function errorAgregarNoticia(error) {
  $("#btn-guardar-noticia").attr("disabled", false);
  swal("Ocurrió un error al guardar la Noticia! Intentá de nuevo", "", "error");
  console.log(error);
}

function messageNoticiaAgregada() {
  $("#contenido").html(`
  <div id="outer" class="container d-flex align-items-center justify-content-center" style="height:550px">
    <div id="inner">
        <center><i class="text-center fa fa-check-circle text-success mb-3" style="text-align:center;font-size:5em"></i></center>
        <h2 class="text-center mt-3 mb-3">¡Agregaste la Noticia correctamente!</h2>
        <button onClick="location.href = 'admin_noticias.php';" class="btn btn-success my-5 btn-block" style="font-weight: bold;font-size:1.3em;cursor:pointer;margin-bottom:30px;">VOLVER A NOTICIAS</button>
        <button onClick="location.reload();" class="btn btn-primary my-5 btn-block" style="font-weight: bold;font-size:1.3em;cursor:pointer;">AGREGAR OTRA</button>
    </div>
  </div>
  `);
}