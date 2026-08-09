# Portfolio — Développeur·se Web

Portfolio statique, responsive, avec animations 3D (Three.js), fait pour être déposé
tel quel sur GitHub et publié gratuitement avec **GitHub Pages**.

Aucune installation, aucun build : uniquement du HTML / CSS / JS, tout fonctionne en
ouvrant simplement `index.html`.

## Structure du projet

```
portfolio/
├── index.html         # Accueil (hero 3D + projets phares + contact)
├── projects.html       # Tous les projets, avec filtres par technologie
├── about.html          # À propos, compétences, parcours, CV
├── css/style.css       # Tout le design (variables, layout, responsive)
├── js/main.js           # Curseur custom, scroll reveal, tilt 3D, scène Three.js
├── assets/
│   ├── cv-bassirou-gueye.pdf   # CV téléchargeable
│   └── bassirou-gueye.jpg      # Photo de profil
└── README.md
```

## 1. Personnaliser le contenu

Le site est livré avec le profil de Bassirou Gueye. Pour le personnaliser à nouveau,
remplacez le texte, la photo (`assets/`) et le CV par les vôtres.

- **Nom, titre, texte de présentation** : à modifier directement dans `index.html`
  (section `.hero`) et `about.html` (section `.about-hero`).
- **Projets** : chaque projet est un bloc `<article class="project-card">` dans
  `index.html` (3 projets phares) et `projects.html` (tous les projets). Dupliquez
  un bloc pour ajouter un projet, changez le titre, la description, les technologies
  (`<ul class="tech-list">`) et les liens (démo / code source).
  - La vignette de chaque projet est un dégradé CSS (`background: linear-gradient(...)`)
    pour rester léger sans image. Vous pouvez la remplacer par une vraie capture
    d'écran : `<div class="thumb-bg" style="background-image:url('assets/img/mon-projet.jpg')"></div>`.
  - `data-tech="react,node"` sur la carte sert au filtre de `projects.html` :
    utilisez les valeurs `react`, `node`, `nextjs`, `api` (ou ajoutez les vôtres, en
    les ajoutant aussi aux boutons `.filter-btn` correspondants).
- **Compétences** (`about.html`) : chaque `.skill-bar` a un `data-level="85"` qui
  définit le pourcentage affiché.
- **Parcours** (`about.html`) : chaque étape est un `.timeline-item`, dupliquez pour
  ajouter une expérience ou une formation.
- **CV** : remplacez `assets/cv-bassirou-gueye.pdf` par votre propre PDF (gardez le
  même nom de fichier, ou mettez à jour les 3 liens `href="assets/..."` si vous le
  renommez).
- **Liens de contact** : email, téléphone, etc. sont à changer dans `index.html`
  (section `#contact`) et dans le pied de page (`<footer>`) de chaque page.
- **Couleurs** : tout le thème est piloté par les variables CSS en haut de
  `css/style.css` (bloc `:root`) — changez `--cyan`, `--magenta`, `--amber`, `--bg`,
  etc. pour une palette différente (thème actuel : noir + violet foncé).

> Le formulaire de contact est statique (aucun serveur) : pour qu'il envoie vraiment
> des emails, connectez-le à un service comme Formspree, EmailJS ou Netlify Forms.

## 2. Tester en local

Ouvrez simplement `index.html` dans votre navigateur, ou lancez un petit serveur local :

```bash
python3 -m http.server 8000
# puis ouvrez http://localhost:8000
```

## 3. Déployer sur GitHub Pages

1. Créez un nouveau dépôt sur GitHub (par exemple `mon-portfolio`).
2. Dans le dossier du projet, initialisez git et poussez le contenu :

   ```bash
   git init
   git add .
   git commit -m "Portfolio initial"
   git branch -M main
   git remote add origin https://github.com/VOTRE-PSEUDO/mon-portfolio.git
   git push -u origin main
   ```

3. Sur GitHub, allez dans **Settings → Pages**.
4. Sous **Build and deployment**, choisissez **Deploy from a branch**, branche
   `main`, dossier `/ (root)`, puis **Save**.
5. Après une ou deux minutes, votre site est en ligne à l'adresse :
   `https://VOTRE-PSEUDO.github.io/mon-portfolio/`

## Notes techniques

- Animation 3D réalisée avec [Three.js](https://threejs.org/) (chargé depuis un CDN,
  aucune dépendance à installer).
- Respecte `prefers-reduced-motion` : les animations sont désactivées pour les
  personnes qui l'ont demandé dans leur système.
- Curseur personnalisé désactivé automatiquement sur écrans tactiles.
- Design 100% responsive, testé de 360px (mobile) à grand écran.
