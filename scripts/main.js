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
    await updateModuleList();
    await slist(document.querySelector("#module-list"));

    // build template
    await buildTemplate();

    // update file for download
    await updateFile();
}

async function updateModuleList() {
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
async function addModule(moduleName) {
    state["modules"].push(moduleName);
    render();
}
async function addFooter(moduleName) {
    state["footer"] = [moduleName];
    render();
}
async function addLegal(moduleName) {
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

async function updateFile() {
    console.log("update file")
    fileText.value = layoutTemplate;
    console.log(layoutTemplate)
}

async function download(filename, text) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

async function preview() {
    console.log("preview")
    const previewContainer = document.querySelector("#preview");
    previewContainer.innerHTML = "";
    const iframe = document.createElement('iframe');
    const removeScroll = `<style type="text/css">body::-webkit-scrollbar{display:none;}body{-ms-overflow-style:none;scrollbar-width:none;}</style>`
    previewContainer.appendChild(iframe);
    iframe.contentWindow.document.open();
    iframe.contentWindow.document.write(layoutTemplate + removeScroll);
    iframe.contentWindow.document.close();
}
async function previewSize(size) {
    const previewContainer = document.querySelector("#preview");
    previewContainer.setAttribute("data-size", `${size}`)
}
async function previewScale(scale) {
    const previewContainer = document.querySelector("#preview");
    previewContainer.setAttribute("data-scale", `${scale}`)
}