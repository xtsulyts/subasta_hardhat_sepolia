import { ethers } from "hardhat";

async function main() {
  // Obtén el ContractFactory de tu contrato
  const Subasta = await ethers.getContractFactory("Subasta");

  // Obtén el Signer (cuenta que desplegará el contrato)
  const [deployer] = await ethers.getSigners();

  // Obtén la transacción de despliegue
  const deployTransaction = await Subasta.getDeployTransaction(3600); // Ajusta los parámetros del constructor si es necesario

  // Estima el gas necesario para desplegar el contrato
  const gasEstimate = await ethers.provider.estimateGas(deployTransaction);

  // Obtén el precio del gas desde el provider
  const feeData = await ethers.provider.getFeeData();
  const gasPrice = feeData.gasPrice || BigInt(0); // Usar BigInt para el precio del gas

  // Calcula el costo total en ETH
  const cost = gasEstimate * gasPrice; // Usar operaciones nativas de BigInt

  // Muestra el costo estimado
  console.log("Costo estimado de gas:", ethers.formatEther(cost), "ETH");
}

// Ejecuta el script
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});