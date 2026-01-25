// ==UserScript==
// @name         Youtube My Style
// @namespace    https://github.com/hirohiro716/
// @version      1.0
// @description  Fix Youtube styles.
// @author       hiro
// @match        https://www.youtube.com/watch*
// @icon         https://www.youtube.com/favicon.ico
// @grant        none
// @updateURL    https://github.com/hirohiro716/youtube-my-style/raw/main/youtube-my-style.user.js
// @downloadURL  https://github.com/hirohiro716/youtube-my-style/raw/main/youtube-my-style.user.js
// ==/UserScript==

let fixNarrowHeader = function() {
    const container = document.querySelector("#masthead-container");
    const pageManager = document.querySelector("#page-manager");
    if (container === null || pageManager === null) {
        return;
    }
    if (window.innerWidth < 800 && window.scrollY === 0) {
        container.style.display = "none";
        pageManager.style.setProperty("--ytd-toolbar-height", "0");
    } else {
        container.style.display = "";
        pageManager.style.setProperty("--ytd-toolbar-height", "");
    }
};
setInterval(fixNarrowHeader, 500);

