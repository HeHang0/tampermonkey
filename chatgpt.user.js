// ==UserScript==
// @name         ChatGPT Chat Record
// @namespace    https://github.com/HeHang0/tampermonkey
// @version      1.0
// @description  ChatGPT search history
// @author       picapico
// @copyright    2023, picapico (https://github.com/hehang0)
// @license      MIT
// @match        https://chat.openai.com/*
// @icon         https://chat.openai.com/favicon-32x32.png
// @updateURL    https://raw.githubusercontent.com/HeHang0/tampermonkey/master/chatgpt.js
// @downloadURL  https://raw.githubusercontent.com/HeHang0/tampermonkey/master/chatgpt.js
// @supportURL   https://github.com/HeHang0/tampermonkey/issues
// @run-at       document-end
// @grant        none
// @noframes
// ==/UserScript==

(function () {
    const listShowButtonHtml = `<span class="" data-state="closed">
    <button aria-label="Show sidebar"
        class="flex p-3 items-center gap-3 transition-colors duration-200 text-white cursor-pointer text-sm rounded-md border bg-white dark:bg-gray-800 border-black/10 dark:border-white/20 hover:bg-gray-50 dark:hover:bg-gray-700 h-11">
        <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24"
            stroke-linecap="round" stroke-linejoin="round"
            class="h-4 w-4 text-black dark:text-white" height="1em" width="1em"
            xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="9" y1="3" x2="9" y2="21"></line>
        </svg>
    </button>
</span>`
    const listLayout = `
<div class="h-full w-[260px]">
    <div class="flex h-full min-h-0 flex-col ">
        <div class="scrollbar-trigger relative h-full w-full flex-1 items-start border-white/20">
            <nav class="flex h-full w-full flex-col p-2">
                <div class="mb-1 flex flex-row gap-2">
                    <input id="searchKeyInput" style="background: transparent;cursor: text;"
                        class="flex items-center gap-3 transition-colors duration-200 text-white cursor-pointer text-sm rounded-md border border-white/20 hover:bg-gray-500/10 h-11 flex-shrink-0 flex-grow" />
                    <span class="" data-state="closed">
                        <span id="refreshListElement"
                            class="flex p-3 gap-3 transition-colors duration-200 text-white cursor-pointer text-sm rounded-md border border-white/20 hover:bg-gray-500/10 h-11 w-11 flex-shrink-0 items-center justify-center">
                            <svg fill="currentColor" viewBox="0 0 1024 1024" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                <path d="M710.4 249.6l76.8-76.8c2.133333-2.133333 4.266667-4.266667 6.4-2.133333 2.133333 0 2.133333 4.266667 2.133333 6.4v204.8c0 4.266667-2.133333 8.533333-4.266666 10.666666s-6.4 4.266667-10.666667 4.266667h-204.8c-4.266667 0-6.4 0-6.4-2.133333s0-4.266667 2.133333-6.4l76.8-76.8c-42.666667-27.733333-87.466667-42.666667-136.533333-42.666667-44.8 0-85.333333 10.666667-121.6 32s-66.133333 51.2-87.466667 87.466667-32 78.933333-32 121.6h-85.333333c0-44.8 8.533333-87.466667 25.6-128 17.066667-40.533333 40.533333-74.666667 70.4-104.533334s64-53.333333 104.533333-70.4c40.533333-17.066667 83.2-25.6 128-25.6 70.4 2.133333 136.533333 25.6 196.266667 68.266667z m44.8 262.4h85.333333c0 44.8-8.533333 87.466667-25.6 128-17.066667 40.533333-40.533333 74.666667-70.4 104.533333-29.866667 29.866667-64 53.333333-104.533333 70.4-40.533333 17.066667-83.2 25.6-128 25.6-72.533333 0-138.666667-21.333333-198.4-66.133333l-76.8 76.8c-2.133333 2.133333-4.266667 4.266667-6.4 2.133333-2.133333 0-2.133333-4.266667-2.133333-6.4V642.133333c0-4.266667 2.133333-8.533333 4.266666-10.666666 2.133333-2.133333 6.4-4.266667 10.666667-4.266667h204.8c4.266667 0 6.4 0 6.4 2.133333s0 4.266667-2.133333 6.4l-74.666667 74.666667c42.666667 29.866667 87.466667 42.666667 136.533333 42.666667 44.8 0 85.333333-10.666667 121.6-32 38.4-21.333333 66.133333-51.2 87.466667-87.466667s32-76.8 32-121.6z">
                                </path>
                            </svg>
                            <span
                                style="position: absolute; border: 0px; width: 1px; height: 1px; padding: 0px; margin: -1px; overflow: hidden; clip: rect(0px, 0px, 0px, 0px); white-space: nowrap; overflow-wrap: normal;">Hide
                                sidebar</span>
                        </span>
                    </span>
                    <span class="" data-state="closed">
                        <span id="switchItemSearcherShowElement"
                            class="flex gap-3 transition-colors duration-200 text-white cursor-pointer text-sm rounded-md border border-white/20 hover:bg-gray-500/10 h-11 w-7 flex-shrink-0 items-center justify-center">
                            <svg stroke="currentColor" fill="none" stroke-width="2"
                                viewBox="0 0 24 24" stroke-linecap="round"
                                stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em"
                                xmlns="http://www.w3.org/2000/svg">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="9" y1="3" x2="9" y2="21"></line>
                            </svg>
                            <span
                                style="position: absolute; border: 0px; width: 1px; height: 1px; padding: 0px; margin: -1px; overflow: hidden; clip: rect(0px, 0px, 0px, 0px); white-space: nowrap; overflow-wrap: normal;">Hide
                                sidebar</span>
                        </span>
                    </span>
                </div>
                <div
                    class="flex-col flex-1 transition-opacity duration-500 overflow-y-auto">
                    <div class="flex flex-col gap-2 pb-2 text-gray-100 text-sm">
                        <div>
                            <span id="chatItemContent">

                            </span>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    </div>
</div>`
    const itemContent = (index, title, content) => `<div class="relative" style="height: auto; opacity: 1; transform: none; transform-origin: 50% 50% 0px;">
    <ol>
        <li class="relative z-[15]"
            style="opacity: 1; height: auto; overflow: hidden; transform: none; transform-origin: 50% 50% 0px;">
            <a href="#${index}" title="${content.replace(/["\<\>]/g, "") || ''}"
                class="flex py-3 px-3 items-center gap-3 relative rounded-md hover:bg-[#2A2B32] cursor-pointer break-all )} )} hover:pr-4 bg-gray-900 group">
                <svg stroke="currentColor" fill="none"
                    stroke-width="2" viewBox="0 0 24 24"
                    stroke-linecap="round"
                    stroke-linejoin="round" class="h-4 w-4"
                    height="1em" width="1em"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <div
                    class="flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative">${title || ''}<div
                        class="absolute inset-y-0 right-0 w-8 z-10 bg-gradient-to-l from-gray-900 group-hover:from-[#2A2B32]"></div></div>
            </a>
        </li>
    </ol>
</div>`

    function refreshList() {
        allList = []
        let innerHTML = ""
        const allElements = document.querySelectorAll('#__next > div.overflow-hidden.w-full.h-full.relative.flex.z-0 > div.relative.flex.h-full.max-w-full.flex-1.overflow-hidden > div > main > div.flex-1.overflow-hidden > div > div > div > div > div > div.relative.flex.flex-col.gap-1')
        for (let i = 0; i < allElements.length; i += 2) {
            allElements[i].id = "chatgpt-" + (i + 1)
            const id = allElements[i].id
            const title = allElements[i].innerText.substring(0, 200)
            const content = allElements[i + 1].innerText.substring(0, 456)
            allList.push({
                id: id,
                title: title,
                content: content,
            })
            innerHTML += itemContent(allElements[i].id, title, content)
        }
        document.getElementById("chatItemContent").innerHTML = innerHTML
        setScrollSmooth()
    }

    let searchTimeout;

    function searchKeyChange() {
        clearTimeout(searchTimeout)
        searchTimeout = setTimeout(processSearch, 200);
    }

    function processSearch() {
        const searchKey = document.getElementById("searchKeyInput").value
        const searchList = searchKey ? allList.filter(m => m.title.includes(searchKey) || m.content.includes(searchKey)) : allList
        let innerHTML = ""
        for (let i = 0; i < searchList.length; i++) {
            innerHTML += itemContent(searchList[i].id, searchList[i].title, searchList[i].content)
        }
        document.getElementById("chatItemContent").innerHTML = innerHTML
    }

    function switchItemSearcherShow(show) {
        if (!chatItemLayout) return
        if (show) {
            chatItemLayout.style.width = "260px"
            chatItemLayout.style.visibility = "visible"
            chatItemShow.style.display = "none"
            if (allList.length <= 0) refreshList()
        } else {
            chatItemLayout.style.width = "0px"
            chatItemLayout.style.visibility = "hidden"
            chatItemShow.style.display = "inline-block"
        }
    }

    function setScrollSmooth() {
        const bodyContainer = document.querySelector("#__next > div.w-full.h-full.relative.flex.z-0 > div.relative.flex.h-full.max-w-full.flex-1 > div > main > div.flex-1 > div > div")
        if (bodyContainer) bodyContainer.style.scrollBehavior = "smooth"
    }

    let chatItemLayout;
    let chatItemShow;
    let chatItemContent;
    let allList = [];

    function initLayout() {
        chatItemContent = document.getElementById("chatItemContent")
        if (chatItemContent) return
        const parentLayout = document.querySelector("#__next > div.overflow-hidden.w-full.h-full.relative.flex.z-0")
        if (!parentLayout) {
            setTimeout(initLayout, 1000);
            return
        }
        chatItemLayout = document.createElement("div")
        chatItemLayout.className = "dark flex-shrink-0 overflow-x-hidden bg-gray-900"
        chatItemLayout.style.width = "0px"
        chatItemLayout.style.visibility = "hidden"
        chatItemLayout.innerHTML = listLayout
        parentLayout.appendChild(chatItemLayout)
        chatItemShow = document.createElement("div")
        chatItemShow.className = "absolute right-2 top-2 z-10 hidden md:inline-block"
        chatItemShow.innerHTML = listShowButtonHtml
        chatItemShow.onclick = switchItemSearcherShow.bind(chatItemShow, true)
        document.getElementsByTagName("main")[0].appendChild(chatItemShow)
        setTimeout(() => {
            document.getElementById("searchKeyInput").oninput = searchKeyChange
            document.getElementById("refreshListElement").onclick = refreshList
            document.getElementById("switchItemSearcherShowElement").onclick = switchItemSearcherShow.bind(this, false)
        }, 150);
    }
    initLayout()
})();