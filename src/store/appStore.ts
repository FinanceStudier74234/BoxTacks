// ============================================================
// Boxtacks - Zustand App State Store
// ============================================================
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { sampleCategories, sampleTemplates, sampleAssets } from '@/data/sampleData';
import type {
  Category,
  ProductItem,
  Template,
  Asset,
  AppUIState,
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
  openNewItemModal: (categoryId?: string) => void;
  closeNewItemModal: () => void;
  setTemplateGalleryOpen: (v: boolean) => void;
  setSelectedElement: (id: string | null) => void;
  setNotification: (n: AppUIState['notification']) => void;
  triggerSave: () => void;

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

  // Design Actions
  addDesignElement: (itemId: string, element: Omit<DesignElement, 'id'>) => void;
  updateDesignElement: (itemId: string, elementId: string, updates: Partial<DesignElement>) => void;
  deleteDesignElement: (itemId: string, elementId: string) => void;

  // Getters
  getActiveItem: () => ProductItem | null;
  getItemById: (id: string) => ProductItem | null;
  getCategoryById: (id: string) => Category | null;
  getAllItems: () => ProductItem[];

  // Pending category for new item
  pendingCategoryId: string | null;
}

export const useAppStore = create<AppStore>((set, get) => ({
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
  pendingCategoryId: null,

  // ---- Initial Data ----
  categories: sampleCategories,
  templates: sampleTemplates,
  assets: sampleAssets,

  // ---- UI Actions ----
  setSidebarExpanded: (v) => set({ sidebarExpanded: v }),
  setRightPanelExpanded: (v) => set({ rightPanelExpanded: v }),

  setActiveItem: (id) => {
    if (!id) return set({ activeItemId: null, currentView: 'dashboard' });
    // Also expand category if needed
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

  openNewItemModal: (categoryId) =>
    set({ isNewItemModalOpen: true, pendingCategoryId: categoryId || null }),
  closeNewItemModal: () =>
    set({ isNewItemModalOpen: false, pendingCategoryId: null }),

  setTemplateGalleryOpen: (v) => set({ isTemplateGalleryOpen: v }),
  setSelectedElement: (id) => set({ selectedElementId: id }),

  setNotification: (n) => {
    set({ notification: n });
    if (n) setTimeout(() => set({ notification: null }), 3000);
  },

  triggerSave: () => {
    set({ isDirty: false, lastSaved: new Date().toISOString() });
    get().setNotification({ type: 'success', message: 'Project saved successfully' });
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
  },

  updateCategory: (id, updates) => {
    set((state) => ({
      categories: state.categories.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
      isDirty: true,
    }));
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
}));
