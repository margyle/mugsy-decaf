// Define allowed values as constants for reuse
const STRENGTH_PREFERENCES = ['light', 'medium', 'strong'];
const NOTIFICATION_METHODS = ['email', 'sms', 'push', 'none'];
const THEMES = ['light', 'dark', 'auto'];
const UNITS = ['metric', 'imperial'];
const LANGUAGES = ['en', 'es', 'fr', 'de'];

// User Preferences entity schema
export const userPreferencesSchema = {
  $id: 'userPreferences',
  type: 'object',
  required: [
    'userId',
    'strengthPreference',
    'defaultCupSize',
    'notificationsBrewed',
    'notificationsMaintenance',
    'notificationsErrors',
    'notificationMethod',
    'allowIntegrations',
    'cloudControlAccess',
    'theme',
    'units',
    'shareRecipes',
    'language',
    'timezone',
  ],
  properties: {
    id: { type: 'string' },
    userId: { type: 'string' },
    strengthPreference: {
      type: 'string',
      enum: STRENGTH_PREFERENCES,
      description: 'Coffee strength preference',
    },
    defaultCupSize: {
      type: 'integer',
      minimum: 50,
      maximum: 1000,
      description: 'Default cup size in milliliters',
    },
    notificationsBrewed: {
      type: 'boolean',
      description: 'Receive notifications when coffee is brewed',
    },
    notificationsMaintenance: {
      type: 'boolean',
      description: 'Receive maintenance notifications',
    },
    notificationsErrors: {
      type: 'boolean',
      description: 'Receive error notifications',
    },
    notificationMethod: {
      type: 'string',
      enum: NOTIFICATION_METHODS,
      description: 'Preferred notification method',
    },
    smsPhoneNumber: {
      type: 'string',
      pattern: '^\\+?[1-9]\\d{1,14}$',
      description: 'SMS phone number (E.164 format)',
    },
    allowIntegrations: {
      type: 'boolean',
      description: 'Allow third-party integrations',
    },
    cloudControlAccess: {
      type: 'boolean',
      description: 'Allow cloud-based control access',
    },
    theme: {
      type: 'string',
      enum: THEMES,
      description: 'UI theme preference',
    },
    autoBrewSchedule: {
      type: 'string',
      description: 'Auto-brew schedule in JSON format',
    },
    units: {
      type: 'string',
      enum: UNITS,
      description: 'Measurement units preference',
    },
    shareRecipes: {
      type: 'boolean',
      description: 'Allow sharing recipes publicly',
    },
    language: {
      type: 'string',
      enum: LANGUAGES,
      description: 'Preferred language code',
    },
    timezone: {
      type: 'string',
      description: 'IANA timezone name (e.g., America/New_York, Europe/London)',
      pattern: '^[A-Za-z_]+/[A-Za-z_]+$',
    },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
};

// Response schemas
export const userPreferencesResponseSchema = {
  $id: 'userPreferencesResponse',
  type: 'object',
  properties: {
    id: { type: 'string' },
    userId: { type: 'string' },
    strengthPreference: { type: 'string' },
    defaultCupSize: { type: 'integer' },
    notificationsBrewed: { type: 'boolean' },
    notificationsMaintenance: { type: 'boolean' },
    notificationsErrors: { type: 'boolean' },
    notificationMethod: { type: 'string' },
    smsPhoneNumber: { type: 'string' },
    allowIntegrations: { type: 'boolean' },
    cloudControlAccess: { type: 'boolean' },
    theme: { type: 'string' },
    autoBrewSchedule: { type: 'string' },
    units: { type: 'string' },
    shareRecipes: { type: 'boolean' },
    language: { type: 'string' },
    timezone: { type: 'string' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
};

export const errorResponseSchema = {
  $id: 'userPreferencesErrorResponse',
  type: 'object',
  properties: {
    error: { type: 'string' },
    message: { type: 'string' },
  },
};

// Body schemas
export const createUserPreferencesBodySchema = {
  type: 'object',
  properties: {
    strengthPreference: {
      type: 'string',
      enum: STRENGTH_PREFERENCES,
    },
    defaultCupSize: {
      type: 'integer',
      minimum: 50,
      maximum: 1000,
    },
    notificationsBrewed: { type: 'boolean' },
    notificationsMaintenance: { type: 'boolean' },
    notificationsErrors: { type: 'boolean' },
    notificationMethod: {
      type: 'string',
      enum: NOTIFICATION_METHODS,
    },
    smsPhoneNumber: {
      type: 'string',
      pattern: '^\\+?[1-9]\\d{1,14}$',
    },
    allowIntegrations: { type: 'boolean' },
    cloudControlAccess: { type: 'boolean' },
    theme: {
      type: 'string',
      enum: THEMES,
    },
    autoBrewSchedule: { type: 'string' },
    units: {
      type: 'string',
      enum: UNITS,
    },
    shareRecipes: { type: 'boolean' },
    language: {
      type: 'string',
      enum: LANGUAGES,
    },
    timezone: {
      type: 'string',
      description: 'IANA timezone name (e.g., America/New_York, Europe/London)',
      pattern: '^[A-Za-z_]+/[A-Za-z_]+$',
    },
  },
};

export const updateUserPreferencesBodySchema = {
  type: 'object',
  properties: {
    strengthPreference: {
      type: 'string',
      enum: STRENGTH_PREFERENCES,
    },
    defaultCupSize: {
      type: 'integer',
      minimum: 50,
      maximum: 1000,
    },
    notificationsBrewed: { type: 'boolean' },
    notificationsMaintenance: { type: 'boolean' },
    notificationsErrors: { type: 'boolean' },
    notificationMethod: {
      type: 'string',
      enum: NOTIFICATION_METHODS,
    },
    smsPhoneNumber: {
      type: 'string',
      pattern: '^\\+?[1-9]\\d{1,14}$',
    },
    allowIntegrations: { type: 'boolean' },
    cloudControlAccess: { type: 'boolean' },
    theme: {
      type: 'string',
      enum: THEMES,
    },
    autoBrewSchedule: { type: 'string' },
    units: {
      type: 'string',
      enum: UNITS,
    },
    shareRecipes: { type: 'boolean' },
    language: {
      type: 'string',
      enum: LANGUAGES,
    },
    timezone: {
      type: 'string',
      description: 'IANA timezone name (e.g., America/New_York, Europe/London)',
      pattern: '^[A-Za-z_]+/[A-Za-z_]+$',
    },
  },
};
