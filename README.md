# Template Pug

Ce dépôt contient les templates projet utilisés pour personnaliser le frontend Girder.

Templates disponibles :

- `smartheat`
- `opla`
- `thermolyse`

Le template à appliquer est choisi avec la variable d’environnement : `PROJECT_TEMPLATE`

Chaque projet contient :
- `views/` : composants frontend personnalisés (`frontPageView.js`)
- `stylesheets/` : styles CSS/Stylus du projet (`frontPage.styl`, `header.styl`, `globalNav.styl`)
- `utilities/` : fichiers utilitaires frontend, notamment les traductions (`translations.js`)
- `public/` : ressources statiques du projet (logos, images, icônes, favicons, etc.)

## Application des templates

Les templates ne sont pas appliqués directement par ce dépôt.

Ils sont utilisés par le dépôt `girder-deploy`, qui monte ce dépôt dans les conteneurs Docker puis applique le template sélectionné avec le script :

```bash
scripts/apply-template.sh
