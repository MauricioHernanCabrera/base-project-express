const express = require('express');
const router = express();

const { UserModel, InstitutionModel, SubjectModel } = require('./../models');

router.post('/', async function(req, res, next) {
  try {
    const { body: data } = req;

    // const subject = await getSubject({ name: data.name });
    // const subject = await createSubject(data);

    // const institution = await addSubjectToInstitution({
    //   _id: data._id,
    //   subject
    // });

    res.status(200).json({
      message: 'Todo ok',
      data: {
        // subject,
        // institution
      }
    });
  } catch (err) {
    next(err);
  }
});

function createInstitution({ name }) {
  const institution = new InstitutionModel({ name });
  return institution.save();
}

function addSubjectToInstitution({ _id, subject }) {
  return InstitutionModel.findOneAndUpdate(
    { _id, subjects: { $ne: subject._id } },
    {
      $push: { subjects: subject }
    },
    { new: true }
  ).orFail('Fallo al agregar materia a la institution');
}

function createSubject({ name, _id }) {
  const subject = new SubjectModel({ name, institution: _id });
  return subject.save();
}

function getSubjectById({ _id }) {
  return SubjectModel.findById(_id).orFail('Fallo al encontrar la materia');
}

function getSubject(filter) {
  return SubjectModel.findOne(filter).orFail('Fallo al encontrar la materia');
}

module.exports = router;
