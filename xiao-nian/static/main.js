function musicPlay(isPlay) {
    var media = document.querySelector('#audioDom');
    if (isPlay && media.paused) {
        media.play();
    }
    if (!isPlay && !media.paused) {
        media.pause();
    }
}
function musicInBrowserHandler() {
    setTimeout(function () {
        musicPlay(true)
    }, 0)
}
document.body.addEventListener('touchstart', musicInBrowserHandler);
$('#yhBtn').click(e => {
    $('#yhBtn').hide()
    setTimeout(function () {
        startF();
    }, 3000)

    setTimeout(() => {
        start()
        fireworks();
    }, 5000) // 这里的5000 是5s指烟花延时时间
    setTimeout(() => {
        function audioAutoPlay() {
            var audio = document.getElementById('audioDom');
            audio.play();
        }
        audioAutoPlay();
    }, 5000) // 这里的5000 是5s指音乐延时时间
    console.log(updateConfig({ autoLaunch: true }));
})
function fireworks() {
    $('.page_one').addClass('hide');
    $('.page_two').removeClass('hide');
    $('.page_two').fireworks({
        sound: false,
        opacity: 1,
        width: '100%',
        height: '100%'
    });
}
function start() {
    let str =window.myWord; 
    let str_ = ''
    let i = 0
    let content = document.getElementById('contents')
    let timer = setInterval(() => {
        if (str_.length < str.length) {
            str_ += str[i++]
            content.innerHTML = '<p>' + str_ + '<span class="xx" style="opacity: 1;    color: red;">❤</span></p>'                        //打印时加光标
        } else {
            clearInterval(timer)
            content.innerHTML = '<p>' + str_ + '</p>'
        }
    }, 100)
}

// jump2()
window.onpageshow = jump2