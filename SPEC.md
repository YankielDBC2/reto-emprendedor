# Reto Emprendedor v2 - Specification

## Overview
- **Nombre:** Reto Emprendedor v2
- **Tipo:** Web App con Auth
- **Función:** Calculadora de metas + tracking financiero + dashboard personal
- **Target:** Entrepreneurs, freelancers

## Tech Stack
- React + Vite
- Firebase Authentication (email/password)
- Firebase Firestore (database)
- CSS vanilla (mantener estilo brutalist)

## Pages

### 1. Landing / Login
- Título: "RETO EMPRENDEDOR"
- Formulario registro (email, password)
- Formulario login
- Botón "Empezar Reto" → crea cuenta

### 2. Setup (solo primera vez)
- Input: Meta financiera ($)
- Input: Fecha objetivo
- Botón "Crear Reto" → dashboard

### 3. Dashboard
- **Header:** Meta actual + progreso
- **Stats:** $/hora, $/día, $/semana, $/mes (calculado vs real)
- **Balance:** Total ganancias - gastos
- **Performance:** Atrasado/Adelantado (%)
- **Quick Add:** Botones rápido (+$income, -$expense)
- **Historial:** Lista últimos movimientos

## Data Model (Firestore)

### Collection: users
```json
{
  "email": "user@example.com",
  "createdAt": "timestamp",
  "meta": 10000,
  "fechaObjetivo": "2026-12-31",
  "balance": 1500,
  "transactions": [
    {
      "type": "income|expense",
      "amount": 500,
      "description": "Client payment",
      "date": "timestamp"
    }
  ]
}
```

## Functionality

### Auth
- Registro con email/password
- Login
- Logout
- Protected routes

### Dashboard
- Meta + fecha objetivo
- Balance actual (ganancias - gastos)
- Performance diario:
  - Esperado: meta / días_totales
  - Real: balance_actual / días_transcurridos
  - Δ = ((real - esperado) / esperado) * 100

### Transacciones
- Agregar ingreso (+)
- Agregar gasto (-)
- Descripción opcional
- Timestamp automático

### Cálculo 24h
- Cada día: comparar balance vs esperado
- Mostrar: "Vas +X% adelantado" o "Vas -X% atrasado"

## UI/UX

### Estilo
- Dark mode (#0a0a0a)
- Verde neon (#00ff88) para dinero positivo
- Rojo (#ff4444) para negativo/advertencia
- Bebas Neue headers, JetBrains Mono números

### Responsive
- Mobile-first
- Cards stack en columna
- Botones táctiles (min 44px)
- Input full-width

## Firebase Config
- Crear proyecto en console.firebase.google.com
- Habilitar Email/Password auth
- Firestore rules: solo usuario propio puede ver sus datos

## Acceptance Criteria
- [ ] Registro + Login funcionando
- [ ] Dashboard muestra meta y progreso
- [ ] Agregar ingresos/gastos funciona
- [ ] Cálculo de performance (atrasado/adelantado)
- [ ] 100% responsive
- [ ] Datos persisten en Firestore

## Archivos a crear
- src/main.jsx
- src/App.jsx
- src/firebase.js
- src/pages/Login.jsx
- src/pages/Setup.jsx
- src/pages/Dashboard.jsx
- src/components/Header.jsx
- src/components/TransactionForm.jsx
- src/components/TransactionList.jsx
- src/components/Stats.jsx
- index.html (actualizado)
- vite.config.js
- package.json