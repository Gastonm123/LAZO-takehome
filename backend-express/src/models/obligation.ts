import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { sequelize } from "../lib/orm.js";

type ObligationState = "pending" | "in_progress" | "submitted" | "done" ;

class Obligation extends Model<
  InferAttributes<Obligation>,
  InferCreationAttributes<Obligation>
> {
  declare id: CreationOptional<number>;
  declare state: ObligationState;
  declare dueDate: Date;
  declare owner: string;
  declare requiresDocument: CreationOptional<boolean>;
  declare documentUrl: string | null;
  declare companyTaxId: string;
  declare title: string;
  declare type: string;
  declare description: string | null;
  declare version: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Obligation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    owner: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    requiresDocument: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    documentUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    companyTaxId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    version: DataTypes.INTEGER,
  },
  {
    sequelize,
    modelName: "Obligation",
    tableName: "obligations",
    timestamps: true,
    version: true,
  },
);

export default Obligation;
