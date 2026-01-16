
import React from 'react';
import { InventoryType, UserRole, ControlStatus } from './types';

export const APP_CONFIG = {
  VERSION: '1.0.0',
  SHEET_OPERATIVE_ID: 'Base_Inventario',
  SHEET_USERS_ID: 'datos_acceso',
};

export const INVENTORY_TYPE_CONFIG = {
  [InventoryType.INGRESO]: { color: 'blue', icon: 'fa-truck-loading', tables: ['EKPO', 'MSEG'] },
  [InventoryType.EGRESO]: { color: 'orange', icon: 'fa-shipping-fast', tables: ['LIPS', 'VBAK'] },
  [InventoryType.GENERAL]: { color: 'indigo', icon: 'fa-boxes-stacked', tables: ['MARD', 'MBEW'] },
  [InventoryType.W2W]: { color: 'emerald', icon: 'fa-arrows-spin', tables: ['LAGP', 'LQUA'] },
};

export const STATUS_UI = {
  [ControlStatus.PENDIENTE]: { label: 'Pendiente', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  [ControlStatus.CONTROLADO]: { label: 'Controlado', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  [ControlStatus.ERROR]: { label: 'Error', color: 'bg-red-100 text-red-700 border-red-200' },
  [ControlStatus.VALIDADO]: { label: 'Validado', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
};
