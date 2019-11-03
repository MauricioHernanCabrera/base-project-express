const { createReadStream, unlinkSync } = require('fs');
const { NoteQueueModel, NoteModel } = require('./../models');
const { createFile } = require('./gapi');

const dequeueNotes = () => {
  let inProcess = 0;
  let LIMIT_MAX = 10;
  let fails = 0;
  let recovers = 0;
  let finished = 0;

  setInterval(async () => {
    const limit = LIMIT_MAX - inProcess;

    console.log({ inProcess, limit, fails, recovers, finished });

    if (limit >= 1) {
      const notesQueue = await NoteQueueModel.find({ isPending: true }).limit(
        limit
      );

      const promises = [];

      for (let i = 0; i < notesQueue.length; i++) {
        const item = notesQueue[i];
        inProcess++;
        item.isPending = false;

        const resource = {
          name: item.file.name,
          parents: [item.googleFolderId]
        };
        const media = {
          mimeType: item.file.mimeType,
          body: createReadStream(item.file.path)
        };
        const fields = 'name, webViewLink';

        promises.push(item.save());
        createFile({ config: { resource, media, fields } })
          .then(({ data }) => {
            finished++;
            item.remove(() => {
              // console.log('Eliminadisimo');
            });

            unlinkSync(item.file.path);

            NoteModel.findOneAndUpdate(
              { _id: item.note },
              { $push: { files: data } }
            )
              .then(() => {})
              .catch(() => {});
          })
          .catch(error => {
            fails++;
            // console.log('fallo al crear!');
            item.isPending = true;
            item.save(() => {
              recovers++;
              // console.log('Volvio a pendiente!');
            });
          });

        inProcess--;
      }

      if (promises.length >= 1) {
        try {
          await Promise.all(promises);
        } catch (error) {
          console.log('Alta rompida', error);
        }
      }
    }
  }, 2000);
};

module.exports = dequeueNotes;
