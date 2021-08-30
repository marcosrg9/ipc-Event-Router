import { ipcMain } from 'electron';
import { ipcRouterEventHandler } from './interfaces/ipcRouter.interface';

export class Route {
    
    private currentEvents!: ipcRouterEventHandler[];

    constructor(router: ipcRouterEventHandler[]) {
        this.loadEvents(router)
    }

    private loadEvents(ipcEvents: ipcRouterEventHandler[]) {

        if (typeof ipcEvents !== 'object') throw new Error('Unknown router structure');
        
        if (ipcEvents.length > 0) {
            
            this.currentEvents = ipcEvents;
            ipcEvents.forEach(event => {
                ipcMain.on(event.event, event.handler());
            })

        } else throw new Error('Empty router');

    }
    
    public set routes(ipcEvents: ipcRouterEventHandler[]) {

        this.currentEvents.forEach(event => {
            ipcMain.removeListener(event.event, event.handler());
        })
        this.loadEvents(ipcEvents);

    }

}