"use strict";
window.addEventListener("load", init);

let layoutTemplate = "";
const btn = document.querySelector(".btn");
const fileText = document.querySelector("#fileText");
const moduleList = document.querySelector("#module-list");

let moduleInfo = {
    "dynamicHero": {
        "name": "Dynamic Hero",
        "settings": [{
            "name": "Background Blue",
            "class": "t-bg-color-blue",
            "type": "checkbox",
            "id": "checkbox-bg",
        }]
    },
    "imageProduct": {
        "name": "Image Product",
    },
    "imageForm": {
        "name": "Image Form",
    },
    "textForm": {
        "name": "Text Form",
    },
    "spacer": {
        "name": "Spacer",
        "settings": [{
            "name": "Spacer Small",
            "class": "spacer__small",
            "type": "radio",
            "id": "radio-size",
            "index": "1",
            "checked": "checked",
        }, {
            "name": "Spacer Large",
            "class": "spacer__large",
            "type": "radio",
            "id": "radio-size",
            "index": "2",
        }]
    },
    "intro": {
        "name": "Intro",
    },
    "statementA": {
        "name": "Statement A",
    },
    "statementB": {
        "name": "Statement B",
    },
    "cards": {
        "name": "Cards",
        "settings": [{
            "name": "Background Grey",
            "class": "t-bg-color-grey",
            "type": "checkbox",
            "id": "checkbox-bg",
        }]
    },
    "infographics": {
        "name": "Infographics",
    },
    "article": {
        "name": "Article",
    },
    "articleTwoColumn": {
        "name": "Article Two Column",
    },
    "sideBySide": {
        "name": "Side By Side",
    },
    "keyNumbers": {
        "name": "Key Numbers",
    },
    "contactForm": {
        "name": "Contact Form",
    },
}

let state = {
    "header": ["header"],
    "modules": [{ "moduleName": "intro", "moduleIdNumber": "0Lbvj9" }, { "moduleName": "spacer", "moduleIdNumber": "Lqvjdr", "settings": { "radio-size": "radio-size_1_Lqvjdr" }, "open": true }, { "moduleName": "cards", "moduleIdNumber": "f9JkA5", "settings": {}, "open": true }],
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

    // console.log(state.modules[state.modules.length - 1])
    console.log(JSON.stringify(state.modules))
}

function updateModuleList() {
    moduleList.innerHTML = "";
    for (let i = 0; i < state.modules.length; i++) {
        let newItem = document.createElement("li");
        newItem.setAttribute("data-moduleIdNumber", state.modules[i].moduleIdNumber);
        if (state.modules[i].open) {
            newItem.classList.add("open");
        }
        // list item
        let newListItem = document.createElement("div");
        newListItem.classList.add("list-item");

        let newExpand = document.createElement("div");
        newExpand.classList.add("expand");
        newExpand.setAttribute("onclick", "expandModuleSettings(this)");

        let newModuleName = document.createElement("div");
        newModuleName.classList.add("module-name");
        newModuleName.innerHTML = moduleInfo[state.modules[i].moduleName].name;

        let newClose = document.createElement("div");
        newClose.classList.add("close");
        newClose.setAttribute("onclick", "removeModule(this)");

        newListItem.appendChild(newModuleName);
        if (moduleInfo[state.modules[i].moduleName].settings) {
            newListItem.appendChild(newExpand);
        }
        newListItem.appendChild(newClose);
        newItem.appendChild(newListItem);

        // settings
        if (moduleInfo[state.modules[i].moduleName].settings) {
            let newSettings = document.createElement("div");
            newSettings.classList.add("settings");

            let settingsArr = moduleInfo[state.modules[i].moduleName].settings;
            for (let j = 0; j < settingsArr.length; j++) {

                // label
                let newLabel = document.createElement("label");
                newLabel.innerHTML = settingsArr[j].name;

                let newInput = document.createElement("input");

                let newSpan = document.createElement("span");
                newSpan.classList.add("checkmark");

                // radio
                if (settingsArr[j]["type"] === "radio") {
                    newInput.name = settingsArr[j].id + "_" + state.modules[i].moduleIdNumber;
                    newInput.id = settingsArr[j].id + "_" + settingsArr[j].index + "_" + state.modules[i].moduleIdNumber;
                    newLabel.classList.add("radio");
                }

                // checkbox
                if (settingsArr[j]["type"] === "checkbox") {
                    newLabel.classList.add("checkbox");
                    newInput.id = settingsArr[j].id + "_" + state.modules[i].moduleIdNumber;
                }

                // shared
                newInput.type = settingsArr[j]["type"];
                newInput.setAttribute("onclick", "handleModuleSettings(this)");

                // checked if
                if (newInput.id === state.modules[i].settings[settingsArr[j].id]) {
                    newInput.checked = "checked";
                }

                newLabel.appendChild(newInput);
                newLabel.appendChild(newSpan);
                newSettings.appendChild(newLabel);
            }
            newItem.appendChild(newSettings);
        }
        moduleList.appendChild(newItem);
    }
}

function handleModuleSettings(target) {
    // console.log(target);

    const clickedItem = target.closest("li");
    const clickedIdNumber = clickedItem.getAttribute("data-moduleidnumber");
    const foundItem = state.modules.find(element => element.moduleIdNumber === clickedIdNumber);


    // radio
    if (target.type === "radio") {
        let foundItemSettings = moduleInfo[foundItem.moduleName].settings;
        let foundItemSettingsProp = foundItemSettings.find(element => element.id === target.id.split("_")[0]).id;
        foundItem.settings[foundItemSettingsProp] = target.id;
    }

    // checkbox
    if (target.type === "checkbox") {
        console.log("TEST");
        let foundItemSettings = moduleInfo[foundItem.moduleName].settings;
        console.log(foundItemSettings);
        let foundItemSettingsProp = foundItemSettings.find(element => element.id === target.id.split("_")[0]).id;
        console.log(foundItemSettingsProp);
        foundItem.settings[foundItemSettingsProp] = target.id;
    }

    // console.log(foundItem);
    // console.log(target.id, foundItem.moduleIdNumber, foundItem.settings)
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
    console.log("test", moduleInfo[moduleName])
    let newObj = {
        "moduleName": moduleName,
        "moduleIdNumber": makeId(6),
    }
    if (moduleInfo[moduleName].settings) {
        newObj.settings = {};
    }
    state.modules.push(newObj);
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
function makeId(length) {
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