const { initDB } = require('./../../utils/db');

const { InstitutionService, NoteService } = require('./../../services');
const { CodeNoteModel, CodeYearModel, UserModel } = require('./../../models');
const codeYearsData = [
  { name: '2019 / 2020' },
  { name: '2018 / 2019' },
  { name: '2017 / 2018' },
  { name: '2016 / 2017' },
  { name: '2015 / 2016' },
  { name: '2014 / 2015' },
  { name: '2013 / 2014' },
  { name: '2012 / 2013' },
  { name: '2011 / 2012' },
  { name: '2010 / 2011' },
  { name: '2009 / 2010' },
  { name: '2008 / 2009' },
  { name: '2007 / 2008' },
  { name: '2006 / 2007' },
  { name: '2005 / 2006' },
  { name: '2004 / 2005' },
  { name: '2003 / 2004' },
  { name: '2002 / 2003' },
  { name: '2001 / 2002' },
  { name: '2000 / 2001' },
  { name: 'viejisimo' }
];

const codeNotesData = [
  { name: 'Teoria' },
  { name: 'Resumen' },
  { name: 'Practico' },
  { name: 'Ejercicios' }
];

const usersData = [
  { username: 'hola', email: 'hola@gmail.com', password: '123456789' },
  { username: 'hola2', email: 'hola2@gmail.com', password: '123456789' },
  { username: 'hola3', email: 'hola3@gmail.com', password: '123456789' }
];

const institutionsData = [
  { name: 'UNNE' },
  { name: 'UTN' },
  { name: 'Cuenca del Plata' }
];

const subjectsData = [
  { name: 'Algoritmo I' },
  { name: 'Algebra' },
  { name: 'Paradigma' }
];

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

const getRandomString = (length = 36) => {
  var result = '';
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

(async function() {
  try {
    await initDB();

    await CodeYearModel.insertMany(codeYearsData);
    await CodeNoteModel.insertMany(codeNotesData);
    await UserModel.insertMany(usersData);

    const institutionsPromises = institutionsData.map(institution => {
      return InstitutionService.createOne({ data: institution });
    });

    const institutions = await Promise.all(institutionsPromises);

    const subjectsPromises = institutions.map((institution, index) => {
      return InstitutionService.createSubject({
        data: subjectsData[index],
        _id: institution._id
      });
    });

    const codeNotes = await CodeNoteModel.find({});
    const codeYears = await CodeYearModel.find({});
    const subjects = await Promise.all(subjectsPromises);
    const users = await UserModel.find({});

    const notesPromises = [];

    for (let i = 0; i < users.length; i++) {
      for (let j = 0; j < 20; j++) {
        notesPromises.push(
          NoteService.createOne({
            data: {
              title: getRandomString(getRandomInt(30, 80)),
              description: getRandomString(getRandomInt(100, 500)),
              googleFolderId: '123456789',
              codeNote: String(
                codeNotes[getRandomInt(0, codeNotes.length)]._id
              ),
              codeYear: String(
                codeYears[getRandomInt(0, codeYears.length)]._id
              ),
              subject: String(subjects[getRandomInt(0, subjects.length)]._id),
              owner: String(users[i]._id)
            }
          })
        );
      }
    }

    const notes = await Promise.all(notesPromises);
  } catch (error) {
    console.log(error);
  } finally {
    return process.exit(0);
  }
})();
