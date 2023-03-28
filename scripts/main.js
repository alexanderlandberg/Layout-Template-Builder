"use strict";

let layoutTemplate = "";
const btn = document.querySelector(".btn");
const fileText = document.querySelector("#fileText");

let state = {
    "header": [],
    "modules": [],
    "footer": [],
    "legal": [],
    "previewSize": "full",
    "previewZoom": "100%",
}

async function render() {
    console.log("RENDER")

    // update module list
    updateModuleList();
    handleDragList(document.querySelector("#module-list"));

    // build template
    await buildTemplate();

    // update file for download
    updateFile();

    // update preview
    preview();
}

function updateModuleList() {
    const sortList = document.querySelector("#module-list");
    sortList.innerHTML = "";
    for (let i = 0; i < state.modules.length; i++) {
        let newItem = document.createElement("li");
        newItem.innerHTML = state.modules[i];
        sortList.appendChild(newItem);
    }
}

function addHeader(moduleName) {
    state["header"] = [moduleName];
    render();
}
function addModule(moduleName) {
    state["modules"].push(moduleName);
    render();
}
function addFooter(moduleName) {
    state["footer"] = [moduleName];
    render();
}
function addLegal(moduleName) {
    state["legal"] = [moduleName];
    render();
}

async function buildTemplate() {
    let importTemplate = await import("./layouts/_template.js")
    let importHeaders = await import("./layouts/_headers.js")
    let importModules = await import("./layouts/_modules.js")
    let importFooters = await import("./layouts/_footers.js")

    layoutTemplate = importTemplate.template;
    let regex;

    regex = /\[htmlHeader\]/gi;
    layoutTemplate = layoutTemplate.replace(regex, (state.header.length > 0 ? importHeaders[state.header] : ""));

    let layoutMain = "";
    for (let i = 0; i < state.modules.length; i++) {
        layoutMain += importModules[state.modules[i]];
    }
    regex = /\[htmlMain\]/gi;
    layoutTemplate = layoutTemplate.replace(regex, layoutMain);

    regex = /\[htmlFooter\]/gi;
    layoutTemplate = layoutTemplate.replace(regex, `${(state.footer.length > 0 ? importFooters[state.footer] : "")}${(state.legal.length > 0 ? importFooters[state.legal] : "")}`);
}

function updateFile() {
    console.log("update file")
    fileText.value = layoutTemplate;
}

function download(filename, text) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function preview() {
    console.log("preview")
    const previewContainer = document.querySelector("#iframe");
    previewContainer.innerHTML = "";
    const iframe = document.createElement('iframe');
    const removeScroll = `<style type="text/css">body::-webkit-scrollbar{display:none;}body{-ms-overflow-style:none;scrollbar-width:none;}</style>`
    previewContainer.appendChild(iframe);
    iframe.contentWindow.document.open();
    iframe.contentWindow.document.write(layoutTemplate + removeScroll);
    iframe.contentWindow.document.close();
}
function previewSize(size) {
    const previewContainer = document.querySelector("#iframe");
    previewContainer.setAttribute("data-size", `${size}`)
}
function previewScale(scale) {
    const previewContainer = document.querySelector("#iframe");
    previewContainer.setAttribute("data-scale", `${scale}`)
}

function handleDragList(target) {
    // (A) SET CSS + GET ALL LIST ITEMS
    target.classList.add("dragList");
    let items = target.getElementsByTagName("li"), current = null;

    // (B) MAKE ITEMS DRAGGABLE + SORTABLE
    for (let i of items) {
        // (B1) ATTACH DRAGGABLE
        i.draggable = true;

        // (B2) DRAG START - YELLOW HIGHLIGHT DROPZONES
        i.ondragstart = e => {
            current = i;
            for (let it of items) {
                if (it != current) { it.classList.add("hint"); }
            }
        };

        // (B3) DRAG ENTER - RED HIGHLIGHT DROPZONE
        i.ondragenter = e => {
            if (i != current) { i.classList.add("active"); }
        };

        // (B4) DRAG LEAVE - REMOVE RED HIGHLIGHT
        i.ondragleave = () => i.classList.remove("active");

        // (B5) DRAG END - REMOVE ALL HIGHLIGHTS
        i.ondragend = () => {
            for (let it of items) {
                it.classList.remove("hint");
                it.classList.remove("active");
            }
        };

        // (B6) DRAG OVER - PREVENT THE DEFAULT "DROP", SO WE CAN DO OUR OWN
        i.ondragover = e => e.preventDefault();

        // (B7) ON DROP - DO SOMETHING
        i.ondrop = e => {
            e.preventDefault();
            if (i != current) {
                let currentpos = 0, droppedpos = 0;
                for (let it = 0; it < items.length; it++) {
                    if (current == items[it]) { currentpos = it; }
                    if (i == items[it]) { droppedpos = it; }
                }
                if (currentpos < droppedpos) {
                    i.parentNode.insertBefore(current, i.nextSibling);
                } else {
                    i.parentNode.insertBefore(current, i);
                }
            }
            // reorder module list
            console.log("REORDER");
            const sortList = document.querySelector("#module-list");
            let sortListNewOrder = [];
            for (let i = 0; i < sortList.children.length; i++) {
                sortListNewOrder.push(sortList.children[i].innerHTML);
            }
            state.modules = sortListNewOrder;
            render();
        };
    }
}