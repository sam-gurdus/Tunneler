_getid('btn_close').disabled = false;

function size_width_onchange(f, nosize) {
    var w = _getid('size_width').value;
    var h = _getid('size_height').value;
    if (w < 100) w = 100;
    if (w > 1500) w = 1500;
    if (h < 100) h = 100;
    if (h > 1500) h = 1500;
    if (f) {
        _getid('size_width_n').value = w;
        _getid('size_height_n').value = h;
    }

    function find(parent) {
        var a = parent.getElementsByTagName('*');
        for (var i = 0; i < a.length; i++) {
            var s = a[i].tagName;
            if (s == "IFRAME" || s == "EMBED" || s == "OBJECT") {
                if (s == "OBJECT") find(a[i]);
                a[i].width = w;
                a[i].height = h;
            }
        }
    }
    if (!nosize) find(_getid("codearea"));
}

function size_width_n_onchange(f) {
    var w = _getid('size_width_n').value;
    var h = _getid('size_height_n').value;
    if (w < 100) w = 100;
    if (w > 1500) w = 1500;
    if (h < 100) h = 100;
    if (h > 1500) h = 1500;
    _getid('size_width').value = w;
    _getid('size_height').value = h;
    size_width_onchange();
}

function vphistory_onchange(f) {
    if (!f.value) return;
    for (var i = 0; i < g_lastdata.length; i++) {
        if (g_lastdata[i].id == f.value) {
            proc_loadgame(g_lastdata[i].url, g_lastdata[i].resp, true);
            break;
        }
    }
}

var g_lastdata2;
var g_lastdata = [];

function proc_loadgame(url, resp, ishistory) {
    g_lastdata2 = {};
    g_lastdata2.url = url;
    g_lastdata2.resp = resp;
    if (!ishistory) {
        for (var i = 0; i < g_lastdata.length; i++) {
            if (g_lastdata[i].resp.id == resp.id) {
                if (g_lastdata[i].url) window.URL.revokeObjectURL(g_lastdata[i].url);
                g_lastdata.splice(i, 1);
                break;
            }
        }
        var a = {};
        a.id = (new Date()).getTime();
        a.url = url;
        a.resp = resp;
        g_lastdata.push(a);
        if (g_lastdata.length > 5) {
            if (g_lastdata[0].url) window.URL.revokeObjectURL(g_lastdata[0].url);
            g_lastdata.splice(0, 1);
        }
        var s = 'History &nbsp;<select onchange="vphistory_onchange(this)" style="width:350px">';
        for (var i = g_lastdata.length - 1; i >= 0; i--) {
            s += '<option value="' + g_lastdata[i].id + '">' + html_entity_encode(g_lastdata[i].resp.title || 'No Name');
        }
        s += '<\/select>';
        _getid('vphistory').innerHTML = s;
    }

    var sw = _getid('size_width');
    var sh = _getid('size_height');
    var bs = _getid('btn_save');
    bs.style.color = "";

    var w = sw.value;
    var h = sh.value;
    var a = get_data();
    for (var i = 0; i <= a.length - 1; i++) {
        if (a[i].id == resp.id) {
            w = a[i].width;
            h = a[i].height;
            sw.value = w;
            sh.value = h;
            size_width_onchange(sw, true);
            bs.style.color = "green";
            break;
        }
    }

    check_flash();
    var s = '';
    if (!okflash) s += '<div style="margin-bottom:5px"><span style="color:#aa2222">Adobe Flash Player is required. Ensure Flash is installed and enabled.<\/span><\/div>';
    s += '<embed width="' + w + '" height="' + h + '" src="' + url + '" quality="high" pluginspage="https://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash">';
    var a = _getid('codearea');
    a.innerHTML = s;
    a.data = resp.id;

    _getid('btn_save').disabled = false;
    _getid('btn_refresh').disabled = false;
    _getid('btn_close').disabled = false;

    document.getElementById("codearea").removeAttribute("style");
    document.getElementById("codearea").style.margin = "0 auto";
}
var okflash = null;

function check_flash() {
    if (okflash != null) return;
    okflash = false;
    try {
        if (new ActiveXObject('ShockwaveFlash.ShockwaveFlash')) okflash = true;
    } catch (e) {
        var a = navigator.mimeTypes;
        if (a && a['application/x-shockwave-flash'] != undefined && a['application/x-shockwave-flash'].enabledPlugin) okflash = true;
    }
}

function openWindow(url, name, w, h) {
    var winX = 0;
    var winY = 0;
    if (parseInt(navigator.appVersion) >= 4) {
        winX = (screen.availWidth - w) * .5;
        winY = (screen.availHeight - h) * .5;
    }
    var features = 'width=' + w + ',height=' + h + ',left=' + winX + ',top=' + winY + ', resizable=yes, scrollbars=yes';
    var win = window.open(url, name, features);
    if (win) win.focus();
}

function get_data() {
    var s = getstorage('drive_data');
    if (!s) s = '[]';
    var a = [];
    try {
        a = JSON.parse(s);
    } catch (err) {
        a = [];
    }
    if (!a) a = [];
    return a;
}

function proc_close() {

    _getid('codearea').innerHTML = '';

    document.getElementById("codearea").setAttribute("style", "width: 500px; height: 500px; background: #EBEBEB; margin: 0 auto;");

    document.getElementById("fileload1").value = "";
    document.getElementById("filetext").value = "";

    document.getElementById("size_width").value = "500";
    document.getElementById("size_width_n").value = "500";
    document.getElementById("size_height").value = "500";
    document.getElementById("size_height_n").value = "500";

    _getid('btn_save').disabled = true;
    _getid('btn_refresh').disabled = true;

    document.getElementById("btn_save").style.color = "";
    
}

function proc_refresh() {
    if (g_lastdata2) {
        proc_loadgame(g_lastdata2.url, g_lastdata2.resp, true);
    }
}

function proc_save() {
    var obj = _getid('codearea');
    if (!obj.data) return;

    var a = get_data();
    if (a.length > 30) {
        a.splice(0, 1);
    }
    for (var i = 0; i <= a.length - 1; i++) {
        if (a[i].id == obj.data) {
            a.splice(i, 1);
            break;
        }
    }
    var b = {}
    b.id = obj.data;
    b.width = _getid('size_width').value;
    b.height = _getid('size_height').value;
    a.push(b);
    if (window.JSON) setstorage("drive_data", JSON.stringify(a));
    show_message("Saved.");
    _getid('btn_save').style.color = "green";
}
