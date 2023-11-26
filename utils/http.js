import superagent from 'superagent'
import e7Cfg from "../model/e7Cfg.js";

export default class http {
  static async get(url, param) {
     try {
         const response = await superagent
             .get(url)
             .query(param)
             .set(e7Cfg.getUrlHead())
         return response.text;
     }catch (error){
         logger.error("error",error)
         throw error;
     }
  }

  static async post(url, param) {

      try {
          const response = await superagent
              .post(url)
              .send(param)
              .set(e7Cfg.getUrlHead());
          return response.text;
      } catch (e) {
          ogger.error("error",error)
          throw error;
      }
  }
}
