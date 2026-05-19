/**
 * CENTRALIZED ICON REGISTRY
 * 
 * STANDARD: All icons used in the frontend MUST be exported from this file.
 * This prevents build failures due to:
 * 1. Missing exports in specific versions of lucide-react.
 * 2. Duplicate imports in component files.
 * 3. Inconsistent naming.
 */

import { 
  Calendar, MapPin, Star, Utensils, Waves, 
  Wine, Users, ChevronRight, Globe, Menu, X,
  Wifi, Coffee, Wind, Phone, Camera,
  Search, Bell, LogOut, Home, Key, ShoppingCart, 
  Package, ChefHat, BedDouble, Wrench, Moon, 
  BarChart3, BellRing, Box, Bath, Tag, PieChart, 
  Coins, ShieldCheck, Settings, Building2, Database, 
  FileText, Settings2, Layout, ClipboardList, Lock,
  Plus, Trash2, Edit3, Save, Check, AlertCircle,
  ArrowRight, ArrowLeft, Image as LucideImage,
  Upload, Sparkles, Send
} from 'lucide-react';

// Re-export with alias for commonly missing or renamed icons
export const Instagram = Camera; // Instagram is missing in 1.8.0
export const Map = MapPin;        // Map is sometimes missing or renamed

// Standard Exports
export {
  Calendar, MapPin, Star, Utensils, Waves, 
  Wine, Users, ChevronRight, Globe, Menu, X,
  Wifi, Coffee, Wind, Phone, Camera,
  Search, Bell, LogOut, Home, Key, ShoppingCart, 
  Package, ChefHat, BedDouble, Wrench, Moon, 
  BarChart3, BellRing, Box, Bath, Tag, PieChart, 
  Coins, ShieldCheck, Settings, Building2, Database, 
  FileText, Settings2, Layout, ClipboardList, Lock,
  Plus, Trash2, Edit3, Save, Check, AlertCircle,
  ArrowRight, ArrowLeft, LucideImage as Image,
  Upload, Sparkles, Send
};

/**
 * DEVELOPMENT GUIDELINE:
 * Before using a new icon, verify its existence by running:
 * node -e "const lucide = require('lucide-react'); console.log('IconName' in lucide)"
 * 
 * If the icon is missing, add a compatible alias in this file.
 */
