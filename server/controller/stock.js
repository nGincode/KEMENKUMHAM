const jwt = require("jsonwebtoken");
const { hash, verify } = require("node-php-password");
const { User, stock, company } = require("../models");
const { Op } = require("sequelize");
const Crypto = require("crypto");
const numeral = require("numeral");

const getId = async (req, res) => {
  const { users_id, users_uuid, email, username } = req.user;
  const { uuid } = req.params;

  const Npwp = await stock.findOne({
    where: { uuid: uuid },
    attributes: ["uuid", "stock", "name", "phone", "address"],
  });

  if (!Npwp) {
    return res.json({
      message: "STOCK not found",
    });
  }

  res.json({
    status: 200,
    massage: "Get data successful",
    data: Npwp,
  });
};

const putId = async (req, res) => {
  const { uuid } = req.params;
  const { users_id, users_uuid } = req.user;
  const { name, priceBuy, priceSell, image, imgDel } = req.body;

  const Stock = await stock.findOne({
    where: { uuid: uuid },
  });

  if (!Stock) {
    return res.status(400).json({
      message: "STOCK not found",
    });
  }

  if (name !== Stock.name) {
    const cekSTOCK = await stock.findOne({ where: { name: name } });
    if (cekSTOCK) {
      return res.status(400).json({
        massage: "Name stock has been used",
      });
    }
  }

  let type = null;

  let imgData = null;
  if (!imgDel) {
    if (image) {
      type = image.split(";")[0].split("/")[1];
      require("fs").writeFile(
        __dirname + `/../../public/upload/stock/${uuid}.${type}`,
        new Buffer.from(
          image.replace(/^data:image\/\w+;base64,/, ""),
          "base64"
        ),
        (err) => {
          console.log(err);
        }
      );
      imgData = "/upload/stock/" + uuid + "." + type;
    } else {
      imgData = Stock.img;
    }
  }

  const data = {
    stock: req.body.stock,
    name: name,
    price_buy: priceBuy,
    price_sell: priceSell,
    img: imgData,
  };

  await Stock.update(data);

  res.json({
    status: 200,
    massage: "Update data successful",
    data: data,
  });
};

const get = async (req, res) => {
  const { users_id, users_uuid, email, username, permission } = req.user;

  const stockDb = await stock.findAll({
    order: [["id", "DESC"]],
  });
  const data = stockDb.map((val) => {
    return {
      img: val.img,
      uuid: val.uuid,
      name: val.name,
      stock: val.stock,
      priceBuy: numeral(val.price_buy).format("0,0"),
      priceSell: numeral(val.price_sell).format("0,0"),
    };
  });

  res.json({
    status: 200,
    massage: "Get data successful",
    data: data,
  });
};

const put = async (req, res) => {
  const { users_id, users_uuid } = req.user;
  const {
    name,
    phone,
    jalan,
    block,
    no,
    rt,
    rw,
    kec,
    kel,
    prov,
    kabkot,
    kodepos,
    email,
    company_id,
  } = req.body;

  const Npwp = await stock.findOne({
    where: { uuid: uuid },
  });

  const Company = await company.findOne({
    where: {
      uuid: company_id,
    },
  });

  if (!Company) {
    return res.status(400).json({
      massage: "Company not found",
    });
  }

  if (!Npwp) {
    return res.json({
      message: "STOCK not found",
    });
  }

  const data = {
    stock: req.body.stock,
    name: name,
    phone: phone,
    email: email,
    address: {
      jalan: jalan,
      block: block,
      no: no,
      rt: rt,
      rw: rw,
      kec: kec,
      kel: kel,
      prov: prov,
      kabkot: kabkot,
      kodepos: kodepos,
    },
    company_id: Company.id,
  };

  await stock.update(data);

  res.json({
    status: 200,
    massage: "Update data successful",
    data: data,
  });
};

const del = async (req, res) => {
  const { users_id, users_uuid } = req.user;
  const { uuid } = req.params;

  const Stock = await stock.findOne({
    where: { uuid: uuid },
  });

  if (!Stock) {
    return res.status(200).json({
      message: "Stock not found",
    });
  }

  await Stock.destroy();

  res.json({
    massage: "Delete successful",
    data: Stock,
  });
};

const post = async (req, res) => {
  const { name, stock_val, price_buy, price_sell, img } = req.body;
  const { users_id, users_uuid } = req.user;

  const cekSTOCK = await stock.findOne({ where: { name: name } });

  if (cekSTOCK) {
    return res.status(400).json({
      massage: "Name stock has been used",
    });
  }
  const uuid = Crypto.randomUUID();
  let type = null;
  if (img) {
    type = img.split(";")[0].split("/")[1];
    require("fs").writeFile(
      __dirname + `/../../public/upload/stock/${uuid}.${type}`,
      new Buffer.from(img.replace(/^data:image\/\w+;base64,/, ""), "base64"),
      (err) => {
        console.log(err);
      }
    );
  }

  const data = {
    uuid: uuid,
    stock: stock_val,
    user_id: users_id,
    name: name,
    price_buy: price_buy,
    price_sell: price_sell,
    img: img ? "/upload/stock/" + uuid + "." + type : null,
  };

  await stock.create(data);

  res.json({
    status: 200,
    massage: "Create successful",
    data: data,
  });
};

module.exports = {
  get,
  put,
  post,
  del,
  getId,
  putId,
};
