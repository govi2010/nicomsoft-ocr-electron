var X2JS = require('x2js');
var edge = require('electron-edge');
const fs = require('fs');
var MainModuleLanguage = {
    "Bulgarian": false,
    "Catalan": false,
    "Croatian": false,
    "Czech": false,
    "Danish": false,
    "Dutch": false,
    "English": true,
    "Estonian": false,
    "Finnish": false,
    "French": false,
    "German": false,
    "Hungarian": false,
    "Indonesian": false,
    "Italian": false,
    "Latvian": false,
    "Lithuanian": false,
    "Norwegian": false,
    "Polish": false,
    "Portuguese": false,
    "Romanian": false,
    "Russian": false,
    "Slovak": false,
    "Slovenian": false,
    "Spanish": false,
    "Swedish": false,
    "Turkish": false
};

var AsianModuleLanguage = {
    "Arabic": false,
    "Chinese_Simplified": false,
    "Chinese_Traditional": false,
    "Japanese": false,
    "Korean": false
};
var Configturation = {
    "FindBarcodes": true,
    "ImgInversion": true,
    "ZonesInversion": true,
    "DetectFixSkew": true,
    "Rotation": true,
    "ImgNoiseFilter": true,
    "RemoveLines": true,
    "GrayMode": false,
    "FastMode": false,
    "BinTwice": false,
    "CorrectMixed": true,
    "Dictionary": true,
    "OneColumn": false,
    "EnabledChars": "",
    "DisabledChars": "",
    "BinarizationThreshold": "255",
    "TextQuality": "-1",
    "PDFRenderingDPI": "300"
};

module.exports = {

    error: [],
    byte64: '',
    MainModuleLanguage: {},
    AsianModuleLanguage: {},
    Configturation: {},
    loadingUrl: '',
    finalKey: '',
    init: function (byte64, inputMainModuleLanguage, inputConfigturation, loadingUrl, key) {

        this.error = [];
        this.byte64 = byte64;
        this.MainModuleLanguage = MainModuleLanguage;
        this.finalKey = key;
        this.AsianModuleLanguage = AsianModuleLanguage;
        this.Configturation = Configturation;
        if (process.arch === "x64") {
            this.loadingUrl = loadingUrl + "\\Bin_64\\NSOCR.dll";
            if (!fs.existsSync(this.loadingUrl)) {
                this.error.push(this.loadingUrl + " : Dll file doesn't exists.");
                return false;
            }
        }
        else {
            this.loadingUrl = loadingUrl + "\\Bin\\NSOCR.dll";
            if (!fs.existsSync(this.loadingUrl)) {
                this.error.push(this.loadingUrl + " : Dll file doesn't exists.");
                return false;
            }
        }


        for (var obj in inputMainModuleLanguage) {
            if (this.MainModuleLanguage.hasOwnProperty(obj)) {
                this.MainModuleLanguage[obj] = inputMainModuleLanguage[obj];
            }
        }

        for (var obj in inputMainModuleLanguage) {
            if (this.AsianModuleLanguage.hasOwnProperty(obj)) {
                this.AsianModuleLanguage[obj] = inputMainModuleLanguage[obj];
            }
        }

        for (var obj in inputConfigturation) {
            if (this.Configturation.hasOwnProperty(obj)) {
                this.Configturation[obj] = inputConfigturation[obj];
            }
        }

        var ch1 = false;

        for (var obj in this.MainModuleLanguage) {
            if (this.MainModuleLanguage[obj]) {
                ch1 = true;
                break;
            }
        }

        var ch2 = 0;
        for (var obj in this.AsianModuleLanguage) {
            if (this.AsianModuleLanguage[obj]) {
                ch2++;
            }
        }

        if (!ch1 && (ch2 == 0)) {
            this.error.push("Please select at least one language for recognition.");
            return false;
        }
        if (ch1 && (ch2 > 0)) {
            this.error.push("Using both main and asian languages in same zone is not supported.");
            return false;
        }
        if (ch2 > 1) {
            this.error.push("Using two or more asian languages in same zone is not supported currently.");
            return false;
        }

        return true;


    },
    GetError: function () {
        return this.error;
    },

    performOcr(callback) {
        callback(process.arch);
        var arrayBuffer;
        var fileReader = new FileReader();
        fileReader.onload = (e) => {
            arrayBuffer = e.target.result;
            var byte64new = new Buffer(arrayBuffer);

            var csFilePath = __dirname + "/ocr.cs";

            var str = "";
            if (fs.existsSync(csFilePath)) {
                if (fs.existsSync(this.loadingUrl)) {
                    str = fs.readFileSync(csFilePath, "utf8").replace("#LIBNAME#", this.loadingUrl);
                } else {
                    callback(this.loadingUrl + " : Dll file doesn't exists.");
                    return;
                }
            } else {
                callback(csFilePath + " : Cs File node found. ");
                return;
            }

            var getXml = edge.func({
                source: str,
                references: ['System.Drawing.dll']
            });

            var passedData = Object.assign({ byte64: byte64new, path: this.loadingUrl, finalKey: this.finalKey }, this.MainModuleLanguage, this.AsianModuleLanguage, this.Configturation);
            getXml(passedData, (error, result) => {
                if (error) {
                    throw error
                }

                var x2js = new X2JS();
                debugger;
                var jsonObj = x2js.xml2js(result);
                callback(JSON.stringify(jsonObj));
            });

        }
        fileReader.readAsArrayBuffer(this.byte64);
    }
};
