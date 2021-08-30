# ipc Event Router
ipc Event Router es una libería  sencilla para sincronizar todos los eventos del ipc del renderizador con el proceso principal y de esta forma escuchar solamente los eventos que se van a usar.

Event Router abrirá un eventListener del main y empezará a escuchar eventos de navegación.

Este evento de navegación debe ser declarado en el renderizador, entonces, cuando se navegue se deberá emitir este evento con la ruta como parámetro, así el proceso principal cargará solo la colección de eventos correspondientes a dicha ruta y liberará de la memoria los que no se vayan a usar en ese momento.

El siguiente esquema define el árbol de rutas y eventos que se cargarían en una instancia correcta:

```
Router
│
└── Navigation Event: 'navigate'
    │
    ├── '/FileExplorer'
    │   ├── { event: 'drop',   handler: dropHandler     }
    │   ├── { event: 'select', handler: selectHandler   }
    │   ├── { event: 'copy',   handler: copyHandler     }
    │   └── { event: 'del',    handler: deleteHandler   }
    │
    ├── '/Settings'
    │   ├── { event: 'update', handler: updHandler      }
    │   └── { event: 'remove', handler: remHandler      }
    │
    ├── '/Admin' | canActivate: adminChecker
    │   ├── { event: 'reload', handler: reloadControl   }
    │   └── { event: 'shutdown', handler: shutdownC...  }
    │
    └── Path...
```

Cuando se detecta el evento de navegación, el router cargará los eventos que corresponden a dicha ruta y cerrará los oyentes del resto.

Para cada ruta se puede establecer una función similar a los Guards de Angular. De esta forma se cargará la colección de eventos únicamente si el guardián ha devuelto true.

El guardián puede ser, o bien una función o una promesa que devuelva true.

Para definir un router simplemente hay que instanciar la clase Router.

```TypeScript
// ⚠️ Ejemplo ficticio.
import { Router } from 'ipc-event-router';

import { dropHandler, selectHandler, copyHandler, deleteHandler } from './controllers/fs';
import { updHandler, remHandler } from './controllers/settings';
import { reloadController, shutdownController } from './controllers/admin';
import { adminChecker } from './helpers/admin';

const router = new Router({
    navigateEvent: 'nav',
    router: [
        { path: '/fileExplorer', events: [
            { event: 'drop', handler: dropHandler       },
            { event: 'select', handler: selectHandler   },
            { event: 'copy',   handler: copyHandler     },
            { event: 'del',    handler: deleteHandler   }
        ]},
        { path: '/settings', events: [
            { event: 'update', handler: updHandler      },
            { event: 'remove', handler: remHandler      }
        ]},
        { path: '/admin', canActivate: adminChecker, events: [
            { event: 'reload', handler: reloadControl   },
            { event: 'shutdown', handler: shutdownC...  }
        ]}
    ]
})
```

## ⚠️ Advertencias 

- No se detectan parámetros de consultas. Si se emite un evento de navegación con una ruta con parámetros dinámicos, no funcionará.

- Las rutas hijas no se detectan, esta versión tiene un funcionamiento muy simple.