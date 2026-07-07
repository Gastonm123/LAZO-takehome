import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../db/orm.js';

const Obligation = sequelize.define(
    'Obligation',
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
        }
    },
    {
        timestamps: true,
        tableName: 'obligations',
        version: true,
    }
);

export default Obligation;

