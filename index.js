module.exports = {
  //for dogwater
  Resolve:require("./Engines/index"),
  PluginsManager:require("./Plugins/index"),
  //for the query stuff
  QueryResolver: require("./Engines/QueryResolver"),
  QLparser:require('./Engines/Parser'),
  Pretifier:require('./Engines/Pretifier')
}
