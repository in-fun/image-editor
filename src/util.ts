'use client';

export function downloadURL(url: string, name: string) {
  // Create a link element with download attribute
  const link = document.createElement('a');
  link.href = url;
  link.download = name;

  // Programmatically click the link to trigger the download
  link.click();
}
