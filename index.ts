import GooglePicker from 'react-google-drive-picker';
import { useEffect, useRef } from 'react';
import axios from 'axios';

export default function GoogleDrive(props: any) {
    const GoogeDriveID = process.env.NEXT_PUBLIC_GDRIVE_ID || '';
    const GoogleDriveKey = process.env.NEXT_PUBLIC_GDRIVE_KEY || '';
    const [openPicker, authResponse] = GooglePicker();
    const oauthToken = useRef('');
    const handleOpenPicker = () => {
        return openPicker({
            clientId: GoogeDriveID,
            developerKey: GoogleDriveKey,
            viewId: 'DOCS_IMAGES',
            showUploadView: true,
            showUploadFolders: true,
            supportDrives: true,
            multiselect: false,
            viewMimeTypes: 'image/jpeg, image/jpg, image/png',
            callbackFunction: (data) => {
                if (data.action === 'cancel') {
                    console.log('User clicked cancel/close button');
                }
                if (data.action === 'picked') {
                    const doc = data.docs[0];
                    axios
                        .get(
                            'https://www.googleapis.com/drive/v3/files/' +
                            doc.id +
                            '?alt=media',
                            {
                                headers: { Authorization: 'Bearer ' + oauthToken.current },
                                responseType: 'blob',
                            }
                        )
                        .then((res) => {
                            const getBase64 = (file: any, cb: Function) => {
                                let reader = new FileReader();
                                reader.readAsDataURL(file);
                                reader.onload = function () {
                                    cb(reader.result);
                                };
                                reader.onerror = function (error) {
                                    console.log('Error: ', error);
                                };
                            };
                            getBase64(res.data, (result: string) => {
                                props(result);
                            });
                        });
                }
            },
        });
    };
    useEffect(() => {
        if (authResponse) {
            oauthToken.current = authResponse.access_token;
        }
    }, [authResponse]);
    return handleOpenPicker;
}


