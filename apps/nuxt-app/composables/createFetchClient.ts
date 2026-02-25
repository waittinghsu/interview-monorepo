import type { FetchContext, FetchOptions } from 'ofetch'
import { ofetch } from 'ofetch'

export interface RequestMeta {
  baseURL?: string
  useYApiMock?: boolean
  skipLoading?: boolean
  silentError?: boolean
  rawResponse?: boolean
  encrypt?: boolean
  decrypt?: boolean
}

// 擴展 FetchOptions 以支援 _meta
export interface ExtendedFetchOptions<R extends any = any> extends FetchOptions {
  _meta?: RequestMeta
}

// 自定義 Fetch 函數型別
export type ExtendedFetch = <T = any>(
  request: string,
  options?: ExtendedFetchOptions
) => Promise<T>

export interface FetchClientOptions {
  baseURL?: string
  serverBaseURL?: string
  timeout?: number
  getToken?: () => string | null

  // Response format
  responseFormat?: {
    enabled: boolean
    codeKey: string
    successCode: string
    dataKey: string
    msgKey: string
    onBusinessError?: (code: string, msg: string, response: any) => void
  }

  // Callbacks
  onRequestStart?: (request: FetchContext) => void
  onRequestEnd?: () => void
  onUnauthorized?: () => void
  onForbidden?: (response: any) => void
  onBadRequest?: (response: any) => void
  onServerError?: (response: any) => void
  onNetworkError?: (error: any) => void

  // Tracking
  onTrackRequest?: (data: any) => void
  onTrackResponse?: (data: any) => void

  // Crypto
  encryptRequest?: (data: any, request: any) => any
  decryptResponse?: (data: any, request: any) => any
}

export function createFetchClient(options: FetchClientOptions): ExtendedFetch {
  const {
    baseURL: clientBaseURL,
    serverBaseURL,
    timeout = 10000,
    getToken,
    responseFormat,
    onRequestStart,
    onRequestEnd,
    onUnauthorized,
    onForbidden,
    onBadRequest,
    onServerError,
    onNetworkError,
    onTrackRequest,
    onTrackResponse,
    encryptRequest,
    decryptResponse,
  } = options

  // 根據環境選擇 baseURL
  const baseURL = import.meta.server
    ? (serverBaseURL || clientBaseURL)
    : clientBaseURL

  const client = ofetch.create({
    baseURL,
    timeout,

    // Request interceptor
    async onRequest(context: FetchContext) {
      const meta = (context.options as ExtendedFetchOptions)?._meta

      // 1. BaseURL override（Mock 機制）
      if (meta?.baseURL) {
        context.options.baseURL = meta.baseURL
      }
      else if (meta?.useYApiMock && import.meta.env.VITE_YAPI_BASE_URL) {
        context.options.baseURL = import.meta.env.VITE_YAPI_BASE_URL
      }

      // 2. Token injection
      if (getToken) {
        const token = getToken()
        if (token) {
          context.options.headers = new Headers(context.options.headers)
          context.options.headers.set('Authorization', `Bearer ${token}`)
        }
      }

      // 3. Loading start
      if (onRequestStart) {
        onRequestStart(context)
      }

      // 4. Request tracking
      if (onTrackRequest) {
        onTrackRequest({
          method: context.options.method || 'GET',
          url: context.request,
          timestamp: Date.now(),
        })
      }

      // 5. Encrypt request body
      if (meta?.encrypt && encryptRequest && context.options.body) {
        context.options.body = encryptRequest(context.options.body, context)
      }
    },

    // Response interceptor
    async onResponse(context: FetchContext) {
      const meta = (context.options as ExtendedFetchOptions)?._meta

      try {
        if (!context.response)
          return

        let responseData = context.response._data

        // 1. Decrypt response
        if (meta?.decrypt && decryptResponse) {
          responseData = decryptResponse(responseData, context)
        }

        // 2. Response tracking
        if (onTrackResponse) {
          onTrackResponse({
            status: context.response.status,
            method: context.options.method || 'GET',
            url: context.request,
            timestamp: Date.now(),
          })
        }

        // 3. Business format unwrapping
        if (responseFormat?.enabled && !meta?.rawResponse) {
          const {
            codeKey,
            successCode,
            dataKey,
            msgKey,
            onBusinessError,
          } = responseFormat

          const code = responseData[codeKey]
          const data = responseData[dataKey]
          const msg = responseData[msgKey]

          if (code !== successCode) {
            // Business error
            if (onBusinessError && !meta?.silentError) {
              onBusinessError(code, msg, responseData)
            }
            throw new Error(msg || 'Business Error')
          }

          // Return unwrapped data
          context.response._data = data
        }
      }
      finally {
        // 4. Loading end
        if (onRequestEnd) {
          onRequestEnd()
        }
      }
    },

    // Error interceptor
    async onResponseError(context: FetchContext) {
      const meta = (context.options as ExtendedFetchOptions)?._meta

      try {
        const status = context.response?.status

        if (!meta?.silentError) {
          // HTTP status code error handling
          if (status === 401 && onUnauthorized) {
            onUnauthorized()
          }
          else if (status === 403 && onForbidden) {
            onForbidden(context.response)
          }
          else if (status === 400 && onBadRequest) {
            onBadRequest(context.response)
          }
          else if (status && status >= 500 && onServerError) {
            onServerError(context.response)
          }
          else if (!status && onNetworkError) {
            // Network error (no response)
            onNetworkError(context.error)
          }
        }
      }
      finally {
        // Loading end
        if (onRequestEnd) {
          onRequestEnd()
        }
      }

      // Re-throw error
      throw context.error
    },
  })

  return client as ExtendedFetch
}
