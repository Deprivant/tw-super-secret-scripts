var TWSEB = {
    SCRIPT_NAME: 'TW Super Energy Bar',
    languagePrefix: Game.locale === 'cs_CZ' ? 'cs' : 'en',
    language: {
        cs: {
            onePointTimeLeft: 'Další bod',
            perHourLabel: 'Za hod.',
            fullEnergyLabel: '100%',
            fullEnergyInfo: '---',
        },
        en: {
            onePointTimeLeft: 'Next',
            perHourLabel: 'Per Hr.',
            fullEnergyLabel: '100%',
            fullEnergyInfo: '---',
        },
    },
};

TWSEB.renderBar = function () {
    var superEnergyBar = $('<div class="TWSEB-seb" />');
    var superEnergyInfoWrapper = $('<div class="TWSEB-seb-info-wrapper" />');
    var timeLeftContainer = $('<div class="TWSEB-seb-tlc" />');
    var energyPerHourContainer = $('<div class="TWSEB-seb-ephc" />');
    var onePointLeftContainer = $('<div class="TWSEB-seb-oplc" />');
    var labels = $(
        "<div class='TWSEB-seb-labels'><span>" +
            TWSEB.language[TWSEB.languagePrefix].onePointTimeLeft +
            '</span><span>' +
            TWSEB.language[TWSEB.languagePrefix].perHourLabel +
            ' </span><span>' +
            TWSEB.language[TWSEB.languagePrefix].fullEnergyLabel +
            '</span></div>'
    );

    $(superEnergyInfoWrapper)
        .append(timeLeftContainer)
        .append(energyPerHourContainer)
        .append(onePointLeftContainer);

    $(superEnergyBar).append(labels);
    $(superEnergyBar).append(superEnergyInfoWrapper);
    $('#ui_character_container').append(superEnergyBar);
    TWSEB.updateBar();
};

TWSEB.startTimer = function () {
    TWSEB.timer = setTimeout(function () {
        TWSEB.updateBar();
        TWSEB.startTimer();
    }, 1000);
};

TWSEB.stopTimer = function () {
    clearTimeout(TWSEB.timer);
};

TWSEB.updateBar = function () {
    var isFullEnergy = Character.maxEnergy === Character.energy;
    var onePointTime = 3600 / (Character.maxEnergy * Character.energyRegen);
    var onePointLeft =
        onePointTime - Game.getServerTime() + Character.energyDate;
    var allEnergyTimeLeft =
        onePointLeft +
        (Character.maxEnergy - Character.energy - 1) * onePointTime;

    $('.TWSEB-seb-tlc').text(
        isFullEnergy
            ? TWSEB.language[TWSEB.languagePrefix].fullEnergyInfo
            : onePointLeft.formatDuration()
    );
    $('.TWSEB-seb-ephc').text(Character.maxEnergy * Character.energyRegen);
    $('.TWSEB-seb-oplc').text(
        isFullEnergy
            ? TWSEB.language[TWSEB.languagePrefix].fullEnergyInfo
            : allEnergyTimeLeft.formatDuration()
    );
};

TWSEB.run = function () {
    TWSEB.renderBar();
    TWSEB.startTimer();
};

TWSEB.stop = function () {
    $('.TWSEB-seb').remove();
    TWSEB.stopTimer();
};
