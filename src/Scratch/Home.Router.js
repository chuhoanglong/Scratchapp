const express = require("express");
const router = express.Router();
const db = require("./db.js");
const shortid = require("shortid");

var Home = require('./SchemaDB/home.model');
var Comment = require('./SchemaDB/comment.model');
var User = require('./SchemaDB/user.model');

//https://dmkjo.sse.codesandbox.io/products?category=adidas
//API lay tat ca cac mon an .
router.get("/home/recipes", async (req, res) => {
  const { page } = req.query;
  const response = await Home.find({});
  if (page >= 0 && response.length > 0) {
    const indexStart = page * 5;
    const indexEnd = indexStart + 5;
    const arrPage = response.reverse().splice(indexStart, indexEnd);
    res.json({
      status: 200,
      data: arrPage
    });
    // let arrPage = db.get("recipes").filter({}).value();
  } else {
    const arrAll = response.reverse();
    res.json({
      status: 200,
      data: arrAll
    });
  }
});

// API lay chi tiet 1 mon an.
router.post("/home/recipes/detail", async (req, res) => {
  const { rId } = req.body;
  if (rId) {
    const response = await Home.find({ rId });
    const dataComment = await Comment.find({ rId });
    if (response) {
      const data = {
        ...response,
        comment: dataComment.length,
        dataComment: dataComment
      }
      res.json({
        status: 200,
        data
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
    urlCover,
    uId
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

  const data = {
    rId: shortid.generate(),
    description,
    directions,
    ingredients,
    name,
    profileAvatar,
    profileName,
    urlCover,
    uId,
    like: 0
  }

  var home = new Home(data);
  home.save(err => {
    if (err) {
      res.json({
        status: 200,
        message: err
      });
      return;
    }
    res.json({
      status: 200,
      message: "Thêm món ăn thành công!"
    });
  });
});

//api thêm bình luận
router.post("/home/recipes/comment", async (req, res) => {
  const { rId, comment, userId } = req.body;
  const currentUser = await User.findOne({ userId });
  console.log("currentUser", currentUser);
  if (!currentUser) {
    res.statusCode = 406;
    res.json({
      status: 406,
      message: "userId Không hợp lệ!",
    });
    return;
  }
  const CurrentRecipe = await Home.find({ rId });
  if (!CurrentRecipe) {
    res.statusCode = 406;
    res.json({
      status: 406,
      message: "rId Không hợp lệ!",
    });
    return;
  }
  const { avatar, userName } = currentUser;
  const data = {
    avatar,
    comment,
    name: userName,
    userId,
    rId,
    cmtId: shortid.generate()
  }
  var commentModel = new Comment(data);
  commentModel.save(async err => {
    if (err) {
      res.statusCode = 406;
      res.json({
        status: 406,
        message: err
      });
      return;
    }
    const dataComment = await Comment.find({ rId });
    res.json({
      status: 200,
      message: "Thêm bình luận thành công!",
      dataComment: dataComment
    });
  });
});

//api xoá bình luận.
router.post("/home/recipes/comment/delete", async (req, res) => {
  const { cmtId } = req.body;
  const response = await Comment.findOneAndRemove({ cmtId });
  if (!response) {
    res.statusCode = 406;
    res.json({
      status: 406,
      message: 'cmtId không tồn tại!',
    })
    return;
  }
  res.json({
    status: 200,
    message: 'Xoá bình luận thành công!',
  });
});


//api like mon an
router.post("/home/recipes/like", async (req, res) => {
  const { rId, userId } = req.body;
  const recipe = await Home.findOne({ rId });
  const { like, usersLike = [] } = recipe;
  const index = usersLike.indexOf(userId);
  if (index >= 0) {
    usersLike.splice(index, 1);
    const response = await Home.where({ rId }).update({ like: like - 1, usersLike })
    console.log("response", response);
    res.json({
      status: 200,
      message: "Unlike post thành công!"
    });
    return;
  }
  const response = await Home.where({ rId }).update({ like: like + 1, usersLike: [...usersLike, userId] })
  console.log("response", response);

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
