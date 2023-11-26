import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
  class Hero extends Model {}
  Hero.init({
    id: {
      type: DataTypes.STRING(20),
      allowNull: false,
      primaryKey: true
    },
    code: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "英雄编码"
    },
    grade: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      comment: "星级"
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: "英雄名称"
    },
    job_cd: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "职业"
    },
    attribute_cd: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "属性"
    },
    country: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "国家简称"
    }
  }, {
    sequelize,
    modelName: 'Hero', // 模型名
    tableName: 'hero',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });

  return Hero;
};
