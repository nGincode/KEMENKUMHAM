const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const verifToken = require("../middleware/jwt");

const user = require("./user");
const kunjungan = require("./kunjungan");
const titipan = require("./titipan");
const tahanan = require("./tahanan");
const auth = require("./auth");
const permission = require("./permission");

router.get("/", async (req, res) => {
  // res.send("API Starting!");
  const { user } = require("../models");
  const User = await user.findAll({});
  res.send(User ? "API Starting!" : "Database not Connect");
});

router.get("/token", (req, res) => {
  const data = { id: 1 };
  res.send(jwt.sign({ data }, "fembinurilham"));
});

router.use("/user", verifToken, user);
router.use("/permission", verifToken, permission);
router.use("/tahanan", verifToken, tahanan);
router.use("/kunjungan", verifToken, kunjungan);
router.use("/titipan", verifToken, titipan);
router.use("/", auth);

router.post("/suratKunjungan", async (req, res) => {
  const { uuid } = req.body;
  const { tahanan, kunjungan } = require("../models");
  let Kunjungan = await kunjungan.findOne({
    where: {
      uuid: uuid,
    },
    order: [["id", "DESC"]],
    include: [
      {
        model: tahanan,
        as: "tahanan",
        attributes: {
          exclude: ["uuid", "createdAt", "updatedAt"],
        },
      },
    ],
  });

  if (!Kunjungan.antrian) {
    const antrian = await kunjungan.findAll({
      where: {
        waktuKunjungan: {
          [Op.between]: [
            moment(Kunjungan.waktuKunjungan).format("YYYY-MM-DD") +
              "T00:00:48.000Z",
            moment(Kunjungan.waktuKunjungan).format("YYYY-MM-DD") +
              "T23:59:59.000Z",
          ],
        },
      },
    });

    await Kunjungan.update({ antrian: antrian.length + 1 });
    Kunjungan.antrian = antrian.length + 1;
  }

  return res.json({
    status: 200,
    massage: "Get data successful",
    data: Kunjungan,
  });
});

module.exports = router;
