// Machine status enums
export enum MachineStatusCode {
  IDLE = 'IDLE',
  WAITING_FOR_PICKUP = 'WAITING_FOR_PICKUP',
  BREWING_HEATING = 'BREWING_HEATING',
  BREWING_GRINDING = 'BREWING_GRINDING',
  BREWING_POURING = 'BREWING_POURING',
  BREW_COMPLETE = 'BREW_COMPLETE',
  FAULT = 'FAULT',
}

export enum ResourceType {
  WATER = 'WATER',
  COFFEE = 'COFFEE',
  MUG = 'MUG',
}

export enum ResourceStatusCode {
  OK = 'OK',
  LOW = 'LOW',
  EMPTY = 'EMPTY',
  FULL = 'FULL',
}

export enum MaintenanceType {
  WATER_FILL = 'WATER_FILL',
  COFFEE_FILL = 'COFFEE_FILL',
  GROUNDS_EMPTY = 'GROUNDS_EMPTY',
  DESCALE = 'DESCALE',
  CLEAN = 'CLEAN',
  REPAIR = 'REPAIR',
}
