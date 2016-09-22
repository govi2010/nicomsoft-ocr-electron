'use strict';

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var X2JS = require('x2js');
var edge = require('electron-edge');
var fs = require('fs');
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
    init: function init(byte64, inputMainModuleLanguage, inputAsianModuleLanguage, inputConfigturation, loadingUrl) {

        this.error = [];
        this.byte64 = byte64;
        this.MainModuleLanguage = MainModuleLanguage;

        this.AsianModuleLanguage = AsianModuleLanguage;
        this.Configturation = Configturation;
        this.loadingUrl = loadingUrl;

        for (var obj in inputMainModuleLanguage) {
            if (this.MainModuleLanguage.hasOwnProperty(obj)) {
                this.MainModuleLanguage[obj] = inputMainModuleLanguage[obj];
            }
        }

        for (var obj in inputAsianModuleLanguage) {
            if (this.AsianModuleLanguage.hasOwnProperty(obj)) {
                this.AsianModuleLanguage[obj] = inputAsianModuleLanguage[obj];
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

        if (!ch1 && ch2 == 0) {
            this.error.push("Please select at least one language for recognition.");
            return false;
        }
        if (ch1 && ch2 > 0) {
            this.error.push("Using both main and asian languages in same zone is not supported.");
            return false;
        }
        if (ch2 > 1) {
            this.error.push("Using two or more asian languages in same zone is not supported currently.");
            return false;
        }

        return true;
    },
    performOcr: function performOcr(callback) {
        var _this = this;

        var arrayBuffer;
        var fileReader = new FileReader();
        fileReader.onload = function (e) {
            arrayBuffer = e.target.result;
            var byte64new = new Buffer(arrayBuffer);

            var csFilePath = __dirname + "/ocr.cs";

            var str = fs.readFileSync(csFilePath, "utf8").replace("#LIBNAME#", "D:\\desktopCapture\\Bin_64\\NSOCR.dll");

            var getXml = edge.func({
                source: str,
                references: ['System.Drawing.dll']
            });

            var passedData = _Object$assign({ byte64: byte64new, path: _this.loadingUrl }, _this.MainModuleLanguage, _this.AsianModuleLanguage, _this.Configturation);
            getXml(passedData, function (error, result) {
                if (error) {
                    throw error;
                }

                var x2js = new X2JS();
                debugger;
                var jsonObj = x2js.xml2js(result);
                console.log(jsonObj);
                callback(JSON.stringify(jsonObj));
            });
        };
        fileReader.readAsArrayBuffer(this.byte64);
    }
};