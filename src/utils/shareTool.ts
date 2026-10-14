/**
 * Utility function to share tools or results using the Web Share API
 * with automatic fallback to Clipboard copy.
 */

export interface ShareOptions {
  title: string;
  text: string;
  url: string;
}

export interface ShareResult {
  shared: boolean;
  copiedToClipboard: boolean;
  error?: string;
}

export const shareContent = async (options: ShareOptions): Promise<ShareResult> => {
  const shareData = {
    title: options.title,
    text: options.text,
    url: options.url,
  };

  // 1. Try native Web Share API
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      // Check if navigator.canShare is available and supports the data
      if (!navigator.canShare || navigator.canShare(shareData)) {
        await navigator.share(shareData);
        return { shared: true, copiedToClipboard: false };
      }
    } catch (err: any) {
      // If user aborted/dismissed the share sheet, return peacefully
      if (err.name === 'AbortError') {
        return { shared: false, copiedToClipboard: false };
      }
      // For other share errors, fall through to clipboard
    }
  }

  // 2. Fallback to Clipboard API
  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    try {
      const copyText = `${options.text}\n${options.url}`;
      await navigator.clipboard.writeText(copyText);
      return { shared: false, copiedToClipboard: true };
    } catch {
      // If modern clipboard fails, fallback to legacy copy
    }
  }

  // 3. Legacy clipboard fallback
  try {
    const textArea = document.createElement('textarea');
    textArea.value = `${options.text}\n${options.url}`;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    return { shared: false, copiedToClipboard: true };
  } catch (err) {
    return { shared: false, copiedToClipboard: false, error: 'Could not share or copy link' };
  }
};
