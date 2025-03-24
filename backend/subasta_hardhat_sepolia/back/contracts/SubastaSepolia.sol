/**
 *Submitted for verification at sepolia.scrollscan.com on 2024-11-11
*/

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract Subasta {
    // Variables de estado
    address public propietario;
    uint256 public tiempoFinalizacion;
    bool public subastaActiva;
    uint256 public porcentajeIncremento = 5; // Incremento mínimo del 5% para superar la mejor oferta
    uint256 public comisionGas = 2; // Comisión del 2% para devolver depósitos
    uint256 public duracionSubasta; // Nueva variable de estado

    // Mapping para almacenar las ofertas anteriores
    mapping(address => uint256) private ofertas; // Mapea las direcciones a sus últimas ofertas
    address private mejorOfertante;
    uint256 private mejorOferta;

    // Eventos
    event NuevaOferta(address ofertante, uint256 cantidad);
    event SubastaFinalizada(address ganador, uint256 cantidad);

    // Constructor: inicializa la subasta con la duración y activa la subasta
    constructor(uint256 _duracionSubasta) {
        propietario = msg.sender;
        duracionSubasta = _duracionSubasta; // Almacena la duración
        tiempoFinalizacion = block.timestamp + _duracionSubasta;
        subastaActiva = true;
    }

    // Modificador para asegurar que solo el propietario puede ejecutar ciertas funciones
    modifier soloPropietario() {
        require(msg.sender == propietario, "Solo el propietario puede realizar esta accion");
        _;
    }

    // Modificador para asegurar que la subasta esté activa
    modifier soloMientrasActiva() {
        require(subastaActiva, "La subasta ya ha finalizado");
        require(block.timestamp <= tiempoFinalizacion, "El tiempo de la subasta ha expirado");
        _;
    }

    // Función para ofertar
    function ofertar() public payable soloMientrasActiva {
        require(msg.value >= mejorOferta + (mejorOferta * porcentajeIncremento / 100), 
                "La oferta debe ser al menos un 5% superior a la oferta actual");

        // Devolver el saldo al mejor ofertante anterior (solo se acumula su saldo original)
        if (mejorOfertante != address(0) && mejorOfertante != msg.sender) {
            ofertas[mejorOfertante] += mejorOferta; // Almacenar la oferta anterior para que pueda ser retirada
        }

        // Registrar la nueva oferta y ofertante
        mejorOfertante = msg.sender; // El nuevo ofertante es el que hace la oferta actual
        mejorOferta = msg.value; // La nueva oferta es el valor enviado en la transacción
        ofertas[msg.sender] = msg.value;  // Registrar la nueva oferta del ofertante

        // Extender el plazo si la oferta se realiza dentro de los últimos 10 minutos
        if (tiempoFinalizacion - block.timestamp <= 10 minutes) {
            tiempoFinalizacion += 10 minutes;
        }

        emit NuevaOferta(msg.sender, msg.value);
    }

    // Función para devolver depósitos a los participantes no ganadores
    function devolverDepositos() public {
        // Verificar que la subasta haya finalizado y que la cuenta no sea el mejor ofertante
        require(!subastaActiva, "La subasta debe haber finalizado");
        require(msg.sender != mejorOfertante, "El ganador no puede retirar el deposito");

        uint256 monto = ofertas[msg.sender]; // Obtener la última oferta realizada por el participante
        require(monto > 0, "No tienes fondos para retirar");

        // Descontar la comisión del 2% para el gas
        uint256 comision = (monto * comisionGas) / 100;
        uint256 montoADevolver = monto - comision;

        ofertas[msg.sender] = 0; // Evitar reentradas y limpiar el registro de la oferta

        // Transferir el monto descontado de la comisión
        payable(msg.sender).transfer(montoADevolver);
    }

    // Función para finalizar la subasta
    function finalizarSubasta() public soloPropietario {
        require(block.timestamp >= tiempoFinalizacion, "La subasta no ha terminado aun");
        subastaActiva = false;

        emit SubastaFinalizada(mejorOfertante, mejorOferta);
    }

    // Función para mostrar el ganador y la oferta ganadora
    function mostrarGanador() public view returns (address, uint256) {
        require(!subastaActiva, "La subasta aun esta en curso");
        return (mejorOfertante, mejorOferta);
    }

    // Función para mostrar la oferta ganadora
    function ofertaGanadora() public view returns (address ganador, uint256 oferta) {
        ganador = mejorOfertante;
        oferta = mejorOferta;
    }

    
}