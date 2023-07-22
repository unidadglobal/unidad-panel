const db = firebase.firestore();

var isLive, isRecording = false;
var stopped = false;
var linkUpdated = false;

var myMessages = [];

let canalID;
var allRecordedBlobs = [];

var enableRecordings = true;

var connection = new RTCMultiConnection();
let currentStream = null;
let grabandoTime = 0;
let grabandoParts = 1;

$(document).ready(function () {
    canalID = null;
    myMessages = []

    loadDataChat()
    listenChanges()
    initRTC()
});



function secondsToTime(e){
    const m = Math.floor(e % 3600 / 60).toString().padStart(2,'0'),
          s = Math.floor(e % 60).toString().padStart(2,'0');
    
    return m + ':' + s;
}

async function loadDataChat() {
    canalID = getQueryVariable("id");
    if (!canalID) return;

    let tipoUsuario;
    $.ajaxSetup({ cache: false })
    await $.get('get_session_variable.php', { requested: "tipo_usuario" }, function (data) {
        tipoUsuario = data.trim() ? data.trim() : null;
    })

    $("#input-link").val("https://unidadglobal.com/watch/"+canalID)

    db.collection("canales").doc(canalID).get().then((doc) => {

        if (doc.exists) {
            const data = doc.data();

            if (data.tituloTransmision) {
                $("#input-titulo").val(data.tituloTransmision)
            }
            else {
                $("#input-titulo").val("")
            }

            if (data.password) {
                $("#input-password").val(data.password)
            }
            else {
                $("#input-password").val("")
            }

            if (!data.chatStatus || data.chatStatus == 0 || data.chatStatus == 1) { // VISIBLE
                $("#switch-chat").attr("checked", "checked").prop("checked", true);
                $("#label-chat-activo").html("CHAT<br>VISIBLE");
                $("#label-chat-activo").addClass("text-success");
                $("#span-slider").addClass("activo");

                if (data.chatStatus == 0) {
                    $("#label-chat-activo2").html("CHAT<br>BLOQUEADO");
                    $("#label-chat-activo2").removeClass("text-success").addClass("text-danger");
                }
                else {
                    $("#switch-chat2").attr("checked", "checked").prop("checked", true);
                    $("#label-chat-activo2").html("CHAT<br>LIBRE");
                    $("#label-chat-activo2").addClass("text-success");
                    $("#span-slider2").addClass("activo");
                }
            }
            else if (data.chatStatus == -1) { // OCULTO
                $("#label-chat-activo").html("CHAT<br>OCULTO");
                $("#label-chat-activo").removeClass("text-success").addClass("text-danger");
                $("#label-chat-activo2").html("CHAT<br>BLOQUEADO");
                $("#label-chat-activo2").removeClass("text-success").addClass("text-danger");
            }


            $("#switch-chat").click(function (e) {
                toggleChat($(this).is(':checked') == true ? true : false, doc.id);
                return false;
            });

            $("#switch-chat2").click(function (e) {
                toggleChat2($(this).is(':checked') == true ? true : false, doc.id);
                return false;
            });

            $("#btn-confirmar").on("click", function (e) {
                e.preventDefault();
                const pass = $("#input-password").val().trim();

                if (/\s/g.test(pass)) {
                    swal("La contraseña no puede contener espacios", "", "error")
                    return;
                }

                db.collection("canales").doc(canalID).update({
                    password: pass.length ? pass : null
                }).then(() => {
                    swal("Cambiaste la contraseña del canal correctamente!", "", "success")
                }).catch((e) => {
                    swal("Ocurrió un error", e.toString(), "error")
                })
            })

            $("#btn-guardar-titulo").on("click", function (e) {
                e.preventDefault();
                const titulo = $("#input-titulo").val().trim();

                $("#btn-guardar-titulo").prop("disabled", true);
                db.collection("canales").doc(canalID).update({
                    tituloTransmision: titulo.length ? titulo : null
                }).then(() => {
                    swal("Cambiaste el Título de la Transmisión correctamente!", "", "success")
                    $("#btn-guardar-titulo").prop("disabled", false);
                }).catch((e) => {
                    swal("Ocurrió un error", e.toString(), "error")
                    $("#btn-guardar-titulo").prop("disabled", false);
                })
            })

            $("#container-switch").css({ "display": "block" });
            $("#container-switch2").css({ "display": "block" });
            $(".loading-wrapper").remove();
        }
    })
}

function toggleChat(activar, canalID) {
    if (activar == false) {
        swal("¿Estás seguro/a de OCULTAR el Chat?", "", {
            icon: "warning",
            buttons: {
                cancel: "Cancelar",
                catch: {
                    text: "Sí, OCULTAR",
                    value: "catch",
                }
            },
        })
            .then((value) => {
                switch (value) {
                    case "catch":
                        db.collection("canales").
                            doc(canalID).
                            update(
                                {
                                    chatStatus: -1
                                }
                            ).then(() => {
                                swal("Ocultaste el Chat correctamente!", "", "success");
                                $("#label-chat-activo").html("CHAT<br>OCULTO");
                                $("#label-chat-activo").removeClass("text-success").addClass("text-danger");
                                $("#switch-chat").removeAttr("checked").prop("checked", false);
                                $("#label-chat-activo2").html("CHAT<br>BLOQUEADO");
                                $("#label-chat-activo2").removeClass("text-success").addClass("text-danger");
                                $("#switch-chat2").removeAttr("checked").prop("checked", false);
                            }).catch((error) => {
                                $("#switch-chat").attr("checked", "checked").prop("checked", true);
                                $("#switch-chat2").attr("checked", "checked").prop("checked", true);
                                swal("Ocurrió un error al desactivar el Chat", "", "error");
                                console.log(error);
                            });

                        break;

                    default:
                        $("#switch-chat").attr("checked", "checked").prop("checked", true);
                        $("#switch-chat2").attr("checked", "checked").prop("checked", true);
                        break;
                }
            });
    }
    else {
        swal("¿Estás seguro/a?", "El Chat será público y visible para todos.", {
            icon: "warning",
            buttons: {
                cancel: "Cancelar",
                catch: {
                    text: "Sí, ACTIVAR",
                    value: "catch",
                }
            },
        })
            .then((value) => {
                switch (value) {
                    case "catch":
                        db.collection("canales").
                            doc(canalID).
                            update(
                                {
                                    chatStatus: 1
                                }
                            ).then(() => {
                                swal("Activaste el Chat correctamente!", "", "success");
                                $("#label-chat-activo").html("CHAT<br>VISIBLE");
                                $("#label-chat-activo").removeClass("text-danger").addClass("text-success");
                                $("#switch-chat").attr("checked", "checked").prop("checked", true);
                                $("#label-chat-activo2").html("CHAT<br>LIBRE");
                                $("#label-chat-activo2").removeClass("text-danger").addClass("text-success");
                                $("#switch-chat2").attr("checked", "checked").prop("checked", true);
                            }).catch((error) => {
                                swal("Ocurrió un error al activar el Chat", "", "error");
                                $("#switch-chat").removeAttr("checked").prop("checked", false);
                                $("#switch-chat2").removeAttr("checked").prop("checked", false);
                                console.log(error);
                            });
                        break;
                    default:
                        $("#switch-chat").attr("checked", "checked").prop("checked", true);
                        break;
                }
            });
    }
}

function toggleChat2(activar, canalID) {
    if (activar == false) {
        swal("¿Estás seguro/a de BLOQUEAR el Chat?", "", {
            icon: "warning",
            buttons: {
                cancel: "Cancelar",
                catch: {
                    text: "Sí, BLOQUEAR",
                    value: "catch",
                }
            },
        })
            .then((value) => {
                switch (value) {
                    case "catch":
                        db.collection("canales").
                            doc(canalID).
                            update(
                                {
                                    chatStatus: 0
                                }
                            ).then(() => {
                                swal("Bloqueaste el Chat correctamente!", "", "success");
                                $("#label-chat-activo2").html("Chat Bloqueado");
                                $("#label-chat-activo2").removeClass("text-success").addClass("text-danger");
                                $("#switch-chat2").removeAttr("checked").prop("checked", false);
                            }).catch((error) => {
                                $("#switch-chat2").attr("checked", "checked").prop("checked", true);
                                swal("Ocurrió un error al desactivar el Chat", "", "error");
                                console.log(error);
                            });

                        break;

                    default:
                        $("#switch-chat2").attr("checked", "checked").prop("checked", true);
                        break;
                }
            });
    }
    else {
        swal("¿Estás seguro/a?", "El Chat será libre y todos pueden escribir.", {
            icon: "warning",
            buttons: {
                cancel: "Cancelar",
                catch: {
                    text: "Sí, ACTIVAR",
                    value: "catch",
                }
            },
        })
            .then((value) => {
                switch (value) {
                    case "catch":
                        db.collection("canales").
                            doc(canalID).
                            update(
                                {
                                    chatStatus: 1
                                }
                            ).then(() => {
                                swal("Activaste el Chat correctamente!", "", "success");
                                $("#label-chat-activo").html("CHAT<br>VISIBLE");
                                $("#label-chat-activo").removeClass("text-danger").addClass("text-success");
                                $("#switch-chat").attr("checked", "checked").prop("checked", true);
                                $("#label-chat-activo2").html("CHAT<br>LIBRE");
                                $("#label-chat-activo2").removeClass("text-danger").addClass("text-success");
                                $("#switch-chat2").attr("checked", "checked").prop("checked", true);
                            }).catch((error) => {
                                swal("Ocurrió un error al activar el Chat", "", "error");
                                $("#switch-chat").removeAttr("checked").prop("checked", false);
                                $("#switch-chat2").removeAttr("checked").prop("checked", false);
                                console.log(error);
                            });
                        break;
                    default:
                        $("#switch-chat").attr("checked", "checked").prop("checked", true);
                        break;
                }
            });
    }
}

async function listenChanges() {
    canalID = getQueryVariable("id");

    db.collection("canales").doc(canalID).collection("messages").orderBy('createdAt').limit(100).onSnapshot(snapshot => {
        $("#main").html("")
        snapshot.forEach((doc, i) => {
            $("#main").append(chatMessage(doc.data(), doc.id, canalID))
        })
    });

    $('#form-chat').on('submit', function (e) { //use on if jQuery 1.7+
        e.preventDefault();  //prevent form from submitting
        sendMessage()
    });
}

function chatMessage(props, id, canalID) {
    const { text, uid, photoURL, nombre } = props;
    const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

    var name = uid !== auth.currentUser.uid ?
        `<span class="user-name"> ${nombre && nombre.length <= 15 ? nombre : nombre && nombre.length > 15 ? nombre.substring(0, 15) : "Usuario"}</span>` : "";

    var code = `
    <div class="message ${messageClass}">
        <div class="dropdown">
            <img data-toggle="dropdown" aria-expanded="false" class="dropdown-toggle" alt="avatar" src=${photoURL || 'nophoto.png'} />
            <div class="dropdown-menu">
                <button class="dropdown-item" type="button" onClick="eliminarMensaje('${id}', '${canalID}')">Eliminar mensaje</button>
                <button class="dropdown-item" type="button" onClick="bloquearUsuario('${uid}', '${canalID}')">Bloquear Usuario</button>
                <button class="dropdown-item" type="button" onClick="limpiarChat('${canalID}')">Limpiar Chat</button>
            </div>
        </div>
      
      <div class="msg-wrapper">
        ${name}
          <p>${text}</p>
      </div>
    </div>
    `
    return code;
}

function eliminarMensaje(id, canalID) {
    db.collection("canales").doc(canalID).collection("messages").doc(id).delete();
}

function bloquearUsuario(id, canalID) {
    swal("Estás seguro/a de Bloquear a este Usuario?", "", {
        icon: "warning",
        buttons: {
            cancel: "Cancelar",
            catch: {
                text: "Sí, BLOQUEAR",
                value: "catch",
            }
        },
    })
        .then((value) => {
            switch (value) {
                case "catch":
                    db.collection("canales").doc(canalID).collection("banned").doc(id).set({
                        fecha: new Date
                    }).then(() => {
                        swal("Bloqueaste al Usuario correctamente!", "", "success")
                    }).catch((e) => {
                        swal("Ocurrió un error al Bloquear al Usuario", e.toString(), "error")
                    });

                    break;

                default:
                    break;
            }
        });
}

function limpiarChat(canalID) {
    swal("Estás seguro/a de Limpiar el CHAT?", "PUEDE DEMORAR UNOS MINUTOS, NO CIERRES LA VENTANA", {
        icon: "warning",
        buttons: {
            cancel: "Cancelar",
            catch: {
                text: "Sí, BLOQUEAR",
                value: "catch",
            }
        },
    })
        .then((value) => {
            switch (value) {
                case "catch":
                    const colRef = db.collection("canales").doc(canalID).collection("messages");
                    colRef.get().then( (querySnapshot) => {
                        if (querySnapshot.docs && querySnapshot.docs.length){
                            querySnapshot.docs.forEach((doc, i) => {
                                colRef.doc(doc.id).delete();
                            })
                        }
                    }).catch((e) => {
                        swal("Ocurrió un error al Limpiar el Chat", e.toString(), "error")
                    });

                    break;

                default:
                    break;
            }
        });
}


var StopWebCam = function () {
    var video = document.getElementById("video-preview")
    var stream = video.srcObject;
    if (stream) {
        var tracks = stream.getTracks();

        for (var i = 0; i < tracks.length; i++) {
            var track = tracks[i];
            track.stop();
        }
        connection.attachStreams.forEach(function(stream2) {
            stream2.stop();
        });
    }
        
        if (isRecording){
            stopRecording();
        }
        else{
            setStatusGrabacion(false)
        }
        $(".no-video-container").removeClass("d-none").addClass("d-block")
        $(".video-outer").removeClass("d-block").addClass("d-none")
        $(".btn-start").removeClass("d-none").addClass("d-flex");
        $(".btn-transmitir").removeClass("d-flex").addClass("d-none");
        $(".btn-transmitir").prop("disabled", false);
        document.getElementById('open-or-join').disabled = false;
        video.srcObject = null;
        isLive = false;
        stopped = true;
        
        updateLink(false)
        setStatus("novideo")
}


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

// LA MAGIA EMPIEZA ACA


function updateLink(value) {
    const canalID = getQueryVariable("id");
    db.collection("canales").doc(canalID).update({
        cameraStream: value == true ? true : null
    }).then(() => {

    });
}

    
function setStatus(value) {
    if (value == "novideo") {
        $(".live-msg").removeClass("d-block").addClass("d-none");
        $(".novideo-msg").removeClass("d-none").addClass("d-block");
        $(".error-msg").removeClass("d-block").addClass("d-none");
    }
    else if (value == "live") {
        $(".live-msg").removeClass("d-none").addClass("d-block");
        $(".novideo-msg").removeClass("d-block").addClass("d-none");
        $(".error-msg").removeClass("d-block").addClass("d-none");
    }
    else if (value == "error") {
        $(".live-msg").removeClass("d-block").addClass("d-none");
        $(".novideo-msg").removeClass("d-block").addClass("d-none");
        $(".error-msg").removeClass("d-none").addClass("d-block");
    }
}
//MAGIA 2

async function sendMessage() {
    let text = $("#input-chat").val().trim();

    if (!text.length) {
        return;
    }

    if (!canalID) {
        return;
    }

    const messagesRef = db.collection("canales").doc(canalID).collection('messages');

    var puede = true;
    if (myMessages.length >= 5) {
        var d1 = new Date(parseInt(myMessages[0]));
        var d2 = new Date(parseInt(myMessages[4]));

        var a = moment(d1);
        if (a.diff(d2, 'seconds') < 5) {
            puede = false;
            alert("Esperá 10 segundos para volver a escribir")
            setTimeout(() => {
                if (myMessages.length === 5) {
                    myMessages = []
                    puede = true;
                }
            }, 5000);
        }
    }
    if (puede) {
        const { uid, photoURL, displayName } = auth.currentUser;
        var nombre;
        if (!displayName) {
            nombre = "Administrador";
        }
        else {
            nombre = displayName;
        }

        const d3 = new Date();
        myMessages.push(d3.getTime())


        $("#input-chat").val("")

        await messagesRef.doc().set({
            text: text.length < 140 ? text : text.substring(0, 139),
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uid,
            nombre,
            photoURL,
            esAdmin: true
        })

        var target = document.getElementById("main");
        if (target)
            target.scrollTo(0, target.scrollHeight - target.clientHeight)
    }
}



// -------------------------- WEBRTC


// https://www.rtcmulticonnection.org/docs/iceServers/
// use your own TURN-server here!
connection.iceServers = [{
    'urls': [
        'stun:stun.l.google.com:19302',
        'stun:stun1.l.google.com:19302',
        'stun:stun2.l.google.com:19302',
        'stun:stun.l.google.com:19302?transport=udp',
    ]
}];

// its mandatory in v3
connection.enableScalableBroadcast = true;

// each relaying-user should serve only 1 users
connection.maxRelayLimitPerUser = 1;

// we don't need to keep room-opened
// scalable-broadcast.js will handle stuff itself.
connection.autoCloseEntireSession = true;

// by default, socket.io server is assumed to be deployed on your own URL
connection.socketURL = 'https://www.unidadglobal.org:9001/';

// comment-out below line if you do not have your own socket.io server
//connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';

connection.socketMessageEvent = 'scalable-media-broadcast-demo';

// document.getElementById('broadcast-id').value = connection.userid;

// user need to connect server, so that others can reach him.
connection.connectSocket(function(socket) {
    socket.on('logs', function(log) {
        console.log(log)
    });

    // this event is emitted when a broadcast is already created.
    socket.on('join-broadcaster', function(hintsToJoinBroadcast) {
        console.log('join-broadcaster', hintsToJoinBroadcast);

        connection.session = hintsToJoinBroadcast.typeOfStreams;
        connection.sdpConstraints.mandatory = {
            OfferToReceiveVideo: !!connection.session.video,
            OfferToReceiveAudio: !!connection.session.audio
        };
        connection.broadcastId = hintsToJoinBroadcast.broadcastId;
        connection.join(hintsToJoinBroadcast.userid);
    });

    socket.on('rejoin-broadcast', function(broadcastId) {
        console.log('rejoin-broadcast', broadcastId);

        connection.attachStreams = [];
        socket.emit('check-broadcast-presence', broadcastId, function(isBroadcastExists) {
            if (!isBroadcastExists) {
                // the first person (i.e. real-broadcaster) MUST set his user-id
                connection.userid = broadcastId;
            }

            socket.emit('join-broadcast', {
                broadcastId: broadcastId,
                userid: connection.userid,
                typeOfStreams: connection.session
            });
        });
    });

    socket.on('broadcast-stopped', function(broadcastId) {
        console.error('broadcast-stopped', broadcastId);
        //alert('This broadcast has been stopped.');
    });

    // this event is emitted when a broadcast is absent.
    socket.on('start-broadcasting', function(typeOfStreams) {
        console.log('start-broadcasting', typeOfStreams);

        // host i.e. sender should always use this!
        connection.sdpConstraints.mandatory = {
            OfferToReceiveVideo: false,
            OfferToReceiveAudio: false
        };
        connection.session = typeOfStreams;

        // "open" method here will capture media-stream
        // we can skip this function always; it is totally optional here.
        // we can use "connection.getUserMediaHandler" instead
        try{
            connection.open(connection.userid);
            setTimeout(()=> {
                $(".btn-transmitir").removeClass("d-none").addClass("d-flex");        
            }, 1000)
        }
        catch(e){
            swal("Ocurrió un error de conexión.", e.message, "error")
        }   
        
        
    });
});

window.onbeforeunload = function() {
    // Firefox is ugly.
    document.getElementById('open-or-join').disabled = false;

    if (isLive || isRecording) {
        return "Estás transmitiendo en vivo"
    }
};

var videoPreview = document.getElementById('video-preview');

connection.onstream = function(event) {
    if (connection.isInitiator && event.type !== 'local') {
        return;
    }

    connection.isUpperUserLeft = false;
    videoPreview.srcObject = event.stream;
    videoPreview.play();
    
    currentStream = event.stream;

    $(".container-grabar").removeClass("d-none")
    $("#grabando-label").html("GRABANDO: 00:00");
    videoPreview.userid = event.userid;

    if (event.type === 'local') {
        videoPreview.muted = true;
    }

    if (connection.isInitiator == false && event.type === 'remote') {
        // he is merely relaying the media
        connection.dontCaptureUserMedia = true;
        connection.attachStreams = [event.stream];
        connection.sdpConstraints.mandatory = {
            OfferToReceiveAudio: false,
            OfferToReceiveVideo: false
        };

        connection.getSocket(function(socket) {
            socket.emit('can-relay-broadcast');

            if (connection.DetectRTC.browser.name === 'Chrome') {
                connection.getAllParticipants().forEach(function(p) {
                    if (p + '' != event.userid + '') {
                        var peer = connection.peers[p].peer;
                        peer.getLocalStreams().forEach(function(localStream) {
                            peer.removeStream(localStream);
                        });
                        event.stream.getTracks().forEach(function(track) {
                            peer.addTrack(track, event.stream);
                        });
                        connection.dontAttachStream = true;
                        connection.renegotiate(p);
                        connection.dontAttachStream = false;
                    }
                });
            }

            if (connection.DetectRTC.browser.name === 'Firefox') {
                // Firefox is NOT supporting removeStream method
                // that's why using alternative hack.
                // NOTE: Firefox seems unable to replace-tracks of the remote-media-stream
                // need to ask all deeper nodes to rejoin
                connection.getAllParticipants().forEach(function(p) {
                    if (p + '' != event.userid + '') {
                        connection.replaceTrack(event.stream, p);
                    }
                });
            }

            // Firefox seems UN_ABLE to record remote MediaStream
            // WebAudio solution merely records audio
            // so recording is skipped for Firefox.
            if (connection.DetectRTC.browser.name === 'Chrome') {
                repeatedlyRecordStream(event.stream);
            }
            
        });
    }

    // to keep room-id in cache
    localStorage.setItem(connection.socketMessageEvent, connection.sessionid);
};

// ask node.js server to look for a broadcast
// if broadcast is available, simply join it. i.e. "join-broadcaster" event should be emitted.
// if broadcast is absent, simply create it. i.e. "start-broadcasting" event should be fired.
document.getElementById('open-or-join').onclick = function() {
    const canalID = getQueryVariable("id");
    $("#open-or-join").prop("disabled", true);
    db.collection("canales").doc(canalID).get().then((doc) => {
        if (doc.exists && doc.data().cameraStream && doc.data().cameraStream.toString().length) {
            swal("Hay una transmisión previa en curso. Asegurate de que no haya otra persona transmitiendo", "Click en ELIMINAR para comenzar una nueva transmisión.", {
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
                        db.collection("canales").doc(canalID).update({
                            cameraStream: null
                        }).then(() => {
                            swal("Eliminaste la transmisión!", "Clickeá de nuevo en TRANSMITIR", "success")
                            $("#open-or-join").prop("disabled", false);
                        }).catch((error) => {
                            swal("Ocurrió un error. Intentá nuevamente", "Revisá tu conexión", "error");
                            $("#open-or-join").prop("disabled", false);
                        });
                        break;
                    default:
                        break;
                }
            });
        }
        else{
            $(".no-video-container").removeClass("d-block").addClass("d-none")
            $(".video-outer").removeClass("d-none").addClass("d-block")
            $(".btn-start").removeClass("d-flex").addClass("d-none");
            
            var broadcastId = document.getElementById('broadcast-id').value;
            if (broadcastId.replace(/^\s+|\s+$/g, '').length <= 0) {
                alert('Please enter broadcast-id');
                document.getElementById('broadcast-id').focus();
                return;
            }

            document.getElementById('open-or-join').disabled = true;

            connection.extra.broadcastId = broadcastId;

            connection.session = {
                audio: true,
                video: true,
                oneway: true
            };

            connection.getSocket(function(socket) {
                socket.emit('check-broadcast-presence', broadcastId, function(isBroadcastExists) {
                    if (!isBroadcastExists) {
                        // the first person (i.e. real-broadcaster) MUST set his user-id
                        connection.userid = broadcastId;
                    }

                    console.log('check-broadcast-presence', broadcastId, isBroadcastExists);

                    socket.emit('join-broadcast', {
                        broadcastId: broadcastId,
                        userid: connection.userid,
                        typeOfStreams: connection.session
                    });
                    //$(".btn-transmitir").removeClass("d-none").addClass("d-flex");
                });
            });        
        }
    })    
};

connection.onstreamended = function() {
    $(".container-grabar").addClass("d-none")
};

connection.onleave = function(event) {
    if (event.userid !== videoPreview.userid) return;

    connection.getSocket(function(socket) {
        socket.emit('can-not-relay-broadcast');

        connection.isUpperUserLeft = true;

        if (allRecordedBlobs.length) {
            // playing lats recorded blob
            var lastBlob = allRecordedBlobs[allRecordedBlobs.length - 1];
            videoPreview.src = URL.createObjectURL(lastBlob);
            videoPreview.play();
            allRecordedBlobs = [];
        } else if (connection.currentRecorder) {
            var recorder = connection.currentRecorder;
            connection.currentRecorder = null;
            recorder.stopRecording(function() {
                
                if (!connection.isUpperUserLeft) return;
                
                videoPreview.src = URL.createObjectURL(recorder.getBlob());
                videoPreview.play();
            });
        }

        if (connection.currentRecorder) {
            connection.currentRecorder.stopRecording();
            
            connection.currentRecorder = null;
        }
    });
};




function disableInputButtons() {
    document.getElementById('open-or-join').disabled = true;
    document.getElementById('broadcast-id').disabled = true;
}



async function initRTC(){
    // ......................................................
    // ......................Handling broadcast-id................
    // ......................................................
    var uid;
    $.ajaxSetup({ cache: false })
    await $.get('get_session_variable.php', { requested: "id_usuario" }, function (data) {
        uid = data.trim() ? data.trim() : auth.currentUser && auth.currentUser.uid ? auth.currentUser.uid : null
    })


    if (uid){
        $(".btn-transmitir").on("click", async function (e) {
        if (!isLive) {
            const canalID = getQueryVariable("id");
            $(".btn-transmitir").prop("disabled", true);

            db.collection("canales").doc(canalID).update({
                cameraStream: uid
            }).then(() => {
                setStatus("live")
            }).catch((error) => {
                setStatus("novideo")
            });
            isLive = !isLive;
        }
    });




        var broadcastId = uid;
        /*
        if (localStorage.getItem(connection.socketMessageEvent)) {
            broadcastId = localStorage.getItem(connection.socketMessageEvent);
        } else {
            broadcastId = connection.token();
        }
        */
        var txtBroadcastId = document.getElementById('broadcast-id');
        txtBroadcastId.value = broadcastId;
        txtBroadcastId.onkeyup = txtBroadcastId.oninput = txtBroadcastId.onpaste = function() {
            localStorage.setItem(connection.socketMessageEvent, this.value);
        };

        // below section detects how many users are viewing your broadcast

        connection.onNumberOfBroadcastViewersUpdated = function(event) {
            if (!connection.isInitiator) return;

            document.getElementById('viewers-counter').innerHTML = 'PERSONAS VIENDO: <b>' + event.numberOfBroadcastViewers + '</b>';
        };    
    }
}

function abrirLink(){
    const link = $("#input-link").val().trim();
    if (!link || !link.length) return;

    window.open(link, '_blank').focus();
}

function setStatusGrabacion(value){
    isRecording = value;
    grabandoTime = 0;
    grabandoParts = 1;
    $("#grabando-label").html("")
    if (value){
        $(".container-grabar").removeClass("d-none")
        $("#grabando-label").html("GRABANDO: 00:00");
        $(".visible-grabando").removeClass("d-none")
        $(".btn-grabar").addClass("d-none");
        
        grabarTransmision();
        updateSeconds();
    }
    else{
        $(".container-grabar").addClass("d-none")
    }
}

const updateSeconds = () => {
    setTimeout(function() {
        if (grabandoTime){

        }
        if (!isRecording) return;
        grabandoTime++;
        $("#grabando-label").html("GRABANDO: "+secondsToTime(grabandoTime))
        updateSeconds();
    }, 1000);
}

function grabarTransmision() {
    if (!isRecording) return;

    connection.currentRecorder = RecordRTC(currentStream, {
        type: 'video',
        mimeType: "video/webm;codecs=h264",
        getNativeBlob: true
    });

    connection.currentRecorder.startRecording();
    
    setTimeout(function() {
        // if (connection.isUpperUserLeft || !connection.currentRecorder) {
        //     return;
        // }
        connection.currentRecorder.stopRecording(function() {
            if (!isRecording) return;
            
            if (connection.isUpperUserLeft) {
                return;
            }

            const url = window.URL.createObjectURL(connection.currentRecorder.getBlob());
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;

            let fecha = moment(new Date()).format('DD-MM-YY_HH-mm');
            
            a.download = `unidadglobal_${fecha}_parte${grabandoParts}.webm`;
            grabandoParts++;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
            document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 100);

            connection.currentRecorder = null;
            grabarTransmision(currentStream);
        });
    }, 15 * 60000); // 30-seconds
};

function stopRecording(){
    $(".visible-grabando").addClass("d-none")
    $(".btn-grabar").removeClass("d-none");
    grabandoParts = 1;

    isRecording = false;
    connection.currentRecorder.stopRecording(function() {
        if (connection.isUpperUserLeft) {
            return;
        }

        const url = window.URL.createObjectURL(connection.currentRecorder.getBlob());
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        let fecha = moment(new Date()).format('DD-MM-YY_HH-mm');
        a.download = `${fecha}_parte${grabandoParts}.webm`;
        grabandoParts++;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
        document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 100);

        connection.currentRecorder = null;
        
    });
}