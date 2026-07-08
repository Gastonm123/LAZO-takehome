import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { sequelize } from "../lib/orm.js";
import Obligation from "./obligation.js";

class ObligationAudit extends Model<
  InferAttributes<ObligationAudit>,
  InferCreationAttributes<ObligationAudit>
> {
  declare field: string;
  declare from: string;
  declare to: string;
  declare obligationId: number;
  declare date: Date;
}

ObligationAudit.init(
  {
    field: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    from: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    to: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: DataTypes.DATE,
    obligationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Obligation,
        key: "id",
      },
      onUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    },
  },
  {
    sequelize,
    modelName: "ObligationAudit",
    tableName: "obligation_audits",
  },
);

Obligation.hasMany(ObligationAudit, {
  foreignKey: "obligationId",
  as: "audits",
});

ObligationAudit.belongsTo(Obligation, {
  foreignKey: "obligationId",
  as: "obligation",
});

export default ObligationAudit;
