module.exports = function(sequelize, DataTypes) {

  let Goal = sequelize.define('goal',
  {
    goal: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    goal_description: {
      type: DataTypes.TEXT,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    color: {
      type: DataTypes.STRING,
      defaultValue: 'teal'
    }
  },
  {timestamps: true,});

  Goal.associate = function(models) {
    Goal.belongsTo(models.user, {foreignKey: 'userId', foreignKeyConstraint: true, onDelete: 'cascade', hooks: true});
  //  Goal.hasMany(models.task);
  };

  return Goal;
}
