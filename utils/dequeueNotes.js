const { createReadStream, unlinkSync } = require('fs');
const { NoteQueueModel, NoteModel } = require('./../models');
const { createFile } = require('./gapi');

const dequeueNotes = () => {
  let LIMIT_MAX = 10;
  let fails = 0;
  let recovers = 0;
  let finished = 0;
  let deleteds = 0;

  setInterval(async () => {
    const limit = LIMIT_MAX;

    console.log({ limit, fails, recovers, finished, deleteds });

    if (limit >= 1) {
      const notesQueue = await NoteQueueModel.find({ isPending: true }).limit(
        limit
      );

      const promises = [];

      for (let i = 0; i < notesQueue.length; i++) {
        const item = notesQueue[i];
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
              deleteds++;
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
            item.isPending = true;
            item.save(() => {
              recovers++;
            });
          });
      }

      if (promises.length >= 1) {
        try {
          await Promise.all(promises);
        } catch (error) {
          console.log('Alta rompida', error);
        }
      }
    }
  }, 3000);
};

module.exports = dequeueNotes;
