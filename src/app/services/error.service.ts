import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor() { }

  error(code: string):string{
    switch(code){
      //email ya registrado
      case 'auth/email-already-in-use':
        return "El Correo ya está registrado"

      //Correo envalido
      case 'auth/invalid-email':
        return 'El correo es invalido'

      //La contraseña es muy debil
      case 'auth/weak-password':
        return 'La contraseña es muy debil'

      case 'auth/user-not-found':
        return 'El usuario no existe'

      case 'auth/wrong-password':
        return 'La contraseña es inválida'
        
      default:
        return 'Error desconocido';
    }
  }
}
