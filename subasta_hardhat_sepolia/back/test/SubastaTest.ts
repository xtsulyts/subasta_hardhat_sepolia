import { ethers } from "hardhat";
import { expect } from "chai";
import { any } from "hardhat/internal/core/params/argumentTypes";


describe("Subasta", function () {
  let subasta: any;
  let owner: any;
  let ofertante1: any;
  let ofertante2: any;


  before(async function () {
    // Obtener las cuentas de prueba
    [owner, ofertante1, ofertante2] = await ethers.getSigners();

    // Imprimir las direcciones de owner y ofertante1
    console.log("Owner:", owner.address);
    console.log("Ofertante1:", ofertante1.address);
    console.log("Ofertante2:", ofertante2.address)
    console.log("")
    console.log("=====TEST DE PRUEBAS=====")



    // Desplegar el contrato con el argumento del constructor
    const Subasta = await ethers.getContractFactory("Subasta");
    const duracionSubasta = 7200; // Por ejemplo, 1 hora en segundos
    subasta = await Subasta.deploy(duracionSubasta);
    await subasta.waitForDeployment(); // Esperar a que el contrato esté desplegado
  });

  it("0- Debería asignar correctamente al propietario", async function () {
    // Obtener la dirección del propietario desde el contrato
    const direccionPropietarioContrato = await subasta.propietario();
    
    // Obtener la dirección del owner (desplegador)
    const direccionOwner = await owner.getAddress();
    
    // Comparar direcciones (ambas deben ser strings en lowercase)
    expect(direccionPropietarioContrato.toLowerCase()).to.equal(direccionOwner.toLowerCase());
    
    // Opcional: Mostrar en consola para debugging
    console.log("0 - Dirección  del pripietario en contrato:", direccionPropietarioContrato);
    //console.log("Dirección del owner:", direccionOwner);
  });

  it("1- Debe desplegar el contrato correctamente:", async function () {
    expect(await subasta.getAddress()).to.not.be.undefined;
    console.log("1 - Datos de despliegue: ", owner)
  });

  it("2- Debe establecer la duración de la subasta correctamente", async function () {
    const duracion = await subasta.duracionSubasta(); // Usar el getter generado automáticamente
    expect(duracion).to.equal(7200); // Verificar que la duración sea la correcta
    console.log("2 -Tiempo de duracin:", duracion)
  });

  it("3- Debe establecer el tiempo de finalización correctamente", async function () {
    const tiempoFinalizacion = await subasta.tiempoFinalizacion();
    const block = await ethers.provider.getBlock("latest"); // Obtener el bloque más reciente
    expect(tiempoFinalizacion).to.equal(block.timestamp + 7200); // Verificar el tiempo de finalización
    console.log("3- Tiempo de finalizacion:", tiempoFinalizacion)
  });

  it("4- Debe activar la subasta correctamente", async function () {
    const subastaActiva = await subasta.subastaActiva();
    expect(subastaActiva).to.be.true; // Verificar que la subasta esté activa
    console.log("4- Si es estado de la subasta es activa === ", subastaActiva)
  });

  // Aquí puedes agregar más pruebas

  // it("5 -Debe permitir ofertar mientras la subasta esté activa", async function () {
  //   // Intentar hacer una oferta válida (1 ETH)
  //   const tx = await expect(
  //     subasta.connect(ofertante1).ofertar({ value: ethers.parseEther("1.0") })
  //   ).to.emit(subasta, "NuevaOferta").withArgs(ofertante1.address, ethers.parseEther("1.0"));
  
    
  // });
  it("5 - Debe permitir ofertar mientras la subasta esté activa", async function () {
    // 1. Estado ANTES de la oferta
    console.log("\n5-  === Estado INICIAL 1er OFERTA ===");
    console.log("Subasta activa?:", await subasta.subastaActiva());
    console.log("Tiempo restante:", (await subasta.tiempoFinalizacion()) - BigInt(Math.floor(Date.now()/1000)), "segundos");
    
    const [mejorOfertantePre, mejorOfertaPre] = await subasta.ofertaGanadora();
    console.log(`Mejor oferta previa: ${ethers.formatEther(mejorOfertaPre)} ETH de ${mejorOfertantePre}`);
  
    // 2. Ejecutar oferta
    const valorOferta = ethers.parseEther("1.0");
    console.log("\nEjecutando 1er oferta de", ethers.formatEther(valorOferta), "ETH...");
    
    const tx = await subasta.connect(ofertante1).ofertar({ value: valorOferta });
    
    // 3. Estado DESPUÉS de la oferta
    console.log("\n=== Estado FINAL 1er OFERTA ===");
    console.log("Transacción hash:", tx.hash);
    
    const [mejorOfertantePost, mejorOfertaPost] = await subasta.ofertaGanadora();
    console.log(`Nueva mejor oferta: ${ethers.formatEther(mejorOfertaPost)} ETH de ${mejorOfertantePost}`);
    
    // 4. Verificación del evento
    await expect(tx)
      .to.emit(subasta, "NuevaOferta")
      .withArgs(ofertante2.address, valorOferta);
  });
  
  it("6 - Segunda oferta mientras la subasta esté activa", async function () {
    // 1. Estado ANTES de la oferta
    console.log("\n6- === Estado INICIAL ===");
    console.log("Subasta activa?:", await subasta.subastaActiva());
    console.log("Tiempo restante:", (await subasta.tiempoFinalizacion()) - BigInt(Math.floor(Date.now()/1000)), "segundos");
    
    const [mejorOfertantePre, mejorOfertaPre] = await subasta.ofertaGanadora();
    console.log(`Mejor oferta previa: ${ethers.formatEther(mejorOfertaPre)} ETH de ${mejorOfertantePre}`);
  
    // 2. Ejecutar oferta
    const valorOferta = ethers.parseEther("2.1");
    console.log("\nEjecutando 2da oferta de", ethers.formatEther(valorOferta), "ETH...");
    
    const tx = await subasta.connect(ofertante1).ofertar({ value: valorOferta });
    
    // 3. Estado DESPUÉS de la oferta
    console.log("\n=== Estado FINAL ===");
    console.log("Transacción hash:", tx.hash);
    
    const [mejorOfertantePost, mejorOfertaPost] = await subasta.ofertaGanadora();
    console.log(`Nueva mejor oferta: ${ethers.formatEther(mejorOfertaPost)} ETH de ${mejorOfertantePost}`);
    
    // 4. Verificación del evento
    await expect(tx)
      .to.emit(subasta, "NuevaOferta")
      .withArgs(ofertante1.address, valorOferta);
  });
  
  it("7 - Tercer  oferta mientras la subasta esté activa", async function () {
    // 1. Estado ANTES de la oferta
    console.log("\n7- === Estado INICIAL 3er OFERTA ===");
    console.log("Subasta activa?:", await subasta.subastaActiva());
    console.log("Tiempo restante:", (await subasta.tiempoFinalizacion()) - BigInt(Math.floor(Date.now()/1000)), "segundos");
    
    const [mejorOfertantePre, mejorOfertaPre] = await subasta.ofertaGanadora();
    console.log(`Mejor oferta previa: ${ethers.formatEther(mejorOfertaPre)} ETH de ${mejorOfertantePre}`);
  
    // 2. Ejecutar oferta
    const valorOferta = ethers.parseEther("4.1");
    console.log("\nEjecutando 3er oferta de", ethers.formatEther(valorOferta), "ETH...");
    
    const tx = await subasta.connect(ofertante1).ofertar({ value: valorOferta });
    
    // 3. Estado DESPUÉS de la oferta
    console.log("\n=== Estado FINAL ===");
    console.log("Transacción hash:", tx.hash);
    
    const [mejorOfertantePost, mejorOfertaPost] = await subasta.ofertaGanadora();
    console.log(`Nueva mejor oferta: ${ethers.formatEther(mejorOfertaPost)} ETH de ${mejorOfertantePost}`);
    
    // 4. Verificación del evento
    await expect(tx)
      .to.emit(subasta, "NuevaOferta")
      .withArgs(ofertante1.address, valorOferta);
  });
  // it("Debe revertir si la subasta ha finalizado manualmente", async function () {
  //   // Avanzar el tiempo más allá del tiempo de finalización
  //   await ethers.provider.send("evm_increaseTime", [7201]); // Avanzar 1 segundo más que la duración
  //   await ethers.provider.send("evm_mine"); // Minar un nuevo bloque para aplicar el cambio de tiempo
  
  //   // Finalizar la subasta manualmente
  //   await subasta.connect(owner).finalizarSubasta();
  
  //   // Intentar hacer una oferta después de finalizar la subasta
  //   await expect(
  //     subasta.connect(ofertante1).ofertar({ value: ethers.parseEther("1.0") })
  //   ).to.be.revertedWith("La subasta ya ha finalizado");
  //   // console.log(subasta)
  // });

  it("Debe mostrar los detalles del bloque minado", async function () {
    // Minar un nuevo bloque
    await ethers.provider.send("evm_mine");
  
    // Obtener el bloque más reciente
    const block = await ethers.provider.getBlock("latest");
  
    // Mostrar los detalles del bloque en la consola
    console.log("Bloque minado:");
    console.log("- Número de bloque:", block.number);
    console.log("- Timestamp:", block.timestamp);
    console.log("- Hash:", block.hash);
    console.log("- Transacciones:", block.transactions);
  });

  // it("Debe aceptar una oferta válida y emitir el evento NuevaOferta", async function () {
  //   const ofertaInicial = ethers.parseEther("1.0");

  
  //    // Mostrar detalles antes de hacer la oferta
  //    console.log("Antes de la primera oferta:");
  //    console.log("- Mejor oferta actual:", await subasta.mejorOferta());
  //    console.log("- Mejor ofertante actual:", await subasta.mejorOfertante());
  //    console.log("- Saldo de ofertante1:", await ethers.provider.getBalance(ofertante1.address));

  //    // Verificar que la subasta esté activa
  //    const subastaActiva = await subasta.subastaActiva();
  //    expect(subastaActiva).to.be.true;
  //    console.log("la subasta esta actiiva?;", subastaActiva)
 
  //    // Verificar que el tiempo de finalización no haya expirado
  //    const tiempoFinalizacion = await subasta.tiempoFinalizacion();
  //    const block = await ethers.provider.getBlock("latest");
  //    expect(block.timestamp).to.be.lessThan(tiempoFinalizacion);
  //    console.log("Cuanto falta para la finalizaion:", tiempoFinalizacion)

  //   // Hacer una oferta válida
  //   await expect(
  //     subasta.connect(ofertante1).ofertar({ value: ofertaInicial })
  //   ).to.emit(subasta, "NuevaOferta").withArgs(ofertante1.address, ofertaInicial);

  //   // Verificar que la mejor oferta y el mejor ofertante se actualizaron correctamente
  //   const mejorOfertante = await subasta.mejorOfertante();
  //   const mejorOferta = await subasta.mejorOferta();
    
  //   expect(mejorOfertante).to.equal(ofertante1.address);
  //   expect(mejorOferta).to.equal(ofertaInicial);
  // });

  // it("Debe devolver el saldo al mejor ofertante anterior", async function () {
  //   const ofertaInicial = ethers.parseEther("1.0");
  //   const ofertaSuperior = ethers.parseEther("2.00"); // 5% superior a la oferta inicial

  //   // Hacer una oferta inicial
  //   await subasta.connect(ofertante1).ofertar({ value: ofertaInicial });

  //   // Hacer una oferta superior
  //   await subasta.connect(ofertante2).ofertar({ value: ofertaSuperior });

  //   // Verificar que el saldo de ofertante1 se incrementó
  //   const saldoOfertante1 = await subasta.ofertas(ofertante1.address);
  //   expect(saldoOfertante1).to.equal(ofertaInicial);
  // });

  // it("Debe extender el plazo si la oferta se realiza dentro de los últimos 10 minutos", async function () {
  //   const ofertaInicial = ethers.parseEther("1.0");

  //   // Avanzar el tiempo a 9 minutos antes de la finalización
  //   await ethers.provider.send("evm_increaseTime", [3600 - 600]); // 3600 - 600 = 3000 segundos
  //   await ethers.provider.send("evm_mine");

  //   // Hacer una oferta dentro de los últimos 10 minutos
  //   await subasta.connect(ofertante1).ofertar({ value: ofertaInicial });

  //   // Verificar que el tiempo de finalización se extendió en 10 minutos
  //   const tiempoFinalizacion = await subasta.tiempoFinalizacion();
  //   const block = await ethers.provider.getBlock("latest");
  //   expect(tiempoFinalizacion).to.equal(block.timestamp + 600); // 600 segundos = 10 minutos
  // });

  // it("Debe revertir si la oferta no es al menos un 5% superior a la mejor oferta actual", async function () {
  //   const ofertaInicial = ethers.parseEther("1.0");
  //   const ofertaInvalida = ethers.parseEther("1.05"); // Menos del 5% superior

  //   // Hacer una oferta inicial
  //   await subasta.connect(ofertante1).ofertar({ value: ofertaInicial });

  //   // Intentar hacer una oferta inválida
  //   await expect(
  //     subasta.connect(ofertante2).ofertar({ value: ofertaInvalida })
  //   ).to.be.revertedWith("La oferta debe ser al menos un 5% superior a la oferta actual");
  // });
  
  // it("Debe aceptar la primera oferta y mostrar detalles", async function () {
  //   const ofertaInicial = ethers.parseEther("1.0");

  //   // Mostrar detalles antes de hacer la oferta
  //   console.log("Antes de la primera oferta:");
  //   console.log("- Mejor oferta actual:", await subasta.mejorOferta());
  //   console.log("- Mejor ofertante actual:", await subasta.mejorOfertante());
  //   console.log("- Saldo de ofertante1:", await ethers.provider.getBalance(ofertante1.address));

  //   // Hacer la primera oferta
  //   await expect(
  //     subasta.connect(ofertante1).ofertar({ value: ofertaInicial })
  //   ).to.emit(subasta, "NuevaOferta").withArgs(ofertante1.address, ofertaInicial);

  //   // Mostrar detalles después de hacer la oferta
  //   console.log("Después de la primera oferta:");
  //   console.log("- Mejor oferta actual:", await subasta.mejorOferta());
  //   console.log("- Mejor ofertante actual:", await subasta.mejorOfertante());
  //   console.log("- Saldo de ofertante1:", await ethers.provider.getBalance(ofertante1.address));
  // });
});

