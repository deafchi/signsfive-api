export default (sequelize, DataTypes) => {
  const gloss = sequelize.define('gloss', {
    name: {
      type: DataTypes.STRING,
      validate: {
        is: /^[a-z]+( [a-z]+)*$/i,
        notNull: true,
        len: [ 3, 50 ]
      }
    },
    description: {
      type: DataTypes.TEXT,
      notNull: true
    }
  })

  gloss.associate = models => {
    gloss.belongsToMany(models.gloss, {
      as: 'AlternativeGlosses',
      through: 'gloss_gloss',
      foreignKey: 'glossId',
      otherKey: 'alt_glossId'
    })
    gloss.belongsToMany(models.source, {
      as: 'Sources',
      through: 'gloss_source',
      foreignKey: 'glossId',
      otherKey: 'sourceId'
    })
    gloss.belongsToMany(models.sign, {
      as: 'Signs',
      through: 'gloss_sign',
      foreignKey: 'glossId',
      otherKey: 'signId'
    })
  }

  return gloss
}
