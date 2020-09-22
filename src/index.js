const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const db = require("./db.js");
const shortid = require("shortid");
const routerProducts = require("./Products.Router");
const routerUsers = require("./Users.Router");
const routerCustomer = require("./Customer.Router");
const routerHomeScratch = require("./Scratch/Home.Router");
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.listen(8080, () => {
  console.log("start server port 8080");
});

// API of products
app.use("/products", routerProducts);
//API of user
app.use("/users", routerUsers);
// API of customer
app.use("/customers", routerCustomer);

//API SCRATCH.
//api of home
app.use("/api", routerHomeScratch);

// npm install node-rsa
const NodeRSA = require("node-rsa");
const axios = require("axios");
// using your public key get from https://business.momo.vn/
//const fs = require('fs');
//const pubKey = fs.readFileSync('rsa.pub');
const pubKey =
  "-----BEGIN PUBLIC KEY-----MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAo1R/k29agqx8NygCydYJwU3J6g1aiwiwPk3H3ZWouFldUpEwa5EkdGjoUAa2sHpsAJFHxJO+cJSVesx3brZskTPoyyYOZBDPXHLNIIbJj0A0sHjLWUk/GfrJS+3PLA12cci0L0nF+KYgDla34Y93k1cz999JZr6NbneQEFAPObGFOi2R0L7+MS4e0/gL4Ujig/vzv7C/ghbUPEqEANZeuCt5bBgISD8O012cGrzPNTdetmUsS54g/zlVC+G7INPnlSnUOL1g7e0B//0nv8JIu6UNwAEPySFVZRM+V0QgPR8tO2SFw1KZuzSBrm3lLI5rG/m+AQmX1g3Zeos/mX7bh7gkPZHqhIsgtV0oTUwp9FSjB3piTj3K96IxOBd0BylLsWa34qzWulKt5ZcjZGxy2FrlYvgWBbOEqcG1Ii7pC5JdGOSsfrUAodPZSH5DtcocBnWTonzMDVkir6w+Bo/6OuLMdgSxxx0qXTMZNqZ/D4VLwOtJ4V8RffxstGe9kcOJOLK2erpyTIPJNUjYrw/ZVvKIUrGbN6fcC+pKJ0zxFep0E1sv6ZaKyG0WH8H1jlRiBlVDeO9eXHMoaOpQV7Ogk/e9MXHN3tsFp+qXrWCgwMGeT5G1xXWuE+YlJOwkds+hJO3v70pdcw+l2Z43pni/wzM2dLHLaE3iVYsiX5gHV4MCAwEAAQ==-----END PUBLIC KEY-----";
const key = new NodeRSA(pubKey, { encryptionScheme: "pkcs1" });
// xu ly thanh toan momo
app.post("/paymentMOMO", (req, res) => {
  const response = req.body;
  const jsonData = {
    amount: response.amount,
    partnerRefId: response.partnerRefId,
    partnerCode: response.partnerCode,
    description: "Thanh toan momo"
  };
  const encrypted = key.encrypt(JSON.stringify(jsonData), "base64");
  axios
    .post("https://test-payment.momo.vn/pay/app", {
      partnerCode: response.partnerCode,
      partnerRefId: response.partnerRefId,
      customerNumber: response.customerNumber,
      appData: response.appData,
      hash: encrypted,
      version: 2.0,
      payType: 3
    })
    .then((resMM) => {
      console.log("https://test-payment.momo.vn/pay/app ------", resMM.data);
      // res.json({ resMOMO: resMM.data });
      // xac nhan giao dich.

      res.json({
        response: resMM.data
      });
    })
    .catch((err) => {
      console.log("err Post Server to momo : ", err);
    });
});
