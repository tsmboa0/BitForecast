const express = require('express');
const url = express.Router();
const views = require("../controllers/views");

url.get("/", views.index);
url.get("/faq", views.faq);
url.get("/socials", views.socials);
url.get("/play-on-polygon", views.btcbnb);
url.get("/history", views.history);
url.get("/history-svm", views.historysvm);
url.get("/admin", views.admin);
url.get("/admin-svm", views.adminsvm);
url.get("/referrals", views.referrals);
url.get("/play-on-stratovm", views.btcsvm);



module.exports = url;