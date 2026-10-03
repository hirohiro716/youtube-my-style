// ==UserScript==
// @name         Youtube My Style
// @namespace    https://github.com/hirohiro716/
// @version      2.2.1
// @description  Fix Youtube styles.
// @author       hiro
// @match        https://www.youtube.com/*
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGNsYXNzPSJleHRlcm5hbC1pY29uIiB2aWV3Qm94PSIwIDAgMjguNTcgIDIwIiBmb2N1c2FibGU9ImZhbHNlIiBzdHlsZT0icG9pbnRlci1ldmVudHM6IG5vbmU7IGRpc3BsYXk6IGJsb2NrOyB3aWR0aDogMTAwJTsgaGVpZ2h0OiAxMDAlOyI+CiAgPHN2ZyB2aWV3Qm94PSIwIDAgMjguNTcgMjAiIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIG1lZXQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgICA8Zz4KICAgICAgPHBhdGggZD0iTTI3Ljk3MjcgMy4xMjMyNEMyNy42NDM1IDEuODkzMjMgMjYuNjc2OCAwLjkyNjYyMyAyNS40NDY4IDAuNTk3MzY2QzIzLjIxOTcgMi4yNDI4OGUtMDcgMTQuMjg1IDAgMTQuMjg1IDBDMTQuMjg1IDAgNS4zNTA0MiAyLjI0Mjg4ZS0wNyAzLjEyMzIzIDAuNTk3MzY2QzEuODkzMjMgMC45MjY2MjMgMC45MjY2MjMgMS44OTMyMyAwLjU5NzM2NiAzLjEyMzI0QzIuMjQyODhlLTA3IDUuMzUwNDIgMCAxMCAwIDEwQzAgMTAgMi4yNDI4OGUtMDcgMTQuNjQ5NiAwLjU5NzM2NiAxNi44NzY4QzAuOTI2NjIzIDE4LjEwNjggMS44OTMyMyAxOS4wNzM0IDMuMTIzMjMgMTkuNDAyNkM1LjM1MDQyIDIwIDE0LjI4NSAyMCAxNC4yODUgMjBDMTQuMjg1IDIwIDIzLjIxOTcgMjAgMjUuNDQ2OCAxOS40MDI2QzI2LjY3NjggMTkuMDczNCAyNy42NDM1IDE4LjEwNjggMjcuOTcyNyAxNi44NzY4QzI4LjU3MDEgMTQuNjQ5NiAyOC41NzAxIDEwIDI4LjU3MDEgMTBDMjguNTcwMSAxMCAyOC41Njc3IDUuMzUwNDIgMjcuOTcyNyAzLjEyMzI0WiIgZmlsbD0iI0ZGMDAwMCIvPgogICAgICA8cGF0aCBkPSJNMTEuNDI1MyAxNC4yODU0TDE4Ljg0NzcgMTAuMDAwNEwxMS40MjUzIDUuNzE1MzNWMTQuMjg1NFoiIGZpbGw9IndoaXRlIi8+CiAgICA8L2c+CiAgPC9zdmc+Cjwvc3ZnPg==
// @grant        none
// @updateURL    https://github.com/hirohiro716/youtube-my-style/raw/main/youtube-my-style.user.js
// @downloadURL  https://github.com/hirohiro716/youtube-my-style/raw/main/youtube-my-style.user.js
// ==/UserScript==

let fixNarrowHeader = () => {
    if (window.location.href.indexOf("/watch?") === -1) {
        return;
    }
    const container = document.querySelector("#masthead-container");
    const pageManager = document.querySelector("#page-manager");
    if (container === null || pageManager === null) {
        return;
    }
    if (window.innerWidth < 800 && window.scrollY === 0) {
        container.style.display = "none";
        pageManager.style.setProperty("--ytd-toolbar-height", "0");
        pageManager.style.setProperty("--ytd-masthead-height", "0");
    } else {
        container.style.display = "";
        pageManager.style.setProperty("--ytd-toolbar-height", "");
        pageManager.style.setProperty("--ytd-masthead-height", "");
    }
};
setInterval(fixNarrowHeader, 500);

let tryClickSkipButton = () => {
    const isElementVisible = (element) => {
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        return (rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none" && style.opacity !== "0");
    };
    const selectors = [
        '.ytp-skip-ad-button',
        '.ytp-ad-skip-button',
        '.ytp-ad-skip-button-modern',
        '.ytp-ad-skip-button-slot',
        'button[class*="skip"]',
        'div[class*="skip"]',
        '[id*="skip-button"]'
    ];
    for (const element of Array.from(document.querySelectorAll(selectors.join(",")))) {
        if (isElementVisible(element)) {
            element.click();
            for (const eventName of ["pointerdown", "mousedown", "pointerup", "mouseup", "click"]) {
                const isPointer = eventName.startsWith("pointer");
                const EventClass = isPointer ? PointerEvent : MouseEvent;
                const event = new EventClass(eventName, {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    pointerId: 1,
                    isPrimary: true
                });
                element.dispatchEvent(event);
            }
            break;
        }
    }
}
setInterval(tryClickSkipButton, 1000);

let muteAds = async () => {
    const video = document.querySelector("video");
    if (video) {
        const adContainer = document.querySelector(".ad-showing");
        if (adContainer) {
            video.muted = true;
        } else {
            video.muted = false;
            video.playbackRate = 1.0;
        }
    }
}
setInterval(muteAds, 200);

let working = false;
let processAds = async () => {
    if (working) {
        return;
    }
    working = true;
    const video = document.querySelector("video");
    if (video) {
        const adContainer = document.querySelector(".ad-showing");
        if (adContainer) {
            await new Promise((resolve) => { setTimeout(() => resolve(), 5000) });
            if (document.querySelector(".ad-showing") !== null) {
                video.playbackRate = 16.0;
                if (isFinite(video.duration) && video.duration > 0) {
                    video.currentTime = video.duration;
                }
            }
        }
    }
    working = false;
}
setInterval(processAds, 1000);
