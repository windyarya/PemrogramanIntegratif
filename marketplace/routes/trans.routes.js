const { authJwt } = require("../middleware");
const controller = require("../controllers/trans.controller");
const cors = require("cors");
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, Origin, Content-Type, Accept"
    );
    next();
  });
  app.post("/order/buat", [authJwt.verifyToken], controller.makeOrder);
  app.post("/order/pembayaran", [authJwt.verifyToken], controller.makePayment);
  app.post("/order/seller/pickup", [authJwt.verifyToken], controller.pickedUp);
  app.post("/order/seller/kirim", [authJwt.verifyToken], controller.shipped);
  app.post("/order/terkirim", [authJwt.verifyToken], controller.delivered);
  app.get("/order/riwayat", [authJwt.verifyToken], controller.getHistory);
};