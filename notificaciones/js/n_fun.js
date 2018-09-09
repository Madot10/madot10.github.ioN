var topicData = {
    rol: null,
    avisosUcab: true,
    eventosUcab: true,
    eventosEst: true,
    promo: false,
    agrupaciones: false,
    modelos: false,
    deportes: false,
    voluntariado: false,
    all: true
};
//null = nothing 
//0=negate 1=accept 
//2=not support
var susCode = null;
var susSWcode = null;
var stateProcess = '';

//Permiso de notificaciones e instalar SW
function SusToService() {

    FB_CM.requestPermission().then(function () {
        //console.log('Notification permission granted.');
        // TODO(developer): Retrieve an Instance ID token for use with FCM.
        susCode = 1;
        //INstalamos SW
        if ('serviceWorker' in navigator) {
            //console.log("Installing");
            navigator.serviceWorker.register('/firebase-messaging-sw.js', { scope: '/firebase-cloud-messaging-push-scope' })
                .then(function (swReg) {
                    susSWcode = 1;
                    swRegistration = swReg;
                    FB_CM.useServiceWorker(swReg);
                });
        } else {
            susSWcode = 2;
            //msgSnack('Navegador no compatible!');
            console.log("SW Dont support");
            // 
        }
    }).catch(function (err) {
        console.log('Unable to get permission to notify.', err);
        susCode = 0;
        //ToggleLoader();
        //goToDiv('Avisos', '¡Deberás permitir las notificaciones para poder continuar con el registro!');
    });
}

//Rellenar datos
function setUserConf() {
    topicData = userDB.topics;
    //Establecemos el rol
    document.getElementById('sl_carrera').value = topicData.rol;

    document.getElementById('SavisosUcab').checked = topicData.avisosUcab;
    document.getElementById('SeventosUcab').checked = topicData.eventosUcab;
    document.getElementById('SeventosEst').checked = topicData.eventosEst;
    document.getElementById('Spromo').checked = topicData.promo;
    document.getElementById('Sagrup').checked = topicData.agrupaciones;
    document.getElementById('Smodels').checked = topicData.modelos;
    document.getElementById('Sdeportes').checked = topicData.deportes;
    document.getElementById('Svoluntariado').checked = topicData.voluntariado;

}

function checkForm() {
    let slcarrera = document.getElementById('sl_carrera')
    if ((slcarrera.value != 'null') && (topicData.rol != null)) {
        return true;
    } else {
        alert('Debes seleccionar tu rol en la ucab!');
        return false;
    }
    return false;
}

function setTopicState(topic, value) {
    //console.log(topic, ' set to ', value);
    topicData[topic] = value;
}

function CompleteFormRes() {
    //revisamos carrera select
    if (checkForm()) {
        //ACtivamos load
        ToggleLoader();
        let uid = FB_AUTH.currentUser.uid;
        let tokenUser;

        if ((susCode == 1) && (susSWcode == 1)) {
            //all ok
            stateProcess = 'Resg';
            FB_CM.getToken()
                .then(function (refreshedToken) {
                    console.log('Token', refreshedToken);
                    tokenUser = refreshedToken;
                    SaveRegToDB(uid, tokenUser);

                }).catch(function (err) {
                    console.log('Unable to retrieve refreshed token ', err);
                    //showToken('Unable to retrieve refreshed token ', err);
                });
        } else if (susCode == 0) {
            //negate sus
            //Activate load
            ToggleLoader();
            goToDiv('Aviso', '¡Deberás permitir las notificaciones para poder continuar con el registro!');
        } else if (susSWcode == 2) {
            //Not supported
            //Activate load
            ToggleLoader();
            goToDiv('Aviso', "Tu navegador no es compatible con la tecnología de notificaciones <br> <b>¡Intenta con otro! </b>");
        }
    }
}

function updateDataDB(docNew, msgOk) {
    FB_DB.collection('users').where("uid", '==', FB_AUTH.currentUser.uid)
        .get()
        .then(function (querySnapshot) {
            //console.log('querySnapshot: ', querySnapshot.docs.length);
            //DEBE existir solo 1 resg por usuario
            if (querySnapshot.docs.length >= 1) {
                var docRefid = querySnapshot.docs[0].id;
                var docRef = FB_DB.collection('users').doc(docRefid);
                //console.log('updating');

                return docRef.update(docNew)
                    .then(function () {
                        console.log("Document successfully updated!");

                        if (msgOk) {
                            msgSnack(msgOk);
                        }
                        topicData = userDB.topics;
                        goToDiv('Home');
                    })
                    .catch(function (error) {
                        // The document probably doesn't exist.
                        console.error("Error updating document: ", error);
                        msgSnack('Error de red, vuelva a intentar');
                    });

                if (querySnapshot.docs.length > 1) {
                    //NOTIFICAR ERROR EN REGISTROS
                    //ENVIAR UID, CORREO, LENGTH, DONDE SE EJECUTA ERROR
                    FB_DB.collection('errors').add({
                        fecha: new Date(),
                        tipo: "Registros dobles o mas",
                        datos: docNew
                    })
                }
            }
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
            msgSnack('Error de red, vuelva a intentar');
        });
}
//Generamos doc para guardar en DB
function SaveRegToDB(uid, tokU) {
    var dat = {
        susState: true,
        susDate: new Date(),
        email: FB_AUTH.currentUser.email,
        uid: uid,
        token: tokU,
        topics: topicData
    };
    if (userDB != null) {
        //Hay reg => update
        OnClickGa("updateRegOK","Sus", "email: "+ dat.email);
        updateDataDB(dat, 'Configuracion actualizado correctamente');

    } else {
        //No hay reg => create
        FB_DB.collection('users').add(dat)
            .then(function (docRef) {
                //console.log("Document written with ID: ", docRef.id);
                OnClickGa("newRegOK","Sus", "email: "+ dat.email);
                msgSnack('Registro completado correctamente');
                userDB = dat;
                goToDiv('Home');
            })
            .catch(function (error) {
                console.error("Error adding document: ", error);
                msgSnack('Error de red, vuelva a intentar');
            })
    }

}

function msgSnack(mesg) {
    // Get the snackbar DIV
    var x = document.getElementById("snackbar");

    x.innerText = mesg;
    // Add the "show" class to DIV
    x.className = "show";

    // After 3 seconds, remove the show class from DIV
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
}

FB_CM.onTokenRefresh(function () {
    //Si no es por el registro que sucede -- procede
    //console.log('Procede refresh?????')
    if (stateProcess != 'Resg') {
        //console.log('Procede refresh');
        FB_CM.getToken().then(function (refreshedToken) {
            //console.log('Token refresh', refreshedToken);

            if (FB_AUTH.currentUser) {
                //si esta auth con google
                var newT = {
                    token: refreshedToken
                };
                updateDataDB(newT);
            }

        }).catch(function (err) {
            console.log('Unable to retrieve refreshed token ', err);
            FB_DB.collection('errors').add({
                fecha: new Date(),
                tipo: "No procede refresh token",
                datos: userDB
            })
            //showToken('Unable to retrieve refreshed token ', err);
        });
    }
});

function updateSW() {
    FB_CM.requestPermission().then(function () {
        //console.log('Notification permission granted.');
        if ('serviceWorker' in navigator) {
            //console.log("Updating");
            navigator.serviceWorker.register('/firebase-messaging-sw.js', { scope: '/firebase-cloud-messaging-push-scope' })
                .then(function (swReg) {
                    swReg.update();
                    FB_CM.useServiceWorker(swReg);
                });
        } else {
            console.log("SW Dont support");
        }
    }).catch(function (err) {
        console.log('Unable to get permission to notify.', err);
        susCode = 0;
    });
}

function UninstallSW() {
    if ('serviceWorker' in navigator) {
        //console.log("Installing");
        navigator.serviceWorker.register('/firebase-messaging-sw.js', { scope: '/firebase-cloud-messaging-push-scope' })
            .then(function (swReg) {
                swRegistration = swReg;
                swRegistration.unregister()
                    .then(function (boolean) {
                        OnClickGa("unSusOK","Sus", "email: "+ dat.email);
                        chAct = {
                            susState: false
                        };
                        updateDataDB(chAct, 'Esperamos que vuelvas pronto!');
                        LogOut();
                        //console.log("El proceso de dessuscripcion fue: ", boolean);
                    });

            });
    } else {
        console.log("SW Dont support");
    }
}
