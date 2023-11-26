import { DataTypes } from 'sequelize';
import initHeroModel from './hero.js';

function initModels(sequelize) {
  const hero = initHeroModel(sequelize, DataTypes);

  return {
    hero,
  };
}

export default initModels;
