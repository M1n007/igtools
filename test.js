var cmd = require("node-cmd");

cmd.get("start", function(err, data, stderr) {
  console.log("the current working dir is : ", data);
});

cmd.get("ls", function(err, data, stderr) {
  console.log("the current dir contains these files :\n\n", data);
});
