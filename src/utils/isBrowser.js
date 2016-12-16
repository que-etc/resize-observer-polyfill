import global from '../shims/global';

/**
 * Detects whether window and document objects are available in current environment.
 */
export default global.window === global && typeof document != 'undefined';
