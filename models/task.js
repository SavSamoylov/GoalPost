module.exports = function(sequelize, DataTypes) {

  let Task = sequelize.define('task',
  {
    description: {
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
  },
  {timestamps: false,});

  Task.associate = function(models) {
    Task.belongsTo(models.goal, {foreignKey: 'goalId', foreignKeyConstraint: true, onDelete: 'cascade', hooks: true});
    Task.belongsTo(models.user, {foreignKey: 'userId', foreignKeyConstraint: true, onDelete: 'cascade', hooks: true});
  };

  return Task;
}
