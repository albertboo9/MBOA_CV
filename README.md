# MBOA-CV - Plateforme de Génération de CV Professionnels

Une plateforme moderne et payante pour créer des CV professionnels de haute qualité en quelques minutes.

## 🚀 Fonctionnalités

### ✅ Implémenté
- **Authentification Google** avec Firebase Auth
- **Interface utilisateur moderne** avec React.js
- **Formulaire multi-étapes** pour la création de CV
- **Aperçu en temps réel** du CV
- **Sauvegarde automatique** (localStorage + Firestore)
- **Génération PDF haute qualité** avec Puppeteer
- **Système de paiement intégré** (simulé pour démo)
- **Templates de CV professionnels**
- **Interface responsive** pour mobile et desktop
- **Sécurité avancée** (CORS, Helmet, authentification)
- **Validation des données** côté client et serveur

### 🔄 Flux Utilisateur
1. **Connexion** via Google Sign-In
2. **Sélection de template** parmi plusieurs modèles
3. **Remplissage du formulaire** en 9 étapes :
   - Informations personnelles
   - Expériences professionnelles
   - Formation
   - Compétences techniques
   - Langues
   - Centres d'intérêt
   - Projets
   - Sections personnalisées
   - Accroche professionnelle
4. **Aperçu en temps réel** avec validation
5. **Paiement sécurisé** (1250 FCFA)
6. **Téléchargement PDF** haute qualité

## 🛠️ Stack Technologique

### Frontend
- **React.js** 18+ avec hooks
- **React Router** pour la navigation
- **CSS Modules** pour le styling
- **Framer Motion** pour les animations
- **React Icons** pour les icônes
- **Firebase SDK** pour l'authentification

### Backend
- **Node.js** avec Express.js
- **Firebase Admin SDK** pour Firestore
- **Puppeteer** pour la génération PDF
- **JWT** pour l'authentification
- **CORS & Helmet** pour la sécurité

### Base de Données
- **Firebase Firestore** pour les données utilisateurs
- **LocalStorage** pour la sauvegarde temporaire

## 📁 Structure du Projet

```
mboa-cv/
├── client/                 # Application React
│   ├── public/
│   ├── src/
│   │   ├── components/     # Composants réutilisables
│   │   │   ├── CVForm.js
│   │   │   ├── CVPreview.js
│   │   │   ├── PaymentModal.js
│   │   │   └── ...
│   │   ├── pages/          # Pages de l'application
│   │   │   ├── LandingPage.js
│   │   │   ├── CVCreationPage.js
│   │   │   ├── PaymentSuccessPage.js
│   │   │   └── ...
│   │   ├── services/       # Services API
│   │   ├── AuthContext.js  # Contexte d'authentification
│   │   └── App.js
│   └── package.json
├── server/                 # API Backend
│   ├── services/           # Services métier
│   │   ├── pdfGenerator.js
│   │   └── paymentService.js
│   ├── templates/          # Templates HTML pour PDF
│   ├── index.js            # Point d'entrée serveur
│   └── package.json
└── README.md
```

## 🚀 Installation & Démarrage

### Prérequis
- Node.js 16+
- npm ou yarn
- Compte Firebase

### Configuration Firebase
1. Créer un projet Firebase
2. Activer Authentication avec Google Sign-In
3. Activer Firestore Database
4. Créer une clé de service (serviceAccountKey.json)

### Installation

```bash
# Cloner le repository
git clone <repository-url>
cd mboa-cv

# Installer les dépendances serveur
cd server
npm install

# Installer les dépendances client
cd ../client
npm install

# Retour à la racine
cd ..
```

### Configuration
Créer les fichiers `.env` :

**server/.env** :
```env
PORT=5000
CLIENT_URL=http://localhost:3000
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-key-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_CLIENT_ID=your-client-id
```

**client/.env** :
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

### Démarrage

```bash
# Terminal 1: Serveur
cd server
npm start

# Terminal 2: Client
cd client
npm start
```

L'application sera disponible sur :
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 🔒 Sécurité

- **Authentification JWT** avec Firebase
- **Validation des données** côté client et serveur
- **Protection CSRF** avec CORS
- **Headers de sécurité** avec Helmet
- **Validation des webhooks** de paiement
- **Chiffrement SSL** en production

## 💰 Modèle Économique

- **Prix unique**: 1250 FCFA par CV
- **Téléchargements illimités** avec code unique
- **Validité**: 1 an par code de téléchargement
- **Paiement mobile** intégré (Orange Money, MTN Mobile Money)

## 📱 Fonctionnalités Avancées

### Auto-sauvegarde
- Sauvegarde automatique toutes les 10 secondes
- Persistance locale avec localStorage
- Synchronisation avec Firestore

### Templates
- **Moderne**: Design épuré professionnel
- **Classique**: Style traditionnel formel
- **Créatif**: Design original coloré

### Validation
- Validation temps réel des champs
- Messages d'erreur contextuels
- Checklist de complétion

### Responsive Design
- Optimisé pour desktop, tablette et mobile
- Interface adaptative
- Performance optimisée

## 🧪 Tests

```bash
# Tests client
cd client
npm test

# Tests serveur (à implémenter)
cd server
npm test
```

## 🚀 Déploiement

### Production
- **Frontend**: Vercel, Netlify, ou Firebase Hosting
- **Backend**: Heroku, Railway, ou DigitalOcean
- **Base de données**: Firebase Firestore (déjà en production)

### Variables d'environnement production
- Configurer les vraies clés Firebase
- Activer les webhooks de paiement réels
- Configurer le monitoring et les logs

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 📞 Support

Pour toute question ou problème :
- Email: support@mboa-cv.com
- Documentation: [Lien vers la doc]

---

**MBOA-CV** - Créez votre CV professionnel en quelques minutes ! ✨
