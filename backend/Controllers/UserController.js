const { Op } = require("sequelize");
const protect = require("../Middlewares/CatchAsyncErrors");
const User = require("../Models/UserModel");
const ErrorHandler = require("../Utils/ErrorHandler");
const redis = require("../Config/RedisDB");

exports.Register = protect(async (req, res, next) => {
  const { name, email, password } = req.body;
  const findUser = await User.findOne({ where: { email } });
  if (findUser) {
    return next(new ErrorHandler("User Already Exists", 401));
  }
  const user = await User.create({ name, email, password });
  const val = await redis.get('users');
  if (val) {
    await redis.setex('users', 3600,JSON.stringify(await User.findAll({
      attributes: ["name", "email", "id", "profile"],
    })))
  }
  res.status(200).json({
    success: true,
    message: "Registered Successfully.",
    data: {
      name: user.name,
      email: user.email,
      id: user.id,
      profile: user.profile,
    },
  });
});

exports.Login = protect(async (req, res, next) => {
  const { email, password } = req.body;
  const findUser = await User.findOne({ where: { email } });
  if (!findUser) {
    return next(new ErrorHandler("User Not Exist", 401));
  }
  if (!(await findUser.validatePassword(password))) {
    return next(new ErrorHandler("Incorrect Password.", 401));
  }
  res.status(200).json({
    success: true,
    message: "Login Successfully.",
    data: {
      name: findUser.name,
      email: findUser.email,
      id: findUser.id,
      profile: findUser.profile,
    },
  });
});

exports.getAllUsers = protect(async (_, res) => {
  let users = await redis.get('users');
  if (!users) {
    users = await User.findAll({
      attributes: ["name", "email", "id", "profile"],
    });
    await redis.setex('users', 3600, JSON.stringify(users));
  }
  else {
    users = JSON.parse(users);
  }
  res.status(200).json({
    success: true,
    message: "All Users Fetched Successfully.",
    data: users,
  });
});

exports.searchUsers = protect(async (req, res, next) => {
  const { query } = req.query;
  if (!query) {
    return next(new ErrorHandler('Search query is required.', 400));
  }

  const users = await User.findAll({
    where: {
      [Op.or]: [
        { name: { [Op.like]: `%${query}%` } },
        { email: { [Op.like]: `%${query}%` } }
      ]
    },
    attributes: ["name", "email", "id", "profile"],
  });

  res.status(200).json({
    success: true,
    message: 'Users recieved successfully.',
    data: users
  })
})
