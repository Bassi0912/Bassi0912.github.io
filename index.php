<?php
// Inclure la logique PHP du jeu
include 'class/logique.php';
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Deviner le Personnage</title>
    <link rel="stylesheet" href="styles.css">
    <form action="class/Instructions.php" method="get">
</form>
</head>
<body>
	<div class="game-container">
		<div class="button-container">
        <form action="class/Instructions.php" method="get">
            <button type="submit" class="button">Voir les Consignes du Jeu</button>
        </form>
    </div>
        <div class="game-box">
            <h1>Devine le Personnage</h1>
            <div class="score-container">
    <p>Score actuel : <strong><?php echo $_SESSION['score']; ?> points</strong></p>
</div>

            <p class="instructions">Entrez le nom du personnage que vous pensez être, et essayez de deviner ses caractéristiques !</p>

            <!-- Formulaire de tentative -->
            <form method="POST">
                <input type="text" name="nom" placeholder="Entrez un nom" value="<?php echo htmlspecialchars($attempt); ?>" required>
                <button type="submit" class="button">Essayer</button>
            </form>

            <!-- Affichage du message d'erreur si le personnage n'existe pas -->
            <?php if ($attempt && !$attemptedCharacter): ?>
                <div class="error-message">
                    <p>Ce personnage n'existe pas dans la base de données. Essayez encore !</p>
                </div>
            <?php endif; ?>

            <!-- Affichage des résultats de la tentative -->
            <?php if ($attempt && $attemptedCharacter): ?>
                <div class="attempts-container">
                    <div class="attempt">
                        <ul class="details">
                            <li class="<?php echo (strtolower($attemptedCharacter['nom']) == strtolower($randomCharacter['nom'])) ? 'correct' : 'incorrect'; ?>" style="font-size: 25px; color: yellow;">Nom : <?php echo $attemptedCharacter['nom']; ?></li>
							<li class="<?php echo (strtolower($attemptedCharacter['arme']) == strtolower($randomCharacter['arme'])) ? 'correct' : 'incorrect'; ?>">Arme : <?php echo $attemptedCharacter['arme']; ?></li>
                            <li class="<?php echo (strtolower($attemptedCharacter['taille']) == strtolower($randomCharacter['taille'])) ? 'correct' : 'incorrect'; ?>">Taille : <?php echo $attemptedCharacter['taille']; ?></li>
                            <li class="<?php echo (strtolower($attemptedCharacter['type']) == strtolower($randomCharacter['type'])) ? 'correct' : 'incorrect'; ?>">Type : <?php echo $attemptedCharacter['type']; ?></li>
                            <li class="<?php echo (strtolower($attemptedCharacter['statut']) == strtolower($randomCharacter['statut'])) ? 'correct' : 'incorrect'; ?>">Statut : <?php echo $attemptedCharacter['statut']; ?></li>
                        </ul>
                        <img src="images/<?php echo $attemptedCharacter['image']; ?>" alt="Image du personnage" class="character-image">
                    </div>
                </div>
            <?php endif; ?>

            <!-- Affichage du message de succès si le bon personnage est trouvé -->
            <?php if ($correctAttempt): ?>
    <div id="score-message">
        <p>Félicitations ! Vous avez trouvé le personnage <strong><?php echo $randomCharacter['nom']; ?></strong> !</p>
        <p>Votre score final est : <strong><?php echo $_SESSION['score']; ?> points</strong></p>
        <p>Nombre total de tentatives : <strong><?php echo count($_SESSION['attempts']); ?></strong></p>
        <img src="images/<?php echo $randomCharacter['image']; ?>" class="success-image" alt="Image du personnage trouvé">
    </div>
<?php endif; ?>



            <!-- Affichage du bouton "Recommencer" avec la classe 'show' si le personnage est trouvé -->
            <form method="POST">
                <button type="submit" name="reset" id="reset-btn" class="button <?php echo $correctAttempt ? 'show' : ''; ?>">Recommencer</button>
            </form>

            <!-- Affichage de toutes les tentatives -->
            <div class="all-attempts">
                <h2>Toutes les tentatives</h2>
                <?php foreach ($_SESSION['attempts'] as $attemptData): ?>
                    <div class="attempt">
                        <div class="details">
                            <ul>
                                <li class="<?php echo ($attemptData['correct']) ? 'correct' : 'incorrect'; ?>"style="font-size: 25px; color: yellow;">Nom : <?php echo htmlspecialchars($attemptData['attempt']); ?></li>
                                <?php if ($attemptData['character']): ?>
                                    <li class="<?php echo (strtolower($attemptData['character']['arme']) == strtolower($randomCharacter['arme'])) ? 'correct' : 'incorrect'; ?>">Arme : <?php echo $attemptData['character']['arme']; ?></li>
                                    <li class="<?php echo (strtolower($attemptData['character']['taille']) == strtolower($randomCharacter['taille'])) ? 'correct' : 'incorrect'; ?>">Taille : <?php echo $attemptData['character']['taille']; ?></li>
                                    <li class="<?php echo (strtolower($attemptData['character']['type']) == strtolower($randomCharacter['type'])) ? 'correct' : 'incorrect'; ?>">Type : <?php echo $attemptData['character']['type']; ?></li>
                                    <li class="<?php echo (strtolower($attemptData['character']['statut']) == strtolower($randomCharacter['statut'])) ? 'correct' : 'incorrect'; ?>">Statut : <?php echo $attemptData['character']['statut']; ?></li>
                                <?php endif; ?>
                            </ul>
                        </div>
                        <img src="images/<?php echo $attemptData['character']['image']; ?>" alt="Image du personnage tenté" class="attempt-image">
                    </div>
                <?php endforeach; ?>
            </div>

        </div>
    </div>
</body>
</html>
