# Blog SEO — Articles Dr. Yousra

Ce dossier accueille les **24 articles SEO** qui seront publiés dans les semaines à venir sur le site de Dr. Yousra, médecin esthétique.

## Structure éditoriale

Les articles suivent un **calendrier éditorial structuré en 3 clusters thématiques** :

1. **Injections** — botox, acide hyaluronique, traitements préventifs et correctifs
2. **Rajeunissement** — skinbooster, mésothérapie, biostimulation, soins anti-âge
3. **Laser & Corrections** — épilation laser, taches, cicatrices, texture de peau

## Architecture des images

Les images spécifiques aux articles de blog suivent le principe de **colocation by feature** : tout ce qui concerne le blog est regroupé dans son propre sous-dossier.

**Emplacement :** `blog/images/` — jamais dans `images/blog/`

**Convention de nommage :**
- Tirets, minuscules, mots-clés SEO
- Format : `[mot-cle-principal]-[contexte]-casablanca.[ext]`
- Exemple : `botox-front-injection-cabinet-casablanca.png`

**Format de fichier :**
- **JPG** pour les photos (meilleure compression)
- **PNG** si transparence nécessaire

**Bonnes pratiques :**
- Compresser avant upload (cible : < 150 Ko pour JPG, < 300 Ko pour PNG)
- Alt-text descriptif **obligatoire** : inclure le mot-clé principal de l'article + contexte géographique
- Chemin relatif depuis un article : `images/[fichier]`

## Documentation

La stratégie SEO complète (prompt maître, calendrier éditorial, suivi de performance) est documentée dans le dossier [`/_docs/`](../_docs/).

> Les fichiers HTML des articles seront ajoutés ici au fur et à mesure de leur production.
