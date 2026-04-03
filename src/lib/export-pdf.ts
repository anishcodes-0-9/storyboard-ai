import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function sanitizeFileName(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export async function exportElementToPdf(
  element: HTMLElement,
  fileName: string,
) {
  const canvas = await html2canvas(element, {
    backgroundColor: "#0f0c0b",
    scale: 2,
    useCORS: true,
  });

  const imageData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({
    orientation: canvas.width > canvas.height ? "landscape" : "portrait",
    unit: "px",
    format: [canvas.width, canvas.height],
  });

  pdf.addImage(imageData, "PNG", 0, 0, canvas.width, canvas.height);

  const finalName = sanitizeFileName(fileName) || "storyboard-artifact";
  pdf.save(`${finalName}.pdf`);
}
