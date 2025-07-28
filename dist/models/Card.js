"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = void 0;
const mongoose_1 = require("mongoose");
const CardSchema = new mongoose_1.Schema({
    uid: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true
    },
    state: {
        type: Boolean,
        default: true,
        required: true
    },
    issueDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    disabledAt: {
        type: Date,
        default: undefined
    },
    assignedTo: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    permanentBlocked: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    collection: 'cards',
    toJSON: {
        transform: function (doc, ret) {
            if (ret.disabledAt === undefined)
                ret.disabledAt = null;
            if (ret.assignedTo === undefined)
                ret.assignedTo = null;
            return ret;
        }
    }
});
CardSchema.index({ assignedTo: 1 });
CardSchema.index({ state: 1 });
CardSchema.virtual('isAvailable').get(function () {
    return this.state === true && this.assignedTo === null;
});
CardSchema.methods.assignToUser = function (userId) {
    this.assignedTo = userId;
    return this.save();
};
CardSchema.methods.unassign = function () {
    this.assignedTo = null;
    return this.save();
};
CardSchema.methods.disable = function () {
    this.state = false;
    this.disabledAt = new Date();
    return this.save();
};
exports.Card = (0, mongoose_1.model)('Card', CardSchema);
