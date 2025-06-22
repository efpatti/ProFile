import {
 colorPalettes,
 defaultPalette,
 bannerDimensions,
} from "./sharedStyleConstants.js";

let currentPalette = "darkGreen";

function renderBannerCode(paletteName) {
 const codeElement = document.getElementById("code");
 if (!codeElement) return;
 const dev = {
  name: "Enzo Ferracini Patti",
  role: "Fullstack Developer",
  stack: ["React", "Node.js", "TypeScript"],
  company: "Mottu",
  position: "Development Intern",
 };
 const palette = colorPalettes[paletteName];
 const accentColor = palette.accent;
 const secondaryColor = palette.secondary;
 const keyColor = palette.key;
 const indent = (level) => "&nbsp;".repeat(level * 2);
 let formatted = `<span style='color:${secondaryColor};font-weight:bold;'>const</span> <span style='color:${keyColor};font-weight:bold;'>dev</span> <span style='color:${keyColor}'>=</span> {<br>`;
 for (let key in dev) {
  if (Array.isArray(dev[key])) {
   formatted += `${indent(
    1
   )}<span style='color:${keyColor}'>${key}</span>: [<br>`;
   dev[key].forEach((item, i) => {
    formatted += `${indent(
     2
    )}<span style='color:${accentColor}'>&quot;${item}&quot;</span>${
     i < dev[key].length - 1 ? "," : ""
    }<br>`;
   });
   formatted += `${indent(1)}],<br>`;
  } else {
   formatted += `${indent(
    1
   )}<span style='color:${keyColor}'>${key}</span>: <span style='color:${accentColor}'>&quot;${
    dev[key]
   }&quot;</span>,<br>`;
  }
 }
 formatted += `}`;
 codeElement.innerHTML = formatted;
}

function setPaletteVars(palette) {
 const root = document.documentElement;
 root.style.setProperty("--accent-color", colorPalettes[palette].accent);
 root.style.setProperty("--key-color", colorPalettes[palette].key);
 root.style.setProperty("--highlight-bg", colorPalettes[palette].highlightBg);
 root.style.setProperty("--accent-color-30", colorPalettes[palette].accent30);
 root.style.setProperty("--secondary-color", colorPalettes[palette].secondary);
 root.style.setProperty(
  "--secondary-soft-color",
  colorPalettes[palette].secondarySoft
 );
 document.body.setAttribute("data-palette", palette);
}

function updateDownloadBtn(palette) {
 const btn = document.getElementById("download-banner-puppeteer");
 if (!btn) return;
 btn.classList.remove(
  "bg-green-600",
  "hover:bg-green-700",
  "bg-blue-500",
  "hover:bg-blue-600",
  "bg-purple-500",
  "hover:bg-purple-600",
  "bg-orange-500",
  "hover:bg-orange-600",
  "bg-teal-500",
  "hover:bg-teal-600"
 );
 btn.classList.add(...colorPalettes[palette].btn);
}

function setActivePaletteButton(palette) {
 document.querySelectorAll(".color-option").forEach((btn) => {
  if (btn.dataset.palette === palette) {
   btn.classList.add("ring-2", "ring-accent");
  } else {
   btn.classList.remove("ring-2", "ring-accent");
  }
 });
}
function updateLogoBtnColor(palette) {
 const updateBtn = document.getElementById("update-logo");
 if (!updateBtn) return;

 // Remove todas as classes de cor possíveis
 updateBtn.classList.remove(
  "bg-green-600",
  "hover:bg-green-700",
  "text-white",
  "bg-secondary",
  "text-accent",
  "bg-blue-500",
  "hover:bg-blue-600",
  "bg-purple-500",
  "hover:bg-purple-600",
  "bg-orange-500",
  "hover:bg-orange-600",
  "bg-teal-500",
  "hover:bg-teal-600"
 );

 // Adiciona apenas a classe de texto
 updateBtn.classList.add("text-accent");
}

function updateRemoveLogoBtnColor(palette) {
 const removeBtn = document.getElementById("remove-logo");
 if (!removeBtn) return;
 removeBtn.classList.remove(
  "bg-red-500",
  "hover:bg-red-600",
  "text-white",
  "bg-accent",
  "text-accent"
 );
 removeBtn.classList.add(
  "text-accent",
  "border",
  "border-accent",
  "hover:bg-gray-200"
 );
}

function setupRemoveLogoBtnHover() {
 // Remove os event listeners antigos pois a animação agora é puramente CSS
 const removeBtn = document.getElementById("remove-logo");
 if (!removeBtn) return;

 // Limpa qualquer conteúdo dinâmico que possa ter sido adicionado
 removeBtn.innerHTML = '<i class="bx bxs-trash"></i>';
}

document.addEventListener("DOMContentLoaded", () => {
 setPaletteVars(currentPalette);
 updateDownloadBtn(currentPalette);
 renderBannerCode(currentPalette);
 setActivePaletteButton(currentPalette);
 updateLogoBtnColor(currentPalette);
 updateRemoveLogoBtnColor(currentPalette);
 setupRemoveLogoBtnHover();

 document.querySelectorAll(".color-option").forEach((btn) => {
  btn.addEventListener("click", () => {
   const palette = btn.dataset.palette;
   if (palette && colorPalettes[palette]) {
    currentPalette = palette;
    setPaletteVars(palette);
    updateDownloadBtn(palette);
    renderBannerCode(palette);
    setActivePaletteButton(palette);
    updateLogoBtnColor(palette);
    updateRemoveLogoBtnColor(palette);
   }
  });
 });
});
