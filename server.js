const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

// --- الربط مع الداتابيز ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.log("❌ DB Error:", err));

// --- تفعيل الروابط (Routes) ---
// تأكد أن المجلد سميتو routes والملفات سميتهم هكا:
app.use('/api/auth', require('./routes/auth'));       // تسجيل الدخول والتسجيل
app.use('/api/books', require('./routes/book'));     // إدارة الكتب
app.use('/api/emprunts', require('./routes/emprunt')); // إدارة التسلاف
app.use('/api/users', require('./routes/user'));     // إدارة المستخدمين
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/emprunt', require('./routes/emprunt'));

app.get('/', (req, res) => res.send("API is working!"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Library API',
      version: '1.0.0',
      description: 'Documentation dyal API d l-mechetaba'
    },
    servers: [{ url: 'http://localhost:3000' }]
  },
  apis: ['./routes/*.js'], // هنا كتقول ليه فين يقلب على التوثيق
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
