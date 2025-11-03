const mongoose = require('mongoose');

const chatHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    query: {
        type: String,
        required: true,
        trim: true
    },
    response: {
        type: String,
        required: true
    },
    reference: {
        type: String,
        default: 'LexAI'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Índice para búsquedas rápidas por usuario
chatHistorySchema.index({ userId: 1, timestamp: -1 });

module.exports = mongoose.model('ChatHistory', chatHistorySchema);