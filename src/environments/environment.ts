// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

//colo una como y pego lo que esta en https://github.com/angular/angularfire/blob/master/docs/install-and-setup.md,
//seguidamente coloco los atributos de firebase que esta en cofigaraciones
//copio todo el firebase y pegar en enviroment.prod.ts
export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyBW1ov3RhNhYtMOTwSTxyU8jE7BGrJ40ow",
    authDomain: "quizzprue.firebaseapp.com",
    projectId: "quizzprue",
    storageBucket: "quizzprue.appspot.com",
    messagingSenderId: "792630876490",
    appId: "1:792630876490:web:18f532c36f46a5a57d09b3"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
