var TWJEI = {
    SCRIPT_NAME: 'TW Jobs Extended Info',
    languagePrefix: Game.locale === 'cs_CZ' ? 'cs' : 'en',
    language: {
        cs: {
            button9x15: '9x 15s',
        },
        en: {
            button9x15: '9x 15s',
        },
    },
};

TWJEI.run = function () {
    JobWindow.initView = function () {
        // eslint-disable-next-line prefer-rest-params
        JobWindow.initView_twjie_backup.apply(this, arguments);

        // count item info
        var ejwiWrapper = $('.job_durationlabel .item .job_yield_buybutton');
        var ejwiImage = $('.item.job_yieldimage');

        for (let i = 0; i < ejwiWrapper.length; i += 1) {
            var element = ejwiWrapper[i];
            var id = $(element).data('itemid');
            var bagItem = Bag.getItemByItemId(id);
            var wearItem = ItemManager.get(id);
            var wearItemType = Wear.wear[wearItem.type];
            var count = 0;
            if (bagItem || (wearItemType && wearItemType.obj.item_id === id)) {
                count =
                    (bagItem !== undefined ? bagItem.count : 0) +
                    (wearItemType !== undefined &&
                    wearItemType.obj.item_id === id
                        ? 1
                        : 0);
            }

            $(ejwiImage[i]).append(
                '<span class="tw-jei-count">' + count + '</span>'
            );
        }

        // 9x 15s button

        var button9x15 = new west.gui.Button(
            TWJEI.language[TWJEI.languagePrefix].button9x15,
            function () {
                $('.job-amount-num').html('9');
                $('.job_durationbar.job_durationbar_short').click();
            }
        );

        var button9x15Wrapper = button9x15.getMainDiv();
        button9x15Wrapper.style.bottom = '25px';
        button9x15Wrapper.style.left = '295px';
        button9x15Wrapper.style['z-index'] = '10';

        this.window.divMain
            .querySelector('div.tw2gui_window_content_pane')
            .appendChild(button9x15.getMainDiv());
    };
};

TWJEI.stop = function () {
    JobWindow.initView = JobWindow.initView_twjie_backup;
};

TWJEI.init = function () {
    JobWindow.initView_twjie_backup = JobWindow.initView;
};
