const express = require("express");
const router = express.Router();
const db = require("./db");

//https://dmkjo.sse.codesandbox.io/customers/0
router.get("/:uid", (req, res) => {
  const uid = req.params.uid;
  res.json(
    db
      .get("customers")
      .filter({ idShop: uid })
      .value()
  );
});

// xoa don hang
router.post("/delete", (req, res) => {
  const payload = req.body;
  for (let i = 0; i < payload.length; i++) {
    var check = db
      .get("customers")
      .remove({ id: payload[i] })
      .write();
  }
  res.send({ status: 200 });
});

// xac nhan don hang
// isVerifying
//case 0: return 'Chờ Xác Nhận';
// case 1: return 'Đã Thanh Toán';
// case 2: return 'Đã Xác Nhận';
// case 3: return 'Hủy Đơn';

router.post("/verify", (req, res) => {
  const payload = req.body;
  for (let i = 0; i < payload.length; i++) {
    let item = db
      .get("customers")
      .find({ id: payload[i] })
      .value();
    item["isVerifying"] = 2;
    db.get("customers")
      .find({ id: payload[i] })
      .assign(item)
      .write();
  }
  res.send({ status: 200 });
});
// xac nhan don hang da thanh toan
router.post("/buySuccess", (req, res) => {
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

// huy don hang.
router.post("/cancelOrder", (req, res) => {
  const payload = req.body;
  for (let i = 0; i < payload.length; i++) {
    let item = db
      .get("customers")
      .find({ id: payload[i] })
      .value();
    if (item["isVerifying"] === 1) {
      res.json({
        status: 200,
        message: "Không thể hủy đơn hàng đã thanh toán!"
      });
    } else {
      item["isVerifying"] = 3;
      db.get("customers")
        .find({ id: payload[i] })
        .assign(item)
        .write();
      res.json({ status: 200, message: "Đã Hủy đơn hàng" });
    }
  }
});
// lay don hang cua toi
router.get("/orderOfMe/:uid", (req, res) => {
  const uid = req.params.uid;
  let item = db
    .get("customers")
    .filter({ uid: uid })
    .sortBy("views")
    .take(5)
    .value();
  console.log(item);
  res.json({ status: 200, item });
});

module.exports = router;
