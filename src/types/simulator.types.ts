export type SimulatorStage =
  | 'CONFIGURING'
  | 'DISPATCHING'
  | 'DISPATCHED_TRACKING'
  | 'IN_PROGRESS'
  | 'PAYMENT_GATEWAY'
  | 'COMPLETED_REVIEW';

export interface ServiceCategoryOption {
  id: string;
  name: string;
  iconName: string;
  color: string;
  defaultPrice: number;
  estimatedMinutes: number;
  commonProblems: string[];
}

export interface SpecialistProfile {
  id: string;
  nombre: string;
  titulo: string;
  foto: string;
  rating: number;
  totalTrabajos: number;
  dniEnmascarado: string;
  matricula: string;
  vehiculo: string;
  patente: string;
  tiempoLlegadaMinutos: number;
  tiempoEstimadoTrabajoMinutos: number;
  herramientas: string[];
  insignias: string[];
  telefono: string;
}

export interface FixiOrder {
  id: string;
  categoriaId: string;
  categoriaNombre: string;
  problemaSeleccionado: string;
  zona: string;
  urgencia: 'Urgente 30 min' | 'Hoy Mismo' | 'Coordinar Horario';
  precioEstimado: number;
  pinSeguridad: string;
  createdAt: string;
}

export type PaymentPlatform = 'CARD' | 'TRANSFER' | 'CASH';

export interface CardPaymentDetails {
  numero: string;
  titular: string;
  vencimiento: string;
  cvv: string;
  marca: 'visa' | 'mastercard' | 'generic';
}

export interface RatingPayload {
  estrellas: number;
  etiquetas: string[];
  propina: number;
  comentario: string;
}
