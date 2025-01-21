export default function validateImageUrlsFromStreamData(data: string): {
  data: string;
  validImageUrls: string[];
} {
  // Define a regex to match markdown-style images and direct image links
  const imageRegex = /!\[([^\]]*)\]\((https?:\/\/[^\s]+?)\)/gi; // Match markdown image syntax (with alt text and URL)

  // Define valid image extensions
  const validExtensions: string[] = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".bmp",
    ".webp",
    ".svg",
  ];

  // Helper function to check if the URL has a valid image extension and does not contain example.com
  function isValidImageUrl(url: string): boolean {
    try {
      const parsedUrl = new URL(url); // Validate URL structure
      // Ensure the URL ends with a valid image extension and does not contain "example.com"
      return (
        validExtensions.some((ext) =>
          parsedUrl.pathname.toLowerCase().endsWith(ext)
        ) && !parsedUrl.hostname.includes("example.com")
      );
    } catch (error) {
      return false; // Return false for invalid URL structure
    }
  }

  // Extract URLs matching the image regex using exec
  const allMatches: { fullMatch: string; url: string }[] = []; // Store full markdown and the URL
  let match: RegExpExecArray | null;
  let iterationCount = 0;
  const maxIterations = 1000; // Safety limit to prevent infinite loops

  // Use while loop with exec to find matches
  while ((match = imageRegex.exec(data)) !== null) {
    // Increment the iteration count
    iterationCount++;
    if (iterationCount > maxIterations) {
      console.warn("Max iterations reached, breaking the loop");
      break; // Exit the loop after max iterations
    }

    // Store the full match and URL for later validation
    allMatches.push({ fullMatch: match[0], url: match[2] });
  }

  // Filter valid image URLs and build the new data with valid URLs
  const validImageUrls: string[] = [];
  let modifiedData = data;

  allMatches.forEach(({ fullMatch, url }) => {
    if (isValidImageUrl(url)) {
      validImageUrls.push(url); // Add valid URLs to the list
    } else {
      // Replace the entire markdown image reference with an empty string (remove it completely)
      modifiedData = modifiedData.replace(fullMatch, "");
    }
  });

  return { data: modifiedData, validImageUrls };
}
