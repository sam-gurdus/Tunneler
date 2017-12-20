function handleFileSelect(files) {
    if (!window.FileReader || !window.XMLHttpRequest) {
        alert("This browser does not support.");
        return;
    }

    if (files) gfiles = files;
    if (!gfiles || gfiles.length == 0) return;

    var tot = 0;
    for (var i = 0, f; f = gfiles[i]; i++) {

        var usearray = false;
        var f = gfiles[i];
        if (f.size > gmaxsize * 1024 * 1024) {
            alert('The file size is too large to view. (The maximum size is ' + gmaxsize + 'MB)');
            return;
        }
        var reader = new FileReader();
        reader.onload = function(e) {
            var blob = new Blob([e.target.result]);
            gd_bloburl = window.URL.createObjectURL(blob);
            var resp = {};
            resp.id = '(Local) ' + this.name;
            resp.title = resp.id;
            proc_loadgame(gd_bloburl, resp);
        };
        reader.onerror = function() {
            alert('Read Error: ' + this.name);
        };
        reader.id = i;
        reader.name = f.name;
        if (!reader.readAsArrayBuffer) {
            alert("This browser does not support.");
            return;
        } else {
            reader.readAsArrayBuffer(f);
        }
        break;

    }
}

function init2() {
    _getid('fileload1').onchange = function(e) {
        if (!e || !e.target) {
            alert("This browser does not support.");
            return;
        }
        handleFileSelect(e.target.files);
    }
    var holder = document;
    holder.ondragover = function(e) {
        try {
            var ua = navigator.userAgent;
            if (ua && ua.indexOf("Chrome") >= 0) {
                if (e.originalEvent) e = e.originalEvent;
                if (e.dataTransfer) {
                    var b = e.dataTransfer.effectAllowed;
                    e.dataTransfer.dropEffect = ('move' === b || 'linkMove' === b) ? 'move' : 'copy';
                }
            }
        } catch (err) {}
        return false;
    };
    holder.ondragend = function() {
        return false;
    };
    holder.ondrop = function(e) {
        e.preventDefault();
        handleFileSelect(e.dataTransfer.files);
        return false;
    };
    if (navigator.userAgent && navigator.userAgent.toLowerCase().indexOf("windows") >= 0) {
        var a = _getid('fileload1');
        a.setAttribute("accept", ".swf");
    }
}
init2();
