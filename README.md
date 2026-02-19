# ✈️ Aéroport - Frontend React

Interface utilisateur React pour le système de gestion aéroportuaire. Consomme l'API Gateway Spring Boot.

## Stack technique

- **React 18** (Create React App)
- **Material UI (MUI)** — composants et thème
- **React Router v6** — navigation SPA
- **Axios** — appels API avec interceptors
- **JWT** — authentification côté client

---

## Structure du projet

```
src/
├── components/
│   ├── Navbar.jsx              # Barre de navigation (AppBar MUI)
│   ├── ProtectedRoute.jsx      # Guard : redirige vers /login si non connecté
│   ├── AdminRoute.jsx          # Guard : redirige si non admin
│   └── ReservationCard.jsx     # Card réservation avec infos vol
├── context/
│   ├── AuthContext.jsx          # État utilisateur + login/register/logout
│   └── SnackbarContext.jsx      # Notifications toast (succès/erreur)
├── pages/
│   ├── Login.jsx                # Formulaire de connexion
│   ├── Register.jsx             # Formulaire d'inscription
│   ├── Vols.jsx                 # Liste des vols (filtres, cards style aérien)
│   ├── VolDetails.jsx           # Détails vol + réservation + admin (modifier/statut)
│   ├── UserReservations.jsx     # Mes réservations (payer/annuler)
│   ├── UserNotifications.jsx    # Mes notifications (marquer lue/supprimer)
│   ├── PaiementSuccess.jsx      # Page confirmation après paiement Stripe
│   ├── PaiementCancel.jsx       # Page annulation paiement Stripe
│   ├── AdminVols.jsx            # CRUD admin des vols
│   └── VolReservations.jsx      # Admin : réservations d'un vol
├── services/
│   ├── api.js                   # Instance Axios + interceptors (token, 401)
│   ├── authService.js           # login, register, logout
│   ├── volService.js            # CRUD vols + statut + places + destination
│   ├── reservationService.js    # CRUD réservations + par passager/vol
│   ├── notificationService.js   # CRUD notifications + par passager/vol
│   └── paiementService.js       # Paiement Stripe (créer, consulter, rembourser)
└── App.jsx                      # Routes + providers
```

---

## Routing

Routing Public, protected, et Admin dans App.jsx

## Authentification

### AuthContext

Gère l'état utilisateur avec `createContext`. Le token JWT est stocké dans `localStorage` et décodé au chargement de l'app via `atob()`.

```
Token JWT → decode payload → { id (sub), email, role }
```

**Fonctions exposées :** `user`, `loading`, `handleLogin`, `handleRegister`, `handleLogout`

### Interceptors (api.js)

- **Request** : Ajoute automatiquement le header `Authorization: Bearer <token>` à chaque requête
- **Response** : Si erreur 401, supprime le token et redirige vers `/login`

### Guards

- `ProtectedRoute` : vérifie `user` → sinon `/login`
- `AdminRoute` : vérifie `user.role === 'ADMIN'` → sinon `/`

---

## Pages

### Vols (publique)

Page d'accueil avec la liste des vols sous forme de cards stylisées :
- Header bleu avec compagnie, numéro de vol, statut (chip coloré)
- Trajet : origine → destination avec icônes avion et heures
- Date et prix
- Filtres par origine et destination (Select MUI)
- Compteur de vols affichés
- Bouton "Créer un vol" visible uniquement pour les admins

### VolDetails (publique)

Détails complets d'un vol avec actions contextuelles :
- Informations du vol (compagnie, trajet, dates, places, prix, statut)
- **Passager connecté** : bouton Réserver → Dialog avec choix du nombre de places
- **Admin** : boutons Modifier (Dialog formulaire), Changer statut (Select), Voir réservations (Dialog table)

### Login / Register

Formulaires MUI (TextField, Button, Box). Redirection vers `/` après login, vers `/login` après register. Redirection automatique si déjà connecté.

### UserReservations (protégée)

Liste des réservations du passager connecté avec :
- Infos du vol associé (récupéré via `fetchVolById`)
- Statut de la réservation (EN_ATTENTE, CONFIRMEE, ANNULEE)
- Bouton Payer (redirige vers Stripe Checkout) / Annuler

### PaiementSuccess / PaiementCancel (protégées)

Pages de retour après paiement Stripe :
- **Success** : confirmation de paiement réussi, lien vers les réservations
- **Cancel** : paiement annulé, lien vers les réservations

### UserNotifications (protégée)

Liste des notifications du passager avec :
- Infos du vol associé
- Marquer comme lue / Supprimer
- Badge de notification dans la Navbar

### AdminVols (admin)

CRUD complet des vols avec table ou cards. Création et modification via Dialog.

### VolReservations (admin)

Liste des réservations pour un vol spécifique (table MUI).

---

## Services API

Tous les services utilisent l'instance Axios centralisée (`api.js`) qui pointe vers le Gateway.

### api.js

```javascript
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,   // http://localhost:8080
  headers: { 'Content-Type': 'application/json' }
});
```

### Endpoints consommés

**authService.js**
| Fonction | Méthode | URL |
|----------|---------|-----|
| `login` | POST | `/auth/login` |
| `register` | POST | `/auth/register` |
| `logout` | — | localStorage.removeItem |

**volService.js**
| Fonction | Méthode | URL |
|----------|---------|-----|
| `fetchVols` | GET | `/vols` |
| `fetchVolById` | GET | `/vols/{id}` |
| `createVol` | POST | `/vols` |
| `editVol` | PUT | `/vols/{id}` |
| `deleteVol` | DELETE | `/vols/{id}` |
| `fetchPlacesDisponibles` | GET | `/vols/{id}/places-disponibles` |
| `updateStatutVol` | PUT | `/vols/{id}/statut` |
| `fetchVolsByDestination` | GET | `/vols/destination/{dest}` |

**reservationService.js**
| Fonction | Méthode | URL |
|----------|---------|-----|
| `createReservation` | POST | `/reservations` |
| `fetchReservationById` | GET | `/reservations/{id}` |
| `annulerReservation` | PUT | `/reservations/{id}/annuler` |
| `confirmReservation` | PUT | `/reservations/{id}/confirmer` |
| `fetchReservationsByPassager` | GET | `/reservations/passager/{id}` |
| `fetchByVolId` | GET | `/reservations/vol/{volId}` |

**notificationService.js**
| Fonction | Méthode | URL |
|----------|---------|-----|
| `createNotification` | POST | `/notifications` |
| `fetchNotificationsByPassager` | GET | `/notifications/passager/{id}` |
| `markAsRead` | PUT | `/notifications/{id}/lue` |
| `deleteNotification` | DELETE | `/notifications/{id}` |
| `fetchNotificationsByVol` | GET | `/notifications/vol/{volId}` |

**paiementService.js** (microservice paiement — port 8085)
| Fonction | Méthode | URL |
|----------|---------|-----|
| `creerPaiement` | POST | `/paiements?reservationId&passagerId&montant` |
| `getPaiementByReservation` | GET | `/paiements/reservation/{reservationId}` |
| `rembourserPaiement` | POST | `/paiements/{id}/rembourser` |

---

## Notifications (SnackbarContext)

Système de toast global utilisant `Snackbar` + `Alert` de MUI. Accessible partout via `useContext(SnackbarContext)`.

```jsx
const { showSnackbar } = useContext(SnackbarContext);
showSnackbar("Réservation confirmée", "success");
showSnackbar("Erreur lors de la suppression", "error");
```

---

## Lancement

### Prérequis

- Node.js 18+
- Backend Spring Boot lancé (Gateway sur port 8080)
- Microservice paiement lancé (port 8085) — routé via le gateway

### Installation

```bash
cd aeroport-react
npm install
```

<!-- ### Configuration

Créer `.env` à la racine :

```
REACT_APP_API_URL=http://localhost:8080
``` -->

### Démarrage

```bash
npm start
```

L'app tourne sur `http://localhost:3000`.

---

## Design

- **Material UI** avec thème custom (Feature à améliorer)
- Cards de vol style billet d'avion (header bleu gradient, trajet avec icônes, prix)
- Dialogs pour les formulaires (réservation, modification, création)
- Chips colorés selon le statut (vert: à l'heure, orange: retardé, rouge: annulé)
- Navbar conditionnelle (login/register ou email/logout selon l'état d'auth)
- Snackbar pour les feedbacks utilisateur
