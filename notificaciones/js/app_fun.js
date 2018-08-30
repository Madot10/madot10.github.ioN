/* Set the width of the side navigation to 250px */
function openNav() {
    if (getCanAccess()) {
        document.getElementById("mySidenav").style.width = "250px";
    }
}

/* Set the width of the side navigation to 0 */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

function changeName(name) {
    document.getElementById('screenName').innerHTML = name;
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
            changeName('Iniciar Sesión');
            document.getElementsByClassName('in')[0].style.display = 'block';
            break;

        case 'Home':
            if (getCanAccess()) {
                stateProcess = 'Ready';
                changeName('Inicio');
                document.getElementsByClassName('Home')[0].style.display = 'block';
                getNotificaciones();
            }
            break;

        case 'Configuracion':
            if (userDB != null) {
                setUserConf();
            }
            changeName('Configuración');
            document.getElementsByClassName('conf')[0].style.display = 'block';
            SusToService();
            break;

        case 'SobreN':
            changeName('Info');
            document.getElementsByClassName('aboutN')[0].style.display = 'block';
            break;

        case 'Aviso':
            console.log('GO TO AVISO');
            changeName('Aviso');
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

function getNotificaciones() {
    console.log('Getting noti')
    document.getElementById('notif').innerHTML = '';
    ToggleLoader();

    FB_DB.collection("notification").orderBy("fecha", "desc")
        .get()
        .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                // doc.data() is never undefined for query doc snapshots
                console.log('Topic',doc.data().topic);

                    if (topicData[doc.data().topic]) {
                        //user esta suscripto
                        console.log(doc.id, " => ", doc.data());
                        generateHomeNoti(doc.data());
                    }else if(topicData[doc.data().topic] == undefined){
                        if(topicData['rol'] == doc.data().topic){
                            //Si es mismo rol
                            generateHomeNoti(doc.data());
                        }
                    }
                
            });
            ToggleLoader();
            document.getElementsByClassName('Home')[0].style.display = 'block';
        });
}

function generateHomeNoti(doc) {
    let titulo = doc.webpush.notification.title;
    let body = doc.webpush.notification.body;
    let link = doc.webpush.notification.click_action || null;
    let image = doc.webpush.notification.image || null;
    let icon = doc.webpush.notification.icon;
    let topic = doc.topic;
    let fecha = doc.fecha;

    var divMain = document.createElement('div');
    divMain.setAttribute('class', 'card');

    //titulo
    let tiH = document.createElement('h2');
    tiH.appendChild(document.createTextNode(titulo));
    divMain.appendChild(tiH);

    //Cuerpo
    let boP = document.createElement('p');
    boP.setAttribute('class', 'container');
    boP.appendChild(document.createTextNode(body));
    divMain.appendChild(boP);

    //br
    divMain.appendChild(document.createElement('br'));

    //Imagen
    if (image) {
        //Si hay imagen
        let img = document.createElement('img');
        img.setAttribute('src', image);
        img.setAttribute('width', '200');
        img.setAttribute('height', '200');
        divMain.appendChild(img);
    }

    //Link
    if (link) {
        //Si hay link
        let alink = document.createElement('a');
        alink.setAttribute('href', link);
        alink.setAttribute('class', 'lbt');
        alink.appendChild(document.createTextNode('Ir a la fuente'));
        divMain.appendChild(alink);
    }

    document.getElementById('notif').appendChild(divMain);
}