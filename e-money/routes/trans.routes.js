const { authJwt } = require("../middleware");
const controller = require("../controllers/trans.controller");
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, Origin, Content-Type, Accept"
    );
    next();
  });
  app.get("/api/saldo", [authJwt.verifyToken], controller.saldo);
  app.get("/api/riwayat", [authJwt.verifyToken], controller.riwayat);
  app.post("/api/pembayaran", [authJwt.verifyToken], controller.pembayaran);
  app.post("/api/transfer", [authJwt.verifyToken], controller.transfer);
  app.post("/api/isiulang", [authJwt.verifyToken, authJwt.isAdmin], controller.isiulang);
};