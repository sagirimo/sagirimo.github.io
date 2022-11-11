const ap = new APlayer({
    container: document.getElementById('aplayer'),
    order: 'random',
    preload: 'auto',
    listMaxHeight: '336px',
    volume: '0.5',
    mutex: true,
    lrcType: 3,
    /* 下方更改为你自己的歌单就行 */
    audio: [{
            name: "花の塔",
            artist: "さユり",
            url: "http://music.163.com/song/media/outer/url?id=1956534872.mp3",
            cover: "https://y.gtimg.cn/music/photo_new/T002R300x300M000002FEF7L03Cv7T_1.jpg?max_age=2592000",
            lrc: "http://music.163.com/api/song/media?id=1956534872",
            theme: "#33658d"
        },
        {
            name: "稻香",
            artist: "周杰伦",
            url: "https://drive.imsyy.top/api?path=%2F%E9%9F%B3%E4%B9%90%2F%E6%96%87%E4%BB%B6%E5%BC%95%E7%94%A8%2F%E5%91%A8%E6%9D%B0%E4%BC%A6-%E7%A8%BB%E9%A6%99.mp3&raw=true",
            cover: "https://y.gtimg.cn/music/photo_new/T002R300x300M000002Neh8l0uciQZ_1.jpg?max_age=2592000",
            lrc: "https://s-sh-2127-music.oss.dogecdn.com/lrc%2F%E5%91%A8%E6%9D%B0%E4%BC%A6-%E7%A8%BB%E9%A6%99.lrc",
            theme: "#e3ae55"
        },
        {
            name: "七里香",
            artist: "周杰伦",
            url: "https://drive.imsyy.top/api?path=%2F%E9%9F%B3%E4%B9%90%2F%E6%96%87%E4%BB%B6%E5%BC%95%E7%94%A8%2F%E5%91%A8%E6%9D%B0%E4%BC%A6-%E4%B8%83%E9%87%8C%E9%A6%99.mp3&raw=true",
            cover: "https://y.gtimg.cn/music/photo_new/T002R300x300M000003DFRzD192KKD_1.jpg?max_age=2592000",
            lrc: "https://s-sh-2127-music.oss.dogecdn.com/lrc%2F%E5%91%A8%E6%9D%B0%E4%BC%A6-%E4%B8%83%E9%87%8C%E9%A6%99.lrc",
            theme: "#395732"
        },
        {
            name: "青花瓷",
            artist: "周杰伦",
            url: "https://drive.imsyy.top/api?path=%2F%E9%9F%B3%E4%B9%90%2F%E6%96%87%E4%BB%B6%E5%BC%95%E7%94%A8%2F%E5%91%A8%E6%9D%B0%E4%BC%A6-%E9%9D%92%E8%8A%B1%E7%93%B7.mp3&raw=true",
            cover: "https://y.gtimg.cn/music/photo_new/T002R300x300M000002eFUFm2XYZ7z_1.jpg?max_age=2592000",
            lrc: "https://s-sh-2127-music.oss.dogecdn.com/lrc%2F%E5%91%A8%E6%9D%B0%E4%BC%A6-%E9%9D%92%E8%8A%B1%E7%93%B7.lrc",
            theme: "#000000"
        },
        {
            name: "霍元甲",
            artist: "周杰伦",
            url: "https://drive.imsyy.top/api?path=%2F%E9%9F%B3%E4%B9%90%2F%E6%96%87%E4%BB%B6%E5%BC%95%E7%94%A8%2F%E5%91%A8%E6%9D%B0%E4%BC%A6-%E9%9C%8D%E5%85%83%E7%94%B2.mp3&raw=true",
            cover: "https://y.qq.com/music/photo_new/T002R300x300M000000OixvE1YjIqd_3.jpg?max_age=2592000",
            lrc: "https://s-sh-2127-music.oss.dogecdn.com/lrc%2F%E5%91%A8%E6%9D%B0%E4%BC%A6-%E9%9C%8D%E5%85%83%E7%94%B2.lrc",
            theme: "#295249"
        },
        {
            name: "浮夸",
            artist: "陈奕迅",
            url: "https://drive.imsyy.top/api?path=%2F%E9%9F%B3%E4%B9%90%2F%E6%96%87%E4%BB%B6%E5%BC%95%E7%94%A8%2F%E9%99%88%E5%A5%95%E8%BF%85-%E6%B5%AE%E5%A4%B8.mp3&raw=true",
            cover: "https://y.gtimg.cn/music/photo_new/T002R300x300M000003J6fvc0bVJon_1.jpg?max_age=2592000",
            lrc: "https://s-sh-2127-music.oss.dogecdn.com/lrc%2F%E9%99%88%E5%A5%95%E8%BF%85-%E6%B5%AE%E5%A4%B8.lrc",
            theme: "#040402"
        },
        {
            name: "十年",
            artist: "陈奕迅",
            url: "https://drive.imsyy.top/api?path=%2F%E9%9F%B3%E4%B9%90%2F%E6%96%87%E4%BB%B6%E5%BC%95%E7%94%A8%2F%E9%99%88%E5%A5%95%E8%BF%85-%E5%8D%81%E5%B9%B4.mp3&raw=true",
            cover: "https://y.gtimg.cn/music/photo_new/T002R300x300M000003J6fvc0bVJon_1.jpg?max_age=2592000",
            lrc: "https://s-sh-2127-music.oss.dogecdn.com/lrc%2F%E9%99%88%E5%A5%95%E8%BF%85-%E5%8D%81%E5%B9%B4.lrc",
            theme: "#040402"
        },
        {
            name: "倔强",
            artist: "五月天",
            url: "https://drive.imsyy.top/api?path=%2F%E9%9F%B3%E4%B9%90%2F%E6%96%87%E4%BB%B6%E5%BC%95%E7%94%A8%2F%E4%BA%94%E6%9C%88%E5%A4%A9-%E5%80%94%E5%BC%BA.mp3&raw=true",
            cover: "https://y.gtimg.cn/music/photo_new/T002R300x300M0000006MmDz4Hl2Ud_1.jpg?max_age=2592000",
            lrc: "https://s-sh-2127-music.oss.dogecdn.com/lrc%2F%E4%BA%94%E6%9C%88%E5%A4%A9-%E5%80%94%E5%BC%BA.lrc",
            theme: "#b3dae1"
        },
        {
            name: "素颜",
            artist: "许嵩 / 何曼婷",
            url: "https://drive.imsyy.top/api?path=/%E9%9F%B3%E4%B9%90/%E6%96%87%E4%BB%B6%E5%BC%95%E7%94%A8/%E8%AE%B8%E5%B5%A9%26%E4%BD%95%E6%9B%BC%E5%A9%B7-%E7%B4%A0%E9%A2%9C.mp3&raw=true",
            cover: "https://y.qq.com/music/photo_new/T002R300x300M0000035f8nw11cjkf_1.jpg?max_age=2592000",
            lrc: "https://s-sh-2127-music.oss.dogecdn.com/lrc%2F%E8%AE%B8%E5%B5%A9%26%E4%BD%95%E6%9B%BC%E5%A9%B7-%E7%B4%A0%E9%A2%9C.lrc",
            theme: "#622931"
        },
        {
            name: "打上花火",
            artist: "米津玄师 / daoko",
            url: "https://drive.imsyy.top/api?path=/%E9%9F%B3%E4%B9%90/%E6%96%87%E4%BB%B6%E5%BC%95%E7%94%A8/%E7%B1%B3%E6%B4%A5%E7%8E%84%E5%B8%88%26daoko-%E6%89%93%E4%B8%8A%E8%8A%B1%E7%81%AB.mp3&raw=true",
            cover: "https://y.qq.com/music/photo_new/T002R300x300M000002rLPlR0CXaWS_3.jpg?max_age=2592000",
            lrc: "https://s-sh-2127-music.oss.dogecdn.com/lrc%2F%E7%B1%B3%E6%B4%A5%E7%8E%84%E5%B8%88%26daoko-%E6%89%93%E4%B8%8A%E8%8A%B1%E7%81%AB.lrc",
            theme: "#ed1306"
        },
        {
            name: "Lemon",
            artist: "米津玄师",
            url: "https://drive.imsyy.top/api?path=/%E9%9F%B3%E4%B9%90/%E6%96%87%E4%BB%B6%E5%BC%95%E7%94%A8/%E7%B1%B3%E6%B4%A5%E7%8E%84%E5%B8%88-Lemon.mp3&raw=true",
            cover: "https://y.qq.com/music/photo_new/T002R300x300M000000nPoD43Dybcc_1.jpg?max_age=2592000",
            lrc: "https://s-sh-2127-music.oss.dogecdn.com/lrc%2F%E7%B1%B3%E6%B4%A5%E7%8E%84%E5%B8%88-Lemon.lrc",
            theme: "#20778f"
        },
        {
            name: "The Saltwater Room",
            artist: "Owl City",
            url: "https://drive.imsyy.top/api?path=%2F%E9%9F%B3%E4%B9%90%2F%E6%96%87%E4%BB%B6%E5%BC%95%E7%94%A8%2FOwl%20City-The%20Saltwater%20Room.mp3&raw=true",
            cover: "https://y.gtimg.cn/music/photo_new/T002R300x300M000002FEF7L03Cv7T_1.jpg?max_age=2592000",
            lrc: "https://s-sh-2127-music.oss.dogecdn.com/lrc%2FOwl%20City-The%20Saltwater%20Room.lrc",
            theme: "#33658d"
        }
    ]
});

/* 底栏歌词 */
setInterval(function () {
    $("#lrc").html("<span class='lrc-show'><i class='iconfont icon-music'></i> " + $(".aplayer-lrc-current").text() + " <i class='iconfont icon-music'></i></span>");
}, 500);

/* 音乐通知及控制 */
ap.on('play', function () {
    music = $(".aplayer-title").text() + $(".aplayer-author").text();
    iziToast.info({
        timeout: 8000,
        iconUrl: './img/icon/music.png',
        displayMode: 'replace',
        message: music
    });
    $("#play").html("<i class='iconfont icon-pause'>");
    $("#music-name").html($(".aplayer-title").text() + $(".aplayer-author").text());
    if ($(document).width() >= 990) {
        $('.power').css("cssText", "display:none");
        $('#lrc').css("cssText", "display:block !important");
    }
});

ap.on('pause', function () {
    $("#play").html("<i class='iconfont icon-play'>");
    if ($(document).width() >= 990) {
        $('#lrc').css("cssText", "display:none !important");
        $('.power').css("cssText", "display:block");
    }
});

//音量调节
function changevolume() {
    var x = $("#volume").val();
    ap.volume(x, true);
    if (x == 0) {
        $("#volume-ico").html("<i class='iconfont icon-volume-x'></i>");
    } else if (x > 0 && x <= 0.3) {
        $("#volume-ico").html("<i class='iconfont icon-volume'></i>");
    } else if (x > 0.3 && x <= 0.6) {
        $("#volume-ico").html("<i class='iconfont icon-volume-1'></i>");
    } else {
        $("#volume-ico").html("<i class='iconfont icon-volume-2'></i>");
    }
}

$("#music").hover(function () {
    $('.music-text').css("display", "none");
    $('.music-volume').css("display", "flex");
}, function () {
    $('.music-text').css("display", "block");
    $('.music-volume').css("display", "none");
})

/* 一言与音乐切换 */
$('#open-music').on('click', function () {
    $('#hitokoto').css("display", "none");
    $('#music').css("display", "flex");
});

$("#hitokoto").hover(function () {
    $('#open-music').css("display", "flex");
}, function () {
    $('#open-music').css("display", "none");
})

$('#music-close').on('click', function () {
    $('#music').css("display", "none");
    $('#hitokoto').css("display", "flex");
});

/* 上下曲 */
$('#play').on('click', function () {
    ap.toggle();
    $("#music-name").html($(".aplayer-title").text() + $(".aplayer-author").text());
});

$('#last').on('click', function () {
    ap.skipBack();
    $("#music-name").html($(".aplayer-title").text() + $(".aplayer-author").text());
});

$('#next').on('click', function () {
    ap.skipForward();
    $("#music-name").html($(".aplayer-title").text() + $(".aplayer-author").text());
});

/* 打开音乐列表 */
$('#music-open').on('click', function () {
    if ($(document).width() >= 990) {
        $('#box').css("display", "block");
        $('#row').css("display", "none");
        $('#more').css("cssText", "display:none !important");
    }
});