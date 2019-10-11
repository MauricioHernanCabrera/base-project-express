const { InstitutionModel } = require('./../models');
const boom = require('@hapi/boom');
const SubjectService = require('./subject');
const removeAccent = require('./../utils/removeAccent');

const getAll = () => {
  return InstitutionModel.find()
    .select(['name', 'nameSort', '_id'])
    .sort({ nameSort: 1 });
};

const createOne = ({ data }) => {
  const nameSort = removeAccent(data.name);
  return InstitutionModel.create({ ...data, nameSort });
};

const getSubjects = async ({ filter }) => {
  const institution = await InstitutionModel.findOne(filter)
    .orFail(boom.notFound('No se encontro la institución'))
    .populate({
      path: 'subjects',
      select: ['name', 'nameSort', '_id']
    });

  return institution.subjects;
};

const createSubject = async ({ data, filter }) => {
  const subjectCreated = await SubjectService.createOne({
    name: data.name,
    institution: filter._id
  });

  await InstitutionModel.findOneAndUpdate(
    { _id: filter._id, subjects: { $ne: subjectCreated._id } },
    {
      $push: { subjects: subjectCreated }
    },
    { new: true }
  )
    .populate({
      path: 'subjects',
      sort: 'nameSort'
    })
    .orFail(boom.badRequest('Fallo al agregar materia a la institution'));

  return subjectCreated;
};

module.exports = {
  getAll,
  createOne,
  getSubjects,
  createSubject
};
