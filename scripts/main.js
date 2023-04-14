"use strict";
window.addEventListener("load", init);

// global variables
let layoutTemplate = "";
const btn = document.querySelector(".btn");
const headerList = document.querySelector("#header-module-list");
const moduleList = document.querySelector("#main-module-list");
const footerList = document.querySelector("#footer-module-list");
const downloadForm = document.querySelector("#downloadForm");
const moduleInfo = {
    "hero": {
        "name": "Hero",
        "settings": [{
            "name": "Background Blue",
            "class": "t-bg-color-blue",
            "type": "checkbox",
            "id": "checkbox-bg",
            "checked": "checked",
        }]
    },
    "header": {
        "name": "Header",
        "settings": [{
            "name": "Background Blue",
            "class": "t-bg-color-blue",
            "type": "checkbox",
            "id": "checkbox-bg",
            "checked": "checked",
        }]
    },
    "dynamicHero": {
        "name": "Dynamic Hero",
        "settings": [{
            "name": "Background Blue",
            "class": "t-bg-color-blue",
            "type": "checkbox",
            "id": "checkbox-bg",
            "checked": "checked",
        }, {
            "name": "Invert",
            "class": "inverted",
            "type": "checkbox",
            "id": "checkbox-invert"
        }]
    },
    "imageProduct": {
        "name": "Image Product",
        "settings": [{
            "name": "Background Blue",
            "class": "t-bg-color-blue",
            "type": "checkbox",
            "id": "checkbox-bg",
            "checked": "checked",
        }, {
            "name": "Invert",
            "class": "inverted",
            "type": "checkbox",
            "id": "checkbox-invert"
        }]
    },
    "imageForm": {
        "name": "Image Form",
        "settings": [{
            "name": "Background Blue",
            "class": "t-bg-color-blue",
            "type": "checkbox",
            "id": "checkbox-bg",
            "checked": "checked",
        }, {
            "name": "Invert",
            "class": "inverted",
            "type": "checkbox",
            "id": "checkbox-invert"
        }]
    },
    "textForm": {
        "name": "Text Form",
        "settings": [{
            "name": "Background Blue",
            "class": "t-bg-color-blue",
            "type": "checkbox",
            "id": "checkbox-bg",
            "checked": "checked",
        }, {
            "name": "Invert",
            "class": "inverted",
            "type": "checkbox",
            "id": "checkbox-invert"
        }]
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
        }, {
            "name": "Background Default",
            "class": "",
            "type": "radio",
            "id": "radio-bg",
            "index": "1",
            "checked": "checked",
        }, {
            "name": "Background Grey",
            "class": "t-bg-color-grey",
            "type": "radio",
            "id": "radio-bg",
            "index": "2",
        }, {
            "name": "Background Blue",
            "class": "t-bg-color-blue",
            "type": "radio",
            "id": "radio-bg",
            "index": "3",
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
        "settings": [{
            "name": "Background Blue",
            "class": "t-bg-color-blue",
            "type": "checkbox",
            "id": "checkbox-bg",
        }, {
            "name": "Invert",
            "class": "inverted",
            "type": "checkbox",
            "id": "checkbox-invert"
        }]
    },
    "keyNumbers": {
        "name": "Key Numbers",
    },
    "contactForm": {
        "name": "Contact Form",
        "settings": [{
            "name": "Background Grey",
            "class": "t-bg-color-grey",
            "type": "checkbox",
            "id": "checkbox-bg",
        }]
    },
    "footerENG": {
        "name": "Footer",
        "settings": [{
            "name": "Background Blue",
            "class": "t-bg-color-blue",
            "type": "checkbox",
            "id": "checkbox-bg",
            "checked": "checked",
        }]
    },
    "legal": {
        "name": "Legal",
        "settings": [{
            "name": "Background Dark Blue",
            "class": "t-bg-color-dark-blue",
            "type": "checkbox",
            "id": "checkbox-bg",
            "checked": "checked",
        }]
    },
    get footerFR() {
        return this["footerENG"]
    },
    get footerES() {
        return this["footerENG"]
    },
    get footerPT() {
        return this["footerENG"]
    },
}
const defaultState = {
    "header": [],
    "modules": [],
    "footer": [],
    "legal": [],
    "previewSize": "full",
    "previewZoom": "100",
    "templateName": "template",
}

// state
let state = {
    "header": [],
    "modules": [],
    "footer": [],
    "legal": [],
    "previewSize": "full",
    "previewZoom": "25",
    "templateName": "template",
}

// ---------- MAIN FUNCTIONS ----------

function init() {
    getLocaleStorage();
    previewSize(state.previewSize);
    previewScale(state.previewZoom);
    downloadForm.addEventListener("submit", preventFormSubmit);
    render();
}

async function render() {

    // update module list
    updateModuleList("header");
    updateModuleList("modules");
    updateModuleList("footer");
    updateModuleList("legal");
    handleDragList(document.querySelector("#main-module-list"));

    // build template
    await buildTemplate();

    // update file for download
    updateFile();
    document.querySelector("input[name='templateName']").value = state.templateName;

    // update preview
    preview();

    // set local storage
    setLocalStorage();

    // console.log(state.modules[state.modules.length - 1])
    // console.log(JSON.stringify(state.modules))
    console.log(state.legal)
}

async function buildTemplate() {
    let importTemplate = await import("./layouts/_template.js")
    let importHeaders = await import("./layouts/_headers.js")
    let importModules = await import("./layouts/_modules.js")
    let importFooters = await import("./layouts/_footers.js")

    layoutTemplate = importTemplate.template;
    let regex, layoutModule, layoutHeader = "", layoutMain = "", layoutFooter = "";

    // header
    layoutModule = (state.header.length > 0 ? importHeaders[state.header[0].moduleName] : "")
    layoutHeader += addClassList(layoutModule, "header");
    regex = /\[htmlHeader\]/gi;
    layoutTemplate = layoutTemplate.replace(regex, layoutHeader);

    // main
    for (let i = 0; i < state.modules.length; i++) {
        layoutModule = importModules[state.modules[i].moduleName]
        layoutMain += addClassList(layoutModule, "modules", i);
    }
    regex = /\[htmlMain\]/gi;
    layoutTemplate = layoutTemplate.replace(regex, layoutMain);

    // footer
    layoutModule = (state.footer.length > 0 ? importFooters[state.footer[0].moduleName] : "")
    layoutFooter += addClassList(layoutModule, "footer");

    // legal
    layoutModule = (state.legal.length > 0 ? importFooters[state.legal[0].moduleName] : "")
    layoutFooter += addClassList(layoutModule, "legal");

    regex = /\[currentYear\]/gi;
    layoutFooter = layoutFooter.replace(regex, new Date().getFullYear());

    regex = /\[htmlFooter\]/gi;
    layoutTemplate = layoutTemplate.replace(regex, layoutFooter);

    function addClassList(layoutModule, listGroup, index) {
        if (listGroup !== "modules") {
            index = 0;
        }
        let classArr = [];
        if (state[listGroup][index] && state[listGroup][index].settings) {
            for (let i = 0; i < Object.keys(state[listGroup][index].settings).length; i++) {
                let settingsProp = Object.keys(state[listGroup][index].settings)[i];

                let settingsType = moduleInfo[state[listGroup][index].moduleName].settings.find(element => element.id === settingsProp).type;
                let settingsValueIndex, settingState;
                // if radio
                if (settingsType === "radio") {
                    settingsValueIndex = state[listGroup][index].settings[settingsProp].split("_")[1];
                    settingState = moduleInfo[state[listGroup][index].moduleName].settings.find(element => (element.id === settingsProp && element.index === settingsValueIndex));
                }
                // if checkbox
                if (settingsType === "checkbox") {
                    settingsValueIndex = state[listGroup][index].settings[settingsProp].split("_")[0];
                    settingState = moduleInfo[state[listGroup][index].moduleName].settings.find(element => element.id === settingsProp);
                }
                classArr.push(settingState.class);
            }
        }
        regex = /\[classList\]/gi;
        layoutModule = layoutModule.replace(regex, classArr.join(" "));
        return layoutModule;
    }

}

function resetTemplate() {
    state.header = JSON.parse(JSON.stringify(defaultState)).header;
    state.modules = JSON.parse(JSON.stringify(defaultState)).modules;
    state.footer = JSON.parse(JSON.stringify(defaultState)).footer;
    state.legal = JSON.parse(JSON.stringify(defaultState)).legal;
    render();
}

function setLocalStorage() {
    localStorage.setItem("LayoutTemplateBuilderState", JSON.stringify(state))
}

function getLocaleStorage() {
    if (localStorage.getItem("LayoutTemplateBuilderState") !== null) {
        state = JSON.parse(localStorage.getItem("LayoutTemplateBuilderState"));
    }
}

// ---------- MODULE LIST ----------

function updateModuleList(listGroup) {

    if (listGroup === "modules") {
        moduleList.innerHTML = "";
    } else if (listGroup === "header") {
        headerList.innerHTML = "";
    } else if (listGroup === "footer") {
        footerList.innerHTML = "";
    } else if (listGroup === "legal") {
        // legal
    }

    for (let i = 0; i < state[listGroup].length; i++) {
        let newItem = document.createElement("li");
        newItem.setAttribute("data-moduleIdNumber", state[listGroup][i].moduleIdNumber);
        if (state[listGroup][i].open || listGroup !== "modules") {
            newItem.classList.add("open");
        }
        // list item
        let newListItem = document.createElement("div");
        newListItem.classList.add("list-item");

        let newExpand = document.createElement("div");
        newExpand.classList.add("expand");
        newExpand.setAttribute("onclick", `expandModuleSettings(this, "${listGroup}")`);

        let newModuleName = document.createElement("div");
        newModuleName.classList.add("module-name");
        newModuleName.innerHTML = moduleInfo[state[listGroup][i].moduleName].name;

        let newClose = document.createElement("div");
        newClose.classList.add("close");
        newClose.setAttribute("onclick", `removeModule(this), "${listGroup}"`);

        newListItem.appendChild(newModuleName);
        if (moduleInfo[state[listGroup][i].moduleName].settings && listGroup === "modules") {
            newListItem.appendChild(newExpand);
        }
        if (listGroup === "modules") {
            newListItem.appendChild(newClose);
        }
        newItem.appendChild(newListItem);

        // settings
        if (moduleInfo[state[listGroup][i].moduleName].settings) {
            let newSettings = document.createElement("div");
            newSettings.classList.add("settings");

            let settingsArr = moduleInfo[state[listGroup][i].moduleName].settings;
            for (let j = 0; j < settingsArr.length; j++) {

                // label
                let newLabel = document.createElement("label");
                newLabel.innerHTML = settingsArr[j].name;

                let newInput = document.createElement("input");

                let newSpan = document.createElement("span");
                newSpan.classList.add("checkmark");

                // radio
                if (settingsArr[j]["type"] === "radio") {
                    newInput.name = settingsArr[j].id + "_" + state[listGroup][i].moduleIdNumber;
                    newInput.id = settingsArr[j].id + "_" + settingsArr[j].index + "_" + state[listGroup][i].moduleIdNumber;
                    newLabel.classList.add("radio");
                }

                // checkbox
                if (settingsArr[j]["type"] === "checkbox") {
                    newLabel.classList.add("checkbox");
                    newInput.id = settingsArr[j].id + "_" + state[listGroup][i].moduleIdNumber;
                }

                // shared
                newInput.type = settingsArr[j]["type"];
                newInput.setAttribute("onclick", `handleModuleSettings(this, "${listGroup}")`);

                // checked if
                if (newInput.id === state[listGroup][i].settings[settingsArr[j].id]) {
                    newInput.checked = "checked";
                }

                newLabel.appendChild(newInput);
                newLabel.appendChild(newSpan);
                newSettings.appendChild(newLabel);
            }
            newItem.appendChild(newSettings);
        }
        if (listGroup === "modules") {
            moduleList.appendChild(newItem);
        } else if (listGroup === "header") {
            headerList.appendChild(newItem);
        } else if (listGroup === "footer") {
            footerList.appendChild(newItem);
        } else if (listGroup === "legal") {
            footerList.appendChild(newItem);
        }
    }
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
            // e.dataTransfer.setDragImage(new Image(), 0, 0); // remove drag image
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

function removeModule(target) {
    const clickedItem = target.closest("li");
    const clickedIdNumber = clickedItem.getAttribute("data-moduleidnumber");
    const foundIndex = state.modules.findIndex(element => element.moduleIdNumber === clickedIdNumber);
    state.modules.splice(foundIndex, 1);
    render();
}

function expandModuleSettings(target, listGroup) {
    const clickedItem = target.closest("li");
    const clickedIdNumber = clickedItem.getAttribute("data-moduleidnumber");
    const foundItem = state[listGroup].find(element => element.moduleIdNumber === clickedIdNumber);
    if (!clickedItem.classList.contains("open")) {
        target.closest("li").classList.add("open");
        foundItem.open = true;
    } else {
        target.closest("li").classList.remove("open");
        foundItem.open = false;
    }
    setLocalStorage();
}

function expandAllSettings() {
    for (let i = 0; i < state.modules.length; i++) {
        if (moduleInfo[state.modules[i].moduleName].settings) {
            state.modules[i].open = true;
            moduleList.children[i].classList.add("open");
        }
    }
    setLocalStorage();
}

function collapseAllSettings() {
    for (let i = 0; i < state.modules.length; i++) {
        if (moduleInfo[state.modules[i].moduleName].settings) {
            state.modules[i].open = false;
            moduleList.children[i].classList.remove("open");
        }
    }
    setLocalStorage();
}

function handleModuleSettings(target, listGroup) {
    const clickedItem = target.closest("li");
    const clickedIdNumber = clickedItem.getAttribute("data-moduleidnumber");
    const foundItem = state[listGroup].find(element => element.moduleIdNumber === clickedIdNumber);

    // radio
    if (target.type === "radio") {
        let foundItemSettings = moduleInfo[foundItem.moduleName].settings;
        let foundItemSettingsProp = foundItemSettings.find(element => element.id === target.id.split("_")[0]).id;
        foundItem.settings[foundItemSettingsProp] = target.id;
    }

    // checkbox
    if (target.type === "checkbox") {
        let foundItemSettings = moduleInfo[foundItem.moduleName].settings;
        let foundItemSettingsProp = foundItemSettings.find(element => element.id === target.id.split("_")[0]).id;
        if (target.checked) {
            foundItem.settings[foundItemSettingsProp] = target.id;
        } else {
            delete foundItem.settings[foundItemSettingsProp];
        }
    }
    render();
}

// ---------- ADD MODULES ----------

function addModule(moduleName, listGroup, toggle) {
    let idNumber = makeId(6);
    let newObj = {
        "moduleName": moduleName,
        "moduleIdNumber": idNumber,
    }
    if (moduleInfo[moduleName].settings) {
        newObj.settings = {};
        for (let i = 0; i < moduleInfo[moduleName].settings.length; i++) {
            if (moduleInfo[moduleName].settings[i] && moduleInfo[moduleName].settings[i].checked) {
                // radio
                if (moduleInfo[moduleName].settings[i].type === "radio") {
                    newObj.settings[moduleInfo[moduleName].settings[i].id] = moduleInfo[moduleName].settings[i].id + "_" + moduleInfo[moduleName].settings[i].index + "_" + idNumber;
                }
                // checkbox
                if (moduleInfo[moduleName].settings[i].type === "checkbox") {
                    newObj.settings[moduleInfo[moduleName].settings[i].id] = moduleInfo[moduleName].settings[i].id + "_" + idNumber;
                }
            }
        }
    }
    listGroup
    if (listGroup === "modules") {
        state.modules.push(newObj);
    } else if (listGroup === "header") {
        state.header = [newObj];
    } else if (listGroup === "footer") {
        state.footer = [newObj];
    } else if (listGroup === "legal") {
        if (toggle.checked) {
            state.legal = [newObj];
        } else {
            state["legal"] = [];
        }
    }
    render();
}

// ---------- DOWNLOAD ----------

function updateFile() {
    document.querySelector("#fileText").value = layoutTemplate;
}

function updateTemplateName(target) {
    state.templateName = target.value.length > 0 ? target.value : "template";
    console.log(state.templateName);
    setLocalStorage();
}

function downloadTemplate() {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(document.querySelector("#fileText").value));
    element.setAttribute('download', (state.templateName + ".html"));

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function preventFormSubmit(event) {
    event.preventDefault();
}

// ---------- PREVIEW ----------

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
    state.previewSize = size;
    // disable zoom if not full
    const switchZoom = document.querySelector("#switch-zoom");
    if (size !== "full") {
        switchZoom.classList.add("disabled");
        for (let i = 0; i < switchZoom.children.length; i++) {
            switchZoom.children[i].children[0].setAttribute("disabled", "disabled");
        }
    } else {
        switchZoom.classList.remove("disabled");
        for (let i = 0; i < switchZoom.children.length; i++) {
            switchZoom.children[i].children[0].removeAttribute("disabled");
        }
    }
    setLocalStorage();
}

function previewScale(scale) {
    const previewContainer = document.querySelector("#iframe");
    previewContainer.setAttribute("data-scale", `${scale}`);
    const selectedValue = document.querySelector(`#switch-zoom-${scale}`);
    selectedValue.setAttribute("checked", "checked");
    state.previewZoom = scale;
    setLocalStorage();
}

// ---------- SUPPORTING FUNCTIONS ----------

function makeId(length) {
    let result = "";
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}