


// yarn add sequelize
import { Sequelize } from 'sequelize'

import config from '../config/config.js'

const sequelize = new Sequelize(
    config.db_database,
    config.db_user,
    config.db_pass,
    {
        host: config.db_host,
        dialect: config.db_dialect,
        port: config.db_port
    })

export default sequelize

// yarn add sequelize-auto

// yarn sequelize-auto -h localhost -d db_node41_food -u root -x 1234 -p 3306 --dialect mysql -o src/models -l esm