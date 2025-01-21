/**
 * Copies the provided text to the clipboard.
 *
 * This function attempts to use the modern Clipboard API (`navigator.clipboard.writeText`)
 * for copying text. If the API is not available, it falls back to a less reliable method
 * using a hidden <textarea> element.
 *
 * @param {string} text - The text to be copied to the clipboard.
 * @returns {Promise<void>} A promise that resolves when the text is successfully copied.
 *
 * @example
 * ```typescript
 * await copyTextToClipboard("Hello, world!");
 * ```
 */
export default async function copyTextToClipboard(text: string): Promise<void> {
  // Check if the Clipboard API is available
  if (!navigator.clipboard) {
    // Fallback method for browsers that do not support the Clipboard API

    // Create a hidden <textarea> element
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed"; // Prevent scrolling to the bottom of the page
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = "0";
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";

    // Append the <textarea> to the document body
    document.body.appendChild(textArea);

    // Select the text content inside the <textarea>
    textArea.select();

    try {
      // Attempt to copy the selected text using execCommand
      document.execCommand("copy");
    } catch (err) {
      // Log an error if the copy operation fails
      console.error("Unable to copy to clipboard", err);
    } finally {
      // Remove the <textarea> element from the document body
      document.body.removeChild(textArea);
    }
  } else {
    // Use the Clipboard API if available
    try {
      // Write the text to the clipboard
      await navigator.clipboard.writeText(text);
    } catch (err) {
      // Log an error if the Clipboard API operation fails
      console.error("Could not copy text to clipboard", err);
    }
  }
}
