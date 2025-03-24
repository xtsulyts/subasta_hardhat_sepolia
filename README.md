# subasta_hardhat_sepolia
Contrato de subasta descentralizada en Solidity. Los usuarios ofertan ETH con un 5% de incremento mínimo. La subasta se extiende 10 minutos si alguien ofrece en los últimos 10 minutos. Al finalizar, el ganador se lleva el ítem y los demás recuperan su ETH (menos 2% de comisión). Solo el creador puede finalizarla. 
