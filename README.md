# Jornada

Application web de suivi personnel du temps de travail hebdomadaire.

Le nom vient de l'espagnol *jornada*, la journée de travail.

Elle fonctionne dans le navigateur, sans compte ni serveur. Les données restent sur l'appareil, dans le stockage local du navigateur, et ne sont transmises nulle part.

## Ce qu'elle fait

- Régler son régime : volume hebdomadaire, jours prestés, répartition, gestion de la pause
- Définir un second régime sur une période de l'année, et des périodes exceptionnelles bornées par des dates
- Encoder ses heures et voir, à tout moment, ce qu'il reste à prester et l'écart de la semaine
- Reporter le solde d'une semaine ou d'un mois à l'autre, ou le remettre à zéro
- Exporter et réimporter l'ensemble des données en JSON

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | L'application entière : structure, styles et script |
| `sw.js` | Service worker, pour l'utilisation hors ligne |
| `manifest.webmanifest` | Déclaration PWA (nom, icônes, couleurs) |
| `apple-touch-icon.png` | Icône utilisée par iOS sur l'écran d'accueil |
| `icon-192.png`, `icon-512.png` | Icônes pour Android et le manifeste |

Tous les fichiers vont à la racine du dépôt. Les chemins sont relatifs : un sous-dossier casserait la mise en cache. Les noms doivent rester identiques, la page et le service worker y renvoient.

## Mise en ligne

1. Déposer les six fichiers à la racine d'un dépôt.
2. Settings → Pages → Source : *Deploy from a branch*, branche `main`, dossier `/ (root)`.
3. Ouvrir l'adresse publiée, puis, sur mobile, l'ajouter à l'écran d'accueil.

Le hors-ligne exige HTTPS. En ouvrant le fichier en local, le service worker ne s'active pas et l'application fonctionne normalement, mais elle a besoin du réseau pour se charger.

## Après chaque modification

Incrémenter `VERSION` dans `sw.js` — `v1` devient `v2`, et ainsi de suite. Sans ça, les appareils qui ont déjà installé l'application continueront de servir l'ancienne version depuis leur cache.

## Modèle de données

Tout tient dans `localStorage`, sous la clé `mesheures_v2` :

- `config` — volume, jours prestés, répartition, mode de saisie, pause, régime saisonnier, report du solde, seuil d'alerte
- `exceptions` — périodes bornées par deux dates, avec leur propre volume et leurs propres jours
- `jours` — une entrée par journée encodée, qui retient le régime applicable ce jour-là

Une base enregistrée par la version précédente sous `mesheures_v1` est reprise automatiquement au premier lancement, avec son régime d'origine.

Chaque journée encodée conserve sa référence horaire. Modifier un réglage aujourd'hui ne réécrit pas les soldes passés.

## Limites connues

- Les données ne se synchronisent pas entre appareils. Pour changer de téléphone : exporter d'un côté, importer de l'autre.
- Vider les données du navigateur efface tout. Exporter régulièrement.
- Les polices viennent de Google Fonts. Elles sont mises en cache après la première visite ; avant cela, hors ligne, l'affichage bascule sur les polices du système.

## Licence

Usage libre. Fourni tel quel, sans garantie.
