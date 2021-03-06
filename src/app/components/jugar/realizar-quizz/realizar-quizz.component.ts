import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cuestionario } from 'src/app/models/Cuestionario';
import { RespuestaQuizzService } from 'src/app/services/respuesta-quizz.service';

@Component({
  selector: 'app-realizar-quizz',
  templateUrl: './realizar-quizz.component.html',
  styleUrls: ['./realizar-quizz.component.css']
})
export class RealizarQuizzComponent implements OnInit, OnDestroy {

  constructor(private _respuestaQuizzService: RespuestaQuizzService,
              private router: Router) { }

  cuestionario!: Cuestionario;
  nombreParticipante= '';
  indexPregunta = 0;
  segundos = 0; 
  setInterval: any;
  loading = false; 

  // respuesta usuario
  opcionSeleccionada: any;
  indexSeleccionado: any; 
  cantidadCorrectas = 0; 
  cantidadIncorrectas = 0; 
  puntosTotales = 0; 
  listRespuestaUsuario: any[] = []; 

  ngOnInit(): void {
    this.cuestionario = this._respuestaQuizzService.cuestionario;
    this.nombreParticipante = this._respuestaQuizzService.nombreParticipante;
    this.valiadarRefesh();
    this.inciarContador();
  }

  ngOnDestroy(): void{
    clearInterval(this.setInterval);
  }

  valiadarRefesh(){
    if(this.cuestionario === undefined){
      this.router.navigate(['/'])
    }
  }

  obtenerSegundos():number{
    return this.segundos;

  }

  obtenerTitulo(): string{
    return this.cuestionario.listPreguntas[this.indexPregunta].titulo;
  }

  inciarContador(){
    this.segundos = this.cuestionario.listPreguntas[this.indexPregunta].segundos;
    
    this.setInterval = setInterval(()=>{
      if(this.segundos === 0){
        this.agregarRespuesta();
      }
      this.segundos = this.segundos-1;
    },1000)
  }

  respuestaSeleccionada(respuesta: any, index: number){
    this.opcionSeleccionada = respuesta; 
    this.indexSeleccionado = index; 

  }

  addClassOption(respuesta: any):string{
    if(respuesta === this.opcionSeleccionada){
      return 'classSeleccionada'
    }else{
      return '';
    }
  }

  siguiente(){
    clearInterval(this.setInterval)
    this.agregarRespuesta()
    this.inciarContador();
  }

  agregarRespuesta(){

    //incrementamos contadores (correcta e incorrecta)
    this.contadorCorrectaIncorrecta();
    //creamos objeto respuesta y agregamso al array
    const respuestaUsuario: any = {
      titulo: this.cuestionario.listPreguntas[this.indexPregunta].titulo,
      puntosObtenidos: this.obtenemosPuntosPregunta(),
      segundos: this.obtenemosSegundos(),
      indexRespuestaSeleccionada: this.obtenemosIndexSeleccionado(),
      listRespuesta: this.cuestionario.listPreguntas[this.indexPregunta].listRespuestas
    }

    this.listRespuestaUsuario.push(respuestaUsuario);

    this.opcionSeleccionada = undefined;
    this.indexSeleccionado = undefined

    //validamos si es la ultima pregunta
    if(this.cuestionario.listPreguntas.length -1 === this.indexPregunta){
      //guardamso las preguntas en firebase
      this.guardamosRespuestaCuestionario(); 

    }else{
      this.indexPregunta++;
      this.segundos = this.cuestionario.listPreguntas[this.indexPregunta].segundos;
    }
    
  }

  obtenemosPuntosPregunta(): number{
    //si el usuario no seleciono ninguna pregunta
    if(this.opcionSeleccionada === undefined){
      return 0;
    }

    const puntosPregunta = this.cuestionario.listPreguntas[this.indexPregunta].puntos;
    //validamos si la respuesta es correcta
    if(this.opcionSeleccionada.esCorrecta == true){
      //Incrementamos la variable puntos totales
      this.puntosTotales = this.puntosTotales + puntosPregunta;
      return puntosPregunta;
    }else{
      return 0;
    }
  }

  obtenemosSegundos():string{
    //validamos si el usuario si el usario respondio la pregunta
    
    if(this.opcionSeleccionada === undefined){
      return 'NO RESPONDIO'
    }else{
      const segundosPregunta = this.cuestionario.listPreguntas[this.indexPregunta].segundos;
      const segundosRespondidas = segundosPregunta - this.segundos;
      return segundosRespondidas.toString();
    }
  }

  obtenemosIndexSeleccionado(): any{
    if(this.opcionSeleccionada === undefined){
      return '';
    }else{
      return this.indexSeleccionado;
    }
  }

  contadorCorrectaIncorrecta(){
    //validamos si el usuario selecciono pregunta
    if(this.opcionSeleccionada === undefined){
      this.cantidadIncorrectas++
      return; 
    }

    //preguntamso si la opcion es incorrecta
    if(this.opcionSeleccionada.esCorrecta === false){
      this.cantidadIncorrectas++
    }else{
      this.cantidadCorrectas++
    }
  }

  guardamosRespuestaCuestionario() {
    const respuestaCuestionario: any = {
      idCuestionario: this.cuestionario.id,
      nombreParticipante: this.nombreParticipante,
      fecha: new Date(),
      cantidadPreguntas: this.cuestionario.cantPreguntas,
      cantidadCorrectas: this.cantidadCorrectas,
      cantidadIncorrectas: this.cantidadIncorrectas,
      puntosTotales: this.puntosTotales,
      listRespuestaUsuario: this.listRespuestaUsuario
    }

    this.loading = true; 
    //almacenas la respuesta en firebase
    this._respuestaQuizzService.setRespuestaUsuario(respuestaCuestionario).then(data=>{
    
      //redireccionamos el proximo componente
      
      this.router.navigate(['/jugar/respuestaUsuario',data.id])
      
    },error =>{
      console.log(error);
      this.router.navigate(['/'])
    })
    
  }
}
