// Función para calcular los días transcurridos entre dos fechas
function DiasPasados() {
    f1 = '28/02/2018';

    let today = new Date();
    f2 = today.getDate() + '/' + (today.getMonth()+1) + '/' + today.getFullYear(); 

    let aFecha1 = f1.split('/');
    let aFecha2 = f2.split('/');

    let fFecha1 = Date.UTC(aFecha1[2], aFecha1[1] - 1, aFecha1[0]);
    let fFecha2 = Date.UTC(aFecha2[2], aFecha2[1] - 1, aFecha2[0]);

    let dif = fFecha2 - fFecha1;
    let dias = Math.floor(dif / (1000 * 60 * 60 * 24));
    console.log(dias);
    document.getElementById('days').innerHTML = dias;
}

DiasPasados();