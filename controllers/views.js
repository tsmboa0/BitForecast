const {ethers} = require("ethers");

exports.index = async (req, res) => {
    res.render("index", {});
}

exports.faq = async (req, res) => {
    res.render("bbbets-faq", {});
}

exports.socials = async (req, res) => {
    res.render("socials", {});
}

exports.btcbnb = async (req, res) => {
    res.render("btc-bnb", {});
}
exports.btcsvm = async (req, res) => {
    res.render("btc-svm", {});
}

exports.history = async (req, res) => {
    res.render("bbbets_history", {});
}
exports.historysvm = async (req, res) => {
    res.render("history-svm", {});
}

exports.admin = async (req, res) => {
    res.render("admin", {});
}
exports.adminsvm = async (req, res) => {
    res.render("admin-svm", {});
}

exports.referrals = async (req, res) => {
    res.render("referrals", {});
}