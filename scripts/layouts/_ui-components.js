export const uiDropdownButton = `<div class="ui-row">
    <div obj="label" class="label"></div>
    <div class="button-group">
        <select obj="select" class="select"></select>
        <div obj="button" class="button"></div>
    </div>
</div>`;

export const uiTextInput = `<div class="ui-row">
    <div obj="label" class="label"></div>
    <input obj="input" type="text">
</div>`;

export const uiToggleSwitch = `<div class="ui-row">
    <div obj="label" class="label"></div>
    <div obj="loop" class="switch">
    </div>
</div>`;
export const uiToggleSwitchLoop = `<span>
    <input obj="input" type="radio">
    <label obj="label"></label>
</span>`;

export const uiButtonGroup = `<div class="ui-row">
    <div obj="label" class="label"></div>
    <div obj="loop" class="button-group"></div>
</div>`;
export const uiButtonGroupLoop = `<div obj="button" class="button"></div>`;

export const uiModuleList = `<div class="ui-row">
    <div obj="label" class="label"></div>
    <ul obj="ul" id="header-module-list" class="moduleList"></ul>
</div>`;

export const uiToggle = `<div class="ui-row">
    <div obj="label" class="label"></div>
    <div class="toggle">
        <input obj="input" type="checkbox">
        <label obj="toggleLabel">
            <span></span>
        </label>
    </div>
</div>`;

export const uiDownloadForm = `<div class="ui-row">
    <form id="downloadForm">
        <div class="label">Output HTML</div>
        <textarea id="fileText" name="htmlText" placeholder="HTML will be output here"></textarea>
        <div class="button-group">
            <input class="button" type="submit" value="Download" onclick="downloadTemplate()">
            <input class="button" type="submit" value="Download for each language" onclick="downloadAllTemplates()">
        </div>
    </form>
</div>`;