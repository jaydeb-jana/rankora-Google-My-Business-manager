/**
 * Universal Bulletproof Clipboard Copy Utility
 * Supports Modern Clipboard API + Legacy execCommand fallback for
 * iOS Safari, Android Chrome, in-app webviews (WhatsApp, Instagram, Facebook),
 * and restrictive mobile browser sandboxes.
 */

export async function copyTextToClipboard(text) {
  if (!text || typeof text !== 'string') return false;

  // 1. Try Modern Navigator Clipboard API
  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      console.warn('[Clipboard] Modern API writeText failed, trying fallback...', e);
    }
  }

  // 2. Robust Fallback: Hidden Textarea with document.execCommand('copy')
  if (typeof document !== 'undefined') {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      // Prevent scrolling to bottom of page in mobile Safari
      textarea.style.position = 'fixed';
      textarea.style.top = '0';
      textarea.style.left = '0';
      textarea.style.width = '2em';
      textarea.style.height = '2em';
      textarea.style.padding = '0';
      textarea.style.border = 'none';
      textarea.style.outline = 'none';
      textarea.style.boxShadow = 'none';
      textarea.style.background = 'transparent';
      textarea.style.opacity = '0.01';
      textarea.setAttribute('readonly', '');

      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      textarea.setSelectionRange(0, textarea.value.length);

      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      if (successful) return true;
    } catch (err) {
      console.error('[Clipboard] Fallback execCommand failed:', err);
    }
  }

  return false;
}
