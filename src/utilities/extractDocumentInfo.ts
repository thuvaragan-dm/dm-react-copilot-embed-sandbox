interface DocumentInfo {
  message: string;
  documentId: string | null;
  documentName: string | null;
}

export default function extractDocumentInfo(html: string): DocumentInfo {
  // Regex to extract the message (everything before the <span>)
  const messageRegex = /(.*)<span/;
  const messageMatch = html.match(messageRegex);
  const message = messageMatch ? messageMatch[1].trim() : "";

  // Regex to extract the <span> content
  const spanRegex = /<span.*?>(.*?)<\/span>/;
  const spanMatch = html.match(spanRegex);

  let documentId = null;
  let documentName = null;

  if (spanMatch && spanMatch[1]) {
    const spanContent = spanMatch[1];

    // Extract document id
    const docIdRegex = /document id:([^ ]+)/;
    const docIdMatch = spanContent.match(docIdRegex);
    if (docIdMatch && docIdMatch[1]) {
      documentId = docIdMatch[1].trim();
    }

    // Extract document name
    const docNameRegex = /document name:([^<]+)/;
    const docNameMatch = spanContent.match(docNameRegex);
    if (docNameMatch && docNameMatch[1]) {
      documentName = docNameMatch[1].trim();
    }
  }

  return {
    message,
    documentId,
    documentName,
  };
}
