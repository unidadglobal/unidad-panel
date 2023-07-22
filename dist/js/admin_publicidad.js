const db = firebase.firestore();
let inputobj = null;

function loadPortadas() {
    db.collection("publicidad").
        orderBy("orden", "asc")
        .get().then((snapshot) => {
            if (snapshot.docs && snapshot.docs.length) {
                snapshot.docs.forEach((doc, i) => {
                    let data = doc.data();
                    if (i < 20 && data.imagen) {
                        $("#img-portada" + (i + 1).toString()).attr("src", data.imagen); //IMG
                        $("#img-portada" + (i + 1).toString()).next().next().css({ "visibility": "visible" }); //BOTON
                        $("#img-portada" + (i + 1).toString()).next().attr("x-data", data.imagen); //INPUT
                        $("#img-portada" + (i + 1).toString()).next().attr("x-orden", data.orden);
                    }
                })
            }
            $(".loading-wrapper").remove();
        }).catch((error) => {
            swal("Ocurrió un error. Recargá la página", "", "error");
        });
}

function readURL(input) {
    inputobj = null;
    if (input.files && input.files[0]) {
        let reader = new FileReader();

        reader.onload = function (e) {
            $('#verificar-subida-img').attr('src', e.target.result);
            $("#verificar-subida-img").cropper("destroy");
            $('#verificar-subida-img').cropper({
                dragMode: "move",
                minContainerWidth: 800,
                minContainerHeight: 300,
                minCanvasWidth: 800,
                minCanvasHeight: 350,
                minCropBoxWidth: 800,
                minCropBoxHeight: 240,
                cropBoxResizable: false,
                imageSmoothingEnabled: true,
                imageSmoothingQuality: "high"
            });
            $("#btn-subir-img").removeClass("btn-danger").html("SUBIR").attr("disabled", false);
            inputobj = input;
            $("#btn-subir-img").on("click", function () {
                canvas = $("#verificar-subida-img").data("cropper").getCroppedCanvas({
                    fillColor: "#000000",
                    width: 800,
                    height: 240,
                }).toDataURL();

                const storageRef = firebase.storage().ref();
                const pubDoc = db.collection("publicidad").doc($("#ModalUploadImg").attr("x-indice"));
                const ref = storageRef.child("publicidad/" + pubDoc.id + ".jpg");

                if ($(inputobj).prop('files')[0]) {
                    $("#btn-subir-img").attr("disabled", true);
                    $("#btn-subir-img").toggleClass("btn-danger");
                    $("#btn-subir-img").html("<span style='color:white'><b>Subiendo...</b></span>");

                    ref.putString(canvas, 'data_url', { contentType: "image/jpeg" }).then(function (snapshot) {
                        snapshot.ref.getDownloadURL().then(function (imageUrl) {
                            pubDoc.set({
                                imagen: imageUrl,
                                orden: parseInt($("#ModalUploadImg").attr("x-indice"))
                            }).then(() => {
                                $("#ModalUploadImg").modal("hide");
                                $("#btn-subir-img").removeClass("btn-danger").html("SUBIR").attr("disabled", false);                                
                                swal("Subiste la imagen correctamente!", "", "success");
                                setTimeout(()=> {
                                    location.reload()
                                }, 1000)
                                
                            }).catch((error) => {
                                swal("Ocurrio un error al subir la Publicidad", "", "error");
                                console.log(error)
                                $("#btn-subir-img").removeClass("btn-danger").html("SUBIR").attr("disabled", false);
                            })
                        });
                    }).catch((error) => {
                        console.log(error);
                        $("#btn-subir-img").removeClass("btn-danger").html("SUBIR").attr("disabled", false);
                        swal("Ocurrió un error al subir la imagen!", "", "error");
                    });

                }
            });
            $("#ModalUploadImg").attr("x-indice", $(input).attr("x-index"))

            $("#ModalUploadImg").modal("show");
        }
        reader.readAsDataURL(input.files[0]);
    }
}

$(document).ready(function () {
    setBannerContainers()
    loadPortadas();

    $(".imgportada").on('click', function () {
        $(this).next().on('change', function () {
            readURL(this);
        });
        $(this).next().click();
    });

    $(".btn-eliminar-portada").on("click", function () {
        const obj = this;
        swal("¿Estás seguro/a de eliminar esta foto?", "", {
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
                        const id = $(obj).prev().attr("x-orden");
                        db.collection("publicidad").doc(id).delete().then(()=>{
                            swal("Eliminaste la imagen correctamente!", "", "success")
                            location.reload()
                        }).catch((e)=>{
                            console.log(e)
                            swal("Error al eliminar la imagen", "", "error")
                        })
                        break;

                    default:
                        break;
                }
            });

    });
});

function setBannerContainers(){
    $(".container-banners").html("");
    
    for (let i = 1; i <= 20;i++){
        $(".container-banners").append(`
        <div class="row mb-3">
            <div class="col">
            <div class="portada-div" >
                <img id="img-portada${i}" class="imgportada" src="dist/img/noimage-wide.jpg" onerror="this.src='dist/img/noimage-wide.jpg';">
                <input class="img-input" x-data="none" id="img-upload${i}" type="file" x-index="${i-1}" accept="image/*"/>
                
                <button class="btn btn-danger btn-sm rounded-0 btn-eliminar-portada text-center" type="button"><i class="fa fa-trash"></i></button>
            </div>
            </div>
        </div>
        `)
    }
}