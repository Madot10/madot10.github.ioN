var stInicio = false;

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
            toggleStyleStart();
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

        case 'report':
            changeName('Reporte');
            document.getElementsByClassName('report')[0].style.display = 'block';
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
            //console.log('GO TO AVISO');
            changeName('Aviso');
            document.getElementById('mensaje').innerHTML = msg;
            document.getElementsByClassName('aviso')[0].style.display = 'block';
            break;

        default:
            //console.log('Default', nameDiv);
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
    //console.log('Getting notis')
    document.getElementById('notif').innerHTML = '';
    ToggleLoader();

    FB_DB.collection("notification").orderBy("fecha", "desc")
        .get()
        .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                // doc.data() is never undefined for query doc snapshots
                //console.log('Topic',doc.data().topic);

                    if (topicData[doc.data().topic]) {
                        //user esta suscripto
                        //console.log(doc.id, " => ", doc.data());
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

    let objToshare = {
        titulo: titulo,
        body: body,
        link: link
    };

    //console.log('Doc gen', doc);
    var divMain = document.createElement('div');
    divMain.setAttribute('class', 'card');

    //titulo
    let tiH = document.createElement('h2');
    tiH.appendChild(document.createTextNode(titulo));
    divMain.appendChild(tiH);

    //Cuerpo
    let boP = document.createElement('p');
    boP.setAttribute('class', 'container');
    boP.innerHTML = body + '<br>' + '<b>' + timeAgoGen(fecha.seconds) + '</b>';
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
        /*
        let alink = document.createElement('a');
        alink.setAttribute('href', link);
        alink.setAttribute('class', 'lbt');
        alink.appendChild(document.createTextNode('Abrir enlace'));*/
        //divMain.appendChild(alink);

        //CONTENEDOR DEL GRUPO
        let con = document.createElement('div');
        con.setAttribute('class','btn-group');
        con.setAttribute('style','width:100%');

            let bLink = document.createElement('button');
            bLink.appendChild(document.createTextNode('Abrir enlace'));
            bLink.setAttribute('onclick',"window.location.href=" + "'" + link + "'");
            bLink.setAttribute('style','width:50%');

            let bSha  = document.createElement('button');
            
            bSha.setAttribute('onclick','LauchModal("shar"); toShare=' + JSON.stringify(objToshare));
            bSha.innerHTML = 'Compartir <i class="fa fa-share-alt" style="color:white"></i>';
            bSha.setAttribute('style','width:50%');

            con.appendChild(bLink);
            con.appendChild(bSha);

        divMain.appendChild(con);

    }

    document.getElementById('notif').appendChild(divMain);
}

function toggleStyleStart(){
    if(stInicio){
        //desactivar
        document.body.style.backgroundColor = 'white';
        document.body.style.color = '';
        document.getElementById('n').style.color = '';
        document.getElementById('loginBT').style.color = 'white';
        document.getElementById('loginBT').style.backgroundColor = '#4b7f52';
        stInicio = false;
    }else{
        //activar
        document.body.style.backgroundColor = '#4b7f52';
        document.body.style.color = 'white';
        document.getElementById('n').style.color = 'white';
        document.getElementById('loginBT').style.color = '#4b7f52';
        document.getElementById('loginBT').style.backgroundColor = 'white';
        stInicio = true;
    }
    
}

function timeAgoGen(sgOld){
    let sgNow = new Date().getTime() / 1000;
    let timeDif = Math.floor(sgNow - sgOld);
    let stResult = '';
    //console.log('TIme dif start', timeDif);
    //Seg de diferencia hasta 59sg
    if((timeDif >= 0) && (timeDif <= 59)){
        //seg
        if(timeDif <= 0){
            stResult = 'Hace instantes';
        }else{
            stResult = 'Hace ' + Math.floor(timeDif) + ' seg';
        }
        
    }else{
        timeDif = Math.floor(timeDif / 60);
        //console.log('TIme dif min', timeDif);
        //Min de diferencia hasta 59
        if((timeDif >= 1) && (timeDif <= 59)){
            //Min
            if(timeDif == 1){
                stResult = 'Hace 1 min';
            }else{
                stResult = 'Hace ' + Math.floor(timeDif) + ' mins';
            }
        }else{
            timeDif = Math.floor(timeDif / 60);
           // console.log('TIme dif hrs', timeDif);
            //Hr diferencia hasta 23
            if((timeDif >= 1) && (timeDif <= 23)){
                //hrs
                if(timeDif == 1){
                    stResult = 'Hace 1 hr';
                }else{
                    stResult = 'Hace ' + Math.floor(timeDif) + ' hrs';
                }
            }else{
                timeDif = Math.floor(timeDif / 24);
                //console.log('TIme dif days', timeDif);
                //Dias diferencia
                if((timeDif >= 1) && (timeDif <= 29)){
                    //dias
                    if(timeDif == 1){
                        stResult = 'Hace un dia';
                    }else{
                        stResult = 'Hace ' + Math.floor(timeDif) + ' dias';
                    }
                }else{
                    timeDif = Math.floor(timeDif / 30);
                    //console.log('TIme dif mes', timeDif);
                    //Meses de diferencia
                    if((timeDif >= 1) && (timeDif <= 11)){
                        //month
                        if(timeDif == 1){
                            stResult = 'Hace un mes';
                        }else{
                            stResult = 'Hace ' + Math.floor(timeDif) + ' meses';
                        }
                    }else{
                        //Anos diferencia
                        timeDif = Math.floor(timeDif / 12);
                        //console.log('TIme dif ano', timeDif);
                        if((timeDif >= 1) && (timeDif <= 11)){
                            //years
                            if(timeDif == 1){
                                stResult = 'Hace un año';
                            }else{
                                stResult = 'Hace ' + Math.floor(timeDif) + ' años';
                            }
                        }
                    }
                }
            }
        }
    }

    return stResult;
}