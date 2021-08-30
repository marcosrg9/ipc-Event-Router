export interface ipcRouterEventHandler {

    event: string
    handler: Function

}

export interface pathRouterEventHandler {

    path: string
    events: ipcRouterEventHandler[] //| pathRouterEventHandler
    /** Función o promesa que debe devolver true para que el router cargue los eventos. */
    canActivate?: () => boolean | Promise<boolean>

}

export interface ipcRouter {

    navigateEvent: string
    /* router: {
        0: pathRouterEventHandler
    } & pathRouterEventHandler[]; */
    router: pathRouterEventHandler[]
    //params?: ipcRouterParams
    
}

interface ipcRouterParams {

    /* No lanza excepciones si el router está vacío */
    ignoreEmptyRouter?: boolean
    /* Profundidad máxima de rutas */
    depth?: number | 'max'
    /* Declara si los errores se emitirán. */
    errorAnnouncement?: {
        /* Canal del emisor de eventos por el cual se emitirán los errores. */
        channel: string
        /* Emitir eventos al propio renderizador. */
        announceRenderer: boolean
    }

}