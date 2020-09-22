const express = require("express");
const router = express.Router();
const db = require("./db.js");
const shortid = require("shortid");

//https://dmkjo.sse.codesandbox.io/products?category=adidas
//API lay tat ca cac mon an .
router.get("/home/recipes", (req, res) => {
  const { page } = req.query;
  if (page >= 0) {
    console.log(page);
    let arrPage = db.get("recipes").filter({}).value();
    const indexStart = page * 5;
    const indexEnd = indexStart + 5;
    arrPage = arrPage.reverse().splice(indexStart, indexEnd);
    res.json({
      status: 200,
      data: arrPage
    });
  } else {
    let arrAll = db.get("recipes").filter({}).value();
    arrAll = arrAll.reverse();
    res.json(arrAll);
  }
});

// API lay chi tiet 1 mon an.
router.post("/home/recipes/detail", (req, res) => {
  const { pId } = req.body;
  if (pId) {
    const dataDetail = db.get("recipes").find({ pId }).value();
    console.log(dataDetail);
    const dataComment = db.get("comments").filter({ pId }).value();
    if (dataDetail) {
      dataDetail.comment = dataComment.length;
      dataDetail.dataComment = dataComment;
      res.json({
        status: 200,
        data: dataDetail
      });
      return;
    }
    res.statusCode = 406;
    res.json([
      {
        message: "Mã id món ăn không tồn tại",
        status: 406
      }
    ]);
  } else {
    res.statusCode = 406;
    res.json([
      {
        message: "Mã id món ăn không hợp lệ",
        status: 406
      }
    ]);
  }
});

// API thêm 1 món ăn.
router.post("/home/recipes", (req, res) => {
  const {
    description,
    directions,
    ingredients,
    name,
    profileAvatar,
    profileName,
    urlCover
  } = req.body;
  if (!description) {
    res.statusCode = 406;
    res.json({
      status: 406,
      message: "Description không hợp lệ!"
    });
    return;
  }
  if (!name) {
    res.statusCode = 406;
    res.json({
      status: 406,
      message: "Name không hợp lệ!"
    });
    return;
  }
  db.get("recipes")
    .push({
      pId: shortid.generate(),
      description,
      directions,
      ingredients,
      name,
      profileAvatar,
      profileName,
      urlCover
    })
    .write();
  res.json({
    status: 200,
    message: "Thêm món ăn thành công!"
  });
});

//api thêm bình luận
router.post("/home/recipes/comment", (req, res) => {
  const { pId, comment, userId } = req.body;
  const userComment = db.get("users").find({ userId }).value();
  const { avatar, userName } = userComment;
  const value = db
    .get("comments")
    .push({
      avatar,
      comment,
      name: userName,
      pId,
      cmtId: shortid.generate()
    })
    .write();

  const dataComment = db.get("comments").filter({ pId }).value();
  console.log(value);
  res.json({
    status: 200,
    message: "Thêm bình luận thành công!",
    data: dataComment
  });
});

//api like mon an
router.post("/home/recipes/like", (req, res) => {
  const { pId, userId } = req.body;
  const recipe = db.get("recipes").find({ pId }).value();
  const { like, usersLike = [] } = recipe;
  const index = usersLike.indexOf(userId);
  if (index >= 0) {
    usersLike.splice(index, 1);
    db.get("recipes")
      .find({ pId })
      .assign({ like: like - 1, usersLike })
      .write();
    res.json({
      status: 200,
      message: "Unlike post thành công!"
    });
    return;
  }
  db.get("recipes")
    .find({ pId })
    .assign({ like: like + 1, usersLike: [...usersLike, userId] })
    .write();
  res.json({
    status: 200,
    message: "like post thành công!"
  });
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
  let check = db.get("products").remove({ id }).write();
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
