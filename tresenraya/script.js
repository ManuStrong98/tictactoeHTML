document.addEventListener('DOMContentLoaded', () => {
    const celdas = document.querySelectorAll('.celda');
    const jugadoresDivs = document.querySelectorAll('.jugador');
    const marcadorJugador1 = document.querySelector('#j1 .marcador');
    const marcadorJugador2 = document.querySelector('#j2 .marcador');
    const mensaje = document.getElementById('smg');
    const botonContinuar = document.querySelector('.opciones button');
    const botonReiniciar = document.querySelector('.reiniciar button');

    let jugadorActual = 'X';
    let tablero = ['', '', '', '', '', '', '', '', ''];
    let puntosJugador1 = 0;
    let puntosJugador2 = 0;
    let juegoActivo = true;
    let nombreJugador1 = jugadoresDivs[0].querySelector('.nombre').textContent;
    let nombreJugador2 = jugadoresDivs[1].querySelector('.nombre').textContent;

   const COMBINACIONES_GANADORAS = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6]           
    ];

    function actualizarMarcador() {
        marcadorJugador1.textContent = puntosJugador1;
        marcadorJugador2.textContent = puntosJugador2;
    }

    function obtenerNombreJugadorActual() {
        return jugadorActual === 'X' ? nombreJugador1 : nombreJugador2;
    }

    function resaltarJugadorActual() {
        const jugador1Div = document.getElementById('j1');
        const jugador2Div = document.getElementById('j2');
    
        if (jugadorActual === 'X') {
            jugador1Div.classList.add('activo');
            jugador2Div.classList.remove('activo');
        } else {
            jugador2Div.classList.add('activo');
            jugador1Div.classList.remove('activo');
        }
    }

    function cambiarTurno() {
        jugadorActual = jugadorActual === 'X' ? 'O' : 'X';
        mensaje.textContent = `Turno de ${obtenerNombreJugadorActual()} (${jugadorActual})`;
        resaltarJugadorActual();
    }

    function verificarGanador() {
        for (let i = 0; i < COMBINACIONES_GANADORAS.length; i++) {
            const [a, b, c] = COMBINACIONES_GANADORAS[i];
            if (tablero[a] && tablero[a] === tablero[b] && tablero[a] === tablero[c]) {
                juegoActivo = false;
                const ganador = obtenerNombreJugadorActual();
                mensaje.textContent = `¡${ganador} ha ganado!`;
    
                [a, b, c].forEach(index => {
                    celdas[index].classList.add('ganadora');
                });
    
                if (tablero[a] === 'X') {
                    puntosJugador1++;
                } else {
                    puntosJugador2++;
                }
                actualizarMarcador();
                botonContinuar.style.display = 'block';
                return true;
            }
        }
    
        if (!tablero.includes('')) {
            juegoActivo = false;
            mensaje.textContent = '¡Empate!';
            botonContinuar.style.display = 'block';
            return true;
        }
    
        return false;
    }
    

    function manejarClickCelda(evento) {
        const celda = evento.target;
        const indice = Array.from(celdas).indexOf(celda);

        if (!juegoActivo || tablero[indice] !== '') {
            return;
        }

        tablero[indice] = jugadorActual;
        celda.textContent = jugadorActual;
        celda.classList.add(jugadorActual);

        if (!verificarGanador()) {
            cambiarTurno();
        }
    }

    function continuarJuego() {
        tablero = ['', '', '', '', '', '', '', '', ''];
        juegoActivo = true;
        jugadorActual = 'X';
        mensaje.textContent = `Turno de ${obtenerNombreJugadorActual()} (${jugadorActual})`;
        celdas.forEach(celda => {
            celda.textContent = '';
            celda.classList.remove('X', 'O');
            celda.classList.remove('X', 'O', 'ganadora');
        });
        botonContinuar.style.display = 'none';
        resaltarJugadorActual();
    }

    function reiniciarJuego() {
        puntosJugador1 = 0;
        puntosJugador2 = 0;
        actualizarMarcador();
        continuarJuego();
    }

    function activarEdicionNombre(jugadorId) {
        const jugadorDiv = document.getElementById(jugadorId);
        const nombreSpan = jugadorDiv.querySelector('.nombre');
        const editarBoton = jugadorDiv.querySelector('.editar-nombre');
        const inputNombre = document.createElement('input');
        inputNombre.type = 'text';
        inputNombre.value = nombreSpan.textContent;

        
        nombreSpan.style.display = 'none';
        editarBoton.style.display = 'none';

       
        jugadorDiv.insertBefore(inputNombre, nombreSpan);
        inputNombre.focus();

        
        inputNombre.addEventListener('blur', guardarNuevoNombre);
        inputNombre.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                inputNombre.blur(); 
            }
        });

        function guardarNuevoNombre() {
            const nuevoNombre = inputNombre.value.trim();
            if (nuevoNombre) {
                nombreSpan.textContent = nuevoNombre;
                if (jugadorId === 'j1') {
                    nombreJugador1 = nuevoNombre;
                } else if (jugadorId === 'j2') {
                    nombreJugador2 = nuevoNombre;
                }
                mensaje.textContent = `Turno de ${obtenerNombreJugadorActual()} (${jugadorActual})`; // Actualizar mensaje si es el turno
            }
            
            jugadorDiv.removeChild(inputNombre);
            nombreSpan.style.display = 'inline';
            editarBoton.style.display = 'inline-block';
        }
    }


    const botonesEditar = document.querySelectorAll('.editar-nombre');
    botonesEditar.forEach(boton => {
        boton.addEventListener('click', function() {
            const jugadorId = this.parentNode.id;
            activarEdicionNombre(jugadorId);
        });
    });

    celdas.forEach(celda => {
        celda.addEventListener('click', manejarClickCelda);
    });

    botonContinuar.addEventListener('click', continuarJuego);
    botonReiniciar.addEventListener('click', reiniciarJuego);

  
    mensaje.textContent = `Turno de ${obtenerNombreJugadorActual()} (${jugadorActual})`;
    botonContinuar.style.display = 'none';
    resaltarJugadorActual();
});