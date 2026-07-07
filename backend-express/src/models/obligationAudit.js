import { Sequelize, DataTypes } from 'sequelize';
import Obligation from './obligation.js';
import { sequelize } from '../db/orm.js';

const ObligationAudit = sequelize.define(
    'ObligationAudit',
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
        obligationVersion: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        obligationId: {
            type: DataTypes.INTEGER,
            references: {
                model: Obligation,
            },
            allowNull: false,
            onUpdate: 'RESTRICT',
            onDelete: 'RESTRICT',
        }
    },
    {
        timestamps: true,
        updatedAt: false,
        tableName: 'obligation_audits',
    }
);

export default ObligationAudit;