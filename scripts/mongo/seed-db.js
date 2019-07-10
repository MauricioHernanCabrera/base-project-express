const { initDB } = require('./../../utils/db');
const { CodeYearModel, CodeNoteModel } = require('./../../models');

const codeYears = [
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

const codeNotes = [
  { name: 'Teoria' },
  { name: 'Resumen' },
  { name: 'Practico' },
  { name: 'Ejercicios' }
];

(async function() {
  await initDB();

  await CodeYearModel.insertMany(codeYears);
  await CodeNoteModel.insertMany(codeNotes);

  return process.exit(0);
})();
