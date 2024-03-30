import { DataTypes } from 'sequelize'
import { sequelize } from './db.js'

const User = sequelize.define(
  'User',
  {
    // Атрибуты модели определяются здесь
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true, // является первичным ключом
      unique: true,
      autoIncrement: true // 1+1=2+1=3+1=4
    },
    chatId: {
      type: DataTypes.STRING,
      unique: true
    },
    right: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    wrong: {
      type: DataTypes.INTEGER,
      defaultValue: 0
      // allowNull по умолчанию имеет значение true
    }
  },
  {
    // Другие варианты моделей здесь
  }
)

export default User

// `sequelize.define` также возвращает модель
// console.log(User === sequelize.models.User) // true
