import pinoHttp from 'pino-http'
import { logger } from '.'
import { randomUUID } from 'crypto'
export const httpLogger = pinoHttp({
  logger,

  genReqId: (req, _res) => {
    return (req.headers['x-request-id'] as string) || randomUUID()
  },

  serializers: {
    req(req) {
      return {
        method: req.method,
        url: req.url,
      }
    },

    res(res) {
      return {
        statusCode: res.statusCode ?? 0,
      }
    },
  },

  customLogLevel: (_req, res, err) => {
    const status = res.statusCode ?? 500

    if (err || status >= 500) return 'error'
    if (status >= 400) return 'warn'
    return 'info'
  },

  customSuccessMessage(req, res) {
    return `${req.method} ${req.url} ${res.statusCode ?? 0}`
  },

  customErrorMessage(req, res, err) {
    return `${req.method} ${req.url} ${res.statusCode ?? 0} - ${err?.message}`
  },
})
