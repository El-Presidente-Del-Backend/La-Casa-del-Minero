"use client"

import { createContext, useContext, useCallback, useEffect, useReducer, type ReactNode } from "react"
import type { Product } from "@/lib/products"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CartItem = {
  product: Product
  quantity: number
}

type CartState = {
  items: CartItem[]
  isOpen: boolean
}

type CartAction =
  | { type: "ADD_ITEM"; product: Product; quantity: number }
  | { type: "REMOVE_ITEM"; productId: string }
  | { type: "UPDATE_QUANTITY"; productId: string; quantity: number }
  | { type: "CLEAR" }
  | { type: "SET_OPEN"; open: boolean }
  | { type: "HYDRATE"; items: CartItem[] }

type CartContextValue = {
  items: CartItem[]
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find((i) => i.product.id === action.product.id)
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.product.id === action.product.id
              ? { ...i, quantity: Math.min(10, i.quantity + action.quantity) }
              : i
          ),
        }
      }
      return {
        ...state,
        items: [...state.items, { product: action.product, quantity: action.quantity }],
      }
    }
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((i) => i.product.id !== action.productId) }
    case "UPDATE_QUANTITY": {
      if (action.quantity <= 0) {
        return { ...state, items: state.items.filter((i) => i.product.id !== action.productId) }
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.product.id === action.productId
            ? { ...i, quantity: Math.min(10, action.quantity) }
            : i
        ),
      }
    }
    case "CLEAR":
      return { ...state, items: [] }
    case "SET_OPEN":
      return { ...state, isOpen: action.open }
    case "HYDRATE":
      return { ...state, items: action.items }
    default:
      return state
  }
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const CartContext = createContext<CartContextValue | null>(null)

const STORAGE_KEY = "la-casa-del-minero-cart"

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false })

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const items = JSON.parse(stored) as CartItem[]
        dispatch({ type: "HYDRATE", items })
      }
    } catch {
      // ignore
    }
  }, [])

  // Persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items))
    } catch {
      // ignore
    }
  }, [state.items])

  const addItem = useCallback((product: Product, quantity = 1) => {
    dispatch({ type: "ADD_ITEM", product, quantity })
  }, [])

  const removeItem = useCallback((productId: string) => {
    dispatch({ type: "REMOVE_ITEM", productId })
  }, [])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", productId, quantity })
  }, [])

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR" })
  }, [])

  const setIsOpen = useCallback((open: boolean) => {
    dispatch({ type: "SET_OPEN", open })
  }, [])

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = state.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isOpen: state.isOpen,
        setIsOpen,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
