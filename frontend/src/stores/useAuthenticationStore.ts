import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'

type TokenClaims = {
  "token_type": string;
  "exp": number;
  "iat": number;
  "jti": number;
  "user_id": number;
  "is_superuser": boolean;
} | null

export const useAuthenticationStore = defineStore('authentication', () => {
  function useDecodeJwt(token: string) {
    const payload = token.split(".")[1];
    if (!payload) return null
    try {
      const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
      return JSON.parse(decoded);
    } catch (e) {
      console.error("Invalid JWT:", e);
      return null;
    }
  }

  const accessToken = ref<string | null>(sessionStorage.getItem("accesstoken"))
  const refreshToken = ref<string | null>(localStorage.getItem("refreshtoken"))
  const tokenClaims = reactive<{ value: TokenClaims }>({
    value: accessToken.value ? useDecodeJwt(accessToken.value) : null
  })

  function setAccessToken(token: string | null) {
    accessToken.value = token
    if (token) {
      sessionStorage.setItem("accesstoken", token)
      tokenClaims.value = useDecodeJwt(token)
    } else {
      sessionStorage.removeItem("accesstoken")
      tokenClaims.value = null
    }
  }

  function setRefreshToken(token: string | null) {
    refreshToken.value = token
    if (token) {
      localStorage.setItem("refreshtoken", token)
    } else {
      localStorage.removeItem("refreshtoken")
    }
  }

  function cleanSession() {
    setAccessToken(null)
    setRefreshToken(null)
  }

  function isAuthenticated() {
    if (!accessToken.value || !tokenClaims.value) {
      return false;
    }
    const currentTimeInSeconds = Date.now() / 1000;
    return currentTimeInSeconds < tokenClaims.value.exp;
  }

  return {
    accessToken,
    refreshToken,
    tokenClaims,
    isAuthenticated,
    cleanSession,
    setAccessToken,
    setRefreshToken
  }
})
