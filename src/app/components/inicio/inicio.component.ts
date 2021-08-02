import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Cuestionario } from 'src/app/models/Cuestionario';
import { RespuestaQuizzService } from 'src/app/services/respuesta-quizz.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  error = false;
  pin = '';
  errorText = '';
  loading = false;
  suscriptionCode: Subscription = new Subscription();

  constructor(private respuestaQuizz: RespuestaQuizzService,
              private router: Router) { }

  ngOnInit(): void {
  }

  ngOnDestroy():void{
    this.suscriptionCode.unsubscribe();//dessubcribirse para no tener problemas de memoria
  }
  //Validar el pin que no este vacio
  ingresar() {
    if (this.pin == '') {
      this.errorMensaje('Por favor ingrese PIN')
      return;
    }
    this.loading = true;
    this.suscriptionCode = this.respuestaQuizz.serchByCode(this.pin).subscribe(data => {
      this.loading = false;
      if (data.empty) {
        this.errorMensaje('PIN inválido');
      }else{
        data.forEach((element: any )=> {
          const cuestionario: Cuestionario={
            id: element.id,
            ...element.data()
          }
          this.respuestaQuizz.cuestionario = cuestionario; 
          //redireccionar al proximo componente.
          //redirecciona al app-routing.modules de jugar
          this.router.navigate(['/jugar']);
        });
      }
    }, error => {
      console.log(error);
      this.loading = false;
    })
  }

  errorMensaje(text: string) {
    this.errorText = text;
    this.error = true;
    this.pin = '';

    //mostrar el error por 4 segundos
    setTimeout(() => {
      this.error = false;
    }, 4000);
  }
}
