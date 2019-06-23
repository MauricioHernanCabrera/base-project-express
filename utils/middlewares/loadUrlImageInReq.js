function loadUrlImageInReq(name = 'image') {
  return function(req, res, next) {
    if (req.file) {
      req.body[name] = req.file.path;
    }
    next();
  };
}

module.exports = loadUrlImageInReq;
