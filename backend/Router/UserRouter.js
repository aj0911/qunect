const express = require("express");
const {
  Register,
  Login,
  getAllUsers,
  searchUsers,
} = require("../Controllers/UserController");

const router = express.Router();

router.post("/register", Register);
router.post("/login", Login);
router.get("/users", getAllUsers);
router.get("/users/search", searchUsers);

module.exports = router;
