// routes/emprunt.js
const isAuthenticated = require('../middleware/isAuthenticated'); // ضروري للحماية

router.post('/api/v1/emprunt', isAuthenticated, async (req, res) => {
  try {
    const { livreId } = req.body; // مابقاش محتاج تصيفط الإيميل، حيت غانجيبوه من الـ Token

    // 1. قلب على الكتاب فـ موديل Book
    const livre = await Book.findById(livreId);

    if (!livre) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }

    // 2. تأكد من الحالة (Etat)
    if (livre.etat === "emprunté") {
      return res.status(400).json({ message: "Livre déjà emprunté" });
    }

    // 3. كاري تسليفة جديدة
    const emprunt = new Emprunt({
      idClient: req.user.id, // جبناه من الميدلوير أوتوماتيكياً
      idLivre: livreId,
      dateEmprunt: new Date(),
      dateRetourPrevue: req.body.dateRetourPrevue // ضروري تزيد هادي باش تكمل الـ Schema
    });

    await emprunt.save();

    // 4. تحديث حالة الكتاب
    livre.etat = "emprunté";
    await livre.save();

    return res.status(200).json({
      message: "Emprunt ajouté avec succès",
      emprunt
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
