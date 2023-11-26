import e7Cfg from "../e7Cfg.js";
import http from '../../utils/http.js'
class api{
  constructor() {
    const apiData = e7Cfg.getYAML('base','api')
    this.gameApi = apiData.api.gameApi
    this.staticApi = apiData.api.staticApi
  }
  async getHeroAnalysis(param){
    const urlStr = this.gameApi+"gameApi/getHeroAnalysis"
    return await http.post(urlStr,param)
  }

  async getEpicHero(param){
    const urlStr = this.staticApi+"gameRecord/epic7/epic7_hero.json"
    return await http.get(urlStr,param);
  }
}

export default new api()
