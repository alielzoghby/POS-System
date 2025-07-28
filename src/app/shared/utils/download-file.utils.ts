export function downloadFile(base64Data: any) {
  // Convert Base64 to a Blob
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Uint8Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const blob = new Blob([byteNumbers], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = generateDownloadName("Report","xlsx");

  document.body.appendChild(link);
  link.click();

  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
}

function generateDownloadName(baseName: string, extension: string ="xlsx") {
  const date = new Date();
  const formattedDate = date.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
  const formattedTime = date.toTimeString().split(' ')[0].replace(/:/g, '-'); // Format time as HH-MM-SS

  return `${baseName}_${formattedDate}_${formattedTime}.${extension}`;
}
