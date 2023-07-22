const db = firebase.firestore();

$(document).ready(function () {
    loadCategorias();
});

function loadCategorias() {
    $("#listacategorias").html("");
    const colRef = db
        .collection("categorias")
        .orderBy("orden", "asc");

    colRef
        .get()
        .then((querySnapshot) => {
            if (querySnapshot.docs && querySnapshot.docs.length) {
                const data = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                data.forEach(categoria => {
                    let thumbnail = categoria.thumbnail;
                    if (!thumbnail || !thumbnail.length) {
                        thumbnail = "dist/img/noimage.jpg";
                    }

                    $("#listacategorias").append(
                        `
                        <li class="list-group-item tile-categoria" style="padding: 0 !important;" x-id-categoria="${categoria.id}">
                            <div class="card-horizontal">
                                <div class="img-square-wrapper">
                                    <img class="" src="${thumbnail}" onerror="this.src='dist/img/noimage.jpg';" style="width:110px;height:110px;">
                                </div>
                                <div class="card-body">
                                    <h4 class="card-title">${categoria.nombre}</h4>
                                </div>
                            </div>
                        </li>
                        `
                    );
                });

                Sortable.create(listacategorias, {
                    animation: 100,
                    group: 'list-1',
                    draggable: '.list-group-item',
                    handle: '.list-group-item',
                    sort: true,
                    filter: '.sortable-disabled',
                    chosenClass: 'active'
                });

                $("#btn-guardarcambios").on("click", function (e) {
                    guardarCambios();
                });
            }
            else {
                $("#listacategorias").html(`
                  <h2 class="text-danger">No hay categorías registradas</h2>
                `)
            }
            $(".loading-wrapper").remove();
        });
}

function guardarCambios() {
    $("#btn-guardarcambios").attr("disabled", true);
    const tiles = document.getElementsByClassName("tile-categoria");
    if (tiles && tiles.length) {
        let batch = db.batch();
        for (let i = 0; i < tiles.length; i++) {
            const id = $(tiles[i]).attr("x-id-categoria");
            const refCanal = db.collection('categorias').doc(id);
            batch.update(refCanal, {
                "orden": i + 1
            });
        }
        batch.commit().then(() => {
            $("#btn-guardarcambios").attr("disabled", false);
            swal("Los cambios se guardaron correctamente!", "", "success");
        }).catch((error) => {
            swal("Ocurrió un error al guardar los cambios", "", "error");
            $("#btn-guardarcambios").attr("disabled", false);
            console.log(error);
        });

    }
}