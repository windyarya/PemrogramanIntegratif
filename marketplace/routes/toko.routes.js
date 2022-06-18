const { authJwt } = require("../middleware");
const controller = require("../controllers/toko.controller");
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, Origin, Content-Type, Accept"
    );
    next();
  });
  app.post("/toko/tambah", [authJwt.verifyToken], controller.addToko);
  app.put("/toko/edit", [authJwt.verifyToken], controller.editToko);
  app.get("/toko/cari", [authJwt.verifyToken], controller.getToko);
};