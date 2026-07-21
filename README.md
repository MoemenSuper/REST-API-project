# Task Management REST API

API REST pour gerer des taches avec Express et SQLite.

## Installation

```bash
npm install
```

## Demarrage

```bash
npm run dev
```

Le serveur demarre sur :

```text
http://localhost:3000
```

## Structure du projet

Le projet suit une architecture MVC simple :

```text
config/       Configuration et connexion a la base SQLite
models/       Requetes SQL et acces aux donnees
controllers/  Validation des requetes et reponses HTTP
routes/       Definition des endpoints Express
app.js        Point d'entree de l'application
```

## Base de donnees

La base de donnees est stockee dans `database.sqlite` a la racine du projet.
Le chemin est construit avec :

```js
path.join(__dirname, "..", "database.sqlite")
```

Cela evite d'utiliser un chemin absolu local et permet au projet de fonctionner
sur differentes machines apres clonage.

La colonne `done` est definie en `BOOLEAN`. SQLite accepte ce type comme alias,
mais stocke les valeurs booleennes sous forme de `0` ou `1`. Une contrainte
`CHECK (done IN (0, 1))` garantit que seules ces deux valeurs sont acceptees.

## Endpoints

### GET `/api/tasks`

Recupere toutes les taches.

Exemple :

```bash
GET http://localhost:3000/api/tasks
```

Filtres disponibles :

```bash
GET http://localhost:3000/api/tasks?done=0
GET http://localhost:3000/api/tasks?done=1
```

Tri disponible :

```bash
GET http://localhost:3000/api/tasks?sort=created_at&order=desc
GET http://localhost:3000/api/tasks?sort=title&order=asc
```

### GET `/api/tasks/:id`

Recupere une tache par son identifiant.

Exemple :

```bash
GET http://localhost:3000/api/tasks/1
```

Reponses gerees :

```text
200 : tache trouvee
400 : identifiant invalide
404 : tache inexistante
```

### POST `/api/tasks`

Cree une nouvelle tache.

Exemple :

```bash
POST http://localhost:3000/api/tasks
Content-Type: application/json

{
  "title": "Prepare presentation",
  "description": "Review the API endpoints before the demo."
}
```

Reponses gerees :

```text
201 : tache creee
400 : donnees invalides
500 : erreur serveur
```

### PUT `/api/tasks/:id`

Met a jour une tache existante.

Exemple :

```bash
PUT http://localhost:3000/api/tasks/1
Content-Type: application/json

{
  "title": "Prepare presentation",
  "description": "Review the API endpoints before the demo and update the slides."
}
```

Reponses gerees :

```text
200 : tache mise a jour
400 : identifiant ou donnees invalides
404 : tache inexistante
500 : erreur serveur
```

### DELETE `/api/tasks/:id`

Supprime une tache existante.

Exemple :

```bash
DELETE http://localhost:3000/api/tasks/1
```

Reponses gerees :

```text
200 : tache supprimee
400 : identifiant invalide
404 : tache inexistante
500 : erreur serveur
```

## Tests

Une collection Postman est incluse :

```text
REST API Tasks- Full CRUD.postman_collection.json
```
