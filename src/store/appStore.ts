// ============================================================
// Boxtacks - Zustand App State Store (with localStorage persistence)
// ============================================================
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { sampleCategories, sampleTemplates, sampleAssets } from '@/data/sampleData';
import type {
  Category,
  ProductItem,
  Template,
  Asset,
  AppUIState,
  AppNotification,
  WorkspaceMode,
  AppView,
  CostingData,
  ManufacturingData,
  DesignData,
  DesignElement,
  ProductStatus,
} from '@/types';

interface AppStore extends AppUIState {
  // Data
  categories: Category[];
  templates: Template[];
  assets: Asset[];

  // UI Actions
  setSidebarExpanded: (v: boolean) => void;
  setRightPanelExpanded: (v: boolean) => void;
  setActiveItem: (id: string | null) => void;
  setActiveCategory: (id: string | null) => void;
  setWorkspaceMode: (mode: WorkspaceMode) => void;
  setCurrentView: (view: AppView) => void;
  setActiveRightTab: (tab: string) => void;
  setActiveNavTab: (tab: string) => void;
  setSearchQuery: (q: string) => void;
  openNewCategoryModal: () => void;
  closeNewCategoryModal: () => void;
  openNewItemModal: (categoryId?: string, productType?: string) => void;
  closeNewItemModal: () => void;
  setTemplateGalleryOpen: (v: boolean) => void;
  setSelectedElement: (id: string | null) => void;
  setNotification: (n: AppUIState['notification']) => void;
  triggerSave: () => void;

  // Notification History Actions
  addNotification: (type: AppNotification['type'], message: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  getUnreadCount: () => number;

  // Category Actions
  addCategory: (name: string, color: string, icon: string) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  toggleCategoryExpanded: (id: string) => void;

  // Item Actions
  addItem: (item: Omit<ProductItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateItem: (id: string, updates: Partial<ProductItem>) => void;
  deleteItem: (id: string) => void;
  updateItemCosting: (id: string, costing: CostingData) => void;
  updateItemManufacturing: (id: string, mfg: ManufacturingData) => void;
  updateItemDesign: (id: string, design: DesignData) => void;
  updateItemStatus: (id: string, status: ProductStatus) => void;
  duplicateItem: (id: string) => void;

  // Asset Actions
  addAsset: (asset: Omit<Asset, 'id' | 'createdAt'>) => void;
  updateAsset: (id: string, updates: Partial<Asset>) => void;
  deleteAsset: (id: string) => void;

  // Design Actions
  addDesignElement: (itemId: string, element: Omit<DesignElement, 'id'>) => void;
  updateDesignElement: (itemId: string, elementId: string, updates: Partial<DesignElement>) => void;
  deleteDesignElement: (itemId: string, elementId: string) => void;

  // Search
  getFilteredItems: (query?: string) => ProductItem[];

  // Getters
  getActiveItem: () => ProductItem | null;
  getItemById: (id: string) => ProductItem | null;
  getCategoryById: (id: string) => Category | null;
  getAllItems: () => ProductItem[];

  // Pending state for new item modal
  pendingCategoryId: string | null;
  pendingProductType: string | null;

  // Hydration flag
  _hasHydrated: boolean;
}

// Helper: persist to localStorage
const persistToStorage = () => {
  try {
    const state = useAppStore.getState();
    const data = {
      categories: state.categories,
      assets: state.assets,
      notifications: state.notifications,
    };
    localStorage.setItem('boxtacks-data', JSON.stringify(data));
  } catch {
    // localStorage unavailable (SSR)
  }
};

const loadFromStorage = (): Partial<Pick<AppStore, 'categories' | 'assets' | 'notifications'>> | null => {
  try {
    const raw = localStorage.getItem('boxtacks-data');
    if (raw) return JSON.parse(raw);
  } catch {
    // localStorage unavailable (SSR)
  }
  return null;
};

export const useAppStore = create<AppStore>((set, get) => {
  // Try loading persisted data
  let initialCategories = sampleCategories;
  let initialAssets = sampleAssets;
  let initialNotifications: AppNotification[] = [];

  if (typeof window !== 'undefined') {
    const saved = loadFromStorage();
    if (saved) {
      if (saved.categories && saved.categories.length > 0) initialCategories = saved.categories;
      if (saved.assets && saved.assets.length > 0) initialAssets = saved.assets;
      if (saved.notifications) initialNotifications = saved.notifications;
    }
  }

  return {
    // ---- Initial UI State ----
    sidebarExpanded: true,
    rightPanelExpanded: true,
    activeItemId: 'item-pnl-hoodie',
    activeCategoryId: 'cat-apparel',
    workspaceMode: '2d',
    currentView: 'dashboard',
    activeRightTab: 'product',
    activeNavTab: 'Workspace',
    searchQuery: '',
    isNewCategoryModalOpen: false,
    isNewItemModalOpen: false,
    isTemplateGalleryOpen: false,
    selectedElementId: null,
    isDirty: false,
    lastSaved: new Date().toISOString(),
    notification: null,
    notifications: initialNotifications,
    pendingCategoryId: null,
    pendingProductType: null,
    _hasHydrated: false,

    // ---- Initial Data ----
    categories: initialCategories,
    templates: sampleTemplates,
    assets: initialAssets,

    // ---- UI Actions ----
    setSidebarExpanded: (v) => set({ sidebarExpanded: v }),
    setRightPanelExpanded: (v) => set({ rightPanelExpanded: v }),

    setActiveItem: (id) => {
      if (!id) return set({ activeItemId: null, currentView: 'dashboard' });
      const item = get().getItemById(id);
      if (item) {
        set({
          activeItemId: id,
          activeCategoryId: item.categoryId,
          currentView: 'workspace',
          isDirty: false,
        });
      }
    },

    setActiveCategory: (id) => set({ activeCategoryId: id }),
    setWorkspaceMode: (mode) => set({ workspaceMode: mode }),
    setCurrentView: (view) => set({ currentView: view }),
    setActiveRightTab: (tab) => set({ activeRightTab: tab }),
    setActiveNavTab: (tab) => set({ activeNavTab: tab }),
    setSearchQuery: (q) => set({ searchQuery: q }),

    openNewCategoryModal: () => set({ isNewCategoryModalOpen: true }),
    closeNewCategoryModal: () => set({ isNewCategoryModalOpen: false }),

    openNewItemModal: (categoryId, productType) =>
      set({
        isNewItemModalOpen: true,
        pendingCategoryId: categoryId || null,
        pendingProductType: productType || null,
      }),
    closeNewItemModal: () =>
      set({ isNewItemModalOpen: false, pendingCategoryId: null, pendingProductType: null }),

    setTemplateGalleryOpen: (v) => set({ isTemplateGalleryOpen: v }),
    setSelectedElement: (id) => set({ selectedElementId: id }),

    setNotification: (n) => {
      set({ notification: n });
      if (n) {
        // Also add to notification history
        get().addNotification(n.type, n.message);
        setTimeout(() => set({ notification: null }), 3000);
      }
    },

    triggerSave: () => {
      // Persist to localStorage
      set({ isDirty: false, lastSaved: new Date().toISOString() });
      persistToStorage();
      get().setNotification({ type: 'success', message: 'Project saved successfully' });
    },

    // ---- Notification History ----
    addNotification: (type, message) => {
      const notif: AppNotification = {
        id: uuidv4(),
        type,
        message,
        read: false,
        createdAt: new Date().toISOString(),
      };
      set((state) => ({
        notifications: [notif, ...state.notifications].slice(0, 50), // Keep last 50
      }));
    },

    markNotificationRead: (id) => {
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        ),
      }));
    },

    markAllNotificationsRead: () => {
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
      }));
    },

    clearNotifications: () => set({ notifications: [] }),

    getUnreadCount: () => {
      return get().notifications.filter((n) => !n.read).length;
    },

    // ---- Category Actions ----
    addCategory: (name, color, icon) => {
      const newCat: Category = {
        id: uuidv4(),
        name,
        color,
        icon,
        items: [],
        isExpanded: true,
        order: get().categories.length,
      };
      set((state) => ({ categories: [...state.categories, newCat], isDirty: true }));
      persistToStorage();
    },

    updateCategory: (id, updates) => {
      set((state) => ({
        categories: state.categories.map((c) =>
          c.id === id ? { ...c, ...updates } : c
        ),
        isDirty: true,
      }));
      persistToStorage();
    },

    deleteCategory: (id) => {
      set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
        activeCategoryId:
          state.activeCategoryId === id ? null : state.activeCategoryId,
        activeItemId: state.categories
          .find((c) => c.id === id)
          ?.items.some((i) => i.id === state.activeItemId)
          ? null
          : state.activeItemId,
        isDirty: true,
      }));
      persistToStorage();
    },

    toggleCategoryExpanded: (id) => {
      set((state) => ({
        categories: state.categories.map((c) =>
          c.id === id ? { ...c, isExpanded: !c.isExpanded } : c
        ),
      }));
    },

    // ---- Item Actions ----
    addItem: (item) => {
      const newItem: ProductItem = {
        ...item,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      set((state) => ({
        categories: state.categories.map((c) =>
          c.id === item.categoryId
            ? { ...c, items: [...c.items, newItem], isExpanded: true }
            : c
        ),
        activeItemId: newItem.id,
        activeCategoryId: item.categoryId,
        currentView: 'workspace',
        isDirty: true,
      }));
      persistToStorage();
    },

    updateItem: (id, updates) => {
      set((state) => ({
        categories: state.categories.map((c) => ({
          ...c,
          items: c.items.map((i) =>
            i.id === id
              ? { ...i, ...updates, updatedAt: new Date().toISOString() }
              : i
          ),
        })),
        isDirty: true,
      }));
      persistToStorage();
    },

    deleteItem: (id) => {
      set((state) => ({
        categories: state.categories.map((c) => ({
          ...c,
          items: c.items.filter((i) => i.id !== id),
        })),
        activeItemId: state.activeItemId === id ? null : state.activeItemId,
        isDirty: true,
      }));
      persistToStorage();
    },

    updateItemCosting: (id, costing) => {
      get().updateItem(id, { costing });
    },

    updateItemManufacturing: (id, mfg) => {
      get().updateItem(id, { manufacturing: mfg });
    },

    updateItemDesign: (id, design) => {
      get().updateItem(id, { designData: design });
    },

    updateItemStatus: (id, status) => {
      get().updateItem(id, { status });
    },

    duplicateItem: (id) => {
      const item = get().getItemById(id);
      if (!item) return;
      const newItem: ProductItem = {
        ...item,
        id: uuidv4(),
        name: `${item.name} (Copy)`,
        sku: `${item.sku}-COPY`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      set((state) => ({
        categories: state.categories.map((c) =>
          c.id === item.categoryId
            ? { ...c, items: [...c.items, newItem] }
            : c
        ),
        activeItemId: newItem.id,
        isDirty: true,
      }));
      persistToStorage();
    },

    // ---- Asset Actions ----
    addAsset: (asset) => {
      const newAsset: Asset = {
        ...asset,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
      };
      set((state) => ({ assets: [...state.assets, newAsset], isDirty: true }));
      persistToStorage();
    },

    updateAsset: (id, updates) => {
      set((state) => ({
        assets: state.assets.map((a) => (a.id === id ? { ...a, ...updates } : a)),
        isDirty: true,
      }));
      persistToStorage();
    },

    deleteAsset: (id) => {
      set((state) => ({
        assets: state.assets.filter((a) => a.id !== id),
        isDirty: true,
      }));
      persistToStorage();
    },

    // ---- Design Actions ----
    addDesignElement: (itemId, element) => {
      const item = get().getItemById(itemId);
      if (!item) return;
      const newEl: DesignElement = { ...element, id: uuidv4() };
      const currentDesign = item.designData || {
        elements: [],
        background: '#FFFFFF',
        width: 500,
        height: 600,
        currentView: 'front' as const,
      };
      get().updateItemDesign(itemId, {
        ...currentDesign,
        elements: [...currentDesign.elements, newEl],
      });
      set({ selectedElementId: newEl.id });
    },

    updateDesignElement: (itemId, elementId, updates) => {
      const item = get().getItemById(itemId);
      if (!item?.designData) return;
      get().updateItemDesign(itemId, {
        ...item.designData,
        elements: item.designData.elements.map((el) =>
          el.id === elementId ? { ...el, ...updates } : el
        ),
      });
    },

    deleteDesignElement: (itemId, elementId) => {
      const item = get().getItemById(itemId);
      if (!item?.designData) return;
      get().updateItemDesign(itemId, {
        ...item.designData,
        elements: item.designData.elements.filter((el) => el.id !== elementId),
      });
      set({ selectedElementId: null });
    },

    // ---- Search ----
    getFilteredItems: (query) => {
      const q = (query ?? get().searchQuery).toLowerCase().trim();
      const all = get().getAllItems();
      if (!q) return all;
      return all.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.sku.toLowerCase().includes(q) ||
          item.type.toLowerCase().includes(q) ||
          item.tags.some((t) => t.toLowerCase().includes(q)) ||
          (item.description?.toLowerCase().includes(q) ?? false)
      );
    },

    // ---- Getters ----
    getActiveItem: () => {
      const { activeItemId } = get();
      if (!activeItemId) return null;
      return get().getItemById(activeItemId);
    },

    getItemById: (id) => {
      for (const cat of get().categories) {
        const item = cat.items.find((i) => i.id === id);
        if (item) return item;
      }
      return null;
    },

    getCategoryById: (id) => {
      return get().categories.find((c) => c.id === id) || null;
    },

    getAllItems: () => {
      return get().categories.flatMap((c) => c.items);
    },
  };
});
