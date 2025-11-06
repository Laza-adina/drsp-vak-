/**
 * 📄 Fichier: src/utils/formatters.ts
 * 📝 Description: Fonctions de formatage (dates, nombres, devises)
 * 🎯 Usage: Affichage cohérent des données dans toute l'application
 */

import { format, parseISO, formatDistanceToNow, isValid } from 'date-fns'
import { fr } from 'date-fns/locale'

// ========================================
// 📅 FORMATAGE DES DATES
// ========================================

/**
 * Formate une date au format DD/MM/YYYY
 * @param date - Date à formater (string ISO ou Date)
 * @example formatDate('2024-11-04') => '04/11/2024'
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '-'
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    if (!isValid(dateObj)) return '-'
    return format(dateObj, 'dd/MM/yyyy', { locale: fr })
  } catch (error) {
    console.error('Erreur formatage date:', error)
    return '-'
  }
}

/**
 * Formate une date avec l'heure au format DD/MM/YYYY HH:mm
 * @example formatDateTime('2024-11-04T14:30:00') => '04/11/2024 14:30'
 */
export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return '-'
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    if (!isValid(dateObj)) return '-'
    return format(dateObj, 'dd/MM/yyyy HH:mm', { locale: fr })
  } catch (error) {
    console.error('Erreur formatage date/heure:', error)
    return '-'
  }
}

/**
 * Formate une date en temps relatif (il y a X jours)
 * @example formatRelativeTime('2024-11-01') => 'il y a 3 jours'
 */
export function formatRelativeTime(date: string | Date | null | undefined): string {
  if (!date) return '-'
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    if (!isValid(dateObj)) return '-'
    return formatDistanceToNow(dateObj, { addSuffix: true, locale: fr })
  } catch (error) {
    console.error('Erreur formatage temps relatif:', error)
    return '-'
  }
}

/**
 * Formate une date au format lisible complet
 * @example formatLongDate('2024-11-04') => 'lundi 4 novembre 2024'
 */
export function formatLongDate(date: string | Date | null | undefined): string {
  if (!date) return '-'
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    if (!isValid(dateObj)) return '-'
    return format(dateObj, 'EEEE d MMMM yyyy', { locale: fr })
  } catch (error) {
    console.error('Erreur formatage date longue:', error)
    return '-'
  }
}

// ========================================
// 🔢 FORMATAGE DES NOMBRES
// ========================================

/**
 * Formate un nombre avec séparateurs de milliers
 * @example formatNumber(1234567) => '1 234 567'
 */
export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return '0'
  return new Intl.NumberFormat('fr-FR').format(value)
}

/**
 * Formate un nombre avec décimales
 * @param value - Nombre à formater
 * @param decimals - Nombre de décimales (défaut: 2)
 * @example formatDecimal(123.456, 2) => '123,46'
 */
export function formatDecimal(value: number | null | undefined, decimals: number = 2): string {
  if (value === null || value === undefined) return '0'
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

/**
 * Formate un pourcentage
 * @example formatPercentage(0.7523) => '75,23 %'
 */
export function formatPercentage(value: number | null | undefined, decimals: number = 2): string {
  if (value === null || value === undefined) return '0 %'
  return `${formatDecimal(value * 100, decimals)} %`
}

// ========================================
// 💰 FORMATAGE DES DEVISES
// ========================================

/**
 * Formate un montant en Ariary (MGA)
 * @example formatCurrency(50000) => '50 000 Ar'
 */
export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) return '0 Ar'
  return `${formatNumber(value)} Ar`
}

/**
 * Formate un montant en Ariary avec décimales
 * @example formatCurrencyDecimal(50000.50) => '50 000,50 Ar'
 */
export function formatCurrencyDecimal(value: number | null | undefined): string {
  if (value === null || value === undefined) return '0,00 Ar'
  return `${formatDecimal(value, 2)} Ar`
}

// ========================================
// 📏 FORMATAGE DES DISTANCES
// ========================================

/**
 * Formate une distance en km/m selon la valeur
 * @example formatDistance(0.5) => '500 m'
 * @example formatDistance(5.2) => '5,2 km'
 */
export function formatDistance(km: number | null | undefined): string {
  if (km === null || km === undefined) return '-'
  
  if (km < 1) {
    return `${Math.round(km * 1000)} m`
  }
  return `${formatDecimal(km, 1)} km`
}

// ========================================
// 📱 FORMATAGE DES NUMÉROS DE TÉLÉPHONE
// ========================================

/**
 * Formate un numéro de téléphone malgache
 * @example formatPhoneNumber('0341234567') => '034 12 345 67'
 */
export function formatPhoneNumber(phone: string | null | undefined): string {
  if (!phone) return '-'
  
  // Nettoyer le numéro
  const cleaned = phone.replace(/\D/g, '')
  
  // Format: 034 12 345 67
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`
  }
  
  return phone
}

// ========================================
// 📍 FORMATAGE DES COORDONNÉES GPS
// ========================================

/**
 * Formate des coordonnées GPS
 * @example formatCoordinates(-19.8637, 47.0363) => '-19.8637, 47.0363'
 */
export function formatCoordinates(lat: number | null, lng: number | null): string {
  if (lat === null || lng === null) return '-'
  return `${lat.toFixed(4)}, ${lng.toFixed(4)}`
}

// ========================================
// 📊 FORMATAGE TAUX D'INCIDENCE
// ========================================

/**
 * Formate un taux d'incidence pour 100 000 habitants
 * @example formatIncidenceRate(125.45) => '125,5 / 100 000 hab.'
 */
export function formatIncidenceRate(rate: number | null | undefined): string {
  if (rate === null || rate === undefined) return '-'
  return `${formatDecimal(rate, 1)} / 100 000 hab.`
}

// ========================================
// 📋 FORMATAGE NOM COMPLET
// ========================================

/**
 * Formate le nom complet d'une personne
 * @example formatFullName('Rakoto', 'Jean') => 'RAKOTO Jean'
 */
export function formatFullName(nom: string, prenom: string): string {
  if (!nom && !prenom) return '-'
  const nomUpper = nom?.toUpperCase() || ''
  const prenomCapitalized = prenom?.charAt(0).toUpperCase() + prenom?.slice(1).toLowerCase() || ''
  return `${nomUpper} ${prenomCapitalized}`.trim()
}

// ========================================
// 🆔 FORMATAGE ID CAS
// ========================================

/**
 * Formate un ID de cas avec padding
 * @example formatCasId(42) => 'CAS-2024-000042'
 */
export function formatCasId(id: number, year?: number): string {
  const currentYear = year || new Date().getFullYear()
  const paddedId = String(id).padStart(6, '0')
  return `CAS-${currentYear}-${paddedId}`
}

// ========================================
// 📄 FORMATAGE TAILLE FICHIER
// ========================================

/**
 * Formate une taille de fichier en octets vers format lisible
 * @example formatFileSize(1536) => '1,5 KB'
 */
export function formatFileSize(bytes: number | null | undefined): string {
  if (bytes === null || bytes === undefined || bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${formatDecimal(bytes / Math.pow(k, i), 1)} ${sizes[i]}`
}

// ========================================
// ⏱️ FORMATAGE DURÉE
// ========================================

/**
 * Formate une durée en secondes vers format lisible
 * @example formatDuration(3665) => '1h 1min 5s'
 */
export function formatDuration(seconds: number | null | undefined): string {
  if (seconds === null || seconds === undefined || seconds === 0) return '0s'
  
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  const parts = []
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}min`)
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`)
  
  return parts.join(' ')
}

// ========================================
// 🔤 FORMATAGE TEXTE TRONQUÉ
// ========================================

/**
 * Tronque un texte avec ellipse
 * @example truncateText('Lorem ipsum dolor sit amet', 15) => 'Lorem ipsum...'
 */
export function truncateText(text: string | null | undefined, maxLength: number): string {
  if (!text) return '-'
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}...`
}

// ========================================
// 🎨 FORMATAGE INITIALES COLORÉES
// ========================================

/**
 * Génère une couleur de fond basée sur une chaîne (pour avatar)
 * @example getColorFromString('Jean Rakoto') => '#4A90E2'
 */
export function getColorFromString(str: string): string {
  if (!str) return '#cccccc'
  
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  const hue = hash % 360
  return `hsl(${hue}, 60%, 50%)`
}
