const { InstitutionModel } = require('./../models');
const boom = require('@hapi/boom');
const SubjectService = require('./subject');
const removeAccent = require('./../utils/removeAccent');

const getAll = () => {
  return InstitutionModel.find()
    .select(['name', 'nameSort', '_id'])
    .sort({ nameSort: 1 });
};

const getOne = ({ filter }) => {
  return InstitutionModel.find(filter).orFail(
    '¡No se encontro la institución!'
  );
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
  const { name } = data;
  const { _id } = filter;

  const subjectCreated = await SubjectService.createOne({
    data: { name, institution: _id }
  });

  await InstitutionModel.findOneAndUpdate(
    { _id, subjects: { $ne: subjectCreated._id } },
    {
      $push: { subjects: subjectCreated }
    },
    { new: true }
  ).populate({
    path: 'subjects',
    sort: 'nameSort'
  });

  return subjectCreated;
};

module.exports = {
  getAll,
  createOne,
  getSubjects,
  createSubject,
  getOne
};
