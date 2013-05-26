/** Initializes application routes.
*/
module.exports = function initialize(app) {

  var User = require("./lib/User");

  app.get("/", function (req, res, next) {
    res.sendfile(__dirname + "/views/index.html")
  });

  app.post("/user", function (req, res, next) {
    var user = new User(req.body.firstName, req.body.lastName,
      parseInt(req.body.age, 10));

    user.fetch(function (err) {
      if (err) {
        res.send(500, err.message);
      }
      res.json(user);
    });
  });
};
