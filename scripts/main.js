"use strict";
window.addEventListener("load", init);

// global variables
let layoutTemplate = "";
const footerLangs = ["footerENG", "footerFR", "footerES", "footerPT"];
// query selectors
let templateSelect, darkmodeToggle, headerList, moduleList, footerList, downloadForm;
// module info
const moduleInfo = {
    "hero": {
        "name": "Hero",
        "settings": [{
            "name": "BG Blue",
            "class": "t-bg-color-blue",
            "type": "checkbox",
            "id": "checkbox-bg",
            "checked": "checked",
        }]
    },
    "header": {
        "name": "Header",
        "settings": [{
            "name": "BG Blue",
            "class": "t-bg-color-blue",
            "type": "checkbox",
            "id": "checkbox-bg",
            "checked": "checked",
        }]
    },
    "dynamicHero": {
        "name": "Dynamic Hero",
        "settings": [{
            "name": "BG Blue",
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
            "name": "BG Blue",
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
            "name": "BG Blue",
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
            "name": "BG Blue",
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
            "label": "Spacer size",
            "name": "Small",
            "class": "spacer__small",
            "type": "radio",
            "id": "radio-size",
            "index": "1",
            "checked": "checked",
        }, {
            "label": "Spacer size",
            "name": "Large",
            "class": "spacer__large",
            "type": "radio",
            "id": "radio-size",
            "index": "2",
        }, {
            "label": "Background color",
            "name": "White (Default)",
            "class": "",
            "type": "radio",
            "id": "radio-bg",
            "index": "1",
            "checked": "checked",
        }, {
            "label": "Background color",
            "name": "Grey",
            "class": "t-bg-color-grey",
            "type": "radio",
            "id": "radio-bg",
            "index": "2",
        }, {
            "label": "Background color",
            "name": "Blue",
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
            "name": "BG Grey",
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
            "name": "BG Blue",
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
            "name": "BG Grey",
            "class": "t-bg-color-grey",
            "type": "checkbox",
            "id": "checkbox-bg",
        }]
    },
    "footerENG": {
        "name": "Footer",
        "settings": [{
            "name": "BG Blue",
            "class": "t-bg-color-blue",
            "type": "checkbox",
            "id": "checkbox-bg",
            "checked": "checked",
        }]
    },
    "legal": {
        "name": "Legal",
        "settings": [{
            "name": "BG Dark Blue",
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
// default state
const defaultSharedState = {
    "templateList": [],
    "currentTemplateIndex": 0,
    "previewSize": "full",
    "previewZoom": "100",
}
const defaultState = {
    "header": [],
    "modules": [],
    "footer": [],
    "legal": [],
    "templateName": "new template",
}

// template list
let templateList = [];
let currentTemplateIndex = 0;

// state
let state;
let sharedState = {
    "previewSize": "full",
    "previewZoom": "100",
    "darkmode": undefined,
}

// ---------- MAIN FUNCTIONS ----------

async function init() {
    getLocalStorage();

    const uiLayout = await getUiLayout();
    buildUiLayout(uiLayout);

    initTemplate();
    render();
    previewSize(sharedState.previewSize);
    previewScale(sharedState.previewZoom);
    initDarkmode();
}

async function render() {

    // set state from template
    state = templateList[currentTemplateIndex];

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
        layoutModule = addModuleIndex(layoutModule, i);
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

    function addModuleIndex(layoutModule, index) {
        let regex = /\[index\]/gi;
        layoutModule = layoutModule.replace(regex, `_${index + 1}`);
        return layoutModule;
    }
}

// ---------- LOCAL STORAGE ----------

function setLocalStorage() {
    sharedState = {
        "templateList": templateList,
        "currentTemplateIndex": currentTemplateIndex,
        "previewSize": sharedState?.previewSize,
        "previewZoom": sharedState?.previewZoom,
        "darkmode": sharedState?.darkmode,
    }
    localStorage.setItem("LayoutTemplateBuilderState", JSON.stringify(sharedState));
}

function getLocalStorage() {
    if (localStorage.getItem("LayoutTemplateBuilderState") !== null) {
        sharedState = JSON.parse(localStorage.getItem("LayoutTemplateBuilderState"));
        templateList = sharedState.templateList;
        currentTemplateIndex = sharedState.currentTemplateIndex;
    }
}

function resetAll() {
    sharedState.templateList = [];
    sharedState.currentTemplateIndex = 0;
    localStorage.setItem("LayoutTemplateBuilderState", JSON.stringify(sharedState));
    location.reload();
}

// ---------- HANDLE TEMPLATES ----------

function initTemplate() {
    if (templateList.length === 0) {
        addTemplate();
    }
    state = templateList[currentTemplateIndex];
    sharedTemplateFunc();
}

function addTemplate() {
    templateList.push(JSON.parse(JSON.stringify(defaultState)));
    currentTemplateIndex = templateList.length - 1;
    sharedTemplateFunc();
}

function removeTemplate() {
    if (templateList.length > 1) {
        templateList.splice(currentTemplateIndex, 1);
        if (currentTemplateIndex > 0) {
            currentTemplateIndex--;
        } else {
            currentTemplateIndex = 0;
        }
        sharedTemplateFunc();
    }
}

function switchTemplate() {
    currentTemplateIndex = (templateSelect.value - 1);
    sharedTemplateFunc();
}

function resetTemplate() {
    state.header = JSON.parse(JSON.stringify(defaultState)).header;
    state.modules = JSON.parse(JSON.stringify(defaultState)).modules;
    state.footer = JSON.parse(JSON.stringify(defaultState)).footer;
    state.legal = JSON.parse(JSON.stringify(defaultState)).legal;
    sharedTemplateFunc();
}

async function sharedTemplateFunc() {
    // update ui
    const uiLayout = await getUiLayout();
    buildUiLayout(uiLayout);

    // set select options
    templateSelect.innerHTML = "";
    for (let i = 0; i < templateList.length; i++) {
        let newOption = document.createElement("option");
        newOption.setAttribute("value", i + 1);
        newOption.innerHTML = `${i + 1}. <span>${templateList[i].templateName}</span>`;
        if (i === currentTemplateIndex) {
            newOption.setAttribute("selected", "selected");
        }
        templateSelect.appendChild(newOption);
    }

    // set button states
    const btnRemove = document.querySelector("#btn-remove-template");
    if (templateList.length < 2) {
        btnRemove.classList.add("disabled");
    } else {
        btnRemove.classList.remove("disabled");
    }

    render();
}

// ---------- MODULE LIST ----------

function updateModuleList(listGroup) {

    if (listGroup === "modules") {
        moduleList.innerHTML = "";
    } else if (listGroup === "header") {
        headerList.innerHTML = "";
    } else if (listGroup === "footer") {
        footerList.innerHTML = "";
    }

    // add "empty" class if list is empty
    if (state[listGroup].length === 0) {
        if (listGroup === "modules") {
            moduleList.closest(".ui-row").classList.add("empty")
        } else if (listGroup === "header") {
            headerList.closest(".ui-row").classList.add("empty")
        } else if (listGroup === "footer") {
            footerList.closest(".ui-row").classList.add("empty")
        }
    } else {
        if (listGroup === "modules") {
            moduleList.closest(".ui-row").classList.remove("empty")
        } else if (listGroup === "header") {
            headerList.closest(".ui-row").classList.remove("empty")
        } else if (listGroup === "footer" || listGroup === "legal") {
            footerList.closest(".ui-row").classList.remove("empty")
        }
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

            let newRadioGroup;
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

                    // radio group
                    if (newSettings.querySelector(`[tempId=${settingsArr[j].id}]`) === null) {
                        newRadioGroup = document.createElement("div");
                        newRadioGroup.classList.add("radio-group");
                        newRadioGroup.setAttribute("tempId", settingsArr[j].id);
                        let newRadioGroupLabel = document.createElement("div");
                        newRadioGroupLabel.innerHTML = settingsArr[j].label + ":";
                        newRadioGroupLabel.classList.add("radio-group-label");
                        newRadioGroup.appendChild(newRadioGroupLabel);
                    } else {
                        newRadioGroup = newSettings.querySelector(`[tempId=${settingsArr[j].id}]`);
                    }
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
                if (settingsArr[j]["type"] === "radio") {
                    newRadioGroup.appendChild(newLabel);
                    newSettings.appendChild(newRadioGroup);
                } else {
                    newSettings.appendChild(newLabel);
                }
            }
            // clean up radio group
            for (let j = 0; j < newSettings.querySelectorAll(".radio-group").length; j++) {
                newSettings.querySelectorAll(".radio-group")[j].removeAttribute("tempId");
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
        target.closest("li").classList.add("is-opening");
        setTimeout(() => {
            target.closest("li").classList.remove("is-opening");
        }, 500);
        foundItem.open = true;
    } else {
        target.closest("li").classList.remove("open");
        target.closest("li").classList.add("is-closing");
        setTimeout(() => {
            target.closest("li").classList.remove("is-closing");
        }, 500);
        foundItem.open = false;
    }
    setLocalStorage();
}

function expandAllSettings() {
    for (let i = 0; i < state.modules.length; i++) {
        if (moduleInfo[state.modules[i].moduleName].settings) {
            state.modules[i].open = true;
            moduleList.children[i].classList.add("open");
            moduleList.children[i].classList.add("is-opening");
            setTimeout(() => {
                moduleList.children[i].classList.remove("is-opening");
            }, 500);
        }
    }
    setLocalStorage();
}

function collapseAllSettings() {
    for (let i = 0; i < state.modules.length; i++) {
        if (moduleInfo[state.modules[i].moduleName].settings) {
            state.modules[i].open = false;
            moduleList.children[i].classList.remove("open");
            moduleList.children[i].classList.add("is-closing");
            setTimeout(() => {
                moduleList.children[i].classList.remove("is-closing");
            }, 500);
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
    templateSelect.children[currentTemplateIndex].children[0].innerHTML = state.templateName;
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

function downloadAllTemplates() {
    const currentFooter = state.footer[0]?.moduleName;

    // loop through each footer
    let i = 0;
    function footerLoop() {
        addModule(footerLangs[i], 'footer');
        setTimeout(function () {

            const element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(document.querySelector("#fileText").value));
            element.setAttribute('download', (state.templateName + "-" + footerLangs[i].split("footer")[1] + ".html"));
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);

            i++;
            if (i < footerLangs.length) {
                footerLoop();
            }
        }, 500)
    }
    footerLoop()

    // reset current footer
    setTimeout(function () {
        if (currentFooter) {
            addModule(currentFooter, 'footer');
        } else {
            console.log("reset footer");
            state.footer = [];
            render();
        }
    }, (500 * (footerLangs.length + 1)))
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
    sharedState.previewSize = size;
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
    sharedState.previewZoom = scale;
    setLocalStorage();
}

// ---------- BUILD UI ----------

async function getUiLayout() {

    let importUiComponents = await import("./layouts/_ui-components.js");

    const uiLayout = [
        {
            "template": importUiComponents.uiDropdownButton,
            "label": {
                "innerHTML": "Templates",
            },
            "select": {
                "id": "templateList",
                "onchange": "switchTemplate()"
            },
            "button": {
                "innerHTML": "Add Template",
                "onclick": "addTemplate()",
            }
        },
        {
            "template": importUiComponents.uiTextInput,
            "label": {
                "innerHTML": "Template Name",
            },
            "input": {
                "name": "templateName",
                "value": "",
                "placeholder": "Name of HTML file",
                "oninput": "updateTemplateName(this)",
            }
        },
        {
            "template": importUiComponents.uiToggleSwitch,
            "label": {
                "innerHTML": "Header",
            },
            "loop": [
                {
                    "template": importUiComponents.uiToggleSwitchLoop,
                    "label": {
                        "innerHTML": "header",
                        "for": "switch-header-1",
                    },
                    "input": {
                        "id": "switch-header-1",
                        "name": "switch-header",
                        "onclick": "addModule('header', 'header')",
                        "checked": (templateList[currentTemplateIndex]?.header[0]?.moduleName === "header"),
                    }
                },
                {
                    "template": importUiComponents.uiToggleSwitchLoop,
                    "label": {
                        "innerHTML": "hero",
                        "for": "switch-header-2",
                    },
                    "input": {
                        "id": "switch-header-2",
                        "name": "switch-header",
                        "onclick": "addModule('hero', 'header')",
                        "checked": (templateList[currentTemplateIndex]?.header[0]?.moduleName === "hero"),
                    }
                }
            ]
        },
        {
            "template": importUiComponents.uiModuleList,
            "templateClassList": [],
            "label": {
                "innerHTML": "Header List",
            },
            "ul": {
                "id": "header-module-list",
            }
        },
        {
            "template": importUiComponents.uiButtonGroup,
            "label": {
                "innerHTML": "Modules",
            },
            "loop": [
                {
                    "template": importUiComponents.uiButtonGroupLoop,
                    "button": {
                        "innerHTML": "Dynamic Hero +",
                        "onclick": "addModule('dynamicHero', 'modules')",
                    }
                },
                {
                    "template": importUiComponents.uiButtonGroupLoop,
                    "button": {
                        "innerHTML": "Image Product +",
                        "onclick": "addModule('imageProduct', 'modules')",
                    }
                },
                {
                    "template": importUiComponents.uiButtonGroupLoop,
                    "button": {
                        "innerHTML": "Image Form +",
                        "onclick": "addModule('imageForm', 'modules')",
                    }
                },
                {
                    "template": importUiComponents.uiButtonGroupLoop,
                    "button": {
                        "innerHTML": "Text Form +",
                        "onclick": "addModule('textForm', 'modules')",
                    }
                },
                {
                    "template": importUiComponents.uiButtonGroupLoop,
                    "button": {
                        "innerHTML": "Spacer +",
                        "onclick": "addModule('spacer', 'modules')",
                    }
                },
                {
                    "template": importUiComponents.uiButtonGroupLoop,
                    "button": {
                        "innerHTML": "Intro +",
                        "onclick": "addModule('intro', 'modules')",
                    }
                },
                {
                    "template": importUiComponents.uiButtonGroupLoop,
                    "button": {
                        "innerHTML": "Statement A +",
                        "onclick": "addModule('statementA', 'modules')",
                    }
                },
                {
                    "template": importUiComponents.uiButtonGroupLoop,
                    "button": {
                        "innerHTML": "Statement B +",
                        "onclick": "addModule('statementB', 'modules')",
                    }
                },
                {
                    "template": importUiComponents.uiButtonGroupLoop,
                    "button": {
                        "innerHTML": "Cards +",
                        "onclick": "addModule('cards', 'modules')",
                    }
                },
                {
                    "template": importUiComponents.uiButtonGroupLoop,
                    "button": {
                        "innerHTML": "Infographics +",
                        "onclick": "addModule('infographics', 'modules')",
                    }
                },
                {
                    "template": importUiComponents.uiButtonGroupLoop,
                    "button": {
                        "innerHTML": "Article +",
                        "onclick": "addModule('article', 'modules')",
                    }
                },
                {
                    "template": importUiComponents.uiButtonGroupLoop,
                    "button": {
                        "innerHTML": "Article Two Column +",
                        "onclick": "addModule('articleTwoColumn', 'modules')",
                    }
                },
                {
                    "template": importUiComponents.uiButtonGroupLoop,
                    "button": {
                        "innerHTML": "Side By Side +",
                        "onclick": "addModule('sideBySide', 'modules')",
                    }
                },
                {
                    "template": importUiComponents.uiButtonGroupLoop,
                    "button": {
                        "innerHTML": "Key Numbers +",
                        "onclick": "addModule('keyNumbers', 'modules')",
                    }
                },
                {
                    "template": importUiComponents.uiButtonGroupLoop,
                    "button": {
                        "innerHTML": "Contact Form +",
                        "onclick": "addModule('contactForm', 'modules')",
                    }
                },
            ]
        },
        {
            "template": importUiComponents.uiModuleList,
            "templateClassList": [],
            "label": {
                "innerHTML": `Module List <span class="collapse-all" onclick="collapseAllSettings()">Collapse All</span><span class="expand-all" onclick="expandAllSettings()">Expand All</span>`,
            },
            "ul": {
                "id": "main-module-list",
            }
        },
        {
            "template": importUiComponents.uiToggleSwitch,
            "label": {
                "innerHTML": "Footers",
            },
            "loop": [
                {
                    "template": importUiComponents.uiToggleSwitchLoop,
                    "label": {
                        "innerHTML": "ENG",
                        "for": "switch-footer-1",
                    },
                    "input": {
                        "id": "switch-footer-1",
                        "name": "switch-footer",
                        "onclick": "addModule('footerENG', 'footer')",
                        "checked": (templateList[currentTemplateIndex]?.footer[0]?.moduleName === "footerENG"),
                    }
                },
                {
                    "template": importUiComponents.uiToggleSwitchLoop,
                    "label": {
                        "innerHTML": "FR",
                        "for": "switch-footer-2",
                    },
                    "input": {
                        "id": "switch-footer-2",
                        "name": "switch-footer",
                        "onclick": "addModule('footerFR', 'footer')",
                        "checked": (templateList[currentTemplateIndex]?.footer[0]?.moduleName === "footerFR"),
                    }
                },
                {
                    "template": importUiComponents.uiToggleSwitchLoop,
                    "label": {
                        "innerHTML": "ES",
                        "for": "switch-footer-3",
                    },
                    "input": {
                        "id": "switch-footer-3",
                        "name": "switch-footer",
                        "onclick": "addModule('footerES', 'footer')",
                        "checked": (templateList[currentTemplateIndex]?.footer[0]?.moduleName === "footerES"),
                    }
                },
                {
                    "template": importUiComponents.uiToggleSwitchLoop,
                    "label": {
                        "innerHTML": "PT",
                        "for": "switch-footer-4",
                    },
                    "input": {
                        "id": "switch-footer-4",
                        "name": "switch-footer",
                        "onclick": "addModule('footerPT', 'footer')",
                        "checked": (templateList[currentTemplateIndex]?.footer[0]?.moduleName === "footerPT"),
                    }
                },
            ]
        },
        {
            "template": importUiComponents.uiToggle,
            "label": {
                "innerHTML": "Legal",
            },
            "input": {
                "id": "toggle-legal",
                "onclick": "addModule('legal', 'legal', this)",
            },
            "toggleLabel": {
                "for": "toggle-legal",
            }
        },
        {
            "template": importUiComponents.uiModuleList,
            "templateClassList": [],
            "label": {
                "innerHTML": `Footer List`,
            },
            "ul": {
                "id": "footer-module-list",
            }
        },
        {
            "template": importUiComponents.uiDownloadForm,
        },
        {
            "template": importUiComponents.uiButtonGroup,
            "label": {
                "innerHTML": "Danger Zone (Double-click to trigger)",
                "ondblclick": "dangerZone()",
            },
            "loop": [
                {
                    "template": importUiComponents.uiButtonGroupLoop,
                    "button": {
                        "innerHTML": "Reset Template",
                        "ondblclick": "resetTemplate()",
                        "class": ["alert"],
                    }
                },
                {
                    "template": importUiComponents.uiButtonGroupLoop,
                    "button": {
                        "id": "btn-remove-template",
                        "innerHTML": "Remove Template",
                        "ondblclick": "removeTemplate()",
                        "class": ["alert"],
                    }
                },
                {
                    "template": importUiComponents.uiButtonGroupLoop,
                    "button": {
                        "innerHTML": "Reset all",
                        "ondblclick": "resetAll()",
                        "class": ["alert"],
                    }
                },
            ]
        },
    ];
    return uiLayout;
}

function buildUiLayout(uiObj, isInsideLoop) {
    let loopHtml;
    if (isInsideLoop) {
        loopHtml = document.createElement("div");
    }

    let newUi = document.createElement("div");
    newUi.id = "ui";
    for (let i = 0; i < uiObj.length; i++) {
        let rowObj = uiObj[i];
        let newRow = htmlToElement(rowObj.template);
        for (let j = 0; j < Object.keys(rowObj).length; j++) {
            let newKey = Object.keys(rowObj)[j];
            // add classes to the row
            if (newKey === "templateClassList") {
                for (let l = 0; l < rowObj[newKey].length; l++) {
                    newRow.classList.add(rowObj[newKey][l]);
                }
            }
            // add innerHTML/attributes to the row items
            let newItem = newRow.querySelector(`[obj=${newKey}]`);
            if (newRow.hasAttribute("obj")) {
                newItem = newRow;
            }
            if (newKey === "loop") {
                // if property is "loop", replace the item with looped html
                let loopedUiLayout = buildUiLayout(rowObj[newKey], true);
                loopedUiLayout.setAttribute("class", newItem.getAttribute("class"));
                newItem.replaceWith(loopedUiLayout);
            } else if (newKey !== "template" && newKey !== "templateClassList") {
                // add values to the row items
                for (let k = 0; k < Object.keys(rowObj[newKey]).length; k++) {
                    let newKeyofKey = Object.keys(rowObj[newKey])[k];
                    if (newKeyofKey === "innerHTML") {
                        // innerHTML
                        newItem.innerHTML = rowObj[newKey][newKeyofKey];
                    } else if (newKeyofKey === "class") {
                        // class
                        newItem.classList.add(...rowObj[newKey][newKeyofKey]);
                    } else if (newKeyofKey === "checked") {
                        // checked
                        if (rowObj[newKey][newKeyofKey]) {
                            newItem.setAttribute("checked", "checked");
                        }
                    } else {
                        // remaining attributes
                        newItem.setAttribute(newKeyofKey, rowObj[newKey][newKeyofKey]);
                    }
                }
            }
        }
        if (!isInsideLoop) {
            newUi.innerHTML += newRow.outerHTML;
        } else {
            loopHtml.innerHTML += newRow.outerHTML;
        }
    }

    if (isInsideLoop) {
        return loopHtml;
    }
    if (!isInsideLoop) {
        document.querySelector("#ui").replaceWith(newUi);

        // reinitate query selectors
        templateSelect = document.querySelector("#templateList");
        darkmodeToggle = document.querySelector("#toggle-darkmode");
        headerList = document.querySelector("#header-module-list");
        moduleList = document.querySelector("#main-module-list");
        footerList = document.querySelector("#footer-module-list");
        downloadForm = document.querySelector("#downloadForm");

        downloadForm.addEventListener("submit", preventFormSubmit);
    }
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

function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

// ---------- MISC ----------

function initDarkmode() {
    if (sharedState.darkmode === undefined) {
        // check system prefers-color-scheme
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            sharedState.darkmode = true;
        } else {
            sharedState.darkmode = false;
        }
    }
    darkmodeToggle.checked = sharedState.darkmode;
    setDarkmode();
}

function setDarkmode() {
    if (darkmodeToggle.checked) {
        document.body.classList.add("dark")
        sharedState.darkmode = true;
    } else {
        document.body.classList.remove("dark")
        sharedState.darkmode = false;
    }
    setLocalStorage();
}

function dangerZone() {

    var audio = new Audio("https://alexanderlandberg.dk/assets/music/Kenny%20Loggins%20-%20Danger%20Zone.mp3");
    audio.play();

    let newZone = document.createElement("div");
    newZone.setAttribute("style", `position: fixed;
    width: 100vw;
    height: 100vh;
    z-index: 999;
    top: 0;
    left: 0;
    background-image: url(https://consequence.net/wp-content/uploads/2018/06/kenny-loggins-danger-zone.png);
    background-size: cover;
    opacity: 0;`);
    document.body.appendChild(newZone);

    let newZoneOpacity = 0;
    let timer = setInterval(() => {
        newZoneOpacity = newZoneOpacity + 0.01;
        newZone.style.opacity = newZoneOpacity;

        if (newZoneOpacity > 1) {
            clearInterval(timer);
        }
    }, 100);
}