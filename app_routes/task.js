const express = require("express");
const route = express.Router();

route.get("list", list());

route.get("id", list());

route.post("insert", list());

route.put("id", list());

route.delete("id", list());
