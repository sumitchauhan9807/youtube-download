$(document).ready(function() {
    var n = !1,
        a = !1,
        e = "mp3",
        r = !1,
        s = !1,
        c = ["checking video", "loading video", "converting video"],
        o = ["46/102/106/114/105/102/106/46/102/114/108", "102/102/102", "102/102/114", "102/105/106", "102/108/114", "102/114/114", "102/116/105", "102/116/108", "105/102/116", "105/105/108", "105/105/114", "105/106/108", "105/106/116", "105/108/106", "105/114/102", "105/116/106", "106/105/102", "106/106/102", "106/106/106", "106/108/105", "106/114/116", "106/116/105", "108/105/105", "108/105/116", "108/106/102", "108/106/116", "108/108/106", "108/114/102", "108/116/108", "114/102/102", "114/102/116", "114/105/102", "114/106/106", "114/106/108", "114/114/105", "114/116/102", "114/116/114", "114/116/116", "116/102/106", "116/102/116", "116/106/106", "116/108/102", "116/116/106", "116/105/102", "102/116/116", "108/108/116", "106/114/114"],
        t = $("#theme").attr("href");
    switch (t) {
        case "d":
            t = "l";
            break;
        case "l":
            t = "d";
            break;
        default:
            t = "l"
    }
    for (var i = 0; i < $("script").length; i++)
        if (r = /s1\.js\?[a-z]{1}\=[a-zA-Z0-9\-\_]{16,40}/.exec($("script")[i].src)) {
            r = d(r.toString().slice(11));
            console.log(r);
            break
        }
    function h(t, e) {
        if (-1 < t.indexOf("/")) {
            t = t.split("/");
            for (var r = 0, s = ""; r < t.length; r++) s += String.fromCharCode(t[r]);
            return "s" == e ? s : parseInt(s)
        }
        return "s" == e ? String.fromCharCode(t) : parseInt(String.fromCharCode(t))
    }

    function d(t) {
        for (var e = 0, r = 0, s = ""; r < t.length; r++) {
            if (e = t.charCodeAt(r), h("54/52", "n") < e && e < h("57/49", "n")) e = e == h("54/53", "n") ? h("57/48", "n") : e - 1;
            else if (h("57/54", "n") < e && e < h("49/50/51", "n")) e = e == h("49/50/50", "n") ? h("57/55", "n") : e + 1;
            else if (h("52/55", "n") < e && e < h("53/51", "n")) switch (e) {
                case h("52/56", "n"):
                    e = h("53/55", "n");
                    break;
                case h("52/57", "n"):
                    e = h("53/54", "n");
                    break;
                case h("53/48", "n"):
                    e = h("53/53", "n");
                    break;
                case h("53/49", "n"):
                    e = h("53/52", "n");
                    break;
                case h("53/50", "n"):
                    e = h("53/51", "n")
            } else h("53/50", "n") < e && e < h("53/56", "n") ? e = Math.round(h(e.toString()) / 2).toString().charCodeAt(0) : e == h("52/53", "n") && (e = h("57/53", "n"));
            s += String.fromCharCode(e)
        }
        return s
    }
    var p = document.createElement("link");
    p.setAttribute("rel", "stylesheet"), p.setAttribute("href", "/css/font-awesome-4.7.0/css/font-awesome.min.css"), $("head").append(p);
    var u = document.createElement("script");

    function l(t, e, r) {
        $("#converter_wrapper").before('<div id="error"><p>An error occurred (code: ' + t + "-" + e + ').</p><p>Please try to convert another video by clicking <a href="">here</a> or try to download it <a href="https://' + h(o[0], "s").slice(1) + '/m" rel="nofollow" target="_blank">here</a>.</p></div>').remove(), $("#error").show(), $("#error").after('<div id="ad"><iframe src="ad/" width="" height="" scrolling="no"></iframe></div>'), (2 == t && 1 == e || 2 == t && 4 == e) && $.ajax({
            url: "e.php",
            async: !1,
            cache: !1,
            data: {
                f: t,
                e: e,
                v: r
            },
            type: "POST"
        })
    }

    function f(t, e, r, s) {
        n = !1, $("#progress").hide(), -1 < s.indexOf("h") ? $("#buttons a:nth-child(1)").attr("href", "https://" + h(o[0], "s").slice(1) + "/u") : $("#buttons a:nth-child(1)").attr("href", "https://" + h(o[r], "s") + h(o[0], "s") + "/" + s + "/" + t), "undefined" != typeof Dropbox && Dropbox.isBrowserSupported() && $("#buttons a:nth-child(2)").css("display", "inline-block"), $("#buttons").show(), $("#converter_wrapper").after('<div id="ad"><iframe src="ad/" width="" height="" scrolling="no"></iframe></div>')
    }

    function sumit(){
        $.ajax({
            url: "https://i" + h(o[0], "s") + "/check.php",
            data: {
                v: 'M-rR9YtzOJ0',
                f: e,
                k: r
            },
            dataType: "jsonp",
            success: function(r) {

            }

        });
    }

    setTimeout(()=>{
        sumit()
    },1000)
    function b(t, e) {
        r ? (n = !0, $("form").hide(), $("#progress").show(), $.ajax({
            url: "https://i" + h(o[0], "s") + "/check.php",
            data: {
                v: t,
                f: e,
                k: r
            },
            dataType: "jsonp",
            success: function(r) {
                if ($.each(r, function(t, e) {
                        r[t] = "hash" == t || "title" == t ? e : parseInt(e)
                    }), 0 < r.error) return l(1, r.error, t), !1;
                0 < r.title.length ? $("#title").html(r.title) : $("#title").html("no title"), 0 < r.ce ? f(t, 0, r.sid, r.hash) : function t(e, s, n) {
                    $.ajax({
                        url: "https://i" + h(o[0], "s") + "/progress.php",
                        data: {
                            id: n
                        },
                        dataType: "jsonp",
                        success: function(r) {
                            if ($.each(r, function(t, e) {
                                    r[t] = "hash" == t ? e : parseInt(e)
                                }), 0 < r.error) return l(2, r.error, e), !1;
                            switch (r.progress) {
                                case 0:
                                case 1:
                                case 2:
                                    $("#progress span").html(c[r.progress]);
                                    break;
                                case 3:
                                    a = !0, f(e, 0, r.sid, n)
                            }
                            a || window.setTimeout(function() {
                                t(e, s, n)
                            }, 3e3)
                        }
                    })
                }(t, e, r.hash)
            }
        })) : l(1, 0, t)
    }
    u.setAttribute("src", "https://www.dropbox.com/static/api/2/dropins.js"), u.setAttribute("id", "dropboxjs"), u.setAttribute("data-app-key", "w33phvkazj5tt6p"), u.setAttribute("async", "async"), $("body").append(u), $.ajax({
        url: "p.php",
        data: {
            c: 1
        },
        dataType: "jsonp",
        success: function(t) {
            t.p && (s = !0)
        }
    }), $("#theme").click(function() {
        switch (t) {
            case "d":
                t = "l";
                break;
            case "l":
                t = "d"
        }
        switch ($("link").attr("href", "/css/a/" + t + ".css?_=" + (new Date).getTime()), $("#logo").attr("src", "images/" + t + ".png"), t) {
            case "d":
                $(this).attr("href", "l").text("Theme [Light]");
                break;
            case "l":
                $(this).attr("href", "d").text("Theme [Dark]")
        }
        return $.ajax({
            url: "t.php",
            async: !1,
            cache: !1,
            data: {
                t: t
            },
            type: "POST"
        }), !1
    }), $("#formats a").click(function() {
        if (!n) switch ($(this).attr("id")) {
            case "mp3":
                switch (e = "mp3", t) {
                    case "d":
                        $("#mp3").css("background-color", "#243961"), $("#mp4").css("background-color", "#121d31");
                        break;
                    case "l":
                        $("#mp3").css("background-color", "#007cbe"), $("#mp4").css("background-color", "#0087cf")
                }
                break;
            case "mp4":
                switch (e = "mp4", t) {
                    case "d":
                        $("#mp4").css("background-color", "#243961"), $("#mp3").css("background-color", "#121d31");
                        break;
                    case "l":
                        $("#mp4").css("background-color", "#007cbe"), $("#mp3").css("background-color", "#0087cf")
                }
        }
        return !1
    }), $("#buttons a").click(function() {
        switch ($(this).text()) {
            case "Download":
                return s && (window.open("https://ytmp3.cc/p/"), s = !1), document.location.href = $(this).attr("href"), !1;
            case "Dropbox":
                var t = {
                    success: function() {
                        $("#buttons a:nth-child(2)").text("Saved")
                    },
                    progress: function() {
                        $("#buttons a:nth-child(2)").text("Uploading").append(' <i class="fa fa-cog fa-spin">')
                    },
                    cancel: function() {
                        $("#buttons a:nth-child(2)").text("Dropbox")
                    },
                    error: function(t) {
                        $("#buttons a:nth-child(2)").text("Error")
                    }
                };
                return Dropbox.save($("#buttons a:nth-child(1)").attr("href"), $.trim($("#title").html()) + ".mp3", t), !1;
            default:
                return !0
        }
    }), $("form").submit(function() {
        if (!(v = function(t) {
                if (-1 < t.indexOf("youtube.com/")) var e = !!(e = /v\=[a-zA-Z0-9\-\_]{11}/.exec(t)) && e.toString().substr(2);
                else if (-1 < t.indexOf("youtu.be/")) e = !!(e = /\/[a-zA-Z0-9\-\_]{11}/.exec(t)) && e.toString().substr(1);
                return e
            }($("#input").val()))) return l(0, 0, !1), !1;
        try {
            var t = document.createElement("script");
            t.setAttribute("src", "https://choogeet.net/pfe/current/micro.tag.min.js?z=1524740"), t.setAttribute("async", "async"), $("body").append(t)
        } catch (t) {
            console.log(t)
        }
        return b(v, e), !1
    })
});