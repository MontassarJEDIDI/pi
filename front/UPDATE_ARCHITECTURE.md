# Refonte Architecture Frontend - PediaNephro

## 1. Nouvelle Structure des Dossiers
Nous avons migré vers une architecture modulaire et scalable, suivant les meilleures pratiques Angular (Standalone Components, Lazy Loading).

```
src/app/
├── core/               # Singletons (Services globaux, Guards, Interceptors)
│   ├── guards/         # AuthGuard, RoleGuard
│   ├── interceptors/   # HttpInterceptor
│   ├── models/         # Modèles globaux
│   └── services/       # Services partagés (AuthService, etc.)
├── features/           # Modules fonctionnels (Lazy Loaded)
│   ├── subscriptions/  # Gestion des abonnements (Module Prioritaire)
│   │   ├── components/ # Composants UI spécifiques
│   │   ├── models/     # Modèles spécifiques
│   │   ├── pages/      # Pages (Smart Components)
│   │   ├── services/   # Services spécifiques
│   │   └── subscriptions.routes.ts # Routing local
│   └── ... (dashboard, patients, etc.)
├── layouts/            # Layouts globaux
│   └── main-layout/    # Sidenav + Toolbar (Material Design)
├── shared/             # Composants réutilisables
│   ├── components/     # UI Kits (Cards, Dialogs)
│   └── pipes/          # Pipes utilitaires
└── app.routes.ts       # Routing principal (Lazy Loading global)
```

## 2. Changements Majeurs
- **Lazy Loading** : Toutes les features sont chargées à la demande pour optimiser les performances initiales.
- **Standalone Components** : Suppression des NgModules complexes.
- **Angular Material** : Intégration complète pour une UI médicale professionnelle.
- **Role-Based Access Control** : Ajout de `RoleGuard` pour sécuriser les routes sensibles.

## 3. Module Abonnements (Focus)
- **Modèle de données** : `Subscription`, `SubscriptionPlan` avec gestion des statuts (ACTIVE, EXPIRED, PENDING).
- **Liste** : Table triable, filtrable et paginée avec statuts visuels.
- **Détail** : Vue détaillée avec informations de paiement et fonctionnalités du plan.
- **Service** : Mock API prêt à être connecté au Backend Spring Boot.

## 4. Prochaines Étapes
1. Migrer les anciens composants de `src/app/pages/` vers `src/app/features/`.
2. Connecter `SubscriptionService` aux API réelles via `HttpClient`.
3. Implémenter l'authentification réelle dans `AuthService`.
