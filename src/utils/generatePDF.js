// Utility function to generate PDF from certificate HTML
// Uses html2canvas and jspdf libraries

/**
 * Generate PDF from certificate element
 * @param {HTMLElement} certificateElement - The certificate HTML element to convert
 * @param {string} fileName - Name of the PDF file
 * @returns {Promise} Promise that resolves when PDF is generated
 */
export const generateCertificatePDF = async (certificateElement, fileName = 'certificate') => {
  try {
    // Dynamic import to avoid issues if libraries aren't loaded
    const html2canvas = (await import('html2canvas')).default;
    const jsPDF = (await import('jspdf')).default;

    // Hide buttons before generating PDF
    const buttons = certificateElement.querySelectorAll('button');
    buttons.forEach(btn => btn.style.display = 'none');

    // Convert HTML to canvas
    const canvas = await html2canvas(certificateElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    // Restore buttons
    buttons.forEach(btn => btn.style.display = '');

    // Get canvas dimensions
    const canvasAspectRatio = canvas.width / canvas.height;
    
    // Use landscape orientation for certificates (A4: 297mm x 210mm)
    const orientation = canvasAspectRatio > 1 ? 'landscape' : 'portrait';
    const pdfWidth = orientation === 'landscape' ? 297 : 210;
    const pdfHeight = orientation === 'landscape' ? 210 : 297;
    
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;
    
    // Check if content fits on one page
    const pageHeight = pdfHeight - 5; // 5mm margin
    let imageWidth = imgWidth;
    let imageHeight = imgHeight;
    
    if (imageHeight > pageHeight) {
      // Scale down to fit on one page
      const scale = pageHeight / imageHeight;
      imageWidth = imageWidth * scale;
      imageHeight = pageHeight;
    }

    // Create PDF
    const pdf = new jsPDF({
      orientation: orientation,
      unit: 'mm',
      format: 'a4',
    });

    const imageData = canvas.toDataURL('image/png');
    // Center the image on the page
    const xOffset = (pdfWidth - imageWidth) / 2;
    const yOffset = (pdfHeight - imageHeight) / 2;
    pdf.addImage(imageData, 'PNG', xOffset, yOffset, imageWidth, imageHeight);

    // Save PDF
    pdf.save(`${fileName}.pdf`);

    return { success: true, message: 'PDF generated successfully' };
  } catch (error) {
    console.error('Error generating PDF:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Print certificate directly from browser
 * @param {HTMLElement} certificateElement - The certificate HTML element
 * @returns {void}
 */
export const printCertificate = (certificateElement) => {
  const printWindow = window.open('', '', 'width=800,height=600');
  const htmlContent = certificateElement.innerHTML;
  
  // Include Tailwind CSS in print window
  const cssLink = document.querySelector('link[rel="stylesheet"]');
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Certificate</title>
        <link href="https://cdn.tailwindcss.com" rel="stylesheet">
        <style>
          @media print {
            button { display: none !important; }
          }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
    </html>
  `);
  
  printWindow.document.close();
  setTimeout(() => {
    printWindow.print();
    // Note: Don't close window immediately, let user close it after printing
  }, 250);
};

/**
 * Download certificate as image (PNG)
 * @param {HTMLElement} certificateElement - The certificate HTML element
 * @param {string} fileName - Name of the file
 * @returns {Promise} Promise that resolves when download is complete
 */
export const downloadCertificateAsImage = async (certificateElement, fileName = 'certificate') => {
  try {
    const html2canvas = (await import('html2canvas')).default;

    const buttons = certificateElement.querySelectorAll('button');
    buttons.forEach(btn => btn.style.display = 'none');

    const canvas = await html2canvas(certificateElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    buttons.forEach(btn => btn.style.display = '');

    // Download as PNG
    canvas.toBlob((blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    });

    return { success: true, message: 'Image downloaded successfully' };
  } catch (error) {
    console.error('Error downloading image:', error);
    return { success: false, error: error.message };
  }
};

export default {
  generateCertificatePDF,
  printCertificate,
  downloadCertificateAsImage,
};
