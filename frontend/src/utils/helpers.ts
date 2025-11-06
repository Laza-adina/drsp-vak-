/**
 * 📄 Fichier: src/utils/helpers.ts
 * 📝 Description: Fonctions utilitaires génériques
 * 🎯 Usage: Helpers pour manipulation de données, validation, etc.
 */

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// ========================================
// 🎨 UTILITAIRE CLASSES CSS (Tailwind)
// ========================================
/**
 * Fusionne les classes Tailwind intelligemment
 * @example cn('px-2 py-1', 'px-4') => 'py-1 px-4' (évite les conflits)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ========================================
// 🎨 COULEUR PAR STATUT
// ========================================
/**
 * Retourne la couleur selon le statut du cas
 * @param statut - Statut du cas (Suspect, Confirmé, etc.)
 * @returns Classe de couleur (primary, success, warning, danger)
 */
export function getStatusColor(statut: string): 'primary' | 'success' | 'warning' | 'danger' {
  const statusMap: Record<string, 'primary' | 'success' | 'warning' | 'danger'> = {
    Suspect: 'warning',
    Confirmé: 'danger',
    Écarté: 'success',
    'En cours': 'primary',
    Actif: 'warning',
    Résolu: 'success',
    Planifiée: 'primary',
    Terminée: 'success',
  }
  return statusMap[statut] || 'primary'
}

// ========================================
// 🚨 COULEUR PAR GRAVITÉ
// ========================================
/**
 * Retourne la couleur selon le niveau de gravité
 * @param gravite - Niveau de gravité (Faible, Modéré, Élevé, Critique)
 */
export function getGraviteColor(gravite: string): 'success' | 'warning' | 'danger' {
  const graviteMap: Record<string, 'success' | 'warning' | 'danger'> = {
    Faible: 'success',
    Modéré: 'warning',
    Élevé: 'danger',
    Critique: 'danger',
  }
  return graviteMap[gravite] || 'warning'
}

// ========================================
// 👤 INITIALES UTILISATEUR
// ========================================
/**
 * Génère les initiales à partir du nom et prénom
 * @example getInitials('Rakoto', 'Jean') => 'RJ'
 */
export function getInitials(nom: string, prenom: string): string {
  if (!nom && !prenom) return '??'
  const firstInitial = prenom?.charAt(0)?.toUpperCase() || ''
  const lastInitial = nom?.charAt(0)?.toUpperCase() || ''
  return `${firstInitial}${lastInitial}`
}

// ========================================
// 🔢 GÉNÉRATION ID UNIQUE
// ========================================
/**
 * Génère un ID unique basé sur timestamp + random
 * @example generateId() => 'id_1699012345_a3f4'
 */
export function generateId(): string {
  return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// ========================================
// 📋 COPIE DANS PRESSE-PAPIER
// ========================================
/**
 * Copie du texte dans le presse-papier
 * @param text - Texte à copier
 * @returns Promise<boolean> - true si succès
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error('Erreur copie presse-papier:', err)
    return false
  }
}

// ========================================
// 📥 TÉLÉCHARGEMENT FICHIER
// ========================================
/**
 * Télécharge un fichier depuis une URL
 * @param url - URL du fichier
 * @param filename - Nom du fichier à sauvegarder
 */
export function downloadFile(url: string, filename: string) {
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// ========================================
// 🔍 RECHERCHE DANS TEXTE
// ========================================
/**
 * Vérifie si une chaîne contient le terme de recherche (insensible à la casse)
 * @param text - Texte à analyser
 * @param search - Terme recherché
 */
export function searchInText(text: string, search: string): boolean {
  if (!search) return true
  return text.toLowerCase().includes(search.toLowerCase())
}

// ========================================
// 🧮 CALCUL POURCENTAGE
// ========================================
/**
 * Calcule le pourcentage avec gestion division par zéro
 * @param value - Valeur
 * @param total - Total
 * @param decimals - Nombre de décimales (défaut: 1)
 */
export function calculatePercentage(value: number, total: number, decimals: number = 1): number {
  if (total === 0) return 0
  return Number(((value / total) * 100).toFixed(decimals))
}

// ========================================
// 📊 TRI TABLEAU PAR PROPRIÉTÉ
// ========================================
/**
 * Trie un tableau d'objets par propriété
 * @param array - Tableau à trier
 * @param key - Clé de tri
 * @param order - Ordre ('asc' ou 'desc')
 */
export function sortBy<T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]

    if (aVal < bVal) return order === 'asc' ? -1 : 1
    if (aVal > bVal) return order === 'asc' ? 1 : -1
    return 0
  })
}

// ========================================
// 🗂️ GROUPER PAR PROPRIÉTÉ
// ========================================
/**
 * Groupe un tableau d'objets par propriété
 * @param array - Tableau à grouper
 * @param key - Clé de regroupement
 * @example groupBy(cas, 'district_nom') => { 'Antsirabe I': [...], 'Betafo': [...] }
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((acc, item) => {
    const groupKey = String(item[key])
    if (!acc[groupKey]) {
      acc[groupKey] = []
    }
    acc[groupKey].push(item)
    return acc
  }, {} as Record<string, T[]>)
}

// ========================================
// ⏱️ DEBOUNCE
// ========================================
/**
 * Crée une fonction debounced
 * @param func - Fonction à debouncer
 * @param delay - Délai en ms
 * @usage Évite les appels API trop fréquents lors de la saisie
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>  // ✅ Changement ici
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}


// ========================================
// 📍 VALIDATION COORDONNÉES GPS
// ========================================
/**
 * Valide des coordonnées GPS
 * @param lat - Latitude
 * @param lng - Longitude
 */
export function isValidCoordinates(lat: number, lng: number): boolean {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
}

// ========================================
// 📏 CALCUL DISTANCE (Haversine)
// ========================================
/**
 * Calcule la distance entre 2 points GPS (en km)
 * @param lat1 - Latitude point 1
 * @param lon1 - Longitude point 1
 * @param lat2 - Latitude point 2
 * @param lon2 - Longitude point 2
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // Rayon de la Terre en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// ========================================
// 🎲 NOMBRE ALÉATOIRE
// ========================================
/**
 * Génère un nombre aléatoire entre min et max (inclus)
 */
export function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// ========================================
// ✅ VALIDATION EMAIL
// ========================================
/**
 * Valide un format email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// ========================================
// 📱 DÉTECTION MOBILE
// ========================================
/**
 * Détecte si l'utilisateur est sur mobile
 */
export function isMobile(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
}
