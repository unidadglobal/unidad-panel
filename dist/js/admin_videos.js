let edit_mode = false;
const db = firebase.firestore();
let duration = 0;

function loadCategorias() {
    $(".select-categoria").html(`
      <option value="ninguna">Ninguna</option>
    `)
    const colRef = db.collection("categorias").where("tipo", "==", 1).orderBy("nombre", "asc");
    colRef.get()
        .then((querySnapshot) => {
            if (querySnapshot.docs && querySnapshot.docs.length) {
                for (let j = 0; j < querySnapshot.docs.length; j++) {
                    let doc = querySnapshot.docs[j];
                    $(".select-categoria").append(
                        `
                        <option value="${doc.id}">${doc.data().nombre}</option>
                        `
                    )
                }
            }
            loadVideos()
        });
}

function loadVideos() {
    let dataSet = new Array();
    let i = 1;
    let colRef = db.collection("videos").orderBy("fecha", "desc");

    colRef.get()
        .then(async (querySnapshot) => {
            if (querySnapshot.docs && querySnapshot.docs.length) {
                $("#tabla-container").html(`
          <table id='tabla' class='table display table-bordered table-striped dataTable w-100 table-responsive d-block d-md-table'>
          </table>
        `)

                for (let j = 0; j < querySnapshot.docs.length; j++) {
                    let doc = querySnapshot.docs[j];

                    let date = null;
                    if (doc.data().fecha) {
                        date = doc.data().fecha.toDate();
                    }
                    else {
                        date = new Date();
                    }

                    let sortDate = moment(date).format('YYYYMMDDHHmmss');
                    let fecha = moment(date).format('DD/MM/YY HH:mm');

                    let url = doc.data().thumbnail;
                    if (!url) {
                        url = "";
                    }

                    const categoria = doc.data().categoria;
                    let nombreCategoria = "-";
                    if (categoria) {
                        var snap = await db.collection("categorias").doc(categoria).get();
                        if (snap.exists && snap.data().nombre) {
                            nombreCategoria = snap.data().nombre
                        }
                    }

                    const canal = doc.data().canal;
                    let nombreCanal = "-";
                    if (canal) {
                        var snap = await db.collection("canales").doc(canal).get();
                        if (snap.exists && snap.data().nombre) {
                            nombreCanal = snap.data().nombre
                        }
                    }

                    dataSet.push([
                        `<img src="${url}" onerror="this.src='dist/img/noimage.jpg';" style="width:90px;height:60px">`,
                        `<span style="display:none" class="td-video" x-id-video="${doc.id}">${sortDate}</span>${fecha}`,
                        doc.data().nombre != null ? `
                            <span class="videoid" x-id-video="${doc.id}">${doc.data().nombre}</span>
                        ` : "",
                        `<span class='catid' x-id="${categoria}">${nombreCategoria}</span>`,
                        `<span class='canalid' x-id="${canal}">${nombreCanal}</span>`,
                            `<button class="btn btn-danger fa fa-trash text-center" onclick="eliminarVideo('${doc.id}', '${doc.data().video}')"></button>
                            <span onClick="copiarLink('${doc.id}')" class="d-inline-block copy-link" tabindex="0" data-toggle="tooltip" title="Copiar Link">
                                <button class="btn btn-primary fa fa-files-o copy-link" style="pointer-events: none;" type="button"></button>
                            </span>
                            <button class="btn btn-info fa fa-external-link text-center" onclick="abrirLinkVideo('${doc.id}')"></button>
                            `
                    ]);
                    i = i + 1;
                }
                $('#tabla').DataTable({
                    pageLength:50,
                    data: dataSet,
                    "order": [[0, "asc"]],
                    "scrollX": true,
                    columns: [
                        { title: "" },
                        { title: "Fecha" },
                        { title: "Título" },
                        { title: "Categoría" },
                        { title: "Canal" },
                        { title: "" },
                    ],
                    "language": {
                        "lengthMenu": "Mostrando _MENU_ videos por página",
                        "zeroRecords": "No hay videos cargadas",
                        "info": "Página _PAGE_ de _PAGES_",
                        "infoEmpty": "No hay videos",
                        "infoFiltered": "(filtrado de _MAX_ videos en total)",
                        "lengthMenu": "Mostrar _MENU_ videos",
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

                $('#tabla tbody tr').click(async function (e) { //EDITAR CATEGORIA
                    if (!e.target.className.includes("btn") && !e.target.className.includes("copy-link")) {
                        edit_mode = true;
                        $("#btn-guardar").prop("disabled", true)
                        $("#ModalEditarVideo").find("input").val("");
                        const videoID = $(this).find(".videoid").attr("x-id-video");
                        const catID = $(this).find(".catid").attr("x-id");
                        const canalID = $(this).find(".canalid").attr("x-id");
                        $("#select-categoria2").val([catID])
                        loadCanalesSelect(catID, canalID)
                        
                        $("#ModalEditarVideo").attr("x-id-video", videoID);
                        $("#titulo-video-editar").val($(this).find("td:eq(2)").text().trim());
                        $("#ModalEditarVideo").modal("show");
                    }
                });
            }
            else {
                $("#tabla-container").html(`
          <h2 class="text-danger">No hay videos subidos</h2>
        `)
            }
            setThumbnailMaker()
            $(".loading-wrapper").remove();
        });
}

$(document).ready(function () {
    loadCategorias();

    $("#btn-agregar-video").on("click", function () {
        edit_mode = false;
        $(".input-video-container").show()
        $("#ModalVideo").attr("x-id-video", "");
        $("#ModalVideo").find("input").val("");
        $("#ModalVideo").find(".select-canal").val("ninguna")
        $("#ModalVideo").find(".select-categoria").val("ninguno")
        $("#ModalVideoLabel").html("Agregar Video");
        $("#ModalVideo").modal("show");
    });

    $("#link-video").on("click focus", function () {
        $("#radio-link").prop("checked", "checked")
    })

    $("#input-video").on("click focus", function () {
        $("#radio-file").prop("checked", "checked")
    })

    $(".btn-guardar-video").on("click", function () {
        try {
            let colRef = db.collection("videos");

            if (!edit_mode) { // NUEVO VIDEO
                const categoriaID = $("#select-categoria option:selected").val();
                const canalID = $("#select-canal option:selected").val();
                const titulo = $("#titulo-video").val().trim().replace(/  /g, " ");
                if (!titulo.length) {
                    swal("Ingresá el Título!", "", "error")
                    return;
                }

                if (!categoriaID || !categoriaID.length || categoriaID == "ninguna"){
                    swal("Seleccioná una Categoría!", "", "error")
                    return;
                }

                if (!canalID || !canalID.length || canalID == "ninguno"){
                    swal("Seleccioná un Canal!", "", "error")
                    return;
                }

                if (!$("#input-video").val() || !$("#input-video").prop('files')[0]) {
                    swal("Seleccioná un video!", "", "error")
                    return;
                }
                else if ($("#input-video").prop("files")[0].size > 100000000) {
                    swal("El video es muy pesado!", "Seleccioná otro con un tamaño menor a 100 MB", "error")
                    return;
                }
                else if (duration < 3) {
                    swal("El video es muy corto!", "Elegí otro.", "error")
                    return;
                }
                $(this).attr("disabled", true).html("Subiendo...").addClass("btn-danger");
                uploadVideo($("#input-video").prop("files")[0], colRef, titulo, formatTime(duration), categoriaID, canalID);
            }
            else {
                const categoriaID = $("#select-categoria2 option:selected").val();
                const canalID = $("#select-canal2 option:selected").val();
                const titulo = $("#titulo-video-editar").val().trim().replace(/  /g, " ");
                if (!titulo.length) {
                    swal("Ingresá el Título!", "", "error")
                    return;
                }

                if (!categoriaID || !categoriaID.length || categoriaID == "ninguna"){
                    swal("Seleccioná una Categoría!", "", "error")
                    return;
                }

                if (!canalID || !canalID.length || canalID == "ninguno"){
                    swal("Seleccioná un Canal!", "", "error")
                    return;
                }

                const videoID = $("#ModalEditarVideo").attr("x-id-video");
                $(this).attr("disabled", true).html("Guardando...").addClass("btn-danger");
                colRef.
                    doc(videoID)
                    .update({
                        "nombre": titulo,
                        "categoria": categoriaID,
                        "canal": canalID
                    }).then(() => {
                        $("#btn-guardar").attr("disabled", false).html("GUARDAR").removeClass("btn-danger");
                        $("#ModalEditarVideo").modal("hide");
                        swal("Modificaste el Video correctamente!", "", "success");
                        loadVideos();
                    }).catch((error) => {
                        console.log(error);
                        swal("Ocurrió un error! Intentá nuevamente", "", "error");
                        $("#btn-guardar").attr("disabled", false).html("GUARDAR").removeClass("btn-danger");
                    });
            }

        } catch (error) {
            console.log(error)
        }
    });

    $('#ModalVideo').on('shown.bs.modal', function () {
        duration = 0;
        $("#radio-link").prop("checked", "checked")
        setProgress(0)
        $("#thumbnail").html("")
        $("#btn-guardar-video").attr("disabled", false).html("SUBIR").removeClass("btn-danger");
        setTimeout(function () {
            $('#titulo-video').focus();
        }, 600);
    });

    $('#ModalEditarVideo').on('shown.bs.modal', function () {
        $("#btn-guardar").attr("disabled", false).html("GUARDAR").removeClass("btn-danger");
        setTimeout(function () {
            $('#titulo-video-editar').focus();
        }, 600);
    });
});

async function uploadVideo(file, colRef, titulo, duracion, categoriaID, canalID) {
    // Create the file metadata
    const theTime = new Date().getTime();
    const storageRef = firebase.storage().ref();
    const refThumbnail = storageRef.child('videos/' + theTime + '_thumbnail.png');

    const dataURL = $("#thumbnail").find("img").attr("src");
    const dataFinal = await resizedataURL(dataURL, 200, 160);
    refThumbnail.putString(dataFinal, 'data_url', { contentType: "image/png" }).then(function (snapshot) {
        snapshot.ref.getDownloadURL().then(function (imageUrl) {
            $(".progress-bar").removeClass("bg-danger");
            var metadata = {
                contentType: 'video/mp4'
            };

            // Upload file and metadata to the object 'images/mountains.jpg'
            var uploadTask = storageRef.child('videos/' + theTime + ".mp4").put(file, metadata);

            $("#btn-cancelar-video").on("click", function () {
                uploadTask.cancel();
            });
            // Listen for state changes, errors, and completion of the upload.
            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
                function (snapshot) {
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    //console.log('Upload is ' + progress + '% done');

                    const porcentaje = Math.trunc(progress);
                    setProgress(porcentaje)

                    switch (snapshot.state) {
                        case firebase.storage.TaskState.PAUSED: // or 'paused'
                            //console.log('Upload is paused');
                            break;
                        case firebase.storage.TaskState.RUNNING: // or 'running'
                            //console.log('Upload is running');
                            break;
                    }
                }, function (error) {
                    // A full list of error codes is available at
                    if (error.code != "storage/canceled") {
                        $("#btn-guardar-video").attr("disabled", false).html("SUBIR").removeClass("btn-danger");
                        $(".progress-bar").addClass("bg-danger");
                        swal("Ocurrió un error al Subir el video!", "Revisá tu conexión y que el video no sea muy pesado. Código: " + error.code, "error");
                    }

                    switch (error.code) {
                        case 'storage/unauthorized':
                            // User doesn't have permission to access the object
                            break;

                        case 'storage/canceled':
                            // User canceled the upload
                            break;
                        case 'storage/unknown':
                            // Unknown error occurred, inspect error.serverResponse
                            break;
                    }
                }, function () {
                    // Upload completed successfully, now we can get the download URL
                    uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                        colRef.doc().set({
                            "nombre": titulo,
                            "video": downloadURL,
                            "fecha": new Date(),
                            "thumbnail": imageUrl,
                            "duration": duracion,
                            "categoria": categoriaID,
                            "canal": canalID
                        }).then(() => {
                            $("#btn-guardar-video").attr("disabled", false).html("SUBIR").removeClass("btn-danger");
                            $("#ModalVideo").modal("hide");
                            swal("Subiste el Video correctamente!", "", "success");
                            loadVideos();
                        }).catch((error) => {
                            console.log(error);
                            swal("Ocurrió un error! Intentá nuevamente", "", "error");
                            $("#btn-guardar-video").attr("disabled", false).html("SUBIR").removeClass("btn-danger");
                        });
                    });
                });
        });
    }).catch((error) => {
        swal("Ocurrió un error! Intentá nuevamente", "", "error");
        $("#btn-guardar-video").attr("disabled", false).html("SUBIR").removeClass("btn-danger");
    })
}

function setProgress(porcentaje) {
    $(".progress-bar").css({ "width": porcentaje + "%" })
    $(".progress-bar").attr("aria-valuenow", porcentaje)
    $(".progress-bar").html(porcentaje + "%")
}

function eliminarVideo(id, url) {
    swal("¿Estás seguro/a de eliminar este Video?", "Esta acción no puede deshacerse.", {
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
                    db.collection("videos").doc(id).delete().then(() => {
                        if (url.includes("firebase")) {
                            const storage = firebase.storage();
                            storage.refFromURL(url).delete();
                        }
                        swal("Eliminaste el Video correctamente!", "", "success")
                        loadVideos();
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

function setThumbnailMaker() {
    document.getElementById('input-video').addEventListener('change', function (event) {
        var file = event.target.files[0];
        var fileReader = new FileReader();
        if (file.type.match('image')) {
            fileReader.onload = function () {
                var img = document.createElement('img');
                img.src = fileReader.result;
                document.getElementById('thumbnail').innerHTML = img.outerHTML;
            };
            fileReader.readAsDataURL(file);
        } else {
            fileReader.onload = function () {
                var blob = new Blob([fileReader.result], { type: file.type });
                var url = URL.createObjectURL(blob);
                var video = document.createElement('video');
                var timeupdate = function () {
                    if (snapImage()) {
                        video.removeEventListener('timeupdate', timeupdate);
                        video.pause();
                    }
                };

                video.addEventListener('loadeddata', function () {
                    if (snapImage()) {
                        video.removeEventListener('timeupdate', timeupdate);
                    }
                });
                var snapImage = function () {
                    var canvas = document.createElement('canvas');
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
                    var image = canvas.toDataURL();
                    var success = image.length > 100000;
                    if (success) {
                        var img = document.createElement('img');
                        img.src = image;
                        document.getElementById('thumbnail').innerHTML = img.outerHTML;
                        URL.revokeObjectURL(url);
                    }
                    return success;
                };
                video.addEventListener('timeupdate', timeupdate);
                video.preload = 'metadata';
                video.src = url;
                // Load video in Safari / IE11
                video.muted = true;
                video.playsInline = true;
                video.play();

                video.onloadedmetadata = function () {
                    URL.revokeObjectURL(video.src);
                    duration = video.duration;
                }
            };
            fileReader.readAsArrayBuffer(file);
        }
    });
}

function formatTime(duration) {
    // Hours, minutes and seconds
    var hrs = ~~(duration / 3600);
    var mins = ~~((duration % 3600) / 60);
    var secs = ~~duration % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";

    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}

function resizedataURL(datas, wantedWidth, wantedHeight) {
    return new Promise(async function (resolve, reject) {

        // We create an image to receive the Data URI
        var img = document.createElement('img');

        // When the event "onload" is triggered we can resize the image.
        img.onload = function () {
            // We create a canvas and get its context.
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');

            // We set the dimensions at the wanted size.
            canvas.width = wantedWidth;
            canvas.height = wantedHeight;

            // We resize the image with the canvas method drawImage();
            ctx.drawImage(this, 0, 0, wantedWidth, wantedHeight);

            var dataURI = canvas.toDataURL();

            // This is the return of the Promise
            resolve(dataURI);
        };

        // We put the Data URI in the image's src attribute
        img.src = datas;

    })
}

function loadCanalesSelect(idCategoria, canal) {
    $(".select-canal").html(`
      <option value="ninguno">Ninguno</option>
    `)

    if (idCategoria == "ninguna"){
        $("#btn-guardar").prop("disabled", false);
        return;
    }

    const colRef = db.collection("canales").where("categoria", "==", idCategoria).orderBy("nombre", "asc");
    colRef.get()
        .then((querySnapshot) => {
            if (querySnapshot.docs && querySnapshot.docs.length) {
                for (let j = 0; j < querySnapshot.docs.length; j++) {
                    let doc = querySnapshot.docs[j];
                    $(".select-canal").append(
                        `
                        <option value="${doc.id}">${doc.data().nombre}</option>
                    `
                    )
                }
                if (canal){
                    $("#select-canal2").val(canal)
                }
            }
            $("#btn-guardar").prop("disabled", false)
        });
}

function abrirLinkVideo(docID){
    window.open("https://unidadglobal.com/watch/"+docID, '_blank').focus();
}

function copiarLink(id) {
    // Get the text field
    const link = "https://unidadglobal.com/watch/"+id;
   
    navigator.clipboard.writeText(link);

}