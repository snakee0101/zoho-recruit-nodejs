const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ApiToken = sequelize.define('ApiToken', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    token_type: {
      type: DataTypes.STRING(50), // e.g., 'authorization_code', 'access_token', 'refresh_token'
      allowNull: true,
    },
    token: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    api_domain: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    expires_in: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
  }, {
    tableName: 'api_tokens',
    timestamps: false, // true if Sequelize should manage createdAt/updatedAt
    underscored: true, // snake_case column names in DB
  });

  return ApiToken;
};
