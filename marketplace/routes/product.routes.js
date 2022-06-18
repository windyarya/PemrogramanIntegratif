const { authJwt } = require("../middleware");
const controller = require("../controllers/product.controller");
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, Origin, Content-Type, Accept"
    );
    next();
  });
  app.post("/produk/tambah", [authJwt.verifyToken], controller.addProduct);
  app.put("/produk/edit", [authJwt.verifyToken], controller.editProduct);
  app.delete("/produk/hapus", [authJwt.verifyToken], controller.deleteProduct);
  app.get("/produk/cari", [authJwt.verifyToken], controller.getProduct);
};