import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


// Definimos el módulo SubastaModule
export default buildModule("SubastaModule", (m) => {
   // 1. Mensaje inicial
   console.log("\n🚀 Iniciando despliegue en Sepolia...");
  // Parámetros de configuración de la subasta
  const duracionSubasta = m.getParameter("duracionSubasta", 1576800); // Duración de la subasta en segundos (por defecto: 1 anio)

  
  // Desplegar el contrato de subasta
  const subasta = m.contract("Subasta", [duracionSubasta]);

  // Retornamos el contrato desplegado para que esté disponible en otros módulos o scripts
  return { subasta };
  
  
}); 


