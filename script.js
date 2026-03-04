let datos = [];

// Procesar datos manuales
function procesarDatos() {
    const input = document.getElementById("inputDatos").value;

    datos = input.split(",")
        .map(n => Number(n.trim()))
        .filter(n => !isNaN(n));

    if (datos.length < 20) {
        alert("Debes ingresar mínimo 20 datos");
        return;
    }

    mostrarDatos();
}

// Generar datos aleatorios
function generarAleatorios() {
    datos = [];
    for (let i = 0; i < 20; i++) {
        datos.push(Math.floor(Math.random() * 100) + 1);
    }
    mostrarDatos();
}

// Mostrar datos actuales
function mostrarDatos() {
    document.getElementById("datosMostrados").innerHTML = datos.join(", ");
}

// ==============================
// PROCESAMIENTO ESTADÍSTICO
// ==============================

function calcularEstadisticas() {
    if (datos.length === 0) {
        alert("Primero ingresa o genera datos");
        return;
    }

    const media = calcularMedia(datos);
    const mediana = calcularMediana(datos);
    const moda = calcularModa(datos);
    const rango = calcularRango(datos);
    const varianza = calcularVarianza(datos, media);
    const desviacion = Math.sqrt(varianza);

    document.getElementById("media").innerText = media.toFixed(2);
    document.getElementById("mediana").innerText = mediana;
    document.getElementById("moda").innerText = moda;
    document.getElementById("rango").innerText = rango;
    document.getElementById("varianza").innerText = varianza.toFixed(2);
    document.getElementById("desviacion").innerText = desviacion.toFixed(2);

    generarTablaFrecuencias();   // 👈 ESTA ES LA LÍNEA CLAVE
    generarHistograma();
    generarPareto(datos);
}

// ==============================
// FUNCIONES MATEMÁTICAS
// ==============================

function calcularMedia(arr) {
    const suma = arr.reduce((a, b) => a + b, 0);
    return suma / arr.length;
}

function calcularMediana(arr) {
    const ordenados = [...arr].sort((a, b) => a - b);
    const mitad = Math.floor(ordenados.length / 2);

    if (ordenados.length % 2 === 0) {
        return (ordenados[mitad - 1] + ordenados[mitad]) / 2;
    } else {
        return ordenados[mitad];
    }
}

function calcularModa(datos) {
    let frecuencia = {};
    let maxFrecuencia = 0;
    let moda = null;

    datos.forEach(num => {
        frecuencia[num] = (frecuencia[num] || 0) + 1;

        if (frecuencia[num] > maxFrecuencia) {
            maxFrecuencia = frecuencia[num];
            moda = num;
        }
    });

    // Si nadie se repite → no hay moda
    if (maxFrecuencia === 1) {
        return "No hay moda";
    }

    return moda;
}

function calcularRango(arr) {
    return Math.max(...arr) - Math.min(...arr);
}

function calcularVarianza(arr, media) {
    const suma = arr.reduce((acc, num) => acc + Math.pow(num - media, 2), 0);
    return suma / arr.length;
}


function generarTablaFrecuencias() {
    if (datos.length === 0) return;

    let conteo = {};
    datos.forEach(n => {
        conteo[n] = (conteo[n] || 0) + 1;
    });

    let valores = Object.keys(conteo).map(Number).sort((a, b) => a - b);

    let tbody = document.getElementById("tablaFrecuencias");
    tbody.innerHTML = "";

    let acumulada = 0;

    valores.forEach(valor => {
        let f = conteo[valor];
        acumulada += f;

        let fr = (f / datos.length).toFixed(2);
        let porcentaje = (fr * 100).toFixed(2) + "%";

        let fila = `
            <tr>
                <td>${valor}</td>
                <td>${f}</td>
                <td>${acumulada}</td>
                <td>${fr}</td>
                <td>${porcentaje}</td>
            </tr>
        `;

        tbody.innerHTML += fila;
    });
}



function generarHistograma() {
    if (datos.length === 0) return;

    const clases = 5;
    const min = Math.min(...datos);
    const max = Math.max(...datos);
    const rango = max - min;
    const amplitud = Math.ceil(rango / clases);

    let intervalos = [];
    let frecuencias = Array(clases).fill(0);

    for (let i = 0; i < clases; i++) {
        let inicio = min + i * amplitud;
        let fin = inicio + amplitud;
        intervalos.push(`${inicio} - ${fin}`);
    }

    datos.forEach(n => {
        let indice = Math.floor((n - min) / amplitud);
        if (indice >= clases) indice = clases - 1;
        frecuencias[indice]++;
    });

    const ctx = document.getElementById("histograma").getContext("2d");

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: intervalos,
            datasets: [{
                label: 'Frecuencia',
                data: frecuencias
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });

    generarBarras(intervalos, frecuencias);
    generarPoligono(intervalos, frecuencias);
    generarOjiva(intervalos, frecuencias);
    
}



function generarBarras(intervalos, frecuencias) {
    const ctx = document.getElementById("barras").getContext("2d");

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: intervalos,
            datasets: [{
                label: 'Frecuencia',
                data: frecuencias
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}



function generarPoligono(intervalos, frecuencias) {
    const ctx = document.getElementById("poligono").getContext("2d");

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: intervalos,
            datasets: [{
                label: 'Frecuencia',
                data: frecuencias,
                fill: false,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

function generarOjiva(intervalos, frecuencias) {

    let acumuladas = [];
    let suma = 0;

    frecuencias.forEach(f => {
        suma += f;
        acumuladas.push(suma);
    });

    const ctx = document.getElementById("ojiva").getContext("2d");

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: intervalos,
            datasets: [{
                label: 'Frecuencia Acumulada',
                data: acumuladas,
                fill: false,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

let graficaPareto;

function generarPareto(datos) {

    if (datos.length === 0) return;

    let conteo = {};
    datos.forEach(n => {
        conteo[n] = (conteo[n] || 0) + 1;
    });

    let pares = Object.entries(conteo)
        .sort((a, b) => b[1] - a[1]);

    let etiquetas = pares.map(p => p[0]);
    let frecuencias = pares.map(p => p[1]);

    let total = datos.length;
    let acumulado = 0;
    let acumulados = frecuencias.map(f => {
        acumulado += f;
        return (acumulado / total) * 100;
    });

    const ctx = document.getElementById("pareto");

    if (graficaPareto) {
        graficaPareto.destroy();
    }

    graficaPareto = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: etiquetas,
            datasets: [
                {
                    label: 'Frecuencia',
                    data: frecuencias,
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    yAxisID: 'y-axis-1'
                },
                {
                    type: 'line',
                    label: 'Acumulado %',
                    data: acumulados,
                    borderColor: 'red',
                    fill: false,
                    yAxisID: 'y-axis-2'
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                yAxes: [
                    {
                        id: 'y-axis-1',
                        type: 'linear',
                        position: 'left',
                        ticks: {
                            beginAtZero: true
                        }
                    },
                    {
                        id: 'y-axis-2',
                        type: 'linear',
                        position: 'right',
                        ticks: {
                            beginAtZero: true,
                            max: 100
                        },
                        gridLines: {
                            drawOnChartArea: false
                        }
                    }
                ]
            }
        }
    });
}



function calcularConjuntos() {

    let A = document.getElementById("conjuntoA").value
        .split(",")
        .map(x => x.trim())
        .filter(x => x !== "");

    let B = document.getElementById("conjuntoB").value
        .split(",")
        .map(x => x.trim())
        .filter(x => x !== "");

    let union = [...new Set([...A, ...B])];

    let interseccion = A.filter(x => B.includes(x));

    let diferencia = A.filter(x => !B.includes(x));

    document.getElementById("union").innerText = union.length ? union.join(", ") : "∅";
    document.getElementById("interseccion").innerText = interseccion.length ? interseccion.join(", ") : "∅";
    document.getElementById("diferencia").innerText = diferencia.length ? diferencia.join(", ") : "∅";
}


function calcularProbabilidad() {

    let total = parseFloat(document.getElementById("totalCasos").value);
    let favorables = parseFloat(document.getElementById("casosFavorables").value);

    if (total <= 0 || favorables < 0 || favorables > total) {
        alert("Valores inválidos");
        return;
    }

    let prob = favorables / total;
    let complemento = 1 - prob;

    document.getElementById("probSimple").innerText = prob.toFixed(4);
    document.getElementById("probComplemento").innerText = complemento.toFixed(4);
}






function calcularMultiplicacion() {

    let A = parseFloat(document.getElementById("probA").value);
    let B = parseFloat(document.getElementById("probB").value);

    if (A < 0 || A > 1 || B < 0 || B > 1) {
        alert("Las probabilidades deben estar entre 0 y 1");
        return;
    }

    let resultado = A * B;

    document.getElementById("resultadoMultiplicacion").innerText = resultado.toFixed(4);
}



function dibujarArbol() {

    let A = parseFloat(document.getElementById("probA").value);
    let B = parseFloat(document.getElementById("probB").value);

    if (A < 0 || A > 1 || B < 0 || B > 1) {
        alert("Las probabilidades deben estar entre 0 y 1");
        return;
    }

    const canvas = document.getElementById("arbolCanvas");
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "14px Arial";

    // Punto inicial
    ctx.fillText("Inicio", 50, 150);

    // Rama A
    ctx.beginPath();
    ctx.moveTo(100, 150);
    ctx.lineTo(250, 80);
    ctx.stroke();
    ctx.fillText("A (" + A + ")", 260, 80);

    // Rama No A
    ctx.beginPath();
    ctx.moveTo(100, 150);
    ctx.lineTo(250, 220);
    ctx.stroke();
    ctx.fillText("No A (" + (1 - A).toFixed(2) + ")", 260, 220);

    // Desde A → B
    ctx.beginPath();
    ctx.moveTo(350, 80);
    ctx.lineTo(500, 50);
    ctx.stroke();
    ctx.fillText("B (" + B + ") → " + (A * B).toFixed(4), 510, 50);

    // Desde A → No B
    ctx.beginPath();
    ctx.moveTo(350, 80);
    ctx.lineTo(500, 110);
    ctx.stroke();
    ctx.fillText("No B (" + (1 - B).toFixed(2) + ") → " + (A * (1 - B)).toFixed(4), 510, 110);

    // Desde No A → B
    ctx.beginPath();
    ctx.moveTo(350, 220);
    ctx.lineTo(500, 190);
    ctx.stroke();
    ctx.fillText("B (" + B + ") → " + ((1 - A) * B).toFixed(4), 510, 190);

    // Desde No A → No B
    ctx.beginPath();
    ctx.moveTo(350, 220);
    ctx.lineTo(500, 250);
    ctx.stroke();
    ctx.fillText("No B (" + (1 - B).toFixed(2) + ") → " + ((1 - A) * (1 - B)).toFixed(4), 510, 250);
}

function factorial(num) {
    if (num === 0 || num === 1) return 1;
    let resultado = 1;
    for (let i = 2; i <= num; i++) {
        resultado *= i;
    }
    return resultado;
}




function calcularPermComb() {

    let n = parseInt(document.getElementById("nPerm").value);
    let r = parseInt(document.getElementById("rPerm").value);

    if (isNaN(n) || isNaN(r) || n < 0 || r < 0 || r > n) {
        alert("Valores inválidos");
        return;
    }

    let permutaciones = factorial(n) / factorial(n - r);
    let combinaciones = factorial(n) / (factorial(r) * factorial(n - r));

    document.getElementById("resultadoPerm").innerText = permutaciones;
    document.getElementById("resultadoComb").innerText = combinaciones;
}