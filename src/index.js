var TWSSS = {
    SCRIPT_NAME: 'TW Super Secret Script',
    VERSION: '@@scriptVersion', // grunt will import version from package.json
    SETTING_PREFIX: 'TWSSS',
    languagePrefix: Game.locale === 'cs_CZ' ? 'cs' : 'en',
    twsvSetting: undefined,
    twsebSetting: undefined,

    language: {
        cs: {
            closeButton: 'Zavřít',
            setting: 'Nastavení',
            saveButton: 'Uložit',
            twsvCheckboxLabel: 'Přeskoč videa a vezmi rovnou odměnu',
            twsebCheckboxLabel: 'Zobraz více informací o energii',
        },
        en: {
            closeButton: 'Close',
            setting: 'Setting',
            saveButton: 'Save',
        },
    },
};

TWSSS.getSetting = function () {
    var savedSetting = JSON.parse(localStorage.getItem(TWSSS.SETTING_PREFIX));

    if (!savedSetting)
        savedSetting = { tmsv: { power: true }, twseb: { power: true } };
    TWSSS.twsvSetting = savedSetting.tmsv || { power: true };
    TWSSS.twsebSetting = savedSetting.twseb || { power: true };
};

TWSSS.startScripts = function () {
    TWSSS.getSetting();

    if (TWSSS.twsvSetting.power) {
        TWSV.run();
    } else {
        TWSV.stop();
    }

    if (TWSSS.twsebSetting.power) {
        TWSEB.run();
    } else {
        TWSEB.stop();
    }
};

TWSSS.setStyle = function () {
    var style = '@@styles'; // grunt will import real styles
    $('<style>').text(style).appendTo(document.head);
};

TWSSS.showSetting = function () {
    var buttonsWrapper,
        cancelBtn,
        form,
        twsvCheckbox,
        footer,
        twsebCheckbox,
        info,
        saveBtn,
        scrollPane,
        settingWindow;

    TWSSS.getSetting();

    settingWindow = wman
        .open('twsss-setting', null)
        .setMiniTitle(TWSSS.language[TWSSS.languagePrefix].setting)
        .setTitle(TWSSS.language[TWSSS.languagePrefix].setting)
        .setMinSize(360, 235)
        .setSize(360, 235);

    form = $('<div class="twss-form" />');

    twsvCheckbox = new west.gui.Checkbox(
        TWSSS.language[TWSSS.languagePrefix].twsvCheckboxLabel
    ).setSelected(TWSSS.twsvSetting.power);

    twsebCheckbox = new west.gui.Checkbox(
        TWSSS.language[TWSSS.languagePrefix].twsebCheckboxLabel
    ).setSelected(TWSSS.twsebSetting.power);

    form.append(twsvCheckbox.getMainDiv());
    form.append(twsebCheckbox.getMainDiv());

    buttonsWrapper = $("<div class='twsss-buttonsWrapper' />");
    saveBtn = new west.gui.Button(
        TWSSS.language[TWSSS.languagePrefix].saveButton,
        function () {
            localStorage.setItem(
                TWSSS.SETTING_PREFIX,
                JSON.stringify({
                    twsv: { power: twsvCheckbox.isSelected() },
                    twseb: { power: twsebCheckbox.isSelected() },
                })
            );

            if (twsvCheckbox.isSelected()) {
                TWSV.run();
            } else {
                TWSV.stop();
            }

            if (twsebCheckbox.isSelected()) {
                TWSEB.run();
            } else {
                TWSEB.stop();
            }

            settingWindow.destroy();
        }
    );
    cancelBtn = new west.gui.Button(
        TWSSS.language[TWSSS.languagePrefix].closeButton,
        function () {
            settingWindow.destroy();
        }
    );

    footer = $('<div class="twsss-footer" />');

    buttonsWrapper = $('<div class="twsss-buttons" />');

    info = $(
        "<a href='@@homepage' target='_blank' class='twsss-infoText'>" +
            TWSSS.SCRIPT_NAME +
            ' v. ' +
            TWSSS.VERSION +
            '</a>'
    );

    buttonsWrapper.append(saveBtn.getMainDiv(), cancelBtn.getMainDiv());
    footer.append(buttonsWrapper);
    footer.append(info);
    scrollPane = new west.gui.Scrollpane();
    scrollPane.appendContent(form).appendContent(footer);

    settingWindow.appendToContentPane(scrollPane.getMainDiv());
};

TWSSS.addMenuButton = function () {
    var div = $('<div class="ui_menucontainer">/');
    var link = $(
        '<div id="TWSSS-menuLink" class="menulink" title="' +
            TWSSS.SCRIPT_NAME +
            '">@@svgMaskIcon</div>'
    );
    link.click(function () {
        TWSSS.showSetting();
    });
    var linkBottom = $('<div class="menucontainer_bottom">/');
    div.append(link);
    div.append(linkBottom);

    $('#ui_menubar').append(div);
};

TWSSS.init = function () {
    TWSSS.addMenuButton();
    TWSSS.startScripts();
    TWMarketScanner.init();
};

$(document).ready(function () {
    try {
        TWSSS.setStyle();
        // TSSEB.init();
        TWSV.init();
        TWSSS.init();
    } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e.stack); /* RemoveLogging:skip */
    }
});
