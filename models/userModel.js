const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nom: { 
        type: String, 
        required: false // خليتها false إيلا كنتي باغي تسجل غير بـ email حالياً
    },
    prenom: { 
        type: String, 
        required: false 
    },
    email: { 
        type: String, 
        required: [true, "L'email est obligatoire"], 
        unique: true, // هادي مهمة باش ما يتسجلوش جوج مستخدمين بنفس الإيميل
        lowercase: true,
        trim: true
    },
    password: { 
        type: String, 
        required: [true, "Le mot de passe est obligatoire"] 
    },
    role: {
        type: String,
        enum: ['admin', 'client'],
        default: 'client'
    }
}, { 
    timestamps: true // كاتزيد ليك وقت التسجيل (createdAt) أوتوماتيكياً
});

module.exports = mongoose.model('User', userSchema);
