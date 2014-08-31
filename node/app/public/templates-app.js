angular.module('templates-app', ['acceuil/acceuil.tpl.html', 'aide/aide.tpl.html', 'communes/communes.tpl.html', 'departements/departements.tpl.html', 'detail/detail.tpl.html', 'edit/edit.tpl.html', 'home/home.tpl.html', 'map/map.tpl.html', 'recherche/recherche.tpl.html', 'voies/voies.tpl.html']);

angular.module("acceuil/acceuil.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("acceuil/acceuil.tpl.html",
    "<div class=\"jumbotron\">\n" +
    "  <h1>GéoTrouvetou</h1>\n" +
    "\n" +
    "  <p class=\"lead\">\n" +
    "    Outil de recheche d'adresses en <em>France</em>.\n" +
    "  </p>\n" +
    "  <p class=\"text-justify\">\n" +
    "    Séléctionnez la liste des départements puis une ville et affichez la listes des rues et lieux dits de la commune.<br>\n" +
    "    Une fois dans le département, vous pouvez utiliser le moteur de recherche.<br>\n" +
    "    Les données sont extraites du Fichier <strong>FANTOIR</strong> fournis par la <strong>DGFiP</strong>, la base de données contient la liste de toutes les communes, voies et lieux dits de France existantes et passée depuis le 1er janvier 1987.<br>\n" +
    "    Mise à jour du Fichier FANTOIR du 20 juin 2013.\n" +
    "\n" +
    "  </p>\n" +
    "\n" +
    "  <ul class=\"list-inline social-buttons\">\n" +
    "    <li plus-one></li>\n" +
    "  </ul> \n" +
    "  \n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("aide/aide.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("aide/aide.tpl.html",
    "<div class=\"row\">\n" +
    "  <h1 class=\"page-header row\">\n" +
    "    <div class=\"col-md-3\">\n" +
    "      GeoTrouvetout<br/>\n" +
    "      <small>Trouve toutes les rues.</small>\n" +
    "    </div>\n" +
    "    <img src=\"assets/geo-trouvetou.gif\" class=\"col-md-2\" style=\"height:100%;width:auto; margin-top: -7px;\" alt=\"Logo\"/>\n" +
    "  </h1>\n" +
    "  \n" +
    "  <h2>Pourquoi cet outil?</h2>\n" +
    "\n" +
    "  <p>\n" +
    "    J'ai commencé à chercher un moyen de préparer des cartes pour les livreurs\n" +
    "    de nos tournées lorsque les adresses nettaient pas sur leur plans ou sur les GPS.\n" +
    "  </p>\n" +
    "\n" +
    "  <p>\n" +
    "    En juillet 2013, la <abbr title=\"Direction générale des Finances publiques\">DGFiP</abbr> à libéré les données\n" +
    "    du fichier national <abbr title=\"Fichier ANnuaire TOpographique Initialisé Réduit\">FANTOIR</abbr>. rescensant toutes les voies des communes françaises.\n" +
    "  </p>\n" +
    "\n" +
    "  <h2>Ce qu'il fait et ne fait pas.</h2>\n" +
    "\n" +
    "  <ul>\n" +
    "    <li>Il permet:<ul>\n" +
    "      <li>de faire des recherche dans la base FANTOIR, à laquelle j'ai ajouté quelques données.</li>\n" +
    "      <li>d'éditer une carte <a href=\"openstreetmap.org\" title=\"OSM\">OpenStreetMap</a>.</li>\n" +
    "      <li>de faire une visualistion du lieu sur le cadastre.</li>\n" +
    "    </ul></li>\n" +
    "    <li> Il ne fait pas:<ul>\n" +
    "      <li>Une carte toute prête à l'emploi si la voie ou le lieu dit n'est pas dans la base de donnée \n" +
    "      d'<a href=\"openstreetmap.org\" title=\"OSM\">OpenStreetMap</a>.\n" +
    "      Si c'est le cas, il faut l'ajouter manuellement.</li>\n" +
    "      <li>Le café</li>\n" +
    "    </ul></li>\n" +
    "  </ul>\n" +
    "\n" +
    "  <h1 class=\"page-header\">\n" +
    "    Comment cela fonctionne?\n" +
    "    <small>Ou petit guide de survie.</small>\n" +
    "  </h1>\n" +
    "  <p>\n" +
    "    Vous pouvez afficher la <a href ui-sref=\"departements\"> liste des départements </a>, la liste des commune de votre département, mais aussi faire une <a href ui-sref=\"recherche\">recherche d'une addresse</a>.\n" +
    "  </p>\n" +
    "\n" +
    "  <p>\n" +
    "    Vous pouvez également afficher la liste des rues et lieux dits d'une commune depuis la barre de recherche.\n" +
    "  </p>\n" +
    "\n" +
    "  <h2>Liste des commune d'un département</h2>\n" +
    "\n" +
    "  <p>\n" +
    "    De base, le logiciel précharge les 20 premières communes et charge la suite au fur et à mesure que l'on descent dans la liste.\n" +
    "  </p>\n" +
    "  \n" +
    "  <div class=\"example\">\n" +
    "    <p>\n" +
    "      Voici comment se présente la liste:\n" +
    "    </p>\n" +
    "    <div class=\"list commune\">\n" +
    "      <a href=\"#/voies/85001\" title=\"L'Aiguillon-sur-Mer\" class=\"row\">\n" +
    "        <div class=\"\">\n" +
    "          <span class=\"codePostal col-md-2 ng-binding\">85460</span> \n" +
    "          <span class=\"col-md-1\">\n" +
    "            <i ng-show=\"true\" class=\"fa fa-tree text-success\"></i>\n" +
    "            <i ng-show=\"\" class=\"fa fa-times-circle text-danger ng-hide\"></i>\n" +
    "          </span> \n" +
    "          <span class=\"name col-md-5 ng-binding\">L'Aiguillon-sur-Mer</span> \n" +
    "          <span class=\"date col-md-4 ng-binding\">01/01/87</span>\n" +
    "        </div>\n" +
    "      </a>\n" +
    "      <a href=\"#/voies/85068\" class =\"row\" title=\"LA CLAYE\">\n" +
    "        <div class=\"strike\">\n" +
    "          <span class=\"codePostal col-md-2 ng-binding\"></span> \n" +
    "          <span class=\"col-md-1\">\n" +
    "            <i ng-show=\"true\" class=\"fa fa-tree text-success\"></i>\n" +
    "            <i ng-show=\"1999-12-22\" class=\"fa fa-times-circle text-danger\"></i>\n" +
    "          </span> \n" +
    "          <span class=\"name col-md-5 ng-binding\">LA CLAYE</span> \n" +
    "          <span class=\"date col-md-4 ng-binding\">\n" +
    "            01/01/87\n" +
    "            <i class=\"fa fa-arrow-circle-right\"></i><span class=\"date ng-binding\">22/12/99</span>\n" +
    "          </span>\n" +
    "        </div>\n" +
    "      </a>\n" +
    "    </div>\n" +
    "    <p>\n" +
    "      Le premier élément est le code postal de la commune suivi par les icones \n" +
    "      <i class=\"fa fa-tree text-success\"></i> qui représente une commune rurale \n" +
    "      et <i class=\"fa fa-times-circle text-danger\"></i> qui représente une commune n'existant plus.\n" +
    "    </p>\n" +
    "    <p>\n" +
    "      Viens ensuite son nom puis la date d'ajout dans la base suivi de <i class=\"fa fa-arrow-circle-right\"></i> puis la date de suppression.\n" +
    "      Vous aurez remarqué que la ville supprimée de la base est rayée <i class=\"fa fa-smile-o\"></i>.\n" +
    "    </p>\n" +
    "  </div>\n" +
    "  \n" +
    "\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("communes/communes.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("communes/communes.tpl.html",
    "<div class=\"row\">\n" +
    "  <h1 class=\"page-header\">\n" +
    "    Liste des communes {{head_subtext}}\n" +
    "  </h1>\n" +
    "  <div class=\"list container\" when-scrolled=\"loadMore()\">\n" +
    "    <div class=\"commune row\" ng-repeat=\"i in items\" ng-class=\"{'strike' : i.dateDel  }\">\n" +
    "      <a href ui-sref=\"voies({insee: i.insee })\" title=\"{{i.beautifullName}}\">\n" +
    "        <div class=\"{{i.css}}\">\n" +
    "          <span class=\"codePostal col-md-2\">{{i.codePostal}}</span> \n" +
    "          <span class=\"col-md-1\">\n" +
    "            <i ng-show=\"{{i.rurale}}\" class=\"fa fa-tree text-success \"></i>\n" +
    "            <i ng-show=\"{{i.dateDel}}\" class=\"fa fa-times-circle text-danger\"></i>\n" +
    "          </span> \n" +
    "          <span class=\"name col-md-5\">{{i.beautifullName}}</span> \n" +
    "          <span class=\"date col-md-4\">\n" +
    "            {{i.date | date : 'dd/MM/yy'}}\n" +
    "            <span ng-show=\"{{i.dateDel}}\"> <i class=\"fa fa-arrow-circle-right\"></i> <span class=\"date\">{{i.dateDel | date: 'dd/MM/yy'}}</span></span>\n" +
    "          </span>\n" +
    "        </div>\n" +
    "      </a>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("departements/departements.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("departements/departements.tpl.html",
    "<div class=\"row\">\n" +
    "  <h1 class=\"page-header\">\n" +
    "    Liste des départements\n" +
    "  </h1>\n" +
    "  <div class=\"list container\" when-scrolled=\"loadMore()\">\n" +
    "    <div class=\"departement row\" ng-repeat=\"i in items\">\n" +
    "      <a href ng-click=\"click(i.departement);\">\n" +
    "        <span class=\"departement col-md-2\">{{i.departement}}</span>\n" +
    "        <span class\"name col-md-6\">{{i.name}}</span>\n" +
    "      </a>\n" +
    "    </div>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("detail/detail.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("detail/detail.tpl.html",
    "<div class=\"row\">\n" +
    "  \n" +
    "  <div class=\"jumbo\">\n" +
    "    <h1 class=\"page-header no-print\">\n" +
    "      Détail {{head_subtext}}\n" +
    "    </h1>\n" +
    "    <div class=\"voie\">\n" +
    "      <div>\n" +
    "        <p class=\"no-print\">\n" +
    "          <span class=\"name\">{{voie.beautifullName}}</span> est référencées sous la référence FANTOIR <span class=\"FANTOIR\">{{voie.id}}</span>.\n" +
    "          <span ng-show=\"{{voie.natureVoie == 'Lieu dit' || i.natureVoie == 'Ensemble immobilier'}}\"> est un {{voie.natureVoie}}.</span>\n" +
    "          <span ng-show=\"{{i.natureVoie == 'Cité ' || i.natureVoie == 'Voie provisoire '}}\"> est une {{voie.natureVoie}}.</span>\n" +
    "        </p>\n" +
    "        <p class=\"no-print\">\n" +
    "          <span class = \"date\">{{voie.beautifullName}} existe depuis le {{voie.date | date : 'EEEE d MMMM y'}}<span ng-show=\"!voie.dateDel\">.</span><span ng-show=\"voie.dateDel\"> et à été supprimé le {{voie.dateDel | date : 'EEEE d MMMM y'}}.</span></span>\n" +
    "        </p>\n" +
    "        <p class=\"print\">\n" +
    "          <span ng-show=\"voie.commune\" class=\"name\">{{voie.beautifullName}}</span>\n" +
    "          <span ng-show=\"voie.commune\"> est sur la commune de {{voie.commune.beautifullName}}</span>\n" +
    "          <span ng-show=\"voie.commune.codePostal\"> ({{voie.commune.codePostal}})</span><span ng-show=\"voie.commune\">.</span>\n" +
    "        </p>\n" +
    "        <p >\n" +
    "          <a ng-show=\"cadastre\" target=\"_blank\" class=\"btn btn-info no-print\"href=\"{{cadastre}}\">\n" +
    "          Visualiser sur le Cadastre.\n" +
    "          </a>\n" +
    "          <a ng-show=\"osmLink\" target=\"_blank\" class=\"btn btn-success no-print\"href=\"{{osmLink}}\">\n" +
    "            Visualiser sur OpenStreetMap\n" +
    "          </a>\n" +
    "          \n" +
    "        </p>\n" +
    "      </div>\n" +
    "    </div> \n" +
    "\n" +
    "  </div>\n" +
    "  <div class =\"map print\" ng-show=\"havePlan\"><leaflet bounds=\"bounds\" center=\"center\" defaults=\"defaults\"></leaflet></div>\n" +
    "  <p ng-show=\"havePlan\" id=\"coordonnes\" class=\"print-only text-right\">\n" +
    "    Coordonnées GPS du centre de la carte Lat: {{center.lat}}, Lon: {{center.lng}}\n" +
    "  </p>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("edit/edit.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("edit/edit.tpl.html",
    "    <div class=\"row\">\n" +
    "  \n" +
    "  <div class=\"jumbo\">\n" +
    "    <h1 class=\"page-header\">\n" +
    "      Edition {{head_subtext}}\n" +
    "    </h1>\n" +
    "    <div class=\"voie\">\n" +
    "      <div>\n" +
    "        <p>\n" +
    "          <a href=\"#\" editable-select=\"voie.natureVoie\" onbeforesave=\"update({field:'natureVoie',value:$data});\" e-ng-options=\"v for v in typeVoies\">\n" +
    "            {{ voie.natureVoie || \"vide\"  }}\n" +
    "          </a>\n" +
    "          <a href=\"#\" editable-text=\"voie.fullClean\" onbeforesave=\"update({field:'fullClean',value:$data});\" class=\"name\">{{ voie.fullClean || \"vide\" }}</a>\n" +
    "          <a href=\"#\" ng-show=\"voie.natureVoie === 'Lieu dit'\" onbeforesave=\"update({field:'bati',value:$data});\" editable-checkbox=\"voie.bati\" e-title=\"BATI?\">\n" +
    "            {{ voie.bati && \"Il y a des bâtiments\" || \"Il n'y a pas de bâtiments\" }}\n" +
    "          </a>\n" +
    "        </p>\n" +
    "        <p>\n" +
    "          <span class = \"date\">{{voie.fullClean}} existe depuis le {{voie.date}}<span ng-show=\"!voie.dateDel\">.</span><span ng-show=\"voie.dateDel\"> et à été supprimé le {{voie.dateDel}}.</span></span>\n" +
    "          \n" +
    "          \n" +
    "        </p>\n" +
    "        <p>\n" +
    "          <span ng-show=\"voie.commune\" class=\"name\">{{voie.fullClean}}</span>\n" +
    "          <span ng-show=\"voie.commune\"> est sur la commune de {{voie.commune.fullClean}}</span>\n" +
    "          <span ng-show=\"voie.commune.codePostal\"> ({{voie.commune.codePostal}})</span>\n" +
    "          <span ng-show=\"voie.commune\">.</span>\n" +
    "        </p>\n" +
    "        <p ng-show=\"cadastre\">\n" +
    "          <a href=\"{{cadastre}}\">\n" +
    "          Visualiser <span ng-show=\"voie.commune\" class=\"name\">{{voie.fullClean}}</span> sur le Cadastre.\n" +
    "          </a>\n" +
    "        </p>\n" +
    "        <!--\n" +
    "        <span class=\"col-md-2  {{i.css}}\">\n" +
    "          <i ng-show=\"{{i.bati}}\" class=\"fa fa-home text-success \"></i>\n" +
    "          <i ng-show=\"{{i.natureVoie == 'Lieu dit'}}\" class=\"fa fa-map-marker text-warning \"></i>\n" +
    "          <i ng-show=\"{{i.dateDel}}\" class=\"fa fa-times-circle text-danger\"></i>\n" +
    "          <i ng-show=\"{{i.natureVoie == 'Voie provisoire'}}\" class=\"fa fa-eye-slash text-danger \"></i>\n" +
    "          <i ng-show=\"{{i.natureVoie == 'Ensemble immobilier' || i.natureVoie == 'Cité '}}\" class=\"fa fa-building text-info \"></i>\n" +
    "          \n" +
    "        </span> \n" +
    "        <span class=\"name col-md-8 {{i.css}}\">{{i.beautifullName}}</span> \n" +
    "        <span class=\"date col-md-2 {{i.css}}\">{{i.date}}</span>\n" +
    "        !-->\n" +
    "      </div>\n" +
    "    </div> \n" +
    "  </div>\n" +
    "  <div class =\"map\"  ng-show=\"havePlan\"><leaflet maxbounds=\"maxbounds\" defaults=\"defaults\"></leaflet></div>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("home/home.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("home/home.tpl.html",
    "<div class=\"jumbotron\">\n" +
    "  <h1>Non-Trivial AngularJS Made Easy</h1>\n" +
    "\n" +
    "  <p class=\"lead\">\n" +
    "    Everything you need to kickstart AngularJS projects: a best-practice\n" +
    "    directory structure, an intelligent build system, and the best web design\n" +
    "    libraries around.\n" +
    "  </p>\n" +
    "\n" +
    "  <ul class=\"list-inline social-buttons\">\n" +
    "    <li>\n" +
    "      <iframe \n" +
    "        src=\"http://ghbtns.com/github-btn.html?user=ngbp&amp;repo=ngbp&amp;type=watch&amp;count=true\" \n" +
    "        allowtransparency=\"true\" \n" +
    "        frameborder=\"0\" \n" +
    "        scrolling=\"0\" \n" +
    "        width=\"110\" \n" +
    "        height=\"20\">\n" +
    "      </iframe>\n" +
    "    </li>\n" +
    "    <li>\n" +
    "      <iframe \n" +
    "        src=\"http://ghbtns.com/github-btn.html?user=ngbp&amp;repo=ngbp&amp;type=fork&amp;count=true\" \n" +
    "        allowtransparency=\"true\" \n" +
    "        frameborder=\"0\" \n" +
    "        scrolling=\"0\" \n" +
    "        width=\"95\" \n" +
    "        height=\"20\">\n" +
    "      </iframe>\n" +
    "    </li>\n" +
    "    <li>\n" +
    "       <iframe allowtransparency=\"true\" frameborder=\"0\" scrolling=\"no\"\n" +
    "        src=\"https://platform.twitter.com/widgets/tweet_button.html?url=http%3A%2F%2Fbit.ly%2FngBoilerplate&counturl=http%3A%2F%2Fngbp.github.com%2Fngbp&text=Check%20out%20%23ngbp%20-%20an%20awesome%20kickstarter%20for%20web%20projects%20%7C&hashtags=angularjs&via=joshdmiller&related=joshdmiller\"\n" +
    "        style=\"width:130px; height:20px;\"></iframe>\n" +
    "    </li>\n" +
    "    <li plus-one></li>\n" +
    "  </ul> \n" +
    "  \n" +
    "  <div class=\"btn-group\">\n" +
    "    <a href=\"https://github.com/ngbp/ngbp#readme\" class=\"btn btn-large btn-default\">\n" +
    "      <i class=\"fa fa-book\"></i>\n" +
    "      Read the Docs\n" +
    "    </a>\n" +
    "    <a href=\"https://github.com/ngbp/ngbp\" class=\"btn btn-large btn-success\">\n" +
    "      <i class=\"fa fa-download\"></i>\n" +
    "      Download\n" +
    "    </a>\n" +
    "  </div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"marketing\">\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-xs-12 col-sm-6 col-md-4\">\n" +
    "      <h4><i class=\"fa fa-thumbs-up\"></i> Good to Go!</h4>\n" +
    "      <p>\n" +
    "        Kickstarts your project quickly, with everything you need, so you can \n" +
    "        focus on what matters: your app.\n" +
    "      </p>\n" +
    "    </div>\n" +
    "    <div class=\"col-xs-12 col-sm-6 col-md-4\">\n" +
    "      <h4><i class=\"fa fa-magic\"></i> Complete Build System</h4>\n" +
    "      <p>\n" +
    "        A smart, <a href=\"http://gruntjs.com\">Grunt</a>-based build system \n" +
    "        designed to save you time and energy.\n" +
    "      </p>\n" +
    "    </div>\n" +
    "    <div class=\"col-xs-12 col-sm-6 col-md-4\">\n" +
    "      <h4><i class=\"fa fa-retweet\"></i> Modularization</h4>\n" +
    "      <p>\n" +
    "        Supports a structure that maintains separation of concerns while\n" +
    "        ensuring maximum code reuse.\n" +
    "      </p>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-xs-12 col-sm-6 col-md-4\">\n" +
    "      <h4><i class=\"fa fa-star\"></i> AngularJS</h4>\n" +
    "      <p>\n" +
    "        JavaScript framework that augments browser-based, single-page \n" +
    "        applications with MVC functionality.\n" +
    "        <a href=\"http://angularjs.org\">More &raquo;</a>\n" +
    "      </p>\n" +
    "    </div>\n" +
    "    <div class=\"col-xs-12 col-sm-6 col-md-4\">\n" +
    "      <h4><i class=\"fa fa-resize-small\"></i> LESS CSS</h4>\n" +
    "      <p>\n" +
    "        The dynamic stylesheet language that extends CSS with efficiency.\n" +
    "        <a href=\"http://lesscss.org\">More &raquo;</a>\n" +
    "      </p>\n" +
    "    </div>\n" +
    "    <div class=\"col-xs-12 col-sm-6 col-md-4\">\n" +
    "      <h4><i class=\"fa fa-twitter\"></i> Twitter Bootstrap</h4>\n" +
    "      <p>\n" +
    "        Sleek, intuitive, and powerful front-end framework for faster and easier\n" +
    "        web development.\n" +
    "        <a href=\"http://getbootstrap.com\">More &raquo;</a>\n" +
    "      </p>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-xs-12 col-sm-6 col-md-4\">\n" +
    "      <h4><i class=\"fa fa-circle\"></i> Angular UI Bootstrap</h4>\n" +
    "      <p>\n" +
    "        Pure AngularJS components for Bootstrap written by the \n" +
    "        <a href=\"https://github.com/angular-ui?tab=members\">AngularUI Team</a>.\n" +
    "        <a href=\"http://angular-ui.github.com/bootstrap\">More &raquo;</a>\n" +
    "      </p>\n" +
    "    </div>\n" +
    "    <div class=\"col-xs-12 col-sm-6 col-md-4\">\n" +
    "      <h4><i class=\"fa fa-flag\"></i> Font Awesome</h4>\n" +
    "      <p>\n" +
    "        The iconic font designed for use with Twitter Bootstrap.\n" +
    "        <a href=\"http://fortawesome.github.com/Font-Awesome\">\n" +
    "          More &raquo;\n" +
    "        </a>\n" +
    "      </p>\n" +
    "    </div>\n" +
    "    <div class=\"col-xs-12 col-sm-6 col-md-4\">\n" +
    "      <h4><i class=\"fa fa-asterisk\"></i> Placeholders</h4>\n" +
    "      <p>\n" +
    "        Client-side image and text placeholder directives written in pure \n" +
    "        AngularJS to make designing mock-ups wicked-fast.\n" +
    "        <a href=\"http://joshdmiller.github.com/angular-placeholders\">\n" +
    "          More &raquo;\n" +
    "        </a>\n" +
    "      </p>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("map/map.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("map/map.tpl.html",
    "<div class=\"row\">\n" +
    "  \n" +
    "  <div class=\"jumbo\">\n" +
    "    <h1 class=\"page-header\">\n" +
    "      Détail {{head_subtext}}\n" +
    "    </h1>\n" +
    "    <div class=\"voie\">\n" +
    "      <div>\n" +
    "        <p>\n" +
    "          <span class=\"name\">{{voie.beautifullName}}</span> est référencées sous la référence FANTOIR <span class=\"FANTOIR\">{{voie.id}}</span>.\n" +
    "          <span ng-show=\"{{voie.natureVoie == 'Lieu dit' || i.natureVoie == 'Ensemble immobilier'}}\"> est un {{voie.natureVoie}}.</span>\n" +
    "          <span ng-show=\"{{i.natureVoie == 'Cité ' || i.natureVoie == 'Voie provisoire '}}\"> est une {{voie.natureVoie}}.</span>\n" +
    "        </p>\n" +
    "        <p>\n" +
    "          <span class = \"date\">{{voie.beautifullName}} existe depuis le {{voie.date}}<span ng-show=\"!voie.dateDel\">.</span><span ng-show=\"voie.dateDel\"> et à été supprimé le {{voie.dateDel}}.</span></span>\n" +
    "        </p>\n" +
    "        <p>\n" +
    "          <span ng-show=\"voie.commune\" class=\"name\">{{voie.beautifullName}}</span>\n" +
    "          <span ng-show=\"voie.commune\"> est sur la commune de {{voie.commune.beautifullName}}</span>\n" +
    "          <span ng-show=\"voie.commune.codePostal\"> ({{voie.commune.codePostal}})</span><span ng-show=\"voie.commune\">.</span>\n" +
    "        </p>\n" +
    "        <p ng-show=\"cadastre\">\n" +
    "          <a target=\"_blank\" href=\"{{cadastre}}\">\n" +
    "          Visualiser <span ng-show=\"voie.commune\" class=\"name\">{{voie.beautifullName}}</span> sur le Cadastre.\n" +
    "          </a>\n" +
    "        </p>\n" +
    "        <!--\n" +
    "        <span class=\"col-md-2  {{i.css}}\">\n" +
    "          <i ng-show=\"{{i.bati}}\" class=\"fa fa-home text-success \"></i>\n" +
    "          <i ng-show=\"{{i.natureVoie == 'Lieu dit'}}\" class=\"fa fa-map-marker text-warning \"></i>\n" +
    "          <i ng-show=\"{{i.dateDel}}\" class=\"fa fa-times-circle text-danger\"></i>\n" +
    "          <i ng-show=\"{{i.natureVoie == 'Voie provisoire'}}\" class=\"fa fa-eye-slash text-danger \"></i>\n" +
    "          <i ng-show=\"{{i.natureVoie == 'Ensemble immobilier' || i.natureVoie == 'Cité '}}\" class=\"fa fa-building text-info \"></i>\n" +
    "          \n" +
    "        </span> \n" +
    "        <span class=\"name col-md-8 {{i.css}}\">{{i.beautifullName}}</span> \n" +
    "        <span class=\"date col-md-2 {{i.css}}\">{{i.date}}</span>\n" +
    "        !-->\n" +
    "      </div>\n" +
    "    </div> \n" +
    "  </div>\n" +
    "  <div class =\"map\"  ng-show=\"havePlan\"><leaflet maxbounds=\"maxbounds\" defaults=\"defaults\"></leaflet></div>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("recherche/recherche.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("recherche/recherche.tpl.html",
    "<div class=\"row\">\n" +
    "  <div ng-show=\"!resultat\" class=\"recherche\">\n" +
    "    <h1 class=\"page-header\">\n" +
    "      Recherche\n" +
    "    </h1>\n" +
    "    <form ng-show=\"!avance\" ng-submit=\"cherche()\" name=\"recherche\">\n" +
    "      <div class=\"row\">\n" +
    "        <div ng-class=\"{'has-error' : recherche.voie.$invalid}\" class=\"form-group col-sm-12 \" >\n" +
    "          <label class=\"\" for=\"voie\">Nom de la voie:</label>\n" +
    "          <input class=\"form-control\" type=\"text\" placeholder=\"\" ng-model=\"voie\" name=\"voie\" ng-minlength=\"3\" >\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div class=\"row\">\n" +
    "        <div class=\"form-group col-sm-4\">\n" +
    "            <label class=\"\" for=\"cp\">Code Postal :</label>\n" +
    "            <input class=\"form-control\" type=\"text\" name=\"cp\" ng-model=\"cp\" placeholder=\"00000\" ng-change=\"getCommune()\">\n" +
    "        </div>\n" +
    "        <div class=\"form-group col-sm-8\">  \n" +
    "            <label class=\"\" for=\"commune\">Commune :</label>\n" +
    "            <input class=\"form-control\" type=\"text\" name=\"commune\" ng-model=\"commune\" placeholder=\"\" >\n" +
    "            <ul class=\"animate-repeat-container\" ng-show=\"communes.length != 0\">\n" +
    "              <li ng-repeat=\"item in communes\" class=\"animate-repeat searchCommune\" ng-click=\"changeCommune(item)\">{{item}}</li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "        \n" +
    "      </div>\n" +
    "     \n" +
    "      <div class=\"row\">\n" +
    "        <!--\n" +
    "        <button class=\"btn btn-info btn-lg\" ng-class=\"{avance : active}\" ng-click=\"avance=!avance\">\n" +
    "          Recherche avancée\n" +
    "        </button> \n" +
    "        !-->\n" +
    "        <button class=\"btn btn-primary btn-lg\" type=\"submit\" ng-click=\"cherche()\">\n" +
    "          Rechercher!\n" +
    "        </button>\n" +
    "      </div>\n" +
    "    </form>\n" +
    "  </div>\n" +
    "  <div class=\"resultats\" ng-show=\"resultat\">\n" +
    "    <h1 class=\"page-header\">\n" +
    "      Resultats : \n" +
    "    </h1>\n" +
    "    <div class=\"jumbotron\" ng-show=\"list.length == 0 && wait === false\">\n" +
    "      <p>\n" +
    "        Pas de résultats.<i class=\"fa  fa-frown-o\"></i>\n" +
    "      </p>\n" +
    "    </div>\n" +
    "    <div class=\"jumbotron\" ng-show=\"list.length == 0 && wait === true\">\n" +
    "      <p>\n" +
    "        <i class=\"fa  fa-refresh\"></i> Recherche en cour.\n" +
    "      </p>\n" +
    "    </div>\n" +
    "    <div ng-show=\"list.length != 0\" class=\"jumbotron\">\n" +
    "      <div class=\"list container \" when-scrolled=\"loadMore()\">\n" +
    "        <div class=\"voie row\" ng-repeat=\"i in list\" ng-class=\"{'strike' : i.dateDel  }\">\n" +
    "          <a href ui-sref=\"detail({'id':i.id})\" >\n" +
    "            <span class=\"col-md-1  {{i.css}}\">\n" +
    "              <i ng-show=\"{{i.bati}}\" class=\"fa fa-home text-success \"></i>\n" +
    "              <i ng-show=\"{{i.natureVoie == 'Lieu dit'}}\" class=\"fa fa-map-marker text-warning \"></i>\n" +
    "              <i ng-show=\"{{i.dateDel}}\" class=\"fa fa-times-circle text-danger\"></i>\n" +
    "              <i ng-show=\"{{i.natureVoie == 'Voie provisoire'}}\" class=\"fa fa-eye-slash text-danger \"></i>\n" +
    "              <i ng-show=\"{{i.natureVoie == 'Ensemble immobilier' || i.natureVoie == 'Cité '}}\" class=\"fa fa-building text-info \"></i>\n" +
    "              \n" +
    "            </span> \n" +
    "            <span class=\"name col-md-6 {{i.css}}\">{{i.beautifullName}}</span>\n" +
    "            <span class=\"codePostal col-md-1 {{i.css}}\">{{i.commune.codePostal}}</span>\n" +
    "            <span class=\"date col-md-4 {{i.css}}\">{{i.commune.beautifullName}}</span>\n" +
    "          </a>\n" +
    "        </div> \n" +
    "      </div>\n" +
    "      <button class=\"btn btn-info right\"ng-click=\"resultat = !resultat\">Nouvelle recherche</button>\n" +
    "\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>");
}]);

angular.module("voies/voies.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("voies/voies.tpl.html",
    "<div class=\"row\">\n" +
    "  <h1 class=\"page-header\">\n" +
    "    Liste des voies {{head_subtext}}\n" +
    "  </h1>\n" +
    "  <div class=\"list container\" when-scrolled=\"loadMore()\">\n" +
    "    <div class=\"voie row\" ng-repeat=\"i in items\" ng-class=\"{'strike' : i.dateDel  }\">\n" +
    "      <a href ui-sref=\"detail({'id':i.id})\" >\n" +
    "        <span class=\"col-md-2\" >\n" +
    "          <i ng-show=\"{{i.bati}}\" class=\"fa fa-home text-success\" ></i>\n" +
    "          <i ng-show=\"{{i.natureVoie == 'Lieu dit'}}\" class=\"fa fa-map-marker text-warning \"></i>\n" +
    "          <i ng-show=\"{{i.dateDel}}\" class=\"fa fa-times-circle text-danger\"></i>\n" +
    "          <i ng-show=\"{{i.natureVoie == 'Voie provisoire'}}\" class=\"fa fa-eye-slash text-danger \"></i>\n" +
    "          <i ng-show=\"{{i.natureVoie == 'Ensemble immobilier' || i.natureVoie == 'Cité '}}\" class=\"fa fa-building text-info \"></i>\n" +
    "          \n" +
    "        </span> \n" +
    "        <span class=\"name col-md-7\" >\n" +
    "          {{i.beautifullName}}\n" +
    "        </span> \n" +
    "        <span class=\"date col-md-3\">\n" +
    "          {{i.date  | date : 'dd/MM/yy'}}\n" +
    "          <span ng-show=\"{{i.dateDel}}\"><i class=\"fa fa-arrow-circle-right\"></i> <span class=\"date\">{{i.dateDel | date : 'dd/MM/yy'}}</span></span>\n" +
    "        </span>\n" +
    "      </div>\n" +
    "    </div> \n" +
    "  </div>\n" +
    "  <i ng-show=\"wait\" class=\"fa fa-refresh\"></i>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);
