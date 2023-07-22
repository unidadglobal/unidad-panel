$(document).ready(function(){
	$(".btn-exit-system").on("click", function(e){
		e.preventDefault();
		swal("¿Estás seguro/a de Cerrar Sesión?","", {
			icon: "warning",
			buttons: {
			  cancel: "Cancelar",
			  catch: {
				text: "Cerrar Sesión",
				value: "catch",
			  }
			},
			})
			.then((value) => {
			  switch (value) {
				case "catch":
					firebase.auth().signOut().then(function() {
						document.location.href = "endsession.php";
					}).catch(function(error) {
						swal("Ocurrió un error al cerrar sesión", "Intentá de nuevo", "error");
					});		
				default:
					break;
			  }
			});
	});
});