# Extension Chrome "Poids Équipes FFT"

Cette extension pour Google Chrome (et autres navigateurs basés sur Chromium) permet d'analyser les pages d'équipes sur le site `tenup.fft.fr` de la Fédération Française de Tennis.

Elle calcule deux indicateurs de "poids" pour une équipe et liste les quatre meilleurs joueurs en se basant sur leurs classements.

## Fonctionnalités

- **Calcul du poids de l'équipe** : Calcule le poids moyen de l'ensemble de l'équipe.
- **Calcul du poids des 4 meilleurs** : Calcule le poids moyen des quatre joueurs les mieux classés.
- **Identification des meilleurs joueurs** : Affiche les classements des quatre meilleurs joueurs.

### Méthode de Calcul

Le "poids" de chaque joueur est déterminé par un barème qui assigne une valeur numérique à chaque échelon de classement (par exemple, -15, 0, 15/1, 30/2, etc.). Cette valeur est inspirée du calcul des poids pour les doubles.

L'extension calcule ensuite la moyenne de ces valeurs pour :
1.  L'ensemble des joueurs de l'équipe.
2.  Les quatre joueurs les plus performants.

## Comment Installer

Comme il s'agit d'une extension non empaquetée, vous devez la charger manuellement.

1.  **Ouvrir la Page des Extensions** :
    *   Ouvrez votre navigateur et accédez à `chrome://extensions` (ou l'équivalent pour votre navigateur).

2.  **Activer le Mode Développeur** :
    *   Dans le coin supérieur droit, activez le **"Mode développeur"**.

3.  **Charger l'Extension** :
    *   Cliquez sur le bouton **"Charger l'extension non empaquetée"**.
    *   Sélectionnez le dossier contenant les fichiers de l'extension.

4.  **Prêt à Utiliser !** :
    *   L'extension apparaîtra dans votre liste. Pensez à épingler son icône (une balle de tennis) dans votre barre d'outils pour un accès rapide.

## Comment Utiliser

1.  Accédez à une page d'équipe sur le site `tenup.fft.fr`.
2.  Cliquez sur l'icône de l'extension dans votre barre d'outils.
3.  Une fenêtre affichera le nom de l'équipe, le poids de l'effectif complet, le poids des 4 meilleurs joueurs, et la liste de leurs classements.
