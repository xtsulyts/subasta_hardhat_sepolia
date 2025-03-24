

## 📌 Descripción
Contrato de subasta descentralizada donde:
- Los participantes hacen ofertas en ETH con **5% de incremento mínimo**
- El tiempo se extiende **10 minutos** si alguien ofrece en los últimos 10 minutos
- Al finalizar, el ganador recibe el ítem y los demás recuperan su ETH (menos **2% de comisión**)
- Solo el creador puede finalizar la subasta

## 📦 Funcionalidades
✅ Ofertas con incremento mínimo del 5%  
✅ Extensión automática del tiempo  
✅ Reembolsos con comisión del 2%  
✅ Seguridad contra reentradas  
✅ Eventos para tracking  

## 🛠️ Tecnologías
- Solidity (^0.8.26)
- Hardhat (Testing)
- TypeScript

## 🔍 Variables Clave
```solidity
address public propietario;
uint256 public tiempoFinalizacion; 
bool public subastaActiva;
uint256 public porcentajeIncremento = 5;
uint256 public comisionGas = 2;
```

## 📜 Métodos Principales
```
function ofertar() public payable;
function devolverDepositos() public;
function finalizarSubasta() public;
function mostrarGanador() public view returns (address, uint256);
```

## 🧪 Testing
Pruebas incluyen:

Validación de ofertas

Extensión de tiempo

Finalización correcta

Reembolsos

Ejecutar pruebas:

```
npx hardhat test
```

## ⚠️ Requisitos
Hardhat configurado

Node.js v16+

📄 Licencia
MIT


