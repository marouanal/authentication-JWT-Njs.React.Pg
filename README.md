après avoir créé la base de données nommée "testapi" et la table "users" contenant id bigint NOT NULL,
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL

Dans ce code backend testé et fonctionnant bien avec Postman et avec un jeton d'authentification JWT, j'ai trois routes : /register où vous avez un formulaire avec les champs nom d'utilisateur, e-mail et mot de passe.

Après avoir envoyé les données JSON via la méthode POST à /register, vous obtenez un jeton d'authentification bearer que vous copiez et collez dans l'en-tête d'autorisation. Ensuite, vous pouvez envoyer une demande POST 
à /login pour pouvoir vous authentifier avec les mêmes identifiants.

Vous pouvez ensuite accéder à la route protégée /profile pour vérifier vos informations de profil actuelles.

naviguez dans le répertoire de projet /répertoire backend-nodejs et exécutez npm install si une erreur se produit, exécutez npm update et npm audit fix --force
puis exécutez le fichier app.js avec la commande : node app.js
