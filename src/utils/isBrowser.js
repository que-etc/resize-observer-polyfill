/**
 * Detects whether window and document objects are available in current environment.
 */
export default process.env.BROWSER ||
    typeof window !== 'undefined' && typeof document !== 'undefined' && window.document === document;
