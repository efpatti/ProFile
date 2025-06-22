// exportBanner.js
// Responsável por exportar o banner como imagem

// Adiciona o html2canvas via CDN
const script = document.createElement("script");
script.src =
 "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";
document.head.appendChild(script);

window.downloadBanner = async function () {
 const banner = document.getElementById("banner");
 const toHide = banner.querySelectorAll(".no-export");
 toHide.forEach((el) => (el.style.display = "none"));

 // Aguarda fontes carregarem e layout estabilizar
 if (document.fonts) await document.fonts.ready;
 await new Promise((r) => setTimeout(r, 200));

 html2canvas(banner, {
  useCORS: true,
  backgroundColor: null,
  scale: 2, // Alta qualidade
  width: 1584,
  height: 396,
 }).then((canvas) => {
  // Mostra novamente os elementos
  toHide.forEach((el) => (el.style.display = ""));
  const link = document.createElement("a");
  link.download = "linkedin-banner.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
 });
};

function downloadBannerViaPuppeteer() {
 fetch("/download-banner")
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
}

document.addEventListener("DOMContentLoaded", () => {
 const puppeteerBtn = document.getElementById("download-banner-puppeteer");
 if (puppeteerBtn) {
  puppeteerBtn.addEventListener("click", downloadBannerViaPuppeteer);
 }
});
