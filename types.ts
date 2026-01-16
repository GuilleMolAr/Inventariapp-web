
export enum UserRole {
  ADMIN = 'ADMIN',
  SUPERVISOR = 'SUPERVISOR',
  CARGADOR = 'CARGADOR',
  CONTROLADOR = 'CONTROLADOR'
}

export enum InventoryType {
  INGRESO = 'Control de Ingreso',
  EGRESO = 'Control de Egreso',
  GENERAL = 'Control General',
  W2W = 'Inventario W2W'
}

export enum ControlStatus {
  PENDIENTE = 'PENDIENTE',
  CONTROLADO = 'CONTROLADO',
  ERROR = 'ERROR',
  VALIDADO = 'VALIDADO'
}

export interface User {
  id: string;
  usuario: string;
  nombreApellido: string;
  userEmail: string;
  rol: UserRole;
}

export interface SAPRow {
  material: string;
  descripcion: string;
  cantidadSap: number;
  ubicacion: string;
  idLote?: string;
  [key: string]: any;
}

export interface Assignment {
  id: string;
  idInventario: string;
  usuarioAsignado: string;
  material: string;
  cantidadSap: number;
  cantidadFisica?: number;
  estado: ControlStatus;
  observaciones?: string;
  timestampCarga: string;
  timestampControl?: string;
}

export interface InventorySession {
  id: string;
  nombre: string;
  tipo: InventoryType;
  creadoPor: string;
  fechaCreacion: string;
  estado: 'ACTIVO' | 'FINALIZADO';
  itemsCount: number;
}
