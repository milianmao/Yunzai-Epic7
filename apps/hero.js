import plugin from '../../../lib/plugins/plugin.js'
import api from '../model/api/api.js'
import db from "../model/db/db.js";
import snowflake from "../utils/snowflake.js";
export class hero extends plugin{
  constructor() {
    // 出装推荐、更新英雄信息
      super({
          name: 'hero',
          dsc: '英雄',
          event: 'message',
          priority: 10000,
          rule: [
              {
                  reg: '^.*出装推荐$',
                  fnc: 'hero'
              },
            {
              reg: '^#更新英雄信息$',
              fnc: 'heroInfoUpdate'
            }
          ]
      });
  }

  // accept(){
  //     if (!this.e.msg) return
  //     // 是否命中命令
  //     if (!/\u51fa\u88c5\u63a8\u8350/.test(this.e.msg)) return;
  //
  //     let roleName = this.e.msg.replace(/\u51fa\u88c5\u63a8\u8350/, '').trim();
  //
  //     // 查询英雄信息
  //
  //     // 组装param
  //
  //
  // }

  async hero(){
      if (!this.e.msg) return
      // 是否命中命令
      if (!(/^.*出装推荐$/.test(this.e.msg))) return;

      let roleName = this.e.msg.replace(/出装推荐$/, '').trim();

      // 查询英雄信息
      const role = await db.models.hero.findOne({
          where:{
              name: roleName
          }
      });
      if (role===null){
          await this.e.reply("查询失败，请检查英雄名称是否正确");
      }
      // 组装param
      const param = {
          lang: role.country,
          hero_code: role.code,
          season_code: "pvp_rta_ss12",
          grade_code: "master"
      }
      const res = await api.getHeroAnalysis(param);

      const data = JSON.parse(res);


      // 处理数据
      let barData = {
        accData: this.calculate(data.result_body.abillity.acc),
        attData: this.calculate(data.result_body.abillity.att),
        criData: this.calculate(data.result_body.abillity.cri),
        criDmgData: this.calculate(data.result_body.abillity.cri_dmg),
        defData: this.calculate(data.result_body.abillity.def),
        maxHpData: this.calculate(data.result_body.abillity.max_hp),
        resData: this.calculate(data.result_body.abillity.res),
        speedData: this.calculate(data.result_body.abillity.speed)
      }

    this.renderImg('epic7', `html/hero/hero.html`, barData)
  }

  async heroInfoUpdate(){
    // 查询
    const res = await api.getEpicHero({_: Date.now()})
    const data = JSON.parse(res);
    const deleteResult = await this.deleteAll();
    const insertResult = await this.saveData(data);
    if (!(deleteResult&&insertResult)){
        await this.e.reply("更新失败")
    }
    await this.e.reply("更新成功")
  }

    async saveData(data){
      const insert = [];
      Object.entries(data).forEach(([key, value]) =>{
          const country = key;
          value.forEach((vo => {
              const nextId = snowflake.nextId();
              const entry = {
                  id: nextId,
                  code: vo.code,
                  grade: vo.grade,
                  name: vo.name,
                  job_cd: vo.job_cd,
                  attribute_cd: vo.attribute_cd,
                  country: country
              }
              insert.push(entry);
          }))
      });
        try {
            await db.models.hero.bulkCreate(insert);
        } catch (e) {
            logger.error("保存英雄信息失败：",e);
            return false;
        }
     return true;
  }

    async deleteAll() {
        try {
            await db.models.hero.destroy({
                where: {}
            })
        } catch (e) {
            logger.error("删除英雄信息失败：",e);
            return false
        }
        return true
    }

  calculate(data){
    data = data.split(',');
    let sum = data.reduce((vo1,vo2) => {
      return Number(vo1) + Number(vo2);
    });

    data = data.map((vo) =>{
      const e = Math.round(Number(vo)/sum*100)
      let t;
      e >= 0 && e <= 19 ? t = 20 : e >= 20 && e <= 39 ? t = 40 : e >= 40 && e <= 59 ? t = 60 : e >= 60 && e <= 79 ? t = 80 : e >= 80 && (t = 100)
      return t;
    })
    return data;

  }
}
