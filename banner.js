// banner.js
// Responsável por exibir informações do desenvolvedor formatadas no banner

const dev = {
 name: "Enzo Ferracini Patti",
 role: "Fullstack Developer",
 stack: ["React", "Node.js", "TypeScript"],
 company: "Mottu",
 position: "Development Intern",
};

function formatDevObject(obj) {
 const accentColor = "#22c55e"; // Tailwind green-500
 const keyColor = "#f7fafc"; // Tailwind gray-50
 const indent = (level) => "&nbsp;".repeat(level * 2);
 let formatted = `<span style='color:${accentColor};font-weight:bold;'>const</span> <span style='color:${keyColor};font-weight:bold;'>dev</span> <span style='color:${keyColor}'>=</span> {<br>`;
 for (let key in obj) {
  if (Array.isArray(obj[key])) {
   formatted += `${indent(
    1
   )}<span style='color:${keyColor}'>${key}</span>: [<br>`;
   obj[key].forEach((item, i) => {
    formatted += `${indent(
     2
    )}<span style='color:${accentColor}'>&quot;${item}&quot;</span>${
     i < obj[key].length - 1 ? "," : ""
    }<br>`;
   });
   formatted += `${indent(1)}],<br>`;
  } else {
   formatted += `${indent(
    1
   )}<span style='color:${keyColor}'>${key}</span>: <span style='color:${accentColor}'>&quot;${
    obj[key]
   }&quot;</span>,<br>`;
  }
 }
 formatted += "};";
 return formatted;
}

document.addEventListener("DOMContentLoaded", function () {
 const codeElement = document.getElementById("code");
 if (codeElement) {
  codeElement.innerHTML = formatDevObject(dev);
 }
});
