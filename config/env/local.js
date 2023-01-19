module.exports = {
  PORT: process.env.PORT || '3000',
  DB: process.env.DB || '',
  IS_DOCUMENT_DB: process.env.IS_DOCUMENT_DB || 'false',
  RDS_FILE: process.env.RDS_FILE || "rds-combined-ca-bundle.pem",
  IS_CONSOLE_LOG: process.env.IS_CONSOLE_LOG || 'true'
}
