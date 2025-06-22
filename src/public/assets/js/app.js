import { BannerService } from "../../../core/services/BannerService.js";

document.addEventListener("DOMContentLoaded", () => {
 const bannerService = new BannerService();
 bannerService.renderTo("code");
});
