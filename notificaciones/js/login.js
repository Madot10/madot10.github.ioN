var loader = true;

/** ANTE CAMBIOS DE LOGIN Y USER **/
FB_AUTH.onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        console.log("AUTH", user);
        IsRegister(checkSesion);
        //ToggleSesion(true);
    } else {
        // No user is signed in.
        console.log("NOT AUTH", user);
        goToDiv('LoginAuth');
        //ToggleSesion(false);
    }

});

function checkSesion() {
    console.log('CHECKING STATE');
    if (userDB != null) {
        //HAY REGISTRO EN DB
        console.log('Hay registro >> HOME');
        stateProcess = 'Ready';
        goToDiv('Home');
    } else {
        //NO HAY REGISTRO EN DB
        console.log("NO hay registro >> REGISTRAR");
        goToDiv('Registrar')
    }
}

function goToDiv(nameDiv, msg) {
    //OCULTAMOS TODAS LAS SCREEN PARA EL CAMBio
    let screens = document.getElementsByClassName('screen');
    for (let element of screens) {
        element.style.display = 'none';
    }

    if (loader) {
        //ocultar
        ToggleLoader();
    }

    switch (nameDiv) {
        case 'LoginAuth':
            document.getElementsByClassName('in')[0].style.display = 'block';
            break;

        case 'Home':
            document.getElementsByClassName('Home')[0].style.display = 'block';
            break;

        case 'Registrar':
            document.getElementsByClassName('res')[0].style.display = 'block';
            SusToService();
            break;

        case 'Aviso':
            console.log('GO TO AVISO');
            document.getElementById('mensaje').innerHTML = msg;
            document.getElementsByClassName('aviso')[0].style.display = 'block';
            break;

        default:
            console.log('Default', nameDiv);
            break;

    }
}




function ToggleLoader() {
    if (!loader) {
        //Se encuentra oculto -> Mostramos
        let screens = document.getElementsByClassName('screen');
        for (let element of screens) {
            element.style.display = 'none';
        }
        document.getElementsByClassName('loader')[0].style.display = 'inline-block';
        loader = true;
    } else {
        //ACTIVO -> desactivar
        document.getElementsByClassName('loader')[0].style.display = 'none';
        loader = false;
    }
}

function LogIn() {
    FB_AUTH.signInWithPopup(provider).then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;

        var user = result.user;

        console.log("LOGIN OK + result:", result);
        console.log("USER: ", user);
        ToggleLoader();

    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;

        var credential = error.credential;
        console.log("ERROR: ", errorCode, errorMessage);
    });
}

function LogOut() {
    FB_AUTH.signOut().then(function () {
        // Sign-out successful.
        console.log("BYE BYE OK");
        userDB = null;
    }).catch(function (error) {
        // An error happened.
        console.log("NOT TODAY", error);
    });
}


function IsRegister(funCall) {
    //BUSCAMOS SI UID ESTA REGISTRADO
    FB_DB.collection('users').where("uid", '==', FB_AUTH.currentUser.uid)
        .get()
        .then(function (querySnapshot) {
            console.log('querySnapshot: ', querySnapshot.docs.length);
            //DEBE existir solo 1 resg por usuario
            if (querySnapshot.docs.length >= 1) {
                console.log('EXISTE');
                console.log(querySnapshot.docs[0].id, " => ", querySnapshot.docs[0].data());
                userDB = querySnapshot.docs[0].data();

                if (querySnapshot.docs.length > 1) {
                    //NOTIFICAR ERROR EN REGISTROS
                    //ENVIAR UID, CORREO, LENGTH, DONDE SE EJECUTA ERROR
                }
            } else {
                console.log('NO EXISTE');
            }
            funCall();
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });
}

function getDBRes() {

}