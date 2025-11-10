# iAuto - Mobile Car Dealership Inventory App

A React Native mobile app built with Expo and TypeScript that allows car dealers to manage their vehicle inventory through natural conversation.

## Features

- **Natural Language Input**: Simply type "bmw 435i" or "sold mazda 3 for 8.5k" and the AI automatically processes it
- **Real-time Analysis**: Visual feedback while parsing your input
- **Instant Feedback**: Shows detected price/action immediately
- **Auto-submission**: Entries are automatically added after confirmation
- **Inventory Tracking**: See your current inventory value and available cars
- **Sales Metrics**: Track monthly sales, goals, and performance
- **Full History**: Searchable history of all transactions

## Design

The UX is inspired by MyFitnessPal's calorie tracking feature:
- Clean, minimalist iOS-inspired design
- Warm cream background (#F8F6F1)
- Natural, conversational input
- Automatic processing - no buttons needed
- Smooth animations throughout

## Tech Stack

- **React Native** with **Expo** (~54.0)
- **TypeScript** for type safety
- **expo-router** for file-based navigation
- **react-native-reanimated** for smooth animations
- **Context API** for state management

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo Go app on your iOS/Android device (download from App Store/Play Store)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd iAuto
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Scan the QR code with:
   - **iOS**: Camera app (opens Expo Go)
   - **Android**: Expo Go app

## Usage Examples

### Adding Vehicles to Inventory

Just type naturally:
- `bmw 435i` - Adds a BMW 435i to inventory
- `llegó mazda 3 2019 rojo` - Adds a red 2019 Mazda 3
- `honda civic en 11k` - Adds Honda Civic with purchase price of $11,000

### Recording Sales

Type sale keywords:
- `vendimos mazda 3 en 8.5k` - Records sale of Mazda 3 for $8,500
- `sold bmw 435i 12k` - Records sale of BMW 435i for $12,000

### Supported Patterns

**Vehicle Makes**: BMW, Mazda, Honda, Toyota, Ford, Chevrolet, Nissan, Mercedes, Audi, Volkswagen, Hyundai, Kia, Lexus, Tesla, Volvo, Subaru, Jeep, Dodge, Ram, GMC

**Action Keywords**:
- Arrival: llegó, llego, arrived, compramos, compre, nuevo
- Sale: vendimos, vendido, vendi, sold, sale

**Price Formats**:
- `8.5k` → $8,500
- `en 8.5` → $8,500
- `8.5 mil` → $8,500
- `$8500` → $8,500
- `USD 8.5k` → $8,500

**Optional Fields**:
- Year: any 4-digit year (1990-2030)
- Color: Spanish (rojo, azul, negro, blanco, gris, plata, verde) or English (red, blue, black, white, gray, silver, green)

## Project Structure

```
iAuto/
├── app/                        # Expo Router screens
│   ├── (tabs)/                 # Tab navigation group
│   │   ├── _layout.tsx         # Tab bar configuration
│   │   ├── registro.tsx        # Main input screen (PRIMARY)
│   │   ├── metricas.tsx        # Metrics/analytics screen
│   │   └── historial.tsx       # Full history screen
│   ├── _layout.tsx             # Root layout with VehicleProvider
│   └── index.tsx               # Entry point (redirects to registro)
├── components/                 # Reusable UI components
│   ├── StatusIndicator.tsx     # "analizando" / "+ USD X" indicator
│   ├── EntryRow.tsx            # Faded history item
│   ├── BottomMetrics.tsx       # Fixed bottom metrics panel
│   └── AnimatedNumber.tsx      # Smooth counter animation
├── contexts/                   # React Context providers
│   └── VehicleContext.tsx      # Shared vehicle state across screens
├── hooks/                      # Custom React hooks
│   ├── useVehicleInput.ts      # Main business logic hook
│   └── useDebounce.ts          # Debounce utility hook
├── utils/                      # Utility functions
│   └── vehicleParser.ts        # Natural language parsing logic
├── constants/                  # App constants
│   ├── Colors.ts               # Color palette
│   └── Timing.ts               # Animation timing constants
├── types/                      # TypeScript type definitions
│   └── index.ts                # All app interfaces and types
└── assets/                     # Images, fonts, etc.
```

## Key Files Explained

### Main Screen: `app/(tabs)/registro.tsx`
The primary screen where users input vehicle data. Features:
- Auto-focus text input
- Tap anywhere to focus
- Real-time status indicator
- Recent entries with fade animation
- Fixed bottom metrics

### Parser: `utils/vehicleParser.ts`
Extracts vehicle information from natural language:
- Detects make and model (required)
- Parses price in multiple formats
- Identifies action (arrival/sale)
- Extracts optional year and color

### Hook: `hooks/useVehicleInput.ts`
Manages all vehicle input state:
- Debounced parsing
- Auto-submission logic
- Entry history management
- Metrics calculation

## Screens

### 1. Registro (Main Input)
- Primary screen for adding vehicles
- Natural language input
- Live parsing feedback
- Auto-submission
- Recent entries visible

### 2. Métricas (Metrics Dashboard)
- Monthly sales progress
- Average sale price
- Sales vs. goal tracking
- Inventory summary

### 3. Historial (Full History)
- Complete transaction history
- Search functionality
- Grouped by date
- Sale/arrival status indicators

## Animations

All animations use timing constants from `constants/Timing.ts`:
- Debounce delay: 300ms
- Confirmation duration: 1500ms
- Animation duration: 500ms
- Fade in/out: 200ms

## Color Palette

Defined in `constants/Colors.ts`:
- Background: #F8F6F1 (warm cream)
- Card: #FFFFFF (pure white)
- Text Primary: #1A1A1A
- Text Secondary: #8E8E93
- Accent Blue: #007AFF (iOS blue)
- Success Green: #34C759
- Border: #E5E5E5

## State Management

The app uses React Context (`VehicleContext`) to share state across all screens:
- Current input
- Detected vehicle data
- Recent entries (last 5)
- All entries (full history)
- Calculated metrics

## Testing Checklist

- [ ] App runs with `npm start`
- [ ] Can type in input field
- [ ] "analizando" appears after typing
- [ ] Detects "bmw 435i" correctly
- [ ] Shows "+ USD X" or "+ Agregado"
- [ ] Entry fades to history after 1.5s
- [ ] Input clears automatically
- [ ] Metrics update in bottom panel
- [ ] Can switch between tabs
- [ ] History shows all entries
- [ ] Search works in History

## Future Enhancements

- [ ] Supabase integration for data persistence
- [ ] User authentication
- [ ] Offline support
- [ ] Photo upload for vehicles
- [ ] Export reports (PDF, Excel)
- [ ] Multi-dealer support
- [ ] Advanced analytics
- [ ] Push notifications

## Troubleshooting

### Metro bundler errors
```bash
# Clear cache and restart
npm start -- --clear
```

### TypeScript errors
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### Expo Go not connecting
- Ensure phone and computer are on same WiFi
- Try scanning QR code again
- Restart Expo Go app

## License

MIT

## Author

Built with React Native, Expo, and TypeScript
