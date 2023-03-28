"use strict";
window.addEventListener("load", init);

let layoutTemplate = "";
const btn = document.querySelector(".btn");
const fileText = document.querySelector("#fileText");
const moduleList = document.querySelector("#module-list");

let moduleInfo = {
    "dynamicHero": "Dynamic Hero",
    "imageProduct": "Image Product",
    "imageForm": "Image Form",
    "textForm": "Text Form",
    "spacer": "Spacer",
    "intro": "Intro",
    "statementA": "Statement A",
    "statementB": "Statement B",
    "cards": "Cards",
    "infographics": "Infographics",
    "article": "Article",
    "articleTwoColumn": "Article Two Column",
    "sideBySide": "Side By Side",
    "keyNumbers": "Key Numbers",
    "contactForm": "Contact Form",
}

let state = {
    "header": ["header"],
    // "modules": [],
    "modules": [{ "moduleName": "spacer", "moduleIdNumber": "FrXMgU" }, { "moduleName": "intro", "moduleIdNumber": "w5modL" }, { "moduleName": "spacer", "moduleIdNumber": "soGv8z" }],
    "footer": ["footer"],
    "legal": [],
    "previewSize": "full",
    "previewZoom": "25",
}

function init() {
    previewSize(state.previewSize);
    previewScale(state.previewZoom);
    render();
}

async function render() {

    // update module list
    updateModuleList();
    handleDragList(document.querySelector("#module-list"));

    // build template
    await buildTemplate();

    // update file for download
    updateFile();

    // update preview
    // preview();

    // console.log(JSON.stringify(state.modules))
}

function updateModuleList() {
    moduleList.innerHTML = "";
    for (let i = 0; i < state.modules.length; i++) {
        let newItem = document.createElement("li");
        newItem.setAttribute("data-moduleIdNumber", state.modules[i].moduleIdNumber)
        newItem.innerHTML = `
        <div class="accordion">
            <div class="expand" onclick="expandModuleSettings(this)">expand_more</div>
            <div class="module-name">${moduleInfo[state.modules[i].moduleName]}</div>
            <div class="close" onclick="removeModule(this)">close</div>
        </div>
        <div class="settings"></div>`;
        moduleList.appendChild(newItem);
    }
}

function expandModuleSettings(target) {
    const clickedItem = target.closest("li");
    const clickedIdNumber = clickedItem.getAttribute("data-moduleidnumber");
    const foundItem = state.modules.find(element => element.moduleIdNumber === clickedIdNumber);
    if (!clickedItem.classList.contains("open")) {
        target.closest("li").classList.add("open");
        foundItem.open = true;
    } else {
        target.closest("li").classList.remove("open");
        foundItem.open = false;
    }
}

function removeModule(target) {
    const clickedItem = target.closest("li");
    const clickedIdNumber = clickedItem.getAttribute("data-moduleidnumber");
    const foundIndex = state.modules.findIndex(element => element.moduleIdNumber === clickedIdNumber);
    state.modules.splice(foundIndex, 1);
    render();
}

function addHeader(moduleName) {
    state["header"] = [moduleName];
    render();
}
function addModule(moduleName) {
    let moduleIdNumber = makeid(6);
    state.modules.push({ moduleName: moduleName, moduleIdNumber: moduleIdNumber });
    render();
}
function addFooter(moduleName) {
    state["footer"] = [moduleName];
    render();
}
function addLegal(toggle) {
    if (toggle.checked) {
        state["legal"] = ["legal"];
    } else {
        state["legal"] = [];
    }
    render();
}
function makeid(length) {
    let result = "";
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
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
        layoutMain += importModules[state.modules[i].moduleName];
    }
    regex = /\[htmlMain\]/gi;
    layoutTemplate = layoutTemplate.replace(regex, layoutMain);

    regex = /\[htmlFooter\]/gi;
    layoutTemplate = layoutTemplate.replace(regex, `${(state.footer.length > 0 ? importFooters[state.footer] : "")}${(state.legal.length > 0 ? importFooters[state.legal] : "")}`);
}

function updateFile() {
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
    previewContainer.setAttribute("data-size", `${size}`);
    const selectedValue = document.querySelector(`#switch-screensize-${size}`);
    selectedValue.setAttribute("checked", "checked");
}
function previewScale(scale) {
    const previewContainer = document.querySelector("#iframe");
    previewContainer.setAttribute("data-scale", `${scale}`);
    const selectedValue = document.querySelector(`#switch-zoom-${scale}`);
    selectedValue.setAttribute("checked", "checked");
}

function handleDragList(list) {

    // get list items and set class
    let items = list.getElementsByTagName("li");
    let current;
    if (items.length > 0) {
        list.classList.add("dragList");
    } else {
        list.classList.remove("dragList");
    }

    // loop items and enable draggable
    for (let i = 0; i < items.length; i++) {
        // add draggable
        items[i].draggable = true;

        // drag start - add hint class
        items[i].ondragstart = e => {
            current = items[i];
            // for (let it of items) {
            for (let j = 0; j < items.length; j++) {
                if (items[j] != current) {
                    items[j].classList.add("hint");
                }
            }
        };

        // drag enter - add active class 
        items[i].ondragenter = e => {
            if (items[i] != current) {
                items[i].classList.add("active");
            }
        };

        // drag leave - remove active class
        items[i].ondragleave = () => items[i].classList.remove("active");

        // drag end - remove hint and active
        items[i].ondragend = () => {
            for (let j = 0; j < items.length; j++) {
                items[j].classList.remove("hint");
                items[j].classList.remove("active");
            }
        };

        // drag over - prevent default drop
        items[i].ondragover = e => e.preventDefault();

        // on drop - do stuff
        items[i].ondrop = e => {
            e.preventDefault();
            if (i != current) {
                let currentpos = 0;
                let droppedpos = 0;

                for (let j = 0; j < items.length; j++) {
                    if (current == items[j]) {
                        currentpos = j;
                    }
                    if (items[i] == items[j]) {
                        droppedpos = j;
                    }
                }

                if (currentpos < droppedpos) {
                    items[i].parentNode.insertBefore(current, items[i].nextSibling);
                } else {
                    items[i].parentNode.insertBefore(current, items[i]);
                }
            }

            // reorder state list
            let updatedList = [];
            for (let j = 0; j < moduleList.children.length; j++) {
                let idNumber = moduleList.children[j].getAttribute("data-moduleIdNumber");
                updatedList.push(state.modules.find(element => element.moduleIdNumber === idNumber));
            }
            state.modules = updatedList;
            render();
        };
    }
}