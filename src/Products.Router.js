const express = require("express");
const router = express.Router();
const db = require("./db.js");
const shortid = require("shortid");

//https://dmkjo.sse.codesandbox.io/products?category=adidas
// lay API san pham theo category.
router.get("/", (req, res) => {
  const { category } = req.query;
  if (!!category) {
    res.json(
      db
        .get("products")
        .filter({ category })
        .value()
    );
  } else {
    res.json(
      db
        .get("products")
        .filter({})
        .value()
    );
  }
});

router.get("/:uid", (req, res) => {
  const { uid } = req.params;
  if (!!uid) {
    res.json(
      db
        .get("products")
        .filter({ uid })
        .value()
    );
  } else {
    res.json(
      db
        .get("products")
        .filter({})
        .value()
    );
  }
});

//https://dmkjo.sse.codesandbox.io/products/addProducts
// Them San Pham vao db.
router.post("/addProducts", (req, res) => {
  const { name, price, url, color, category, currency } = req.body;
  const a = db
    .get("products")
    .push({
      id: shortid.generate(),
      name,
      color,
      category,
      price,
      url,
      size: 36,
      currency
    })
    .write();
  console.log(a);

  res.json({
    status: 200,
    message: "Thêm sản phẩm thành công!"
  });
});

//https://dmkjo.sse.codesandbox.io/products/removeProduct?id=1
// xoa san pham khoi db
router.get("/removeProduct", (req, res) => {
  const { id } = req.query;
  let check = db
    .get("products")
    .remove({ id })
    .write();
  if (!!check.length) {
    res.json({
      status: 200,
      message: "Xóa Sản Phẩm Thành Công!"
    });
  } else {
    res.json({
      status: 300,
      message: "Xóa Sản Phẩm Thất Bại, Hãy Thử Lại!"
    });
  }
});

//sua san pham trong db
//https://dmkjo.sse.codesandbox.io/products/updateProduct
router.get("/updateProduct", (req, res) => {
  const { id } = req.query;
  db.get("products")
    .find({ id })
    .assign({ ...req.query })
    .write();
  res.json({
    status: 200,
    message: "Sửa Sản Phẩm Thành Công!"
  });
});

module.exports = router;
