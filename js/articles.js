/**
 * Source unique des articles du blog Dr Yousra El Khadri.
 *
 * Comment ajouter un nouvel article :
 *   1. Ajoutez un nouvel objet en haut de la constante ARTICLES ci-dessous.
 *   2. Le champ `date` doit être au format ISO 'YYYY-MM-DD'.
 *   3. Le script gère automatiquement :
 *        - le tri par date décroissante (du plus récent au plus ancien)
 *        - l'affichage des 2 articles les plus récents sur la home (.blog-preview-two)
 *        - le rendu complet et trié sur la page Blog (.blog-grid)
 *        - le filtrage par catégorie sur la page Blog (data-cat / data-category)
 *
 * Catégories supportées par les filtres de blog.html :
 *   - 'injections'
 *   - 'anti-age'
 *   - 'laser'
 */
(function () {
  'use strict';

  var ARTICLES = [
    {
      url: 'blog/filler-pommettes-casablanca.html',
      title: 'Filler des pommettes à Casablanca : restaurer le volume et redessiner l\'ovale',
      excerpt: 'Pommettes creuses, ovale relâché, visage fatigué : comment le filler par acide hyaluronique restaure le volume sans chirurgie.',
      image: 'blog/images/filler-pommettes-injection-generique-casablanca.jpg',
      imageAlt: 'Filler pommettes — injection acide hyaluronique, photo générique',
      imageWidth: 768,
      imageHeight: 576,
      date: '2026-05-20',
      readingMinutes: 6,
      category: 'injections',
      categoryLabel: 'Injections'
    },
    {
      url: 'blog/tear-trough-casablanca.html',
      title: 'Tear Trough Casablanca : effacer les cernes creux sans chirurgie',
      excerpt: 'Cernes creux, sillon lacrymal, regard fatigué : comment le tear trough par acide hyaluronique restaure le volume sans chirurgie.',
      image: 'blog/images/tear-trough-casablanca-injection-1.png',
      imageAlt: 'Tear trough Casablanca — injection acide hyaluronique',
      imageWidth: 768,
      imageHeight: 1344,
      date: '2026-05-18',
      readingMinutes: 6,
      category: 'injections',
      categoryLabel: 'Injections'
    },
    {
      url: 'blog/botox-masseter-casablanca.html',
      title: "Botox masséter : affiner l'ovale du visage à Casablanca",
      excerpt: "Mâchoire carrée, ovale du visage, bruxisme : comment fonctionne le botox dans le masséter et à quoi s'attendre au cabinet.",
      image: 'blog/images/injection-botox-masseter-casablanca-dr-yousra-el-khadri.png',
      imageAlt: 'Dr Yousra El Khadri réalisant une injection de botox au masséter à Casablanca',
      imageWidth: 768,
      imageHeight: 1344,
      date: '2026-05-12',
      readingMinutes: 8,
      category: 'injections',
      categoryLabel: 'Injections'
    },
    {
      url: 'blog/injections-esthetiques-casablanca-guide.html',
      title: 'Injections esthétiques à Casablanca : guide complet 2026',
      excerpt: "Botox, fillers, stimulateurs de collagène, skin boosters : panorama complet de toutes les solutions d'injection disponibles à Casablanca.",
      image: 'blog/images/salon-attente-cabinet-dr-yousra-elkhadri-casablanca.png',
      imageAlt: 'Guide complet des injections esthétiques à Casablanca - cabinet Dr Yousra El Khadri',
      imageWidth: 768,
      imageHeight: 1344,
      date: '2026-05-06',
      readingMinutes: 12,
      category: 'injections',
      categoryLabel: 'Injections',
      isPilier: true,
      pilierLabel: 'Guide complet'
    },
    {
      url: 'blog/botox-front-casablanca.html',
      title: 'Botox du front à Casablanca : zones traitées, prix et durée des effets',
      excerpt: "Rides horizontales, ride du lion, botox préventif : tout ce que vous devez savoir sur le botox du front à Casablanca avant votre consultation.",
      image: 'blog/images/cabinet-bureau-dr-yousra-elkhadri-casablanca.jpeg',
      imageAlt: 'Article botox front à Casablanca - cabinet Dr Yousra El Khadri',
      imageWidth: 720,
      imageHeight: 1280,
      date: '2026-05-05',
      readingMinutes: 6,
      category: 'injections',
      categoryLabel: 'Injections'
    }
  ];

  var MOIS_FR = [
    'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
  ];

  function formatDateFr(iso) {
    var parts = String(iso).split('-');
    var d = parseInt(parts[2], 10);
    var m = parseInt(parts[1], 10);
    var y = parts[0];
    return d + ' ' + MOIS_FR[m - 1] + ' ' + y;
  }

  function escapeAttr(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function escapeText(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function articleHtml(article, opts) {
    var cls = 'blog-card' + (opts && opts.withReveal ? ' rv' : '');
    var badges = '';
    if (article.categoryLabel) {
      badges += '<span class="blog-badge ' + escapeAttr(article.category) + '">' +
        escapeText(article.categoryLabel) + '</span>';
    }
    if (article.isPilier) {
      badges += '<span class="blog-badge blog-badge-pilier">' +
        escapeText(article.pilierLabel || 'Guide complet') + '</span>';
    }
    return (
      '<a href="' + escapeAttr(article.url) + '" class="' + cls + '"' +
      ' data-cat="' + escapeAttr(article.category) + '"' +
      ' data-category="' + escapeAttr(article.category) + '"' +
      ' data-published="' + escapeAttr(article.date) + '">' +
        '<div class="blog-card-img">' +
          '<img src="' + escapeAttr(article.image) + '"' +
            ' alt="' + escapeAttr(article.imageAlt) + '"' +
            (article.imageWidth ? ' width="' + article.imageWidth + '"' : '') +
            (article.imageHeight ? ' height="' + article.imageHeight + '"' : '') +
            ' loading="lazy">' +
        '</div>' +
        '<div class="blog-card-body">' +
          badges +
          '<h3>' + escapeText(article.title) + '</h3>' +
          '<p>' + escapeText(article.excerpt) + '</p>' +
          '<div class="blog-card-meta">' +
            '<span>' + escapeText(formatDateFr(article.date)) +
              ' · ' + article.readingMinutes + ' min de lecture</span>' +
            '<span class="blog-card-read">Lire la suite →</span>' +
          '</div>' +
        '</div>' +
      '</a>'
    );
  }

  function sortedDesc() {
    return ARTICLES.slice().sort(function (a, b) {
      return b.date.localeCompare(a.date);
    });
  }

  function renderInto(selector, opts) {
    var container = document.querySelector(selector);
    if (!container) return;

    Array.prototype.forEach.call(
      container.querySelectorAll('.blog-card'),
      function (c) { c.remove(); }
    );
    var empty = container.querySelector('.blog-filter-empty');
    if (empty) empty.remove();

    var list = sortedDesc();
    var limited = (opts && opts.limit) ? list.slice(0, opts.limit) : list;
    var html = limited.map(function (a) { return articleHtml(a, opts); }).join('');

    var footer = container.querySelector('.blog-preview-two-footer');
    if (footer) {
      footer.insertAdjacentHTML('beforebegin', html);
    } else {
      container.insertAdjacentHTML('afterbegin', html);
    }
  }

  function init() {
    renderInto('.blog-preview-two', { limit: 2, withReveal: false });
    renderInto('.blog-grid', { withReveal: true });
  }

  window.DrYousraArticles = {
    list: ARTICLES,
    sorted: sortedDesc,
    render: renderInto
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
