let url = 'http://www.cioff.org/events-festival.cfm/en/1042/Croatia-International_Festival_of_Traditional_Music_instruments';
let fileUrl = 'festiwale.txt';
function httpGet(theUrl) {
    return new Promise((resolve, reject) => {
        if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        }
        else {// code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                resolve(xmlhttp.response);
            }
        }
        xmlhttp.open("GET", theUrl, false);
        xmlhttp.send();
    });
}

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

let urls = [];
let emails = [];

let extractUrls = /http:[^"]+/gm;
let extractFunction = /urlformsg\(\s*([^)]+?)\s*\)/m;
let extractParams = /[^,']+/gm;

function getEmailFromSite(site) {
    let header = site.match(extractFunction);
    let params = header[1].match(extractParams);
    return params[0] + '@' + params[1];
}


// TO DZIAŁA
/*
async function getEmails() {
    let email, emails = [];
    let file = await readTextFile(fileUrl);
    let urls = file.match(extractUrls);
    console.log(urls.length);
    for (let i = 0; i < url.length; i++) {
        let site = await httpGet(urls[i]);
        email = getEmailFromSite(site);
        emails.push(email);
        console.log(email);
    }
    document.getElementById('content').innerText = emails;
}
*/

//TO NIE DIZAŁA
async function getEmails() {

    let file = await readTextFile(fileUrl);
    let urls = file.match(extractUrls);

    let promises = urls.map(url => httpGet(url))
    let emails = await Promise.all(promises); //promises to kody źródłowe stron chyba, jeszcze funkcja getEmailFromSite()???

    document.getElementById('content').innerText = emails;
}

getEmails();