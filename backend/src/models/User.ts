import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export type UserRole = 'user' | 'admin';

interface UserAttributes {
  id: string;
  email: string;
  password_hash: string;
  refresh_token: string | null;
  reset_token: string | null;
  reset_token_expires_at: Date | null;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

type UserCreationAttributes = Optional<
  UserAttributes,
  'id' | 'refresh_token' | 'reset_token' | 'reset_token_expires_at'
>;

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id: string;
  declare email: string;
  declare password_hash: string;
  declare refresh_token: string | null;
  declare reset_token: string | null;
  declare reset_token_expires_at: Date | null;
  declare role: UserRole;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(320),
      allowNull: false,
      unique: true
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    refresh_token: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    reset_token: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    reset_token_expires_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      allowNull: false,
      defaultValue: 'user'
    }
  },
  {
    sequelize,
    tableName: 'users',
    modelName: 'User',
    underscored: true
  }
);

export default User;
