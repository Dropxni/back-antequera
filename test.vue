<template>
    <div class="caja-view">
      <h1 class="titulo">🪙Caja de Cobro</h1>

<div v-if="mostrarModalCambio" class="modal-overlay">
  <div class="modal-contenido">
    <h3>🪙 Ingresar cambio inicial en caja</h3>
    
    <input
      v-model.number="cambioInicial"
      type="number"
      min="1"
      step="0.01"
      placeholder="Ej. 500.00"
      class="input-cambio"
    />

    <div class="modal-botones">
      <button class="btn-confirmar" @click="guardarCambioInicial">
        Guardar
      </button>
    </div>
  </div>
</div>


      <!-- ALERTA GENERAL -->
      <div v-if="alerta.visible" :class="['alerta-general', alerta.tipo]">
        {{ alerta.mensaje }}
      </div>

      <!-- MODAL DE CONFIRMACIÓN -->
      <div v-if="modalVisible" class="modal-overlay">
        <div class="modal-contenido">
          <p>¿Eliminar "<strong>{{ itemAEliminar?.nombre }}</strong>" del carrito?</p>
          <div class="modal-botones">
            <button @click="confirmarEliminacion(true)" class="btn-confirmar">Sí</button>
            <button @click="confirmarEliminacion(false)" class="btn-cancelar">Cancelar</button>
          </div>
        </div>
      </div>

      <!-- Buscar producto -->
      <section class="productos">
        <h2>Buscar producto por nombre</h2>
        <input
          v-model="busquedaProducto"
          type="text"
          placeholder="Escribe el nombre del producto"
          class="input-busqueda"
        />
        <div
          v-for="(producto, index) in productosFiltrados"
          :key="producto.id + '-' + index"
          class="producto-card"
        >
          <div class="info-producto">
            <img
              v-if="producto.imagen"
              :src="producto.imagen"
              alt="Imagen producto"
              class="imagen-producto"
            />
            <div>
              <h3>{{ producto.nombre }}</h3>
              <p class="precio">$ {{ producto.precio.toFixed(2) }}</p>
              <p class="stock" v-if="producto.stock !== undefined">Stock: {{ producto.stock }}</p>
              <p class="codigo">Código: {{ producto.codigoBarras }}</p>
            </div>
          </div>
          <button
            @click="agregarAlCarrito(producto)"
            class="btn-agregar"
            :disabled="producto.stock === 0"
          >
            Agregar
          </button>
        </div>
        <p v-if="busquedaProducto && productosFiltrados.length === 0" class="no-resultados">
          ❌ No se encontraron productos con ese nombre.
        </p>
      </section>

      <!-- Código de barras -->
      <div class="lector-codigo">
        <input
          id="codigoBarra"
          v-model="codigoEscaneado"
          type="text"
          inputmode="numeric"
          pattern="\d*"
          maxlength="13"
          @keyup.enter="procesarEscaneo"
          placeholder="Escanea o escribe el código del producto"
          ref="inputCodigo"
          @focus="inputActivo = true"
          @blur.capture="inputActivo = false"
        />
      </div>

      <!-- Alerta si no se encuentra producto -->
      <div v-if="productoNoEncontrado" class="alerta-error">
        ❌ Producto no encontrado con ese código de barras.
      </div>

      <!-- Carrito -->
      <section class="carrito">
        <h2>Carrito</h2>
        <div v-if="carrito.length === 0" class="empty-carrito">No hay productos en el carrito.</div>
        <ul v-else class="lista-carrito">
          <li v-for="(item, index) in carrito" :key="item.id + '-' + index" class="item-carrito">
            <span>{{ item.nombre }}</span>
            <div class="contador-cantidad">
              <button @click="cambiarCantidad(item, -1)">-</button>
              <span>{{ item.cantidad }}</span>
              <button @click="cambiarCantidad(item, 1)" :disabled="item.cantidad >= item.stock">+</button>
            </div>
            <span class="subtotal">$ {{ (item.precio * item.cantidad).toFixed(2) }}</span>
            <button class="btn-eliminar" @click="mostrarModal(item)">🗑</button>
          </li>
        </ul>

        <p class="total">Total de la venta: ${{ total.toFixed(2) }}</p>

        <div class="metodo-pago">
          <label>Método de pago:</label>
          <label><input type="radio" value="efectivo" v-model="metodoPago" /> Efectivo</label>
          <label><input type="radio" value="tarjeta" v-model="metodoPago" /> Tarjeta</label>
          <label><input type="radio" value="transferencia" v-model="metodoPago" /> Transferencia</label>
          <label><input type="radio" value="credito" v-model="metodoPago" /> Crédito</label>
        </div>

        <!-- FORMULARIO COMPLETO DE CRÉDITO -->
        <div v-if="metodoPago === 'credito'" class="formulario-credito">
          <h3>📋 Crear nuevo crédito</h3>
          <div class="form-group">
            <label for="nombreCredito">Nombre del cliente</label>
            <input
              id="nombreCredito"
              v-model="nuevoCreditoCaja.nombre"
              type="text"
              placeholder="Nombre del cliente"
            />
          </div>
          <div class="form-group">
            <label>Monto del crédito</label>
            <input :value="total.toFixed(2)" type="number" readonly />
          </div>
          <div class="form-group">
            <label for="descripcionCredito">Descripción (motivo del crédito)</label>
            <input
              id="descripcionCredito"
              v-model="nuevoCreditoCaja.descripcion"
              type="text"
              placeholder="Ejemplo: Préstamo por emergencia"
            />
          </div>
          <button class="btn-crear" @click="guardarCredito">Otorgar crédito</button>
        </div>

<div v-if="totalAcumulado > 0" class="recuadro-total-acumulado">
  <p><strong>Ventas totales del día:</strong> ${{ totalAcumulado.toFixed(2) }}</p>


<div class="dinero-total">
  <strong> Dinero en caja:</strong> ${{ dineroEnCajaTotal.toFixed(2) }}
</div>

</div>

        <button @click="mostrarModalDePago" :disabled="carrito.length === 0 || metodoPago === 'credito'" class="btn-finalizar">
          Finalizar Venta
        </button>
      </section>

  <!-- Modal de Pago -->
  <div
    v-if="mostrarModalPago"
    class="modal-overlay"
    @keydown.esc="cancelarPago"
    tabindex="0"
    ref="modalPago"
  >
    <div class="modal-contenido" role="dialog" aria-modal="true" aria-labelledby="tituloModalPago">
      <h3 id="tituloModalPago">Confirmar Pago💵</h3>

      <p>Total a pagar: <strong>${{ total.toFixed(2) }}</strong></p>

      <label for="montoRecibido">Monto recibido</label>
      <input
        id="montoRecibido"
        type="number"
        min="0"
        step="0.01"
        v-model.number="montoRecibido"
        @input="calcularCambio"
        placeholder="Ingresa el monto recibido"
        autofocus
      />

      <p v-if="cambio >= 0">Cambio: <strong>${{ cambio.toFixed(2) }}</strong></p>
      <p v-else class="alerta-error">Monto recibido insuficiente</p>

      <div class="modal-botones">
        <button
          class="btn-confirmar"
          :disabled="montoRecibido < total"
          @click="confirmarPago"
          title="Confirmar el pago"
        >
          Confirmar
        </button>

        <button
          class="btn-cancelar"
          @click="cancelarPago"
          title="Cancelar"
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>


      <!-- Ticket -->
      <section v-if="ventaFinalizada" class="ticket" id="ticket">
        <h2>Ticket de Venta</h2>
        <ul>
          <li v-for="(item, index) in carritoAnterior" :key="item.id + '-' + index">
            {{ item.nombre }} (x{{ item.cantidad }}) - ${{ (item.precio * item.cantidad).toFixed(2) }}
          </li>
        </ul>
        <p><strong>Total: ${{ totalAnterior.toFixed(2) }}</strong></p>
        <p>Método de pago: {{ metodoPagoAnterior }}</p>
        <p>¡Gracias por su compra!</p>
        <button @click="imprimirTicket" class="btn-imprimir">Imprimir Ticket</button>
      </section>
    </div>
  </template>

-------------------------------------------------------Scryp funcional----------------------------------------------------------------------
<script>
import { obtenerProductos, actualizarProducto } from '../services/producto.service.js';
export default {
  data() {
        return {
      sucursal: JSON.parse(localStorage.getItem('usuario'))?.sucursal || 'sin_sucursal',
      mostrarModalPago: false,
      montoRecibido: 0,
      cambio: 0,
      cambioInicial: 0, // ✅ Esto evita el warning
      mostrarModalCambio: false,
      dineroInicial: 0, // dinero con que inicia la caja
      rol: '',
      productos: [],
      carrito: [],
      codigoEscaneado: '',
      metodoPago: 'efectivo',
      ventaFinalizada: false,
      carritoAnterior: [],
      metodoPagoAnterior: '',
      totalAnterior: 0,
      totalAcumulado: 0, // ventas del día
      ventasRealizadas: [],
      inputActivo: false,
      busquedaProducto: '',
      productoNoEncontrado: false,
      modalVisible: false,
      itemAEliminar: null,
          corteEnProceso: false,
      nuevoCreditoCaja: {
        nombre: '',
        descripcion: '',
      },
      alerta: {
        visible: false,
        mensaje: '',
        tipo: 'exito'
      }
    };
  },


    computed: {
    total() {
      return this.carrito.reduce((suma, item) => suma + item.precio * item.cantidad, 0);
    },
    productosFiltrados() {
      if (!this.busquedaProducto) return [];
      const texto = this.busquedaProducto.toLowerCase();
      return this.productos.filter(p => p.nombre.toLowerCase().includes(texto));
    },
  dineroEnCajaTotal() {
    return this.dineroInicial + this.totalAcumulado;
  },
    },


    mounted() {
  const usuario = JSON.parse(localStorage.getItem('usuario')) || {};
  this.rol = usuario.rol || 'cajero';

  this.cargarProductos();

  const claveCambio = cambioInicial_${this.sucursal};
  const cambioGuardado = localStorage.getItem(claveCambio);

  if (this.rol.toLowerCase() !== 'admin') {
    if (!cambioGuardado || isNaN(parseFloat(cambioGuardado))) {
      this.mostrarModalCambio = true;
      this.totalAcumulado = 0;
      this.dineroInicial = 0;
    } else {
      this.dineroInicial = parseFloat(cambioGuardado);

      const claveTotal = total_acumulado_${this.sucursal}_${new Date().toISOString().slice(0, 10)};
      const totalGuardado = localStorage.getItem(claveTotal);
      if (totalGuardado) {
        this.totalAcumulado = parseFloat(totalGuardado);
      } else {
        this.totalAcumulado = 0;
      }
    }
  }

    },


    methods: {
    async cargarProductos() {
  try {
    const productos = await obtenerProductos();
    this.productos = productos.filter(p => p.sucursal === this.sucursal);

  } catch (error) {
    console.error('Error al cargar productos:', error);
    this.mostrarAlerta('❌ Error al obtener productos del servidor.', 'error');
  }
    },
    guardarCambioInicial() {
  if (!this.cambioInicial || this.cambioInicial <= 0) {
    alert('Ingresa un valor válido para el cambio inicial');
    return;
  }

  this.dineroInicial = this.cambioInicial; // ✅ Asigna el cambio a dineroInicial

  const fecha = new Date().toLocaleDateString();
  const horaInicio = new Date().toLocaleTimeString();
  const usuario = JSON.parse(localStorage.getItem('usuario')) || {};
  const sucursal = usuario.sucursal || 'sin_sucursal';

  const corte = {
    fecha,
    horaInicio,
    sucursal,
    usuario: usuario.nombre || 'desconocido',
    cambio: this.dineroInicial,
    ventas: [],
    total: 0,
  };

  let cortes = JSON.parse(localStorage.getItem('cortes')) || [];
  cortes.push(corte);
  localStorage.setItem('cortes', JSON.stringify(cortes));

  localStorage.setItem(cambioInicial_${sucursal}, this.dineroInicial);

  this.mostrarModalCambio = false;
    },
    agregarAlCarrito(producto) {
  if (producto.stock === 0) return alert('Producto sin stock');
  const encontrado = this.carrito.find(p => p.id === producto.id);
  if (encontrado) {
    if (encontrado.cantidad < producto.stock) encontrado.cantidad++;
    else alert('No hay más stock disponible');
  } else {
    this.carrito.push({ ...producto, cantidad: 1 });
  }

  this.ventaFinalizada = false;

  // ✅ Limpia el buscador y oculta los resultados
  this.busquedaProducto = '';

  // ✅ Opcional: reenfocar input de código de barras
  this.$nextTick(() => this.$refs.inputCodigo?.focus());
    },
    cambiarCantidad(item, delta) {
      const nuevaCantidad = item.cantidad + delta;
      if (nuevaCantidad < 1) return this.mostrarModal(item);
      const original = this.productos.find(p => p.id === item.id);
      if (original && nuevaCantidad > original.stock) return alert('No hay más stock disponible');
      item.cantidad = nuevaCantidad;
    },
    mostrarModal(item) {
      this.modalVisible = true;
      this.itemAEliminar = item;
    },
    confirmarEliminacion(confirmado) {
      if (confirmado && this.itemAEliminar) {
        this.carrito = this.carrito.filter(p => p.id !== this.itemAEliminar.id);
      }
      this.modalVisible = false;
      this.itemAEliminar = null;
    },
    procesarEscaneo() {
      const codigo = this.codigoEscaneado.trim();
      if (!codigo) return;
      const producto = this.productos.find(p => p.codigoBarras === codigo);
      if (!producto) {
        this.productoNoEncontrado = true;
        setTimeout(() => (this.productoNoEncontrado = false), 3000);
        this.codigoEscaneado = '';
        return;
      }
      this.agregarAlCarrito(producto);
      this.codigoEscaneado = '';
    },
    guardarCredito() {
      if (!this.nuevoCreditoCaja.nombre.trim()) {
        this.mostrarAlerta('⚠ Ingresa el nombre del cliente.', 'error');
        return;
      }
      if (!this.total || this.total <= 0) {
        this.mostrarAlerta('⚠ El carrito está vacío.', 'error');
        return;
      }

      const nombre = this.nuevoCreditoCaja.nombre.trim();
      const descripcionUsuario = this.nuevoCreditoCaja.descripcion.trim();
      const monto = this.total;
      const sucursal = this.sucursal;

      const detalleProductos = this.carrito
        .map(item => ${item.nombre} x${item.cantidad})
        .join(', ');
      const descripcionCompleta = descripcionUsuario
        ? ${descripcionUsuario}; Productos: ${detalleProductos}
        : Productos: ${detalleProductos};

      const claveClientes = clientes_${sucursal};
      const clientes = JSON.parse(localStorage.getItem(claveClientes)) || [];

      const existente = clientes.find(
        c => c.nombre.toLowerCase() === nombre.toLowerCase() && c.sucursal === sucursal
      );

      if (existente) {
        existente.creditoPendiente += monto;
        existente.montoInicial += monto;
        existente.descripcion = descripcionCompleta;
      } else {
        clientes.push({
          id: Date.now(),
          nombre,
          creditoPendiente: monto,
          montoInicial: monto,
          descripcion: descripcionCompleta,
          historial: [],
          sucursal
        });
      }

      localStorage.setItem(claveClientes, JSON.stringify(clientes));

      const usuarioActual = JSON.parse(localStorage.getItem('usuario')) || {
        username: 'desconocido',
        sucursal: 'sin_sucursal'
      };

      const ventaCredito = {
        id: Date.now(),
        productos: JSON.parse(JSON.stringify(this.carrito)),
        total: this.total,
        metodoPago: 'credito',
        fecha: new Date().toISOString(),
        usuario: {
          nombre: usuarioActual.username,
          sucursal: this.sucursal
        },
        sucursal: this.sucursal
      };

      const todasVentas = JSON.parse(localStorage.getItem('ventas_realizadas')) || [];
      todasVentas.push(ventaCredito);
      localStorage.setItem('ventas_realizadas', JSON.stringify(todasVentas));

      this.$emit('nueva-venta', ventaCredito);

      this.nuevoCreditoCaja = { nombre: '', descripcion: '' };
      this.carrito = [];
      this.ventaFinalizada = false;
      this.metodoPago = 'efectivo';

      this.mostrarAlerta('✔ Crédito guardado sin afectar caja.', 'exito');
    },
    cargarTotalDelDia() {
      const hoy = new Date().toISOString().slice(0, 10);
      const sucursal = this.sucursal;
      let total = 0;

      const todasVentas = JSON.parse(localStorage.getItem('ventas_realizadas') || '[]');
      const ventasHoy = todasVentas.filter(v =>
        v.sucursal === sucursal &&
        v.fecha?.startsWith(hoy) &&
        v.metodoPago !== 'credito'
      );
      ventasHoy.forEach(v => total += v.total);

      const pagosCredito = JSON.parse(localStorage.getItem('ingresos_credito') || '[]');
      const pagosHoy = pagosCredito.filter(p =>
        p.tipo === 'pago_credito' &&
        p.sucursal === sucursal &&
        p.fecha?.startsWith(hoy)
      );
      pagosHoy.forEach(p => total += p.monto);

      this.totalAcumulado = total;

      const claveTotal = total_acumulado_${sucursal}_${hoy};
      localStorage.setItem(claveTotal, total.toString());
    },
    finalizarVenta() {
      if (this.metodoPago === 'credito') {
        alert('Para ventas a crédito, usa el botón "Otorgar crédito".');
        return;
      }

      this.carrito.forEach(item => {
        const prod = this.productos.find(p => p.id === item.id);
        if (prod) prod.stock -= item.cantidad;
      });

this.productos.forEach(producto => {
  actualizarProducto(producto.id, { stock: producto.stock });
});

      const usuarioActual = JSON.parse(localStorage.getItem('usuario')) || {
        username: 'desconocido',
        sucursal: 'sin_sucursal'
      };

      const venta = {
        id: Date.now(),
        productos: JSON.parse(JSON.stringify(this.carrito)),
        total: this.total,
        metodoPago: this.metodoPago,
        fecha: new Date().toISOString(),
        usuario: {
          nombre: usuarioActual.username,
          sucursal: this.sucursal
        },
        sucursal: this.sucursal
      };

      const todasVentas = JSON.parse(localStorage.getItem('ventas_realizadas')) || [];
      todasVentas.push(venta);
      localStorage.setItem('ventas_realizadas', JSON.stringify(todasVentas));

      this.sumarAlTotalDelDia(this.total);

      // ✅ Actualizar dinero en caja por sucursal
      const claveDinero = dinero_en_caja_${this.sucursal};
      const dineroActual = parseFloat(localStorage.getItem(claveDinero)) || 0;
      const nuevoDinero = dineroActual + this.total;
      localStorage.setItem(claveDinero, nuevoDinero.toFixed(2));
      window.dispatchEvent(new Event("dinero-en-caja-actualizado"));

      this.$emit('nueva-venta', venta);
      this.carritoAnterior = [...this.carrito];
      this.totalAnterior = this.total;
      this.metodoPagoAnterior = this.metodoPago;
      this.ventaFinalizada = true;
      this.carrito = [];
      this.codigoEscaneado = '';
    },
    sumarAlTotalDelDia(monto) {
      const hoy = new Date().toISOString().slice(0, 10);
      const claveTotal = total_acumulado_${this.sucursal}_${hoy};
      const totalAnterior = parseFloat(localStorage.getItem(claveTotal)) || 0;
      const nuevoTotal = totalAnterior + monto;
      localStorage.setItem(claveTotal, nuevoTotal.toString());
      this.totalAcumulado = nuevoTotal;
    },
    mostrarModalDePago() {
  this.mostrarModalPago = true;
  this.montoRecibido = 0;
  this.cambio = 0;
    },
    calcularCambio() {
  if (this.montoRecibido >= this.total) {
    this.cambio = this.montoRecibido - this.total;
  } else {
    this.cambio = 0;
  }
    },
    confirmarPago() {
this.finalizarVenta();
  this.mostrarModalPago = false;
    },
    cancelarPago() {
  this.mostrarModalPago = false;
    },
    imprimirTicket() {
      const ticketContent = `
        <div style="text-align: left; font-size: 12px; font-family: monospace;">
          <h2 style="text-align: center; font-size: 16px;">POS OAXACA DE ANTEQUERA</h2>
          <p>Fecha: ${new Date().toLocaleString()}</p>
          <hr />
          <p><strong>Productos:</strong></p>
          ${this.carritoAnterior
            .map(item => ${item.nombre} x${item.cantidad}  $${(item.precio * item.cantidad).toFixed(2)})
            .join('<br>')}
          <hr />
          <p><strong>Total: $${this.totalAnterior.toFixed(2)}</strong></p>
          <p>Método de pago: ${this.metodoPagoAnterior}</p>
          <p style="text-align: center;">¡Gracias por su compra!</p>
          <br><br><br>
        </div>
      `;
      const printWindow = window.open('', '', 'width=300,height=600');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Ticket</title>
              <style>
                @media print {
                  body {
                    margin: 0;
                    padding: 0;
                    font-family: monospace;
                    font-size: 12px;
                  }
                }
              </style>
            </head>
            <body onload="window.print(); window.close();">
              ${ticketContent}
            </body>
          </html>
        `);
        printWindow.document.close();
      }
      this.ventaFinalizada = false;
    },
    reenfocarInput() {
      setTimeout(() => {
        if (!this.inputActivo) {
          this.$refs.inputCodigo?.focus();
        }
      }, 100);
    },
    detectarEscape(event) {
      if (event.key === 'Escape') {
        this.reenfocarInput();
      }
    },
    mostrarAlerta(mensaje, tipo = 'exito') {
      this.alerta.mensaje = mensaje;
      this.alerta.tipo = tipo;
      this.alerta.visible = true;
      setTimeout(() => {
        this.alerta.visible = false;
      }, 3000);
    }, 
    realizarCorteDeCaja() {
  const usuarioData = JSON.parse(localStorage.getItem('usuario')) || {};
  const ventasGuardadas = JSON.parse(localStorage.getItem('ventas_realizadas')) || [];
  const cortes = JSON.parse(localStorage.getItem('cortes_realizados')) || [];

  if (usuarioData.rol === 'admin') {
    this.mostrarAlerta('⚠ Los administradores no pueden realizar cortes de caja.', 'error');
    return;
  }

  // ✅ Fecha local en México en formato YYYY-MM-DD
  const fechaHoy = new Date().toLocaleDateString('es-MX', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).split('/').reverse().join('-');

  const horaActual = new Date().toLocaleTimeString('es-MX');

  const usuario = {
    nombre: usuarioData.nombre || usuarioData.username || 'Desconocido',
    sucursal: usuarioData.sucursal || this.sucursal
  };

  const cortesSucursal = cortes
    .filter(corte => corte.sucursal === this.sucursal)
    .sort((a, b) => b.timestamp - a.timestamp);

  const ultimoCorteTimestamp = cortesSucursal.length > 0 ? cortesSucursal[0].timestamp : 0;

  const ventasNuevas = ventasGuardadas.filter(venta => {
    return (
      venta.sucursal === this.sucursal &&
      new Date(venta.fecha).getTime() > ultimoCorteTimestamp
    );
  });

  const totalVentas = ventasNuevas.reduce((acc, venta) => acc + (venta.total || 0), 0);

  const cambioInicialKey = cambioInicial_${this.sucursal};
  const cambioInicial = Number(localStorage.getItem(cambioInicialKey)) || 0;

  const totalCaja = cambioInicial + totalVentas;

  const corte = {
    sucursal: this.sucursal,
    fecha: fechaHoy,
    hora: horaActual,
    total: totalCaja,
    ventas: ventasNuevas,
    usuario: usuario,
    cambioInicial: cambioInicial,
    totalVentas: totalVentas,
    timestamp: Date.now()
  };

  cortes.push(corte);
  localStorage.setItem('cortes_realizados', JSON.stringify(cortes));

  localStorage.removeItem(total_acumulado_${this.sucursal}_${fechaHoy});
  localStorage.removeItem(dinero_en_caja_${this.sucursal});
  localStorage.removeItem(cambioInicial_${this.sucursal});

  this.totalAcumulado = 0;
  this.dineroInicial = 0;
  this.carrito = [];
  this.codigoEscaneado = '';
  this.ventaFinalizada = false;
  this.metodoPago = 'efectivo';

  this.mostrarAlerta('📦 Corte de caja realizado exitosamente.', 'exito');
  window.dispatchEvent(new Event('corte-realizado'));
    }
  }
};
</script>