import hre from "hardhat";
import SubastaModules from "../ignition/modules/SubastaModules";

async function main() {
  // Obtén la cuenta que desplegará el contrato
  const [deployer] = await hre.ethers.getSigners();
  console.log("Desplegando contratos con la cuenta:", deployer.address);

  // Ejecuta el despliegue con Hardhat Ignition
  const result = await hre.ignition.deploy(SubastaModules);

  // Muestra la dirección del contrato desplegado
  const subastaAddress = await result.subasta.getAddress();
  console.log("Subasta desplegada en:", subastaAddress);

  
}

// Ejecuta el script
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});