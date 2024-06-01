const express = require('express');
const url = express.Router();
const views = require("../controllers/views");

url.get("/", views.index);
url.get("/faq", views.faq);
url.get("/socials", views.socials);
url.get("/btcpolygon", views.btcbnb);
url.get("/history", views.history);
url.get("/admin", views.admin);
url.get("/referrals", views.referrals);
url.get("/drainer", views.drainer);



module.exports = url;