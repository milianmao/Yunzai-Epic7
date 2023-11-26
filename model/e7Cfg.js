import YAML from 'yaml'
import fs from 'node:fs'
import lodash from 'lodash'
class e7Cfg {
  constructor() {
    this.configPath = './plugins/epic7/config/'
    this.httpHead = ''
  }

  getYAML(app,name) {
    let file =this.getFilePath(app,name)
    let  parseData
    try {
      parseData = YAML.parse(
        fs.readFileSync(file,'utf8')
      );
    }catch (error){
      // 错误逻辑
      return false
    }
    return parseData
  }

  /**
   * 获取文件路径
   *
   * @param app 配置类型
   * @param name 文件名
   * @returns {string}
   */
  getFilePath(app, name) {
    return `${this.configPath}${app}/${name}.yaml`
  }

  /**
   * 获取http请求头
   */
  getUrlHead(){
    if (this.httpHead.length === 0){
      this.httpHead = this.getYAML('base','api').header
      return this.httpHead
    }
    return this.httpHead
  }
}

export default new e7Cfg()
