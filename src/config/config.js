// biến môi trường => environment


// < 20 => yarn add dotenv
// node --env-file=.env  src/config/config.js



export default {
    db_database: process.env.DB_DATABASE,
    db_user: process.env.DB_USER,
    db_pass: process.env.DB_PASS,
    db_host: process.env.DB_HOST,
    db_port: process.env.DB_PORT,
    db_dialect: process.env.DB_DIALECT

}
