const url = 'https://bff928a0.ngrok.io/api/v1';

let id = Math.floor(Math.random() * 1000 + 1);
let status = document.getElementById('status');

window.onload = function () {
    fetch(`${url}/status`, {
        method: 'GET'
    })
        .then(function (response) {
        })
        .catch(function (response) {
        })
}

function respond(msg) {
    data = {
        query: msg
    }
    fetch(`${url}/${id}/respond`, {
        method: 'POST',
        body: JSON.stringify(data)
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (responses) {
            console.log(responses);
            if (responses) {
                for (let response of responses) {
                    if (response.buttons != undefined) {
                        createResponderReply(response.text, response.buttons)
                    } else
                    if (response.text != undefined) {
                        createResponder(response.text);
                    } else if (response.image != undefined) {
                        createResponderImage("<img src=" + response.image + " />");
                    }
                }
            } else {
                createResponder("Xin lỗi, tôi không hiểu bạn đang nói gì, vui lòng trả đặt lại câu hỏi !")
            }

        })
        .catch(function (err) {
            createResponder("Tôi đang có một vài trục trặc kỹ thuật. Phiền bạn quay lại sau nhé :)");
        });
}

function createResponderReply(msg, buttons) {
    let uuid = guid();
    let array = [];
    buttons.forEach(function (entry) {
        var replyOption = {
            question: entry.title,
            answer: entry.payload
        }
        array.push(replyOption);
    });

    chatWindow.talk({
        [uuid]: {
            says: [
                msg
            ],
            reply: array
        }
    }, uuid);
}

function createResponderImage(img) {
    let uuid = guid();

    chatWindow.talk({
        [uuid]: {
            says: [
                img
            ]
        }
    }, uuid);
}

function createResponder(msg) {
    let uuid = guid();

    chatWindow.talk({
        [uuid]: {
            says: [
                msg
            ]
        }
    }, uuid);

    if (enableVoice() == true) {
        let texts = msg.split('\n');

        speakArray(texts, {}, function (data) {
            console.log('Done!');
        });
    }

}

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

function enableVoice() {
    return ($('#enable-voice').html()=='volume_up');
}

function listen() {
    let mic = document.getElementById('mic');
    mic.style.color = 'red';
    let hear = new webkitSpeechRecognition();
    hear.continuous = false;
    hear.interimResults = true;
    hear.lang = 'vi-VN';
    hear.start();

    final_transcript = '';
    hear.onresult = function (event) {
        var interim_transcript = '';
        if (typeof (event.results) == 'undefined') {
            hear.onend = null;
            hear.stop();
            return;
        }
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                document.getElementById("message").value = event.results[i][0].transcript;
                mic.style.color = 'white';
                send();
            } else {
                interim_transcript += event.results[i][0].transcript;
            }
        }
        document.getElementById("message").value = interim_transcript;
    }
}


function send() {
    let message = document.getElementById('message').value;
    if (message != '') {
        document.getElementById('btnEnter').click();
    }
}


var self = {};
self.apiKey = 'c9ac6691a5d44b3b93595c032a195124';
self.voice = 'hatieumai';
self.speed = '1';
var count = 0;

//private methods and properties - should ONLY expose methods and properties publicly (via the 'return' object) that are supposed to be used; everything else (helper methods that aren't supposed to be called externally) should be private.

var audioElement = document.getElementById(self.elementId);

var loadTrack = function (url) {
    audioElement.src = url;
    audioElement.load();
};

var playTrack = function (url, cb) {
    var canplay = function () {
        // console.log('Can play');
        audioElement.removeEventListener('canplay', canplay, false);
        audioElement.addEventListener('ended', callback, false);
        audioElement.play();
    };

    var onError = function () {
        console.log('Retry');

        setTimeout(function () {
            loadTrack(url);
        }, 1000);
    };

    var callback = function () {
        audioElement.removeEventListener('error', onError, false);
        audioElement.removeEventListener('ended', callback, false);
        cb();
    };

    audioElement.addEventListener('canplay', canplay, false);
    audioElement.addEventListener('error', onError, false);
    loadTrack(url);
};

var speak = function (text, speechOptions, successCallback, errorCallback) {
    speakArray([text], speechOptions, successCallback, errorCallback);
};

var speakArray = function (texts, speechOptions, callback) {
    let voice = self.voice;
    let speed = self.speed;

    var play = function (text, cb) {
        var tmpOptions = {
            voice: 'both',
            speed: 0
        };

        if (speechOptions) {
            tmpOptions.voice = speechOptions.voice || tmpOptions.voice;
            tmpOptions.speed = speechOptions.speed || tmpOptions.speed;
        }

        fetch("https://api.openfpt.vn/text2speech/v4", {
            body: JSON.stringify(text),
            headers: {
                'content-type': 'application/json',
                voice: $(".select-selected").html().substring(
                    $(".select-selected").html().lastIndexOf("(") + 1, 
                    $(".select-selected").html().lastIndexOf(")")
                ),
                speed: speed,
                api_key: self.apiKey
            },
            method: "POST"
        }).then(function (response) {
            // The response is a Response instance.
            // You parse the data into a useable format using `.json()`
            return response.json();
        }).then(function (data) {
            // `data` is the parsed version of the JSON returned from the above endpoint.
            console.log(data);  // { "userId": 1, "id": 1, "title": "...", "body": "..." }
            playTrack(data.async, cb);
        }).catch(function () {
            callback(new Error());
        })
    };


    audioElement = document.getElementById("openfpt-tts");

    var playId = function (i) {
        if (texts) {
            if (i < texts.length) {
                play(texts[i], function (err) {
                    if (!err) {
                        return playId(i + 1);
                    }
                });
            } else {
                return callback(null, {});
            }
        }
    };

    playId(0);

};