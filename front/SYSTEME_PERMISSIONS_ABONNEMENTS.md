# Système de Permissions Basé sur les Abonnements

## Vue d'ensemble

Ce système permet de contrôler l'accès aux fonctionnalités de l'application selon le type d'abonnement souscrit par l'utilisateur.

## Types d'abonnements et leurs permissions

### 🟢 Basique (102 DT/mois)
**Permissions incluses :**
- Consultations limitées
- Accès basique au dossier médical
- Rappels de rendez-vous
- Support par email
- Rapports de base
- Examens de base
- Jusqu'à 50 patients (pour les médecins)

### 🔵 Premium (239 DT/mois) - Recommandé
**Tout du Basique, plus :**
- Consultations illimitées
- Téléconsultation vidéo
- Accès complet au dossier médical
- Support prioritaire
- Accès aux forums médicaux
- Rapports détaillés
- Statistiques avancées
- Analyses médicales avancées
- Patients illimités (pour les médecins)

### 🟠 Pro (435 DT/mois)
**Tout du Premium, plus :**
- Support téléphonique
- Suivi personnalisé
- Accès aux webinaires exclusifs

---

## Architecture du système

### 1. Modèle de permissions (`subscription-permission.model.ts`)

Définit toutes les permissions disponibles et leur attribution par type d'abonnement.

```typescript
enum SubscriptionPermission {
  CONSULTATIONS_LIMITED,
  CONSULTATIONS_UNLIMITED,
  TELECONSULTATION,
  // ... etc
}
```

### 2. Service de permissions (`subscription-permission.service.ts`)

Gère le chargement et la vérification des permissions de l'utilisateur.

**Méthodes principales :**
- `loadUserSubscription()` : Charge l'abonnement actif de l'utilisateur
- `hasPermission(permission)` : Vérifie une permission spécifique
- `hasAnyPermission(permissions[])` : Vérifie au moins une permission
- `hasAllPermissions(permissions[])` : Vérifie toutes les permissions
- `getCurrentPlanName()` : Retourne le nom du plan actuel

### 3. Guards de routes (`subscription-permission.guard.ts`)

Protège les routes selon les permissions requises.

**Guards disponibles :**
- `subscriptionPermissionGuard([permissions])` : Vérifie des permissions spécifiques
- `activeSubscriptionGuard` : Vérifie simplement qu'un abonnement actif existe

### 4. Directive structurelle (`has-permission.directive.ts`)

Affiche/masque des éléments HTML selon les permissions.

---

## Utilisation

### Dans les routes (`app.routes.ts`)

```typescript
import { subscriptionPermissionGuard, activeSubscriptionGuard } from './core/guards/subscription-permission.guard';
import { SubscriptionPermission } from './core/models/subscription-permission.model';

// Route nécessitant un abonnement actif
{
  path: 'consultations',
  loadComponent: () => import('./...'),
  canActivate: [activeSubscriptionGuard]
}

// Route nécessitant une permission spécifique
{
  path: 'forums',
  loadComponent: () => import('./...'),
  canActivate: [subscriptionPermissionGuard([SubscriptionPermission.FORUMS_ACCESS])]
}
```

### Dans les composants TypeScript

```typescript
import { SubscriptionPermissionService } from '@core/services/subscription-permission.service';
import { SubscriptionPermission } from '@core/models/subscription-permission.model';

constructor(private permissionService: SubscriptionPermissionService) {}

ngOnInit() {
  // Charger l'abonnement
  this.permissionService.loadUserSubscription().subscribe();
  
  // Vérifier une permission
  if (this.permissionService.hasPermission(SubscriptionPermission.TELECONSULTATION)) {
    // Afficher le bouton de téléconsultation
  }
}
```

### Dans les templates HTML

```html
<!-- Afficher un élément si l'utilisateur a une permission -->
<div *hasPermission="SubscriptionPermission.TELECONSULTATION">
  <button>Lancer une téléconsultation</button>
</div>

<!-- Afficher si l'utilisateur a au moins une des permissions -->
<div *hasAnyPermission="[SubscriptionPermission.FORUMS_ACCESS, SubscriptionPermission.WEBINARS_ACCESS]">
  Contenu accessible avec Premium ou Pro
</div>

<!-- Afficher si l'utilisateur a toutes les permissions -->
<div *hasAllPermissions="[SubscriptionPermission.CONSULTATIONS_UNLIMITED, SubscriptionPermission.TELECONSULTATION]">
  Contenu accessible uniquement avec Premium ou Pro
</div>
```

### Composant d'affichage du statut

```html
<!-- Afficher les informations de l'abonnement -->
<app-subscription-status></app-subscription-status>
```

---

## Exemples concrets

### Exemple 1 : Page de consultations

**Route protégée :**
```typescript
{
  path: 'consultations',
  loadComponent: () => import('./consultations-patient.component'),
  canActivate: [activeSubscriptionGuard] // Nécessite un abonnement actif
}
```

**Dans le composant :**
```typescript
// Basique : consultations limitées
// Premium/Pro : consultations illimitées
if (this.permissionService.hasPermission(SubscriptionPermission.CONSULTATIONS_UNLIMITED)) {
  // Afficher toutes les consultations
} else {
  // Limiter à X consultations par mois
}
```

### Exemple 2 : Bouton de téléconsultation

**Dans le template :**
```html
<button 
  *hasPermission="SubscriptionPermission.TELECONSULTATION"
  (click)="startTeleconsultation()">
  Téléconsultation vidéo
</button>
```

### Exemple 3 : Accès aux forums

**Route protégée :**
```typescript
{
  path: 'forums',
  canActivate: [subscriptionPermissionGuard([SubscriptionPermission.FORUMS_ACCESS])]
  // Accessible uniquement avec Premium ou Pro
}
```

---

## Flux de fonctionnement

1. **Connexion utilisateur** → `AuthService.login()`
2. **Chargement automatique** → `SubscriptionPermissionService.loadUserSubscription()`
3. **Récupération de l'abonnement actif** depuis l'API
4. **Mise à jour des permissions** selon le plan
5. **Vérification des permissions** lors de l'accès aux routes/composants

---

## Gestion des erreurs

- **Pas d'abonnement actif** → Redirection vers `/patient/abonnement`
- **Permissions insuffisantes** → Redirection vers `/patient/dashboard` avec message
- **Erreur API** → Permissions vides (accès limité)

---

## Points forts par abonnement

### Basique
✅ Idéal pour démarrer  
✅ Accès aux fonctionnalités essentielles  
✅ Support par email

### Premium
✅ Tout du Basique  
✅ Consultations illimitées  
✅ Téléconsultation  
✅ Forums médicaux  
✅ Statistiques avancées

### Pro
✅ Tout du Premium  
✅ Support téléphonique 24/7  
✅ Suivi personnalisé  
✅ Webinaires exclusifs  
✅ Gestionnaire de compte dédié

---

## Notes importantes

- Les permissions sont chargées automatiquement après la connexion
- Les permissions sont mises en cache dans le service
- Un rechargement de page nécessite une nouvelle vérification
- Les permissions sont réinitialisées lors de la déconnexion
