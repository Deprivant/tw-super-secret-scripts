var TWGiftBomber = {
    SCRIPT_NAME: 'TW Gift Bomber',
    VERSION: '@@scriptVersion', // grunt will import version from package.json
    WIDGET_ID: 'twgb-widget',
    languagePrefix: Game.locale === 'cs_CZ' ? 'cs' : 'en',
    language: {
        cs: {
            noFriendsMessage: 'Není komu poslat dárek',
        },
        en: {
            noFriendsMessage: 'You have no friend waiting for your gift',
        },
    },
};

TWGiftBomber.setStyle = function () {
    var style = '@@twgbStyles'; // grunt will import real styles
    $('<style>').text(style).appendTo(document.head);
};

TWGiftBomber.updateCountOfFriends = function (number) {
    TWGiftBomber.widget.text(number);
};

TWGiftBomber.getList = function () {
    var waitingFriends = [],
        friendsList;
    var s;
    var i;
    var time;
    var type = Object.keys(Game.sesData)[0];
    friendsList = Chat.Friendslist.getFriends();
    var eventActivations =
        WestUi.FriendsBar.friendsBarUi.friendsBar.eventActivations;
    var n = Game.sesData[type].friendsbar;
    for (s = 0; s < friendsList.length; s += 1) {
        i =
            typeof eventActivations[friendsList[s].playerId] !== 'undefined' &&
            eventActivations[friendsList[s].playerId][type] !== 'undefined'
                ? eventActivations[friendsList[s].playerId][type]
                : 0;
        time = i + parseInt(n.cooldown, 10) - new ServerDate().getTime() / 1e3;
        if (time > 0) {
            // TODO: need work
        } else {
            waitingFriends.push({
                n: friendsList[s].pname,
                i: friendsList[s].playerId,
                t: time,
            });
        }
    }
    waitingFriends.sort(
        Sort.create('asc', function () {
            return waitingFriends.t;
        })
    );
    return waitingFriends;
};

// scanTimer
TWGiftBomber.startSending = function () {
    var waitingFriends, waitingFriendsLength;

    waitingFriends = TWGiftBomber.getList();
    waitingFriendsLength = waitingFriends.length;

    if (waitingFriendsLength > 0) {
        // eslint-disable-next-line no-console
        console.log('startSending(), pole čekajících přátel: ', waitingFriends);
        TWGiftBomber.updateCountOfFriends(waitingFriendsLength);
        TWGiftBomber.sendAllGifts(waitingFriends);
    } else {
        MessageError(
            TWGiftBomber.language[TWGiftBomber.languagePrefix].noFriendsMessage
        ).show();
        $(TWGiftBomber.widget).remove();
    }
};

// send gifts to all waiting friends
TWGiftBomber.sendAllGifts = function (waitingFriends) {
    var timer, friendsLeft;

    friendsLeft = waitingFriends.length;

    if (!friendsLeft) return;

    // eslint-disable-next-line no-console
    console.log('sendAllGifts(), začínám posílat všem čekajícím');

    var type = Object.keys(Game.sesData)[0];
    var r = WestUi.FriendsBar.friendsBarUi.friendsBar.eventActivations;

    function ajaxProcess() {
        friendsLeft -= 1;
        TWGiftBomber.updateCountOfFriends(friendsLeft);

        Ajax.remoteCall(
            'friendsbar',
            'event',
            {
                player_id: waitingFriends[friendsLeft].i,
                event: type,
            },
            function (t) {
                if (t.error)
                    return MessageError(
                        GiftBomber.language[TWGiftBomber.languagePrefix]
                            .defaultError
                    ).show();

                var n = waitingFriends[friendsLeft].i; // e.handleObj.data;
                r[n] = r[n] || {};
                r[n][type] = t.activationTime;
            }
        );

        // eslint-disable-next-line no-console
        console.log(
            'Posílám: ' +
                waitingFriends[friendsLeft].n +
                ', index: ' +
                friendsLeft
        );
    }

    function loop() {
        var rand = Math.floor(Math.random() * 3000) + 1500;
        // eslint-disable-next-line no-console
        console.log('náhodný timer: ', rand);
        timer = setTimeout(function () {
            if (friendsLeft < 1) {
                clearInterval(timer);
                // eslint-disable-next-line no-console
                console.log(
                    'sendAllGifts(), končím s posíláním všem čekajícím'
                );
                $(TWGiftBomber.widget).remove();
            } else {
                ajaxProcess();
                loop();
            }
        }, rand);
    }

    loop();
};

TWGiftBomber.start = function () {
    var wrapper;
    TWGiftBomber.widget = $("<div id='" + TWGiftBomber.WIDGET_ID + "' />");
    wrapper = $('.dock-image.friends')[0];
    $(wrapper).append(TWGiftBomber.widget);
    TWGiftBomber.startSending();
};

// script init
TWGiftBomber.init = function () {
    TWGiftBomber.setStyle();
    TWGiftBomber.start();
};
