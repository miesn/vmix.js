
function vmixJs() {
    this.vmixIp;
    this.inputList = [];
    this.vmixVersion;
    this.refreshInput = function refreshInput() {
        var url = "http://" + this.vmixIp + ":8088/api/";
        console.log(url);
        url = encodeURI(url);
        var request = new XMLHttpRequest();
        request.open("GET", url, false);
        request.send(null);

        //处理xml
        var xmlDoc = loadXML(request.responseText);
        if (xmlDoc) {
            try {
                this.vmixVersion = xmlDoc.getElementsByTagName('version')[0].textContent;
                console.log("Version " + this.vmixVersion);
                inputs = xmlDoc.getElementsByTagName("input");
                if (inputs) {
                    for (var i = 0; i < inputs.length; i++) {
                        console.groupCollapsed(inputs[i].childNodes[0].textContent);
                        var myInputText = [];
                        if (inputs[i].attributes['type'].textContent == "GT" || inputs[i].attributes['type'].textContent == "Xaml") {
                            texts = inputs[i].getElementsByTagName('text');
                            var myTexts = [];
                            if (texts) {
                                for (var j = 0; j < texts.length; j++) {
                                    myText = {
                                        "index": texts[j].attributes['index'].textContent,
                                        "name": texts[j].attributes['name'].textContent,
                                        "content": texts[j].textContent
                                    }
                                    myTexts.push(myText);
                                }
                            }
                            myInputText = myTexts;
                        }

                        var input = {
                            inputName: inputs[i].childNodes[0].textContent,
                            inputKey: inputs[i].attributes['key'].textContent,
                            inputTitle: inputs[i].attributes['title'].textContent,
                            duration: inputs[i].attributes['duration'].textContent,
                            type: inputs[i].attributes['type'].textContent,
                            inputText: myInputText
                        };
                        console.table(input);
                        console.groupEnd();
                        this.inputList.push(JSON.stringify(input));
                    }
                }
            } catch (e) {
                console.log(e.stack); // print stack trace
            }
        }
        console.group("Input List");
        console.table(this.inputList);
        console.groupEnd();
    }
    this.query = function query(queryData) {
        var url = "http://" + this.vmixIp + ":8088/api/?" + objectToQueryString(queryData);
        console.log(url);
        console.table(queryData);
        url = encodeURI(url);
        var time = 1000;
        var timeout = false;
        var request = new XMLHttpRequest();
        var timer = setTimeout(function () {
            timeout = true;
            request.abort();
        }, time);
        request.open("GET", url);
        request.onreadystatechange = function () {
            if (request.readyState !== 4) {
                return;
            }
            if (timeout) {
                console.error("timeout");
                return;
            }
            clearTimeout(timer);
            if (request.status === 200) {
                callback(request.responseText);
            }

        };

        request.send(null);
    }
}

var objectToQueryString = function objectToQueryString(obj) {
    return Object.keys(obj).map(function (key) {
        return "".concat(encodeURIComponent(key), "=").concat(encodeURIComponent(obj[key]));
    }).join('&');
};

var loadXML = function (xmlString) { //构建xmldoc对象

    var xmlDoc = null;

    if (window.DOMParser)  //IE9+,FF,webkit
    {
        try {

            domParser = new DOMParser();
            xmlDoc = domParser.parseFromString(xmlString, 'text/xml');
        } catch (e) {
        }
    }
    else if (!window.DOMParser && window.ActiveXObject) {   //window.DOMParser 判断是否是非ie浏览器
        var xmlDomVersions = ['MSXML2.DOMDocument', 'Microsoft.XMLDOM'];
        for (var i = 0; i < xmlDomVersions.length; i++) {
            try {
                xmlDoc = new ActiveXObject(xmlDomVersions[i]);
                xmlDoc.async = false;
                xmlDoc.loadXML(xmlString); //loadXML方法载入xml字符串
                break;
            } catch (e) {
                continue;
            }
        }
    }
    else {
        return null;
    }

    return xmlDoc;
}