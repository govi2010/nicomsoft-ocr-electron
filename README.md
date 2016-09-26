
# nicomsoft-ocr-electron

## INSTALLING

`npm install git://github.com/govi2010/nicomsoft-ocr-electron.git#master`

## API

INIT method: `init: function (byte64, inputMainModuleLanguage, inputConfigturation, loadingUrl, key)`
Init method initialize OCR sdk for Application  inputs are 

`byte64`: blob object of image

`inputMainModuleLanguage`: language json.

```
{
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
    "Turkish": false,
    "Arabic": false,
    "Chinese_Simplified": false,
    "Chinese_Traditional": false,
    "Japanese": false,
    "Korean": false
};
```

`inputConfigturation`: option available in sdk.
```

{
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

```

`loadingUrl`: path of sdk folder.
`C:\Program Files (x86)\Nicomsoft OCR` here is sample.

`key`: key for Niconsoft OCR key.

## License

MIT

