module.exports = {
  PORT: process.env.PORT || "3005",
  OPEN_AI_API_KEY:
    process.env.OPEN_AI_API_KEY ||
    "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",
  DB:
    process.env.DB ||
    "mongodb://quehoc:messypet59@ac-ujutgy0-shard-00-00.dnspwpr.mongodb.net:27017,ac-ujutgy0-shard-00-01.dnspwpr.mongodb.net:27017,ac-ujutgy0-shard-00-02.dnspwpr.mongodb.net:27017/test?replicaSet=atlas-kt19cl-shard-0&ssl=true&authSource=admin",
  IS_CONSOLE_LOG: process.env.IS_CONSOLE_LOG || "true",
};
