// ============================================================
// Boxtacks - Core TypeScript Interfaces
// ============================================================

export type ProductStatus =
  | 'idea'
  | 'designing'
  | 'sample-ordered'
  | 'in-revision'
  | 'approved'
  | 'production-ready';

export type WorkspaceMode = '2d' | 'mockup' | '3d' | 'details';

export type AppView = 'dashboard' | 'workspace' | 'templates' | 'manufacturing' | 'inventory' | 'analytics' | 'brand-assets';

export type DesignElementType = 'text' | 'image' | 'rect' | 'circle' | 'line';

export type ProductView = 'front' | 'back' | 'sleeve' | 'side';

// ------------------------------------------------------------------
// Design Zones
// ------------------------------------------------------------------
export type ZonePriority = 'primary' | 'secondary' | 'optional' | 'exclusion';

export type ZoneShape = 'rect' | 'ellipse';

export interface SafeArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PrintBoundary {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DesignZone {
  id: string;
  label: string;
  shortLabel: string;          // e.g. "LC" for Left Chest
  hint: string;                // Smart contextual design tip
  tip?: string;                // Secondary/bonus tip
  productTypes: string[];      // Which product types this zone applies to
  applicableViews: ProductView[];
  x: number;                   // Pixels on reference canvas
  y: number;
  width: number;
  height: number;
  shape: ZoneShape;
  priority: ZonePriority;
  color: string;               // Zone border/accent color
  safeArea?: SafeArea;         // Inner safe area inset
  printBoundary?: PrintBoundary;
  recommendedTemplateTypes?: string[];
  suggestedElementSize?: { width: number; height: number };
  isVisible: boolean;          // User can toggle per-zone
}

export interface ProductTypeZoneConfig {
  productType: string;
  displayName: string;
  referenceCanvasWidth: number;
  referenceCanvasHeight: number;
  defaultView: ProductView;
  zones: DesignZone[];
  defaultActiveZoneId?: string;
  layoutSuggestions?: LayoutSuggestion[];
}

export interface LayoutSuggestion {
  id: string;
  label: string;
  description: string;
  icon: string;
  zoneIds: string[];           // Zones used in this layout
}

// Zone state tracked in the store
export interface ZoneState {
  zonesVisible: boolean;
  activeZoneId: string | null;
  hiddenZoneIds: string[];     // User-toggled off zones
  customZones: DesignZone[];   // User-added custom zones
}

// ------------------------------------------------------------------
// Design Canvas
// ------------------------------------------------------------------
export interface DesignElement {
  id: string;
  type: DesignElementType;
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation?: number;
  // Text
  content?: string;
  fontSize?: number;
  fontFamily?: string;
  fontStyle?: string;
  align?: string;
  // Style
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  // Image
  src?: string;
  // Control
  locked?: boolean;
  visible?: boolean;
  name?: string;
}

export interface DesignData {
  elements: DesignElement[];
  background: string;
  width: number;
  height: number;
  currentView: ProductView;
}

// ------------------------------------------------------------------
// Costing
// ------------------------------------------------------------------
export interface CostingData {
  unitCost: number;
  packagingCost: number;
  shippingCost: number;
  laborCost: number;
  overheadCost: number;
  targetSellingPrice: number;
  wholesalePrice: number;
  retailPrice: number;
  currency: string;
}

// ------------------------------------------------------------------
// Manufacturing
// ------------------------------------------------------------------
export interface ManufacturingData {
  supplierName: string;
  moq: number;
  leadTime: string;
  productionNotes: string;
  country: string;
  sampleStatus: 'not-started' | 'requested' | 'received' | 'approved' | 'rejected';
  revisionApproval: string;
  packagingRequirements: string;
  contactEmail?: string;
  contactPhone?: string;
}

// ------------------------------------------------------------------
// Product Item
// ------------------------------------------------------------------
export interface ProductItem {
  id: string;
  name: string;
  categoryId: string;
  sku: string;
  status: ProductStatus;
  type: string;
  thumbnail?: string;
  color?: string;
  tags: string[];
  description?: string;
  materials?: string;
  dimensions?: string;
  weight?: string;
  printNotes?: string;
  manufacturingNotes?: string;
  brandNotes?: string;
  costing?: CostingData;
  manufacturing?: ManufacturingData;
  designData?: DesignData;
  revisionHistory?: RevisionEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface RevisionEntry {
  id: string;
  version: string;
  note: string;
  date: string;
  author: string;
}

// ------------------------------------------------------------------
// Category
// ------------------------------------------------------------------
export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  description?: string;
  items: ProductItem[];
  isExpanded: boolean;
  order: number;
}

// ------------------------------------------------------------------
// Template
// ------------------------------------------------------------------
export type TemplateCategory =
  | 'Apparel'
  | 'Packaging'
  | 'Stationery'
  | 'Poster'
  | 'Business';

export interface Template {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  tags: string[];
  color: string;
  icon: string;
  isPremium: boolean;
  designData?: Partial<DesignData>;
}

// ------------------------------------------------------------------
// Asset
// ------------------------------------------------------------------
export interface Asset {
  id: string;
  name: string;
  type: 'logo' | 'graphic' | 'pattern' | 'font' | 'icon';
  src: string;
  tags: string[];
  createdAt: string;
}

// ------------------------------------------------------------------
// Workspace / Project
// ------------------------------------------------------------------
export interface Project {
  id: string;
  name: string;
  description?: string;
  categories: Category[];
  assets: Asset[];
  createdAt: string;
  updatedAt: string;
}

// ------------------------------------------------------------------
// Notifications
// ------------------------------------------------------------------
export interface AppNotification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  read: boolean;
  createdAt: string;
}

// ------------------------------------------------------------------
// UI State
// ------------------------------------------------------------------
export interface AppUIState {
  sidebarExpanded: boolean;
  rightPanelExpanded: boolean;
  activeItemId: string | null;
  activeCategoryId: string | null;
  workspaceMode: WorkspaceMode;
  currentView: AppView;
  activeRightTab: string;
  activeNavTab: string;
  searchQuery: string;
  isNewCategoryModalOpen: boolean;
  isNewItemModalOpen: boolean;
  isTemplateGalleryOpen: boolean;
  selectedElementId: string | null;
  isDirty: boolean;
  lastSaved: string | null;
  notification: { type: 'success' | 'error' | 'info'; message: string } | null;
  notifications: AppNotification[];
}
