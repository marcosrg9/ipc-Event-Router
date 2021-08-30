/**
 * @name ipc-event-router
 * @author Marcos Rodríguez Yélamo<marcosylrg@gmail.com>
 * @version 0.0.1
 * @license MIT
 * @link https://github.com/marcosrg9/ipc-Event-Router
 */

import { ipcMain } from 'electron';
import { Route } from './models/event.abstract.model';
import { ipcRouter,
         ipcRouterEventHandler,
         pathRouterEventHandler } from './models/interfaces/ipcRouter.interface';

export * from './models/interfaces/ipcRouter.interface'

export class Router {

    private current!: Route;

    constructor(routerParams: ipcRouter) {

        const { navigateEvent, router } = routerParams;

        // Si el evento de navegación no es una cadena, lanza un error.
        if (typeof navigateEvent !== 'string') throw new Error('Unknown navigation event type')

        // Si el tipo del router no es estrictamente igual a 'object', lanza error.
        if (typeof router === 'object') {

            // Si la longitud de índices en el router es inferior a 1, lanza error.
            if (router.length > 0) {

                // Empieza a escuchar eventos de navegación.
                ipcMain.on(navigateEvent, (_, path: string) => {

                    /*  Comprueba que la ruta es estrictamente igual a una cadena y que esta tenga
                        una longitud superior a 0. */
                    if(typeof path === 'string' && path.length > 0) {

                        // Recorre el router.
                        for(let route of router) {
    
                            /*  Comprueba que la ruta del router es estrictamente igual a la ruta
                                pasada como parámetro. */
                            if (route.path === path) {
                                // Delega al método privado para cargar la colección de eventos.
                                this.load(route);
                                break;
                                // Continúa buscando.
                            } continue;
                        }
                    }
                })

            } else {
                throw new Error('Empty router')
            }
        } else {
            throw new Error('Unknown router structure')
        }
    }

    private load(router: pathRouterEventHandler) {

        // Comprueba si ya hay una colección de eventos cargada en memoria.
        if (this.current) {
            // Comprueba que el método canActivate ha sido proporcionado.
            if (router.canActivate) {
                // Comprueba si canActivate es una instacia de Promise.
                if (router.canActivate instanceof Promise) {
                    // Pasa al método promiseWrapper la promesa para resolverla. 
                    this.promiseWrapper(router.canActivate, (pass: boolean) => {
                        // Si el resultado del parámetro del callback es true, continúa la carga.
                        if (pass === true) this.current.routes = router.events as ipcRouterEventHandler[];
                    })
                    // Continúa si canActivate no es una promesa.
                } else {
                    // Ejecuta el canActivate y comprueba que devuelva true. Entonces carga la colección.
                    if (router.canActivate() === true) this.current.routes = router.events as ipcRouterEventHandler[];
                }
                // Carga la colección directamente.
            } this.current.routes = router.events as ipcRouterEventHandler[];

            // Instancia un nuevo Router de eventos.
        } else this.current = new Route(router.events as ipcRouterEventHandler[]);

    }

    /**
     * Crea una envoltura para las promesas y devuelve un callback con un parámetro booleano cuando se
     * resuelve.
     */
    private async promiseWrapper(func: Promise<boolean>, callback: Function) {
        try {
            const r = await func;
            if (r === true) callback(true);
            else callback(false);
        } catch (e) {
            callback(false);
        }
    }

    /**
     * Desconecta el router.
     * No implementado en esta versión.
     */
    /* public shutdownRouter(): void {
        
    } */

}