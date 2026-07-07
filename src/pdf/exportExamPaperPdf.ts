export interface ExportExamPaperPdfOptions {
  element: HTMLElement;
  studentName?: string;
}

function normalizePdfClone(clonedDoc: Document): void {
  const styles = clonedDoc.querySelectorAll("style");
  styles.forEach((styleTag) => {
    let cssText = styleTag.textContent || "";
    if (cssText.includes("oklch") || cssText.includes("lab")) {
      cssText = cssText.replace(/oklch\([^)]+\)/g, "transparent");
      cssText = cssText.replace(/lab\([^)]+\)/g, "transparent");
      styleTag.textContent = cssText;
    }
  });

  const clonedElement = clonedDoc.querySelector("[data-exam-paper]") as HTMLElement | null;
  if (!clonedElement) return;

  clonedElement.style.width = "820px";
  clonedElement.style.padding = "40px";
  clonedElement.style.backgroundColor = "#ffffff";
  clonedElement.style.color = "#000000";
  clonedElement.style.borderColor = "#000000";
  clonedElement.style.boxShadow = "none";
  clonedElement.style.border = "1px solid #000000";
  clonedElement.style.borderRadius = "0";

  const noPrintElements = clonedElement.querySelectorAll(".no-print");
  noPrintElements.forEach((el) => {
    (el as HTMLElement).style.setProperty("display", "none", "important");
  });

  const printOnlyElements = clonedElement.querySelectorAll(".print-only");
  printOnlyElements.forEach((el) => {
    (el as HTMLElement).style.setProperty("display", "block", "important");
  });

  const allDescendants = clonedElement.querySelectorAll("*");
  allDescendants.forEach((el) => {
    const htmlEl = el as HTMLElement;

    try {
      const computed = window.getComputedStyle(htmlEl);

      let bgColor = computed.backgroundColor;
      let borderColor = computed.borderColor;

      if (bgColor && (bgColor.includes("oklch") || bgColor.includes("lab"))) {
        bgColor = "transparent";
      }
      if (borderColor && (borderColor.includes("oklch") || borderColor.includes("lab"))) {
        borderColor = "#000000";
      }

      htmlEl.style.backgroundColor = bgColor;
      htmlEl.style.color = "#000000";
      htmlEl.style.borderColor = borderColor;
    } catch {
      htmlEl.style.color = "#000000";
    }

    if (htmlEl.tagName === "BUTTON") {
      htmlEl.style.borderColor = "#000000";
      htmlEl.style.backgroundColor = "transparent";
    }
  });

  const mathTexts = clonedElement.querySelectorAll(".inline-math");
  mathTexts.forEach((el) => {
    (el as HTMLElement).style.setProperty("color", "#000000", "important");
    const mathSpans = el.querySelectorAll("*");
    mathSpans.forEach((span) => {
      (span as HTMLElement).style.setProperty("color", "#000000", "important");
    });
  });
}

export async function exportExamPaperPdf({
  element,
  studentName,
}: ExportExamPaperPdfOptions): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const html2canvas = (await import("html2canvas")).default;
  const { jsPDF } = await import("jspdf");

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: true,
    backgroundColor: "#ffffff",
    onclone: normalizePdfClone,
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const imgWidth = 210;
  const pageHeight = 297;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST");
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST");
    heightLeft -= pageHeight;
  }

  const filename = `${studentName?.trim() || "math"}_시험지.pdf`;
  pdf.save(filename);
}
