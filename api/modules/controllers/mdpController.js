// pour vérifier que le mot de passe est bon pour les applications RP et des plannings
exports.checkMdp = function (req, res) {
  const id = String(req.params.id);

  const mdp = 'Hell0Rps';

  if (id === mdp) {
    res.status(200).send('Mot de passe valide');
  } else {
    res.status(201).send('Mot de passe invalide');
  }
}
