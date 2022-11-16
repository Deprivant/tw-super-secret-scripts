var TWSEB = {
    SCRIPT_NAME: 'TW Super Energy Bar',
    languagePrefix: Game.locale === 'cs_CZ' ? 'cs' : 'en',
    language: {
        cs: {
            oneEnergyPointTimeLeft: 'Další bod',
            perHourLabel: 'Za hod.',
            fullEnergyLabel: '100 %',
            fullEnergyInfo: '---',
            lessThenOneSec: '< 1 sek.',
            koProtection: 'Duelová ochrana do ',
        },
        en: {
            oneEnergyPointTimeLeft: 'Next',
            perHourLabel: 'Per Hr.',
            fullEnergyLabel: '100 %',
            fullEnergyInfo: '---',
            lessThenOneSec: '< 1 sec',
            koProtection: 'Duel protection ends at ',
        },
    },
};

TWSEB.renderBar = function () {
    var superEnergyBar = $('<div class="TWSEB-seb" />');
    var superEnergyInfoWrapper = $(
        '<div class="TWSEB-seb-info-energy-wrapper" />'
    );
    var timeLeftContainer = $('<div class="TWSEB-seb-tlc" />');
    var energyPerHourContainer = $('<div class="TWSEB-seb-ephc" />');
    var oneEnergyPointLeftContainer = $('<div class="TWSEB-seb-oplc" />');

    var superEnergyInfoHealthWrapper = $(
        '<div class="TWSEB-seb-info-health-wrapper" />'
    );
    var timeLeftHealthContainer = $('<div class="TWSEB-seb-health-tlc" />');
    var energyPerHourHealthContainer = $(
        '<div class="TWSEB-seb-health-ephc" />'
    );
    var oneEnergyPointLeftHealthContainer = $(
        '<div class="TWSEB-seb-health-oplc" />'
    );

    var labels = $(
        "<div class='TWSEB-seb-labels'><span>" +
            TWSEB.language[TWSEB.languagePrefix].oneEnergyPointTimeLeft +
            '</span><span>' +
            TWSEB.language[TWSEB.languagePrefix].perHourLabel +
            ' </span><span>' +
            TWSEB.language[TWSEB.languagePrefix].fullEnergyLabel +
            '</span></div>'
    );

    $(superEnergyInfoWrapper)
        .append(timeLeftContainer)
        .append(energyPerHourContainer)
        .append(oneEnergyPointLeftContainer);

    $(superEnergyInfoHealthWrapper)
        .append(timeLeftHealthContainer)
        .append(energyPerHourHealthContainer)
        .append(oneEnergyPointLeftHealthContainer);

    $(superEnergyBar).append(labels);
    $(superEnergyBar).append(superEnergyInfoHealthWrapper);
    $(superEnergyBar).append(superEnergyInfoWrapper);
    $('#ui_character_container').append(superEnergyBar);

    if (Character.getDuelProtection(true) > new ServerDate().getTime()) {
        var r = Character.getDuelProtection(true);

        var KOWrapper = new west.gui.Icon('clock')
            .addClass('TWSEB-ko-warning')
            .setTooltip(
                TWSEB.language[TWSEB.languagePrefix].koProtection +
                    new Date(r).toLocaleString()
            );

        $('#ui_character_container').append(KOWrapper.getMainDiv());
    }
    TWSEB.updateBar();
};

TWSEB.renderExpInfo = function () {
    var RestExpInfoValue =
        Character.getMaxExperience4Level() - Character.getExperience4Level();
    var RestExpInfo = $(
        '<span id="restExpInfo">(-' +
            format_number(RestExpInfoValue) +
            ', ' +
            format_number(
                Math.round((RestExpInfoValue / Character.energy) * 100) / 100
            ) +
            ') </span>'
    );
    $('#ui_experience_bar .fill_wrap').after(RestExpInfo);
};

TWSEB.startTimer = function () {
    TWSEB.timer = setTimeout(function () {
        TWSEB.updateBar();
        TWSEB.updateExpInfo();
        TWSEB.startTimer();
    }, 1000);
};

TWSEB.stopTimer = function () {
    clearTimeout(TWSEB.timer);
};

TWSEB.updateBar = function () {
    var isFullEnergy = Character.maxEnergy === Character.energy;
    var oneEnergyPointTime =
        3600 / (Character.maxEnergy * Character.energyRegen);
    var oneEnergyPointLeft =
        oneEnergyPointTime - Game.getServerTime() + Character.energyDate;
    var allEnergyTimeLeft =
        oneEnergyPointLeft +
        (Character.maxEnergy - Character.energy - 1) * oneEnergyPointTime;

    var isFullHealth = Character.maxHealth === Character.healt;
    var oneHealthPointTime =
        3600 / (Character.maxHealth * Character.healthRegen);
    var oneHelthPointLeft =
        oneHealthPointTime - Game.getServerTime() + Character.healthDate;

    var allHealthTimeLeft =
        oneHelthPointLeft +
        (Character.maxHealth - Character.health - 1) * oneHealthPointTime;

    $('.TWSEB-seb-tlc').text(
        // eslint-disable-next-line no-nested-ternary
        isFullEnergy
            ? TWSEB.language[TWSEB.languagePrefix].fullEnergyInfo
            : oneEnergyPointLeft < 1
            ? TWSEB.language[TWSEB.languagePrefix].lessThenOneSec
            : oneEnergyPointLeft.formatDuration()
    );
    $('.TWSEB-seb-ephc').text(
        (Character.maxEnergy * Character.energyRegen).toFixed(2)
    );
    $('.TWSEB-seb-oplc').text(
        isFullEnergy
            ? TWSEB.language[TWSEB.languagePrefix].fullEnergyInfo
            : allEnergyTimeLeft.formatDuration()
    );

    $('.TWSEB-seb-health-tlc').text(
        // eslint-disable-next-line no-nested-ternary
        isFullHealth
            ? TWSEB.language[TWSEB.languagePrefix].fullEnergyInfo
            : oneHelthPointLeft < 1
            ? TWSEB.language[TWSEB.languagePrefix].lessThenOneSec
            : oneHelthPointLeft.formatDuration()
    );

    $('.TWSEB-seb-health-ephc').text(
        (Character.maxHealth * Character.healthRegen).toFixed(2)
    );
    $('.TWSEB-seb-health-oplc').text(
        isFullHealth
            ? TWSEB.language[TWSEB.languagePrefix].fullEnergyInfo
            : allHealthTimeLeft.formatDuration()
    );
};

TWSEB.updateExpInfo = function () {
    var RestExpInfoValue =
        Character.getMaxExperience4Level() - Character.getExperience4Level();

    $('#restExpInfo').text(
        '(-' +
            RestExpInfoValue +
            ', ' +
            format_number(
                Math.round((RestExpInfoValue / Character.energy) * 100) / 100
            ) +
            ')'
    );
};

TWSEB.run = function () {
    TWSEB.renderBar();
    TWSEB.renderExpInfo();
    TWSEB.startTimer();
};

TWSEB.stop = function () {
    $('.TWSEB-seb').remove();
    $('#restExpInfo').remove();
    TWSEB.stopTimer();
};