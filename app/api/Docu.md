# ENDPOINTS 

## Auth

### `/api/auth/[...nextauth]`
- **Method**: POST
- **Description**: Gère l'authentification via NextAuth.
- **Arguments**: 
  - `user`: Objet utilisateur contenant les informations nécessaires pour l'authentification.

## User

### `/api/user/createUser`
- **Method**: POST
- **Description**: Crée un nouvel utilisateur.
- **Arguments**: 
  - `name`: string
  - `email`: string
  - `password`: string
  - `imageprofil`: string

### `/api/user/getUser`
- **Method**: GET
- **Description**: Récupère les informations d'un utilisateur connecté.
- **Arguments**: Aucun

## Festivals

### `/api/getfestivals`
- **Method**: POST
- **Description**: Récupère la liste des festivals.
- **Arguments**: 
  - `image`: string (dans le corps de la requête)

### `/api/getfestivalsmap`
- **Method**: GET
- **Description**: Récupère la carte des festivals.
- **Arguments**: Aucun