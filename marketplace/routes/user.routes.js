const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");
const cors = require("cors");
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, Origin, Content-Type, Accept"
    );
    next();
  });
  app.post("/user/edit", [authJwt.verifyToken], controller.editUser);
  app.post("/user/hapus", [authJwt.verifyToken], controller.deleteUser);
  app.post("/user/cari", [authJwt.verifyToken], controller.getUser);
};