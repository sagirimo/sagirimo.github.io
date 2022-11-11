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
            cover: "http://p1.music.126.net/fS_5RbP_4qg-RYreqp2tGg==/109951167558017839.jpg?param=130y130",
            lrc: "[by:Aki惊蛰]\n[00:13.996]君が持ってきた漫画\n[00:16.130]くれた知らない名前のお花\n[00:19.790]今日はまだ来ないかな？\n[00:22.169]初めての感情知ってしまった\n[00:25.358]\n[00:25.896]窓に飾った絵画をなぞってひとりで宇宙を旅して\n[00:31.474]それだけでいいはずだったのに\n[00:36.991]\n[00:37.781]君の手を握ってしまったら\n[00:43.093]孤独を知らないこの街には\n[00:49.493]もう二度と帰ってくることはできないのでしょう\n[01:00.165]君が手を差し伸べた　光で影が生まれる\n[01:11.310]歌って聞かせて　この話の続き\n[01:17.177]連れて行って見たことない星まで\n[01:26.488]\n[01:34.481]誰の手も声も届かない\n[01:36.865]高く聳え立った塔の上へ\n[01:39.801]飛ばすフウセンカズラ\n[01:42.708]僕は君に笑って欲しいんだ\n[01:45.896]\n[01:46.435]満たされない穴は惰性の会話や澄ましたポーズで\n[01:52.032]これまでは埋めてきたけど\n[01:57.234]\n[01:57.234]退屈な日々を蹴散らして\n[02:02.221]君と二人でこの街中を泳げたら\n[02:10.132]それはどれだけ素敵なことでしょう？\n[02:19.176]出したことないほど大きな声でやっと君に伝わる\n[02:30.609]歪なくらいがさ　きっとちょうどいいね\n[02:36.217]世界の端と端を結んで\n[02:45.501]\n[02:54.267]窓に飾った絵画をなぞってひとりで宇宙を旅して\n[02:59.850]それだけでも不自由ないけど\n[03:05.184]僕は選んでみたいの\n[03:07.767]高鳴る心　謎だらけの空を\n[03:11.229]安全なループを今、書き換えて！\n[03:19.192]\n[03:19.995]君の手を握ってしまったら\n[03:25.578]孤独を知らないこの街にはもう二度と\n[03:33.491]帰ってくることはできないのでしょう\n[03:42.549]いくらでも迷いながら光も影も見に行こう\n[03:53.919]歌って聞かせてこの話の続き\n[03:59.503]連れて行って見たことない星まで\n[04:11.188]世界の端と端を結んで",
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