/**
 * Permissions disponibles dans l'application
 * Chaque permission correspond à une fonctionnalité accessible selon l'abonnement
 */
export enum SubscriptionPermission {
  // Modules externes (microservices)
  DOSSIER_MEDICAL_PREVIEW = 'DOSSIER_MEDICAL_PREVIEW',
  DOSSIER_MEDICAL_FULL = 'DOSSIER_MEDICAL_FULL',
  CONSULTATIONS_PREVIEW = 'CONSULTATIONS_PREVIEW',
  CONSULTATIONS_FULL = 'CONSULTATIONS_FULL',
  EVENTS_READ = 'EVENTS_READ',
  EVENTS_INTERACT = 'EVENTS_INTERACT',
  FORUM_READ = 'FORUM_READ',
  FORUM_POST = 'FORUM_POST',

  // Piliers IA
  PILIER1_LIGHT = 'PILIER1_LIGHT',
  PILIER1_FULL = 'PILIER1_FULL',
  PILIER2_SCORE = 'PILIER2_SCORE',
  PILIER2_FULL = 'PILIER2_FULL',
  PILIER3_ACCESS = 'PILIER3_ACCESS',

  // Consultations
  CONSULTATIONS_LIMITED = 'CONSULTATIONS_LIMITED',        // Consultations limitées (Basique)
  CONSULTATIONS_UNLIMITED = 'CONSULTATIONS_UNLIMITED',    // Consultations illimitées (Premium, Pro)
  TELECONSULTATION = 'TELECONSULTATION',                  // Téléconsultation vidéo (Premium, Pro)

  // Dossier médical
  MEDICAL_RECORD_BASIC = 'MEDICAL_RECORD_BASIC',          // Accès basique au dossier (Basique)
  MEDICAL_RECORD_FULL = 'MEDICAL_RECORD_FULL',            // Accès complet au dossier (Premium, Pro)

  // Rappels et notifications
  APPOINTMENT_REMINDERS = 'APPOINTMENT_REMINDERS',        // Rappels de rendez-vous (Tous)

  // Support
  SUPPORT_EMAIL = 'SUPPORT_EMAIL',                        // Support par email (Basique)
  SUPPORT_PRIORITY = 'SUPPORT_PRIORITY',                  // Support prioritaire (Premium, Pro)
  SUPPORT_PHONE = 'SUPPORT_PHONE',                        // Support téléphonique (Pro)

  // Forums et communauté
  FORUMS_ACCESS = 'FORUMS_ACCESS',                        // Accès aux forums médicaux (Premium, Pro)

  // Rapports et statistiques
  REPORTS_BASIC = 'REPORTS_BASIC',                        // Rapports de base (Basique)
  REPORTS_DETAILED = 'REPORTS_DETAILED',                  // Rapports détaillés (Premium, Pro)
  STATISTICS_ADVANCED = 'STATISTICS_ADVANCED',            // Statistiques avancées (Premium, Pro)

  // Analyses et examens
  EXAMENS_BASIC = 'EXAMENS_BASIC',                        // Examens de base (Basique)
  EXAMENS_ADVANCED = 'EXAMENS_ADVANCED',                  // Analyses médicales avancées (Premium, Pro)

  // Suivi et personnalisation
  FOLLOW_UP_PERSONALIZED = 'FOLLOW_UP_PERSONALIZED',      // Suivi personnalisé (Pro)
  WEBINARS_ACCESS = 'WEBINARS_ACCESS',                    // Accès aux webinaires exclusifs (Pro)
  VIDEO_LIBRARY_ACCESS = 'VIDEO_LIBRARY_ACCESS',          // Accès à la bibliothèque vidéo éducative (Pro)
  EVENTS_ACCESS = 'EVENTS_ACCESS',                        // Accès aux événements (Pro)

  // Gestion des patients (pour les médecins)
  PATIENTS_LIMITED = 'PATIENTS_LIMITED',                  // Jusqu'à 50 patients (Basique)
  PATIENTS_UNLIMITED = 'PATIENTS_UNLIMITED',              // Patients illimités (Premium, Pro)
}

/**
 * Configuration des permissions par type d'abonnement avec HÉRITAGE
 */
const BASIC_PERMISSIONS = [
  SubscriptionPermission.DOSSIER_MEDICAL_PREVIEW,
  SubscriptionPermission.CONSULTATIONS_PREVIEW,
  SubscriptionPermission.EVENTS_READ,
  SubscriptionPermission.FORUM_READ,
  SubscriptionPermission.PILIER1_LIGHT,
  SubscriptionPermission.PILIER2_SCORE,

  SubscriptionPermission.CONSULTATIONS_LIMITED,
  SubscriptionPermission.MEDICAL_RECORD_BASIC,
  SubscriptionPermission.APPOINTMENT_REMINDERS,
  SubscriptionPermission.SUPPORT_EMAIL,
  SubscriptionPermission.REPORTS_BASIC,
  SubscriptionPermission.EXAMENS_BASIC,
  SubscriptionPermission.PATIENTS_LIMITED,
];

const PREMIUM_PERMISSIONS = [
  ...BASIC_PERMISSIONS,
  SubscriptionPermission.DOSSIER_MEDICAL_FULL,
  SubscriptionPermission.CONSULTATIONS_FULL,
  SubscriptionPermission.EVENTS_INTERACT,
  SubscriptionPermission.FORUM_POST,
  SubscriptionPermission.PILIER1_FULL,
  SubscriptionPermission.PILIER2_FULL,
  SubscriptionPermission.PILIER3_ACCESS,

  SubscriptionPermission.CONSULTATIONS_UNLIMITED,
  SubscriptionPermission.TELECONSULTATION,
  SubscriptionPermission.MEDICAL_RECORD_FULL,
  SubscriptionPermission.SUPPORT_PRIORITY,
  SubscriptionPermission.FORUMS_ACCESS,
  SubscriptionPermission.REPORTS_DETAILED,
  SubscriptionPermission.STATISTICS_ADVANCED,
  SubscriptionPermission.EXAMENS_ADVANCED,
  SubscriptionPermission.PATIENTS_UNLIMITED,
];

const PRO_PERMISSIONS = [
  ...PREMIUM_PERMISSIONS,
  SubscriptionPermission.PILIER3_ACCESS,
  SubscriptionPermission.SUPPORT_PHONE,
  SubscriptionPermission.FOLLOW_UP_PERSONALIZED,
  SubscriptionPermission.WEBINARS_ACCESS,
  SubscriptionPermission.VIDEO_LIBRARY_ACCESS,
  SubscriptionPermission.EVENTS_ACCESS,
];

export const SUBSCRIPTION_PERMISSIONS: Record<string, SubscriptionPermission[]> = {
  'Basique': BASIC_PERMISSIONS,
  'Premium': PREMIUM_PERMISSIONS,
  'Pro': PRO_PERMISSIONS,
};
