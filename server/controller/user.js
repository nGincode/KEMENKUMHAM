const jwt = require("jsonwebtoken");
const { hash, verify } = require("node-php-password");
const { user, permissionUser, permission } = require("../models");
const { Op } = require("sequelize");
const Crypto = require("crypto");
const moment = require("moment/moment");

const getId = async (req, res) => {
  const { users_id, users_uuid, email, username } = req.user;
  const { uuid } = req.params;

  const User = await user.findOne({
    where: { uuid: uuid },
    include: [
      {
        model: permission,
        as: "permission",
        attributes: {
          exclude: ["id", "uuid", "createdAt", "updatedAt"],
        },
      },
    ],
  });

  if (!User) {
    return res.json({
      massage: "User tidak ada",
    });
  }

  res.json({
    massage: "Berhasil Mengambil data",
    data: User,
  });
};

const putId = async (req, res) => {
  const { users_id, users_uuid } = req.user;
  const {
    username,
    email,
    namaLengkap,
    noHp,
    alamat,
    tanggalLahir,
    role,
    status,
    NIP,
    image,
    imgDel,
  } = req.body;
  const { uuid } = req.params;

  const Permission = await permission.findOne({ where: { name: role } });

  if (!Permission) {
    return res.status(400).json({
      massage: "Role tidak valid",
    });
  }

  const User = await user.findOne({
    where: { uuid: uuid },
    include: [
      {
        model: permission,
        as: "permission",
        attributes: {
          exclude: ["id", "uuid", "createdAt", "updatedAt"],
        },
      },
    ],
  });

  if (!User) {
    return res.status(400).json({
      massage: "User tidak ada",
    });
  }

  if (User.email !== email) {
    const Email = await user.findOne({
      where: { email: email },
    });

    if (Email) {
      return res.status(400).json({
        massage: "Email telah digunakan",
      });
    }
  }

  if (User.username !== username) {
    const Username = await user.findOne({
      where: { username: username },
    });

    if (Username) {
      return res.status(400).json({
        massage: "Username telah digunakan",
      });
    }
  }
  let type = null;

  let imgData = null;
  if (!imgDel) {
    if (image) {
      type = image.split(";")[0].split("/")[1];
      require("fs").writeFile(
        __dirname + `/../../public/upload/profile/${uuid}.${type}`,
        new Buffer.from(
          image.replace(/^data:image\/\w+;base64,/, ""),
          "base64"
        ),
        (err) => {
          console.log(err);
        }
      );
      imgData = "/upload/profile/" + uuid + "." + type;
    } else {
      imgData = User.img;
    }
  }

  const data = {
    username: username,
    email: email,
    namaLengkap: namaLengkap,
    noHp: noHp,
    alamat: alamat,
    NIP: NIP,
    tanggalLahir: tanggalLahir,
    permission_id: Permission.id,
    status: status,
    img: imgData,
  };

  await User.update(data);

  res.json({
    status: 200,
    massage: "Berhasil diubah",
    data: data,
  });
};

const get = async (req, res) => {
  const { users_id, users_uuid, email, username } = req.user;

  const User = await user.findAll({
    include: [
      {
        model: permission,
        as: "permission",
        attributes: {
          exclude: ["id", "uuid", "createdAt", "updatedAt"],
        },
      },
    ],
    order: [["id", "DESC"]],
  });

  if (!User) {
    return res.json({
      massage: "User not found",
    });
  }
  res.json({
    massage: "Get data successful",
    data: User.map((val) => {
      return {
        uuid: val.uuid,
        img: val.img,
        namaLengkap: val.namaLengkap,
        email: val.email,
        username: val.username,
        tanggalLahir: val.tanggalLahir
          ? moment(val.tanggalLahir).format("DD/MM/YYYY")
          : "-",
        noHp: val.noHp,
        NIP: val.NIP,
        role: val?.permission?.name,
        alamat: val.alamat,
        status: val.status,
      };
    }),
  });
};

const put = async (req, res) => {
  const { users_id, users_uuid } = req.user;
  const {
    username,
    email,
    namaLengkap,
    noHp,
    alamat,
    tanggalLahir,
    files,
    old_password,
    password,
    confirm_password,
    NIP,
  } = req.body;

  const User = await user.findOne({
    where: { id: users_id },
    include: [
      {
        model: permission,
        as: "permission",
        attributes: {
          exclude: ["id", "uuid", "createdAt", "updatedAt"],
        },
      },
    ],
  });

  if (!User) {
    return res.json({
      massage: "User tidak ada",
    });
  }

  if (email) {
    const data = {
      username: username,
      email: email,
      namaLengkap: namaLengkap,
      noHp: noHp,
      alamat: alamat,
      tanggalLahir: tanggalLahir,
      permission: User.permission,
      img: User.img,
      NIP: NIP,
    };

    await User.update(data);

    const token = jwt.sign(
      {
        data: {
          users_uuid: users_uuid,
          users_id: users_id,
          email: email,
          username: username,
          permission: User.permission,
        },
      },
      "fembinurilham"
    );

    res.json({
      status: 200,
      massage: "Berhasil diubah",
      data: data,
      token,
    });
  } else if (old_password && password && confirm_password) {
    if (
      old_password.length < 8 ||
      password.length < 8 ||
      confirm_password.length < 8
    ) {
      return res.status(400).json({
        massage: "Password min 8 karakter",
      });
    }

    if (password !== confirm_password) {
      return res.status(400).json({
        massage: "Password tidak sama",
      });
    }

    const isPasswordCorrect = verify(old_password, User.password);
    if (!isPasswordCorrect) {
      return res.status(404).json({
        massage: "Password lama salah",
      });
    }

    const data = {
      password: hash(password),
    };

    await User.update(data);

    res.json({
      status: 200,
      massage: "Berhasil diubah",
    });
  } else if (files) {
    const type = files.split(";")[0].split("/")[1];
    require("fs").writeFile(
      __dirname + `/../../public/upload/profile/${users_uuid}.${type}`,
      new Buffer.from(files.replace(/^data:image\/\w+;base64,/, ""), "base64"),
      (err) => {
        console.log(err);
      }
    );

    const data = {
      username: User.username,
      email: User.email,
      namaLengkap: User.namaLengkap,
      noHp: User.noHp,
      alamat: User.alamat,
      tanggalLahir: User.tanggalLahir,
      permission: User.permission,
      img: "/upload/profile/" + users_uuid + "." + type,
    };
    await User.update({
      img: "/upload/profile/" + users_uuid + "." + type,
    });

    return res.json({
      massage: "Avatar berhasil diganti",
      data: data,
    });
  } else {
    return res.json({
      massage: "User tidak ada",
    });
  }
};

const del = async (req, res) => {
  const { users_id, users_uuid } = req.user;
  const { uuid } = req.params;

  const User = await user.findOne({
    where: { uuid: uuid },
  });

  if (!User) {
    return res.json({
      massage: "User tidak ada",
    });
  }

  require("fs").unlink(__dirname + `/../../public${User.img}`, (err) => {
    console.log(err);
  });

  await User.destroy();

  res.json({
    massage: "Berhasil dihapus",
    data: User,
  });
};

const post = async (req, res) => {
  const {
    NIP,
    username,
    email,
    fullName,
    phone,
    address,
    dateOfBirth,
    role,
    password,
    confirm_password,
    img,
  } = req.body;

  const User = await user.findOne({
    where: { [Op.or]: [{ username: username }, { email: email }] },
    include: [
      {
        model: permission,
        as: "permission",
        attributes: {
          exclude: ["id", "uuid", "createdAt", "updatedAt"],
        },
      },
    ],
  });

  const Permission = await permission.findOne({ where: { name: role } });

  if (User) {
    return res.status(400).json({
      massage: "Email atau Username telah digunakan",
    });
  }

  if (!role) {
    return res.status(400).json({
      massage: "Permission harus ada",
    });
  }

  if (!Permission) {
    return res.status(400).json({
      massage: "Permission tidak valid",
    });
  }

  if (password.length < 8 || confirm_password.length < 8) {
    return res.status(400).json({
      massage: "Password min 8 karakter",
    });
  }

  if (password !== confirm_password) {
    return res.status(400).json({
      massage: "Password tidak sama",
    });
  }

  const uuid = Crypto.randomUUID();
  let type = null;
  if (img) {
    type = img.split(";")[0].split("/")[1];
    require("fs").writeFile(
      __dirname + `/../../public/upload/profile/${uuid}.${type}`,
      new Buffer.from(img.replace(/^data:image\/\w+;base64,/, ""), "base64"),
      (err) => {
        console.log(err);
      }
    );
  }

  const data = {
    uuid: uuid,
    username: username,
    NIP: NIP,
    email: email,
    namaLengkap: fullName,
    noHp: phone,
    alamat: address,
    tanggalLahir: dateOfBirth,
    password: hash(password),
    status: "active",
    permission_id: Permission.id,
    img: img ? "/upload/profile/" + uuid + "." + type : null,
  };
  await user.create(data);

  res.json({
    status: 200,
    massage: "Berhasil ditambhakan",
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
