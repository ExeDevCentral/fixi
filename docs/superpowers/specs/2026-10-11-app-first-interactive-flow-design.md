# Especificación de Diseño: FIXI App-First & Interactive Service Lifecycle

- **Fecha:** 2026-10-11
- **Estado:** Aprobado para Planificación
- **Alcance:** Arquitectónico / Rediseño de Experiencia de Usuario

---

## 1. Visión y Propósito

El objetivo principal es transformar a FIXI de un directorio estático de profesionales ("15 millones de páginas iguales") a una **aplicación viva y orientada a la acción ('App-First')**.

El usuario final debe poder entender en menos de 10 segundos cómo funciona el servicio mediante una **simulación interactiva de punta a punta** que recorre todo el ciclo de vida del trabajo:
1. **Solicitud guiada** con diagnóstico rápido del problema.
2. **Matching y asignación** en tiempo real con radar visual.
3. **Ficha de Seguridad y Notificación por Email oficial**: visualización simultánea de quién llega a su casa (foto, DNI verificado, vehículo, herramientas, tiempo de llegada y tiempo estimado de trabajo) junto con el correo electrónico formal recibido con PIN de seguridad para apertura de puerta.
4. **Pasarela de cobro multiplataforma interactiva**: Tarjeta con visualizador interactivo, Transferencia/MODO con QR y comprobante, y Efectivo con código de entrega.
5. **Cierre de servicio y calificación**: Puntuación con estrellas, etiquetas de reputación, propina opcional, animación de celebración y recibo digital.

---

## 2. Arquitectura de Navegación y Vistas

### 2.1 Vista Principal (`src/pages/Home.tsx`)
- **Modo 'App-First' (Por Defecto)**: El centro visual es el motor interactivo `FixiSimulatorEngine`.
- **Selector de Modo en Navbar/Sub-header**:
  - `[ ✨ Experiencia en Vivo / Pedir FIXI ]` (Activo por defecto)
  - `[ 🔍 Directorio de Profesionales ]` (Mantiene el catálogo existente para usuarios que deseen buscar manualmente)
- **Topbar de Seguridad y Estado**:
  - Badge con especialistas activos en guardia geolocalizados.
  - Indicador de cobertura geográfica (Rosario, Funes, Roldán, Gran Rosario).

---

## 3. Máquina de Estados del Simulador (`FixiSimulatorEngine`)

El simulador implementa una máquina de estados finita reactiva:

| Estado | Descripción | Interacciones del Usuario |
|---|---|---|
| `CONFIGURING` | Selección de oficio (Electricidad, Plomería, Gas, Jardinería, Cerrajería, Fletes) + diagnóstico de falla + urgencia. | Clics en tags de diagnóstico rápido ("Pérdida de agua", "Disyuntor saltado"), selección de zona, botón "Buscar mi FIXI". |
| `DISPATCHING` | Radar dinámico de búsqueda en un radio de 5 km buscando al profesional óptimo matriculado. | Visualización animada de matching con micro-avances. |
| `DISPATCHED_TRACKING` | Especialista confirmado en camino. Ficha técnica completa de seguridad. | **Toggle Dual**: cambiar entre **Vista App** (tiempo de arribo: 12 min, tiempo estimado de trabajo: 40 min) y **Vista Email Oficial FIXI** (template de correo de seguridad con PIN de acceso). Botón "Simular Llegada al Domicilio". |
| `IN_PROGRESS` | Trabajo en ejecución. Cronómetro en vivo y checklist de labores realizadas. | Visualización de avance del trabajo y botón "Completar trabajo e ir a Cobro". |
| `PAYMENT_GATEWAY` | Pasarela de cobro simulada con 3 métodos independientes. | Selección de método: **1. Tarjeta**, **2. Transferencia bancaria/MODO**, **3. Efectivo con PIN**. Validación y botón "Confirmar Pago". |
| `COMPLETED_REVIEW` | Trabajo finalizado y pagado. Pantalla de reputación y cierre. | Calificación 1-5 estrellas, selección de etiquetas (Puntual, Impecable, Precio justo), propina opcional, lanzamiento de confeti y opción de "Reiniciar simulación" o "Ver directorio". |

---

## 4. Canales de Cobro Detallados (`PaymentGatewayModal / View`)

1. **Tarjeta de Crédito / Débito**:
   - Tarjeta interactiva con visualización de chip, detección automática de marca (Visa / Mastercard), enmascaramiento de números y simulación de procesamiento seguro TLS 256-bit.
2. **Transferencia Bancaria / MODO**:
   - Visualización de Alias (`fixi.pagos.oficial`), CBU y QR interoperable estándar BCRA.
   - Botón interactivo "Adjuntar / Simular Comprobante de Transferencia" con feedback inmediato de acreditación instantánea.
3. **Efectivo contra entrega con PIN**:
   - Generación de un código PIN de 4 dígitos seguro. El usuario simula entregárselo al FIXI-Pro como acuse de recibo y conformidad del trabajo antes de abonar en mano.

---

## 5. Visualizador de Correo Electrónico Oficial de Llegada

Componente integrado con pestaña/drawer `EmailNotificationPreview`:
- Cabecera oficial con identidad FIXI ("Aviso de Seguridad en Domicilio").
- Foto del especialista con insignia "Verificado por FIXI".
- Nombre, DNI enmascarado (ej. 34.***.890), matrícula profesional.
- Vehículo y patente (ej. Moto Honda Titán - Patente A123BCD).
- Código PIN de seguridad único de la visita.
- Estimación de tiempo:
  - Tiempo de llegada al domicilio (ej. 15 minutos).
  - Tiempo estimado de duración de la reparación (ej. 45 a 60 minutos).

---

## 6. Estética y Diseño Visual

- **Paleta**: Dark Mode Slate/Zinc (`bg-slate-950` / `bg-slate-900`) con gradientes profundos en esmeralda vibrante (`emerald-400`, `emerald-500`) y ámbar brillante (`amber-400`).
- **Superficies**: Acabados en glassmorphism con bordes sutiles iluminados (`border-white/10`, `backdrop-blur-xl`).
- **Tipografía y jerarquía**: Títulos de alto contraste, etiquetas legibles y badges con iconografía de Lucide.
- **Movimiento**: Transiciones fluidas con Framer Motion en cada cambio de paso del simulador.
