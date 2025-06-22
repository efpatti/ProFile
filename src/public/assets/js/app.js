import { BannerService } from "../../../core/services/BannerService.js";

const bannerService = new BannerService();

export function renderBannerCode(paletteName) {
 bannerService.renderTo("code", paletteName);
}

document.addEventListener("DOMContentLoaded", () => {
 renderBannerCode("darkGreen");
});
