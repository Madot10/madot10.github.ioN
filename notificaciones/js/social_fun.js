//MODAL SYSTEM
var moig, mosha;
var toShare = {};

window.onload = function () {
    moig = document.getElementById('IgModal');
    mosha = document.getElementById('ShareModal');

    //chequeamos si es ig navegador
    var IsIG = navigator.userAgent.toLowerCase().indexOf("instagram");
    if (IsIG != -1) {
        // alert("Abierto desde IG");
        LauchModal("ig");
    }
}

function OnClickGa(act, typeInter , lb){
    //si existe etiqueta hacer:
    //console.log('LB', lb)
    if(lb){
        //console.log('enter');
        gtag('event', act, {
            'event_category': typeInter + "Interaccion",
            'event_label': lb
          });
    }else{
        //console.log('not enter');
        gtag('event', act, {
            'event_category': typeInter + "Interaccion"
          });
    }
    
}

//open modals segun string
function LauchModal(tModal) {
    switch (tModal) {
        case "ig":
            moig.style.display = "block";
            break;
        case 'shar':
            mosha.style.display = 'block';
            break;

        default:
            break;
    }
}

// When the user clicks on <span> (x), close the modal
function closeModal(tModal) {
    switch (tModal) {
        case "ig":
            moig.style.display = "none";
            break;

        case 'shar':
            mosha.style.display = 'none';
            break;

        default:
            break;
    }

}

function generateLink(redS) {
    OnClickGa('shareTo'+ redS, 'Social' , 'sharing: ' + JSON.stringify(toShare));
    switch (redS) {
        case 'tw':
            //TWitter
            linka = 'https://www.facebook.com/sharer/sharer.php?u=https%3A//madot10.github.io/notificaciones';
            if (toShare.link) {
                linka = toShare.link;
            }
            let contTo = toShare.titulo + ' Lee más en: ' + linka;
            let newCont = encodeURIComponent(contTo);
            url = 'https://twitter.com/home?status=' + newCont;
            //abrir en nueva ventana
            window.open(url, '_blank');
            break;

        case 'fb':
            //Facebook
            linka = 'https://www.facebook.com/sharer/sharer.php?u=https%3A//madot10.github.io/notificaciones';
            window.open(linka, '_blank');
            break;

        case 'em':
            //EMAIL
            let asunto = 'N+ => ' + toShare.titulo;
            let cuerpo = toShare.body + ' \n ' + 'Fuente: ' + toShare.link + ' \n ' + 'NOTIFICACIONES+ ' + 'https://madot10.github.io/notificaciones';
            url = 'mailto:?&subject=' + encodeURIComponent(asunto) + '&body=' + encodeURIComponent(cuerpo);
            window.open(url, '_blank');
            break;

        case 'wp':
            //What
            let WHcont = toShare.titulo + ' \n ' + toShare.body + ' \n ' + 'Link: ' + toShare.link + ' \n ' + 'NOTIFICACIONES+ ' + 'https://madot10.github.io/notificaciones';
            encodeCont = encodeURI(WHcont);
            let a = document.createElement('a');
            a.style = { position: 'absolute', left: '-9999px' };
            a.href = "whatsapp://send?text=" + encodeCont;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            break;

        case 'cy':
            //COPY
            let cont = toShare.titulo + ' \n ' + toShare.body + ' \n ' + 'Link: ' + toShare.link + ' \n ' + 'NOTIFICACIONES+ ' + 'https://madot10.github.io/notificaciones';
            copyStringToClipboard(cont);
            msgSnack('¡Copiado!');
            break;

        default:
            break;
    }
    closeModal('shar');
}

function copyStringToClipboard(str) {
    // Create new element
    var el = document.createElement('textarea');
    // Set value (string to be copied)
    el.value = str;
    // Set non-editable to avoid focus and move outside of view
    el.setAttribute('readonly', '');
    el.style = { position: 'absolute', left: '-9999px' };
    document.body.appendChild(el);
    // Select text inside element
    el.select();
    // Copy text to clipboard
    document.execCommand('copy');
    // Remove temporary element
    document.body.removeChild(el);
}

function getAllUrlParams(url) {

    // get query string from url (optional) or window
    var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

    // we'll store the parameters here
    var obj = {};

    // if query string exists
    if (queryString) {

        // stuff after # is not part of query string, so get rid of it
        queryString = queryString.split('#')[0];

        // split our query string into its component parts
        var arr = queryString.split('&');

        for (var i = 0; i < arr.length; i++) {
            // separate the keys and the values
            var a = arr[i].split('=');

            // in case params look like: list[]=thing1&list[]=thing2
            var paramNum = undefined;
            var paramName = a[0].replace(/\[\d*\]/, function (v) {
                paramNum = v.slice(1, -1);
                return '';
            });

            // set parameter value (use 'true' if empty)
            var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

            // (optional) keep case consistent
            paramName = paramName.toLowerCase();
            paramValue = paramValue.toLowerCase();

            // if parameter name already exists
            if (obj[paramName]) {
                // convert value to array (if still string)
                if (typeof obj[paramName] === 'string') {
                    obj[paramName] = [obj[paramName]];
                }
                // if no array index number specified...
                if (typeof paramNum === 'undefined') {
                    // put the value on the end of the array
                    obj[paramName].push(paramValue);
                }
                // if array index number specified...
                else {
                    // put the value at that index number
                    obj[paramName][paramNum] = paramValue;
                }
            }
            // if param name doesn't exist yet, set it
            else {
                obj[paramName] = paramValue;
            }
        }
    }

    return obj;
}

var IsIG = navigator.userAgent.toLowerCase().indexOf("instagram");
if (IsIG != -1) {
    // alert("Abierto desde IG");
    LauchModal("ig");
}

