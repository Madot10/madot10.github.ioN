var loader = true;

/** ANTE CAMBIOS DE LOGIN Y USER **/
FB_AUTH.onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        //console.log("AUTH", user);
        IsRegister(checkSesion);
        //ToggleSesion(true);
    } else {
        // No user is signed in.
        //console.log("NOT AUTH", user);
        goToDiv('LoginAuth');
        //ToggleSesion(false);
    }

});

function checkSesion() {
    //console.log('CHECKING STATE');
    if (userDB != null) {
        //HAY REGISTRO EN DB
        //console.log('Hay registro >> HOME');
        updateSW();
        topicData = userDB.topics;
        stateProcess = 'Ready';
        goToDiv('Home');
    } else {
        //NO HAY REGISTRO EN DB
        //console.log("NO hay registro >> Configuracion");
        goToDiv('Configuracion')
    }
}

function LogIn() {
    FB_AUTH.signInWithPopup(provider).then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;

        var user = result.user;

        //console.log("LOGIN OK + result:", result);
        //console.log("USER: ", user);
        OnClickGa("login","Nplus", "Email: "+ user.email);
        //activar
        toggleStyleStart();
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
        //console.log("BYE BYE OK");
        userDB = null;
    }).catch(function (error) {
        // An error happened.
        //console.log("NOT TODAY", error);
    });
}

function getCanAccess(){
    if((FB_AUTH.currentUser) && (userDB != null)){
        return true;
    }else{
        msgSnack('Debes iniciar sesión!');
        return false;
    }
}

function IsRegister(funCall) {
    //BUSCAMOS SI UID ESTA REGISTRADO
    FB_DB.collection('users').where("uid", '==', FB_AUTH.currentUser.uid)
        .get()
        .then(function (querySnapshot) {
            //console.log('querySnapshot: ', querySnapshot.docs.length);
            //DEBE existir solo 1 resg por usuario
            if (querySnapshot.docs.length >= 1) {
                console.log('EXISTE');
                //console.log(querySnapshot.docs[0].id, " => ", querySnapshot.docs[0].data());
                userDB = querySnapshot.docs[0].data();

                if (querySnapshot.docs.length > 1) {
                    //NOTIFICAR ERROR EN REGISTROS
                    //ENVIAR UID, CORREO, LENGTH, DONDE SE EJECUTA ERROR
                }
            } else {
                //console.log('NO EXISTE');
            }
            funCall();
        })
        .catch(function (error) {
            //console.log("Error getting documents: ", error);
        });
}
