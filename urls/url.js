const express = require('express');
const url = express.Router();
const views = require("../controllers/views");

url.get("/", views.index);
url.get("/faq", views.faq);
url.get("/socials", views.socials);
url.get("/btcbnb", views.btcbnb);
url.get("/history", views.history);
url.get("/admin", views.admin);



module.exports = url;