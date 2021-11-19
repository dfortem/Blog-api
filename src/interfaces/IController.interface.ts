export interface IController {
  initRoutes(): any
}

export function routerPath(uri: string) {
  return `/api${uri}`
}

export default IController
