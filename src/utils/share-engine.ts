/**
 * CHECKOUT SOCIAL SHARE ENGINE
 * 
 * Generates clean, platform-optimized share messages and links.
 */

export const shareToWhatsApp = (text: string, url: string) => {
  const message = encodeURIComponent(`${text}\n\nCheck this out on Checkout → ${url}`);
  window.open(`https://wa.me/?text=${message}`, '_blank');
};

export const shareToInstagram = (text: string, url: string) => {
  // Instagram doesn't support direct URL sharing in feed via web API, 
  // so we copy to clipboard and notify the user.
  copyToClipboard(`${text} ${url}`);
};

export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  return true;
};

export const generateShareMessage = (type: string, title: string, location?: string) => {
  const prefix = type === 'REQUIREMENT' ? 'Looking for' : 'Offering';
  const locSuffix = location ? ` in ${location}` : '';
  return `${prefix} ${title}${locSuffix}.`;
};
