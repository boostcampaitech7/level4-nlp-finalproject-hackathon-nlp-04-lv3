import { create } from 'zustand'

interface SignupFormState {
  formData: {
    name: string
    username: string
    password: string
    confirmPassword: string
    level: number
  }
  setName: (name: string) => void
  setUsername: (username: string) => void
  setPassword: (password: string) => void
  setConfirmPassword: (password: string) => void
  setFormData: (name: string, value: string) => void
  setLevel: (level: number) => void
}

export const useSignupFormStore = create<SignupFormState>()((set) => ({
  formData: {
    name: '',
    username: '',
    password: '',
    confirmPassword: '',
    level: 0,
  },
  setName: (name) =>
    set((state) => ({ formData: { ...state.formData, name: name } })),
  setUsername: (username) =>
    set((state) => ({
      formData: { ...state.formData, username: username },
    })),
  setPassword: (password) =>
    set((state) => ({
      formData: { ...state.formData, password: password },
    })),
  setConfirmPassword: (confirmPassword) =>
    set((state) => ({
      formData: { ...state.formData, confirmPassword: confirmPassword },
    })),
  setFormData: (name, value) => {
    set((state) => ({
      formData: { ...state.formData, [name]: value },
    }))
  },
  setLevel: (level: number) =>
    set((state) => ({ formData: { ...state.formData, level: level } })),
}))
