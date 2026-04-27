app.post('/api/v1/emprunt', async (req, res) => {
  try {
    const { emailClient, livreId } = req.body;

    const livre = await Livre.findById(livreId);

    if (!livre) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }

    
    if (livre.etat === "emprunté") {
      return res.status(400).json({ message: "Livre déjà emprunté" });
    }

    const emprunt = new Emprunt({
      emailClient,
      livreId,
      dateEmprunt: new Date(),
      dateRetour: null
    });

    await emprunt.save();

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