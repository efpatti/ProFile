// puppeteerDownload.js
// Responsável por acionar o download do banner via Puppeteer (API backend)

document.addEventListener("DOMContentLoaded", () => {
 const puppeteerBtn = document.getElementById("download-banner-puppeteer");
 if (puppeteerBtn) {
  puppeteerBtn.addEventListener("click", () => {
   // Pegue a paleta atual do body
   const palette = document.body.getAttribute("data-palette") || "darkGreen";
   fetch(`/download-banner?palette=${palette}`)
    .then((response) => response.blob())
    .then((blob) => {
     const url = window.URL.createObjectURL(blob);
     const a = document.createElement("a");
     a.style.display = "none";
     a.href = url;
     a.download = "linkedin-banner.png";
     document.body.appendChild(a);
     a.click();
     window.URL.revokeObjectURL(url);
    })
    .catch(() =>
     alert(
      "Erro ao baixar banner via Puppeteer. Certifique-se que o servidor está rodando."
     )
    );
  });
 }
});
