const { InstitutionModel } = require('./../models');
const boom = require('@hapi/boom');
const SubjectService = require('./subject');

const getAll = () => {
  return InstitutionModel.find()
    .select('name')
    .sort({ nameSort: 1 });
};

const createOne = ({ data }) => {
  return InstitutionModel.create(data);
};

const getSubjects = async ({ _id }) => {
  const institution = await InstitutionModel.findById(_id)
    .orFail(boom.notFound('No se encontro la institución'))
    .populate({
      path: 'subjects',
      select: ['name', '_id']
    });
  return institution.subjects;
};

const createSubject = async ({ data, _id }) => {
  const subjectCreated = await SubjectService.createOne({
    name: data.name,
    institution: _id
  });
  const institutionWithSubject = await InstitutionModel.findOneAndUpdate(
    { _id, subjects: { $ne: subjectCreated._id } },
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
