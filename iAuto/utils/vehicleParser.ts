import { ParsedVehicle, VehicleAction } from '../types';

// Supported car makes
const CAR_MAKES = [
  'bmw', 'mazda', 'honda', 'toyota', 'ford', 'chevrolet', 'nissan',
  'mercedes', 'audi', 'volkswagen', 'hyundai', 'kia', 'lexus',
  'tesla', 'volvo', 'subaru', 'jeep', 'dodge', 'ram', 'gmc',
];

// Action keywords
const ARRIVAL_KEYWORDS = ['llegó', 'llego', 'arrived', 'compramos', 'compre', 'nuevo'];
const SALE_KEYWORDS = ['vendimos', 'vendido', 'vendi', 'sold', 'sale'];

// Color keywords
const COLORS = {
  es: ['rojo', 'azul', 'negro', 'blanco', 'gris', 'plata', 'verde'],
  en: ['red', 'blue', 'black', 'white', 'gray', 'silver', 'green'],
};

/**
 * Parse price from text
 * Patterns: "8.5k", "en 8.5", "8.5 mil", "$8500", "USD 8.5k"
 */
function parsePrice(text: string): number | null {
  // Pattern 1: "8.5k" or "8.5K"
  const kPattern = /(\d+(?:\.\d+)?)\s*k/i;
  const kMatch = text.match(kPattern);
  if (kMatch) {
    return parseFloat(kMatch[1]) * 1000;
  }

  // Pattern 2: "en 8.5" or "en 8"
  const enPattern = /en\s+(\d+(?:\.\d+)?)/i;
  const enMatch = text.match(enPattern);
  if (enMatch) {
    const value = parseFloat(enMatch[1]);
    return value < 100 ? value * 1000 : value;
  }

  // Pattern 3: "8.5 mil" or "8 mil"
  const milPattern = /(\d+(?:\.\d+)?)\s*mil/i;
  const milMatch = text.match(milPattern);
  if (milMatch) {
    return parseFloat(milMatch[1]) * 1000;
  }

  // Pattern 4: "$8500" or "USD 8500"
  const dollarPattern = /(?:\$|USD)\s*(\d+(?:\.\d+)?)/i;
  const dollarMatch = text.match(dollarPattern);
  if (dollarMatch) {
    const value = parseFloat(dollarMatch[1]);
    return value < 100 ? value * 1000 : value;
  }

  // Pattern 5: Plain number (assume thousands if < 100)
  const numberPattern = /\b(\d+(?:\.\d+)?)\b/;
  const numberMatch = text.match(numberPattern);
  if (numberMatch) {
    const value = parseFloat(numberMatch[1]);
    // Only consider it a price if it's a reasonable value
    if (value >= 1 && value < 1000) {
      return value * 1000;
    } else if (value >= 1000) {
      return value;
    }
  }

  return null;
}

/**
 * Parse year from text (4-digit number between 1990-2030)
 */
function parseYear(text: string): number | null {
  const yearPattern = /\b(19\d{2}|20[0-3]\d)\b/;
  const match = text.match(yearPattern);
  if (match) {
    return parseInt(match[1], 10);
  }
  return null;
}

/**
 * Parse color from text
 */
function parseColor(text: string): string | null {
  const lowerText = text.toLowerCase();

  // Check Spanish colors
  for (const color of COLORS.es) {
    if (lowerText.includes(color)) {
      return color.charAt(0).toUpperCase() + color.slice(1);
    }
  }

  // Check English colors
  for (const color of COLORS.en) {
    if (lowerText.includes(color)) {
      return color.charAt(0).toUpperCase() + color.slice(1);
    }
  }

  return null;
}

/**
 * Detect action (arrival or sale)
 */
function detectAction(text: string): VehicleAction {
  const lowerText = text.toLowerCase();

  // Check for sale keywords
  for (const keyword of SALE_KEYWORDS) {
    if (lowerText.includes(keyword)) {
      return 'sale';
    }
  }

  // Check for arrival keywords (explicit)
  for (const keyword of ARRIVAL_KEYWORDS) {
    if (lowerText.includes(keyword)) {
      return 'arrival';
    }
  }

  // Default to arrival if no keyword found
  return 'arrival';
}

/**
 * Parse make and model from text
 */
function parseMakeAndModel(text: string): { make: string; model: string } | null {
  const lowerText = text.toLowerCase();

  // Find the make
  let make: string | null = null;
  let makeIndex = -1;

  for (const carMake of CAR_MAKES) {
    const index = lowerText.indexOf(carMake);
    if (index !== -1) {
      make = carMake.charAt(0).toUpperCase() + carMake.slice(1);
      makeIndex = index;
      break;
    }
  }

  if (!make || makeIndex === -1) {
    return null;
  }

  // Extract model (alphanumeric sequence after make)
  const afterMake = text.slice(makeIndex + make.length).trim();

  // Model can be alphanumeric with spaces, hyphens
  const modelPattern = /^([a-z0-9\-]+(?:\s+[a-z0-9\-]+)?)/i;
  const modelMatch = afterMake.match(modelPattern);

  if (!modelMatch) {
    return null;
  }

  // Clean up the model
  let model = modelMatch[1].trim();

  // Remove common words that aren't part of the model
  const stopWords = ['en', 'rojo', 'azul', 'negro', 'blanco', 'gris', 'plata', 'verde', 'red', 'blue', 'black', 'white', 'gray', 'silver', 'green'];
  const modelWords = model.split(/\s+/);
  const cleanedWords = modelWords.filter(word => !stopWords.includes(word.toLowerCase()));
  model = cleanedWords.join(' ');

  if (!model) {
    return null;
  }

  return { make, model };
}

/**
 * Main parser function
 * Returns parsed vehicle data or null if incomplete
 */
export function parseVehicleInput(text: string): ParsedVehicle | null {
  if (!text || text.trim().length < 3) {
    return null;
  }

  // Parse make and model (required)
  const makeAndModel = parseMakeAndModel(text);
  if (!makeAndModel) {
    return null;
  }

  // Parse action
  const action = detectAction(text);

  // Parse optional fields
  const year = parseYear(text);
  const color = parseColor(text);
  const price = parsePrice(text);

  return {
    make: makeAndModel.make,
    model: makeAndModel.model,
    year: year || undefined,
    color: color || undefined,
    price: price || 0,
    action,
  };
}

/**
 * Validate if the parsed vehicle is complete enough to submit
 * For arrivals: make + model is enough
 * For sales: make + model + price is required
 */
export function isValidVehicle(parsed: ParsedVehicle | null): boolean {
  if (!parsed) {
    return false;
  }

  // Must have make and model
  if (!parsed.make || !parsed.model) {
    return false;
  }

  // For sales, must have a price
  if (parsed.action === 'sale' && (!parsed.price || parsed.price === 0)) {
    return false;
  }

  return true;
}
