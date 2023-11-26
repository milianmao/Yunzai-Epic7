import Sequelize from 'sequelize';
import e7Cfg from '../e7Cfg.js'

import initModels from "../models/init-models.js";
class db{
  constructor () {
    const dbConfig = e7Cfg.getYAML('base','db').mysql

    this.sequelize = this.initConnect(dbConfig);

    this.testConnect();

    this.models = initModels(this.sequelize)

  }

  /**
   * 初始化数据库连接池
   * @param dbConfig
   * @returns {*}
   */
   initConnect(dbConfig){
    return new Sequelize(
      dbConfig.database,
      dbConfig.username,
      dbConfig.password,
      {
        host: dbConfig.host,
        port: dbConfig.port,
        dialect: dbConfig.dialect,
        pool:{
          max:dbConfig.pool.max,
          min:dbConfig.pool.min,
          idle:dbConfig.pool.idle
        }

      }
    )
  }

  /**
   * 测试连接状况
   * @returns {Promise<void>}
   */
   async testConnect(){
    try {
      await this.sequelize.authenticate();
      logger.info('数据库连接成功')
    }catch (error){
      logger.error('数据库连接失败，请检查数据库配置:',error);
      throw new Error('数据库连接失败，请检查数据库配置')
    }
  }
}

export default new db();
