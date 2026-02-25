import type { FetchContext } from 'ofetch'
import type { ExtendedFetchOptions, FetchClientOptions } from './createFetchClient'

/**
 * 建立 Request 攔截器
 */
export function createRequestInterceptor(options: {
  getToken?: () => string | null
  onLoadingStart?: () => void
  onTrack?: (data: any) => void
  onEncrypt?: (data: any, context: any) => any
}) {
  const { getToken, onLoadingStart, onTrack, onEncrypt } = options

  return (context: FetchContext) => {
    const meta = (context.options as ExtendedFetchOptions)?._meta

    // Token injection
    if (getToken) {
      const token = getToken()
      if (token) {
        context.options.headers = new Headers(context.options.headers)
        context.options.headers.set('Authorization', `Bearer ${token}`)
      }
    }

    // Loading start
    if (!meta?.skipLoading && onLoadingStart) {
      onLoadingStart()
    }

    // Request tracking
    if (onTrack) {
      onTrack({
        method: context.options.method || 'GET',
        url: context.request,
        timestamp: Date.now(),
      })
    }

    // Encrypt request body
    if (meta?.encrypt && onEncrypt && context.options.body) {
      context.options.body = onEncrypt(context.options.body, context)
    }
  }
}

/**
 * 建立 Response 攔截器
 */
export function createResponseInterceptor(options: {
  onLoadingEnd?: () => void
  onTrack?: (data: any) => void
  onDecrypt?: (data: any, context: any) => any
  responseFormat?: FetchClientOptions['responseFormat']
}) {
  const { onLoadingEnd, onTrack, onDecrypt, responseFormat } = options

  return (context: FetchContext) => {
    const meta = (context.options as ExtendedFetchOptions)?._meta

    try {
      if (!context.response)
        return

      let responseData = context.response._data

      // Decrypt response
      if (meta?.decrypt && onDecrypt) {
        responseData = onDecrypt(responseData, context)
      }

      // Response tracking
      if (onTrack) {
        onTrack({
          status: context.response.status,
          method: context.options.method || 'GET',
          url: context.request,
          timestamp: Date.now(),
        })
      }

      // Business format unwrapping
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
      // Loading end
      if (onLoadingEnd) {
        onLoadingEnd()
      }
    }
  }
}

/**
 * 建立 Error 攔截器
 */
export function createErrorInterceptor(options: {
  onLoadingEnd?: () => void
  onUnauthorized?: () => void
  onForbidden?: (response: any) => void
  onBadRequest?: (response: any) => void
  onServerError?: (response: any) => void
  onNetworkError?: (error: any) => void
}) {
  const {
    onLoadingEnd,
    onUnauthorized,
    onForbidden,
    onBadRequest,
    onServerError,
    onNetworkError,
  } = options

  return (context: FetchContext) => {
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
      if (onLoadingEnd) {
        onLoadingEnd()
      }
    }

    // Re-throw error
    throw context.error
  }
}
