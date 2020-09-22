const express = require("express");
const router = express.Router();
const db = require("./db");
const shortid = require("shortid");
const firebase = require("./firebaseconfig");

// khi nguoi dung dang nhap
//https://dmkjo.sse.codesandbox.io/users
router.post("/", (req, res) => {
  const { email, password } = req.body;
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(function(result) {
      if (!!result) {
        const { uid, email } = result.user;
        // result.user.tenantId should be ‘TENANT_PROJECT_ID’.
        const user = db
          .get("users")
          .find({ email, uid })
          .value();
        if (!!user) {
          console.log(user);
          if (user.roles === "admin") {
            res.json({
              status: 201,
              message: "Bạn Vui Lòng Sử Dụng Tài Khoản Người Dùng Để Đăng Nhập"
            });
          } else {
            res.json({
              status: 200,
              message: "Đăng Nhập Thành Công!",
              user
            });
          }
        } else {
          res.json({
            status: 300,
            message: "Tài Khoản Không Tồn Tại!"
          });
        }
      }
    })
    .catch(function(error) {
      res.json({
        status: 300,
        message: error.message
      });
      // Handle error.
    });
});

// khi nguoi dung dang ki tai khoan
//https://dmkjo.sse.codesandbox.io/users/singup
router.post("/singup", (req, res) => {
  const { name, email, password, phone, address, avatar, roles } = req.body;
  const user = db
    .get("users")
    .push({
      id: shortid.generate(),
      name,
      email,
      password,
      phone,
      address,
      avatar,
      roles
    })
    .write();
  res.json({ user });
});

//https://dmkjo.sse.codesandbox.io/users/customers
router.get("/customers", (req, res) => {
  res.json(
    db
      .get("customers")
      .filter({})
      .value()
  );
});
// them don hang vao ro hang nguoi dung
router.post("/customers", (req, res) => {
  const {
    uid,
    hoten,
    diachi,
    thanhpho,
    quanHuyen,
    phuongXa,
    dienthoai,
    carts,
    idShop,
    isVerifying,
    amount,
    createdAt,
    avatarUrl,
    email,
    note
  } = req.body;
  console.log(req.body);
  const customers = db
    .get("customers")
    .push({
      id: shortid.generate(),
      uid: `${uid}`,
      name: hoten,
      address: {
        country: "VN",
        state: quanHuyen || phuongXa,
        city: thanhpho,
        street: diachi
      },
      idShop,
      isVerifying,
      email: email,
      note,
      amount,
      phone: dienthoai,
      avatarUrl: avatarUrl,
      createdAt: new Date(),
      carts: carts
    })
    .write();
  res.json({ customers });
});

router.get("/removeCustomers", (req, res) => {
  const { id } = req.query;
  let check = db
    .get("customers")
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

router.post("/customers/buySuccess", (req, res) => {
  const { id } = req.body;
  console.log(id);
  let item = db
    .get("customers")
    .find({ id })
    .value();
  item["isVerifying"] = 1;
  db.get("customers")
    .find({ id })
    .assign(item)
    .write();
  res.send({ status: 200 });
});

module.exports = router;
