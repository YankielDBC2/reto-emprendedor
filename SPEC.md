# Reto Emprendedor - Specification

## Overview
- **Nombre:** Reto Emprendedor
- **Tipo:** Single-page web app
- **Función:** Calculadora de metas financieras - desglosa una meta de dinero en intervalos de tiempo (hora/día/semana/mes)
- **Target:** Entrepreneurs, freelancers, gente con metas financieras

## UI/UX Spec

### Layout
- Single page, centered content
- Max-width: 600px
- Responsive (mobile-first)

### Visual Style
- **Estilo:** Brutalist Financial - fuerte, directo, sin decoraciones innecesarias
- **Tema:** Dark mode con acentos en verde neon (dinero)
- **Tipografía:** 
  - Headers: "Bebas Neue" (bold, impactante)
  - Body: "JetBrains Mono" (números, código)
- **Colores:**
  - Background: #0a0a0a
  - Card: #141414
  - Border: #2a2a2a
  - Accent: #00ff88 (verde dinero)
  - Warning: #ff4444
  - Text: #ffffff / #888888

### Components
1. **Header** - Título grande "RETO EMPRENDEDOR"
2. **Input Card** - Meta y fecha objetivo
3. **Results Grid** - 4 cards (hora/día/semana/mes)
4. **Progress Bar** - Visual del tiempo restante
5. **CTA Button** - "Empezar Reto"

### Animaciones
- Cards aparecen con stagger (50ms delay)
- Números cuentan animadamente
- Hover states sutiles

## Functionality

### Inputs
- Meta financiera ($)
- Fecha objetivo

### Outputs (calculado automáticamente)
| Interval | Fórmula |
|----------|---------|
| Por hora | meta / horas_totales |
| Por día | meta / días_totales |
| Por semana | meta / semanas_totales |
| Por mes | meta / meses_totales |

### Validaciones
- Meta > 0
- Fecha > hoy
- Mostrar warning si meta muy agresiva

## Acceptance Criteria
- [ ] User puede introducir meta y fecha
- [ ] Se calculan los 4 intervalos automáticamente
- [ ] Números formateados con $ y separadores de miles
- [ ] Warning si la meta requiere más de $100/hora
- [ ] Diseño responsive funciona en móvil
- [ ] Animaciones smooth

## Tech
- HTML + CSS + Vanilla JS
- Google Fonts (Bebas Neue, JetBrains Mono)
- No dependencies