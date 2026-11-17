// Hands an image to the phone's share sheet (Messages, WhatsApp, Instagram…) when the browser
// can share files, otherwise downloads it. Resolves to 'shared', 'downloaded' or 'cancelled'.
export async function shareOrDownload({ blob, fileName, title }) {
  const file = new File([blob], fileName, { type: blob.type });
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title });
      return 'shared';
    } catch (err) {
      if (err.name === 'AbortError') return 'cancelled';
      throw err;
    }
  }
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return 'downloaded';
}

// "Union Oyster House" -> "union-oyster-house"
export const toFileSlug = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60) || 'back-of-house';
