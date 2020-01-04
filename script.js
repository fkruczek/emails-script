async function readTextFile(file) {
    return new Promise((resolve, reject) => {
        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", file, false);
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4) {
                if (rawFile.status === 200 || rawFile.status == 0) {
                    var allText = rawFile.responseText;
                    resolve(allText);
                }
            }
        }
        rawFile.send(null);
    });
}

async function httpGet(url) {
    const response = await fetch(url);
    const text = await response.text();
    return getEmailFromSite(text);
}

let extractUrls = /http:[^"]+/gm;
let extractFunction = /urlformsg\(\s*([^)]+?)\s*\)/m;
let extractParams = /[^,']+/gm;

function getEmailFromSite(site) {
    let header = site.match(extractFunction);
    let params = header[1].match(extractParams);
    return params[0] + '@' + params[1];
}

async function getEmails() {
    let file = await readTextFile('festiwale.txt');
    let urls = file.match(extractUrls);
    let promises = urls.map(url => httpGet(url));
    let emails = await Promise.all(promises);
    document.getElementById('content').innerText = emails;
}
getEmails();

