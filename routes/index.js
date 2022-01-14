const express = require("express");
const router = express.Router();

const gameStatus = require("../statTracker");

/* GET home page */
// router.get("/", function(req, res) {
//   res.sendFile("realsplash.html", { root: "./public" });
// });


/* Pressing the 'PLAY' button, returns this page */
// router.get("/play", function(req, res) {
//   res.sendFile("game.html", { root: "./public" });
// });

/* GET game page */
router.get("/play", function(req, res) {
  res.render("game.ejs", {});
});

// GET home page
router.get("/", function(req, res) {
  res.render("realsplash.ejs", {
    gamesInitialized: gameStatus.gamesInitialized,
    gamesCompleted: gameStatus.gamesCompleted,
    gamesAborted: gameStatus.gamesAborted,
    onlinePlayers: gameStatus.onlinePlayers,
    whiteWins: gameStatus.whiteWins,
    blackWins: gameStatus.blackWins
  });
});


module.exports = router;