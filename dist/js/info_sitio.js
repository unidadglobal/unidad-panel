let hasChanged = false;
const db = firebase.firestore();

function loadData() {
  const colRef = db.collection("configuracion").doc("datos");
  colRef.get()
    .then((doc) => {
      if (doc.exists) {
        const data = doc.data();

        if (data.instagram) {
          $("#input-instagram").val(data.instagram)
        }
        if (data.facebook) {
          $("#input-facebook").val(data.facebook)
        }
        if (data.twitter) {
          $("#input-twitter").val(data.twitter)
        }
        if (data.footer) {
          $("#input-footer").val(data.footer)
        }
        if (data.donaciones) {
          $("#input-donaciones").val(data.donaciones)
        }
      }
      $(".loading-wrapper").remove();

    });
}

$(document).ready(function () {
  loadData();

  $("input").on("keypress paste", function (e) {
    hasChanged = true;
    $("#btn-guardarcambios").css({ "display": "inline-block" });
    return true;
  });

  $('#btn-guardarcambios').on('click', function (e) {
    if (hasChanged == true) {
      e.preventDefault();
      $(this).attr("disabled", true);
      guardarCambios();
    }
  });

  window.onbeforeunload = function () {
    return hasChanged ? "Realizaste cambios. Continuar?" : null;
  }
});


function guardarCambios() {
  const instagram = $("#input-instagram").val().trim();
  const facebook = $("#input-facebook").val().trim();
  const twitter = $("#input-twitter").val().trim();
  const footer = $("#input-footer").val().trim();
  const donaciones = $("#input-donaciones").val().trim();

  $.ajaxSetup({ cache: false })
  $.get('get_session_variable.php', { requested: "tipo_usuario" }, function (data) {
    db.collection("configuracion").doc("datos").set(
      {
        instagram: instagram.length ? instagram : null,
        facebook: facebook.length ? facebook : null,
        twitter: twitter.length ? twitter: null,
        footer: footer.length ? footer : null,
        donaciones: donaciones.length ? donaciones : null
      }
    ).then(function () {
      hasChanged = false;
      $("#btn-guardarcambios").css({ "display": "none" });
      $("#btn-guardarcambios").attr("disabled", false);
      swal("Los cambios se guardaron correctamente!", "", "success");
    }).catch((error) => {
      swal("Ocurrió un error al guardar los cambios", error.toString(), "error");
      $("#btn-guardarcambios").attr("disabled", false);
      console.log(error);
    });
  });
}