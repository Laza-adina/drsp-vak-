#!/bin/bash

# ================================
# 🚀 Script d’installation complet
# Projet : drsp-surveillance-frontend
# ================================

set -e  # Stoppe le script en cas d’erreur



cd drsp-surveillance-frontend

# echo "📦 2. Installation des dépendances..."
# npm install react-router-dom axios @tanstack/react-query zustand recharts leaflet react-leaflet lucide-react date-fns react-hot-toast clsx react-hook-form zod @hookform/resolvers @types/leaflet tailwindcss postcss autoprefixer

# echo "🎨 3. Initialisation de Tailwind CSS..."
# npx tailwindcss init -p

echo "📁 4. Création de la structure du projet..."
mkdir -p public
touch public/{favicon.ico,index.html}

mkdir -p src/{api/services,assets/{images,icons},components/{common,layout,charts,maps},features/{auth/{components,pages,hooks},dashboard/{components,pages},cas/{components,pages},cartographie/{components,pages},alertes/{components,pages},interventions/{components,pages},statistiques/{components,pages},rapports/{components,pages},admin/{components,pages}},hooks,store,routes,types,utils}

# Fichiers API
touch src/api/{axios.config.ts,endpoints.ts}
touch src/api/services/{auth.service.ts,cas.service.ts,dashboard.service.ts,cartographie.service.ts,statistiques.service.ts,alertes.service.ts,interventions.service.ts,rapports.service.ts,users.service.ts}

# Components
touch src/components/common/{Button.tsx,Input.tsx,Select.tsx,Modal.tsx,Card.tsx,Table.tsx,Pagination.tsx,Loading.tsx,ErrorMessage.tsx}
touch src/components/layout/{Layout.tsx,Sidebar.tsx,Navbar.tsx,Footer.tsx}
touch src/components/charts/{LineChart.tsx,BarChart.tsx,PieChart.tsx,AreaChart.tsx}
touch src/components/maps/{MapContainer.tsx,MarkerCluster.tsx,HeatmapLayer.tsx,ChoroplethLayer.tsx}

# Features
touch src/features/auth/components/{LoginForm.tsx,RegisterForm.tsx}
touch src/features/auth/pages/{LoginPage.tsx,RegisterPage.tsx}
touch src/features/auth/hooks/useAuth.ts
touch src/features/dashboard/components/{StatCard.tsx,TopDistricts.tsx,EvolutionChart.tsx,DiseaseDistribution.tsx}
touch src/features/dashboard/pages/DashboardPage.tsx
touch src/features/cas/components/{CasList.tsx,CasForm.tsx,CasDetail.tsx,CasFilters.tsx}
touch src/features/cas/pages/{CasListPage.tsx,CasFormPage.tsx}
touch src/features/cartographie/components/{MapView.tsx,MapControls.tsx,MapLegend.tsx}
touch src/features/cartographie/pages/CartographiePage.tsx
touch src/features/alertes/components/{AlertesList.tsx,AlerteForm.tsx,AlerteCard.tsx}
touch src/features/alertes/pages/AlertesPage.tsx
touch src/features/interventions/components/{InterventionsList.tsx,InterventionForm.tsx,InterventionDetail.tsx}
touch src/features/interventions/pages/InterventionsPage.tsx
touch src/features/statistiques/components/{TendanceChart.tsx,IncidenceChart.tsx,AgeDistribution.tsx}
touch src/features/statistiques/pages/StatistiquesPage.tsx
touch src/features/rapports/components/{RapportFilters.tsx,RapportPreview.tsx}
touch src/features/rapports/pages/RapportsPage.tsx
touch src/features/admin/components/{UsersList.tsx,UserForm.tsx,DistrictsList.tsx,MaladiesList.tsx}
touch src/features/admin/pages/AdminPage.tsx

# Hooks, Store, Routes, Types, Utils
touch src/hooks/{useAuth.ts,useDebounce.ts,useLocalStorage.ts,usePermissions.ts}
touch src/store/{authStore.ts,uiStore.ts,index.ts}
touch src/routes/{index.tsx,ProtectedRoute.tsx,RoleBasedRoute.tsx}
touch src/types/{auth.types.ts,cas.types.ts,dashboard.types.ts,cartographie.types.ts,alertes.types.ts,interventions.types.ts,statistiques.types.ts,user.types.ts,api.types.ts}
touch src/utils/{formatters.ts,validators.ts,constants.ts,helpers.ts}

# Fichiers de base
touch src/{App.tsx,index.tsx,index.css}
touch .env.example .env .gitignore README.md

echo "✅ Structure complète créée avec succès !"

echo "🚀 5. Lancement du serveur de développement..."
npm run dev
