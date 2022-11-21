"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_google_drive_picker_1 = __importDefault(require("react-google-drive-picker"));
var react_1 = require("react");
var axios_1 = __importDefault(require("axios"));
function GoogleDrive(props) {
    var GoogeDriveID = process.env.NEXT_PUBLIC_GDRIVE_ID || '';
    var GoogleDriveKey = process.env.NEXT_PUBLIC_GDRIVE_KEY || '';
    var _a = (0, react_google_drive_picker_1.default)(), openPicker = _a[0], authResponse = _a[1];
    var oauthToken = (0, react_1.useRef)('');
    var handleOpenPicker = function () {
        return openPicker({
            clientId: GoogeDriveID,
            developerKey: GoogleDriveKey,
            viewId: 'DOCS_IMAGES',
            showUploadView: true,
            showUploadFolders: true,
            supportDrives: true,
            multiselect: false,
            viewMimeTypes: 'image/jpeg, image/jpg, image/png',
            callbackFunction: function (data) {
                if (data.action === 'cancel') {
                    console.log('User clicked cancel/close button');
                }
                if (data.action === 'picked') {
                    var doc = data.docs[0];
                    axios_1.default
                        .get('https://www.googleapis.com/drive/v3/files/' +
                        doc.id +
                        '?alt=media', {
                        headers: { Authorization: 'Bearer ' + oauthToken.current },
                        responseType: 'blob',
                    })
                        .then(function (res) {
                        var getBase64 = function (file, cb) {
                            var reader = new FileReader();
                            reader.readAsDataURL(file);
                            reader.onload = function () {
                                cb(reader.result);
                            };
                            reader.onerror = function (error) {
                                console.log('Error: ', error);
                            };
                        };
                        getBase64(res.data, function (result) {
                            props(result);
                        });
                    });
                }
            },
        });
    };
    (0, react_1.useEffect)(function () {
        if (authResponse) {
            oauthToken.current = authResponse.access_token;
        }
    }, [authResponse]);
    return handleOpenPicker;
}
exports.default = GoogleDrive;
