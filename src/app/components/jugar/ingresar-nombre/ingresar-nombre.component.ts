import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RespuestaQuizzService } from 'src/app/services/respuesta-quizz.service';

@Component({
  selector: 'app-ingresar-nombre',
  templateUrl: './ingresar-nombre.component.html',
  styleUrls: ['./ingresar-nombre.component.css']
})
export class IngresarNombreComponent implements OnInit {
  nombre = '';
  errorText = '';
  error = false; 

  constructor(private _respuestaQuezzService: RespuestaQuizzService,
              private router:Router) { }

  ngOnInit(): void {
    this.validarRefresh();
  }
  ingresarNombre(){
    if(this.nombre === ''){
      this.errorMensaje('Ingrese su nombre');
      return //para que no continue con el siguiente bloque de codigo
    }
    this._respuestaQuezzService.nombreParticipante = this.nombre;
    this.router.navigate(['/jugar/iniciarContador'])
    
  }

  errorMensaje(text: string) {
    this.errorText = text;
    this.error = true;

    //mostrar el error por 4 segundos
    setTimeout(() => {
      this.error = false;
    }, 4000);
  }

  validarRefresh(){
    if(this._respuestaQuezzService.cuestionario === undefined){
      this.router.navigate(['/']);
    }
  }
}
