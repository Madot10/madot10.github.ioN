var topicData = {
    rol: null,
    avisosUcab: true,
    eventosUcab: true,
    eventosEst: true,
    promo: false,
    agrupaciones: false,
    modelos: false,
    deportes: false,
    voluntariado: false
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
        console.log('Notification permission granted.');
        // TODO(developer): Retrieve an Instance ID token for use with FCM.
        susCode = 1;
        //INstalamos SW
        if ('serviceWorker' in navigator) {
            console.log("Installing");
            navigator.serviceWorker.register('/firebase-messaging-sw.js', { scope: '/firebase-cloud-messaging-push-scope' })
                .then(function (swReg) {
                    susSWcode = 1;
                    swRegistration = swReg;
                    FB_CM.useServiceWorker(swReg);
                });
        } else {
            susSWcode = 2;
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

function checkForm() {
    let slcarrera = document.getElementById('sl_carrera')
    if (slcarrera.value != 'null') {
        return true;
    } else {
        alert('Debes seleccionar tu rol en la ucab!');
        return false;
    }
    return false;
}

function setTopicState(topic, value) {
    console.log(topic, ' set to ', value);
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

//Generamos doc para guardar en DB
function SaveRegToDB(uid, tokU) {
    FB_DB.collection('users').add({
        susDate: new Date(),
        email: FB_AUTH.currentUser.email,
        uid: uid,
        token: tokU,
        topics: topicData
    })
        .then(function (docRef) {
            console.log("Document written with ID: ", docRef.id);
            msgSnack('Registro completado correctamente');
            goToDiv('Home');
        })
        .catch(function (error) {
            console.error("Error adding document: ", error);
            msgSnack('Error de red, vuelva a intentar');
        })
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
    console.log('Procede refresh?????')
    if (stateProcess != 'Resg') {
        console.log('Procede refresh');
        FB_CM.getToken().then(function (refreshedToken) {
            console.log('Token refresh', refreshedToken);

            if (FB_AUTH.currentUser) {
                //si esta auth con google
                FB_DB.collection('users').where("uid", '==', FB_AUTH.currentUser.uid)
                    .get()
                    .then(function (querySnapshot) {
                        console.log('querySnapshot: ', querySnapshot.docs.length);
                        //DEBE existir solo 1 resg por usuario
                        if (querySnapshot.docs.length >= 1) {
                            var docRef = querySnapshot.docs[0].data();

                            return docRef.update({
                                token: refreshedToken
                            }).then(function () {
                                console.log("Document successfully updated!");
                            })
                                .catch(function (error) {
                                    // The document probably doesn't exist.
                                    console.error("Error updating document: ", error);
                                });

                            if (querySnapshot.docs.length > 1) {
                                //NOTIFICAR ERROR EN REGISTROS
                                //ENVIAR UID, CORREO, LENGTH, DONDE SE EJECUTA ERROR
                            }
                        }
                    })
                    .catch(function (error) {
                        console.log("Error getting documents: ", error);
                    });
            }

        }).catch(function (err) {
            console.log('Unable to retrieve refreshed token ', err);
            //showToken('Unable to retrieve refreshed token ', err);
        });
    }
});

/*******TEST FUNCTION****** *///fecha: new Date(), action_click: 'https://madot10.github.io' "click_action": 'https://www.youtube.com'
function sendNoti() {
    var message = {
        data: {
            "title": 'EVENTO',
            "body": 'Nueva prueba de data ' + new Date(),
            "icon": 'https://firebasestorage.googleapis.com/v0/b/nplus-madot.appspot.com/o/logo%2Fnoti_logo.png?alt=media&token=0c5c2d56-c17f-4be7-be06-017ebd992f9f'
        },
        topic: 'avisosUcab'
      }

    FB_DB.collection('notification').add(message)
        .then(function (docRef) {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch(function (error) {
            console.error("Error adding document: ", error);
        });
}