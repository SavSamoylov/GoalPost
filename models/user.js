module.exports = function(sequelize, DataTypes) {

  let User = sequelize.define('user',
  {
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    location: {
      type: DataTypes.STRING,
      defaultValue: 'No Location Provided'
    },
    photo: {
      type: DataTypes.STRING,
    },
    bio: {
      type: DataTypes.TEXT,
    },
    color: {
      type: DataTypes.STRING,
      defaultValue: '#607d8b'
    },
  },
  {timestamps: false,});

  User.associate = function(models) {
    //User.hasMany(models.goal);
    //User.hasMany(models.task);
  };

  return User;
}
