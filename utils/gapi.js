const { google } = require('googleapis');
const credentials = require('./../credentials.json');
const token = require('./../token.json');

const NAME_BASE_FOLDER = 'apuntus.com';
const MIME_TYPE_FOLDER = 'application/vnd.google-apps.folder';
const PERMISSION_ANYONE_READER = {
  type: 'anyone',
  role: 'reader'
};

const authorize = () => {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  oAuth2Client.setCredentials(token);
  return oAuth2Client;
};

const getFileList = async (payload = {}) => {
  const { auth = authorize(), config } = payload;
  const drive = google.drive({ version: 'v3', auth });
  return (await drive.files.list(config)).data;
};

const getFolderApuntus = async (payload = {}) => {
  const { auth = authorize() } = payload;
  const drive = google.drive({ version: 'v3', auth });

  const { data } = await drive.files.list({
    pageSize: 1,
    q: `name='${NAME_BASE_FOLDER}' and mimeType='${MIME_TYPE_FOLDER}' and not trashed`
  });

  if (data.files.length) {
    return data.files[0];
  } else {
    const resNewFolder = await createFolder({
      auth,
      config: {
        resource: {
          name: NAME_BASE_FOLDER,
          mimeType: MIME_TYPE_FOLDER
        }
      }
    });
    await createPermission({ fileId: resNewFolder.data.id, auth });
    return resNewFolder.data;
  }
};

const createFolder = (payload = {}) => {
  const { auth = authorize(), config } = payload;
  const drive = google.drive({ version: 'v3', auth });

  return drive.files.create(config);
};

const createPermission = (payload = {}) => {
  const { fileId, auth = authorize() } = payload;
  const drive = google.drive({ version: 'v3', auth });

  return drive.permissions.create({
    resource: PERMISSION_ANYONE_READER,
    fileId
  });
};

const createFile = (payload = {}) => {
  const { auth = authorize(), config } = payload;
  const drive = google.drive({ version: 'v3', auth });
  return drive.files.create(config);
};

module.exports = {
  getFileList,
  getFolderApuntus,
  createPermission,
  createFolder,
  MIME_TYPE_FOLDER,
  createFile,
  authorize
};
