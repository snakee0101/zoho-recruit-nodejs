const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const FormSubmission = sequelize.define('FormSubmission', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    // Step 1 fields
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    position: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    linkedin: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    // Step 2 fields
    education_level: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    years_experience: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    skills: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: true,
    },
    previous_employer: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    current_job_title: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    notice_period: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    expected_salary: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    availability_interview: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    preferred_location: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    cover_letter: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    source_application: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
  }, {
    tableName: 'form_submissions',
    timestamps: false, // set true if you use createdAt/updatedAt
    underscored: true, // matches snake_case DB column names
  })

  return FormSubmission
}