import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Cuestionario } from 'src/app/models/Cuestionario';
import { QuizzService } from 'src/app/services/quizz.service';

@Component({
  selector: 'app-list-cuestionarios',
  templateUrl: './list-cuestionarios.component.html',
  styleUrls: ['./list-cuestionarios.component.css']
})
export class ListCuestionariosComponent implements OnInit, OnDestroy {
suscriptionUser: Subscription = new Subscription(); 
suscriptionQuizz: Subscription = new Subscription(); 
listCuestionarios: Cuestionario[] = [];
loading = false; 

  constructor(private afAuth: AngularFireAuth, 
              private router: Router,
              private _quizzService: QuizzService,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loading = true; 
    this.suscriptionUser = this.afAuth.user.subscribe(user=>{
      if (user && user.emailVerified){ //validar que no ingrese si el usuario ya cerro cesion. 
        //cargar los custionarios
        this.getCustionarios(user.uid);
      }else{
        this.router.navigate(['/'])
      }
    })
  }

  ngOnDestroy(): void {
    this.suscriptionUser.unsubscribe();
    this.suscriptionQuizz.unsubscribe();
  }

  getCustionarios(uid: string){
    this.suscriptionQuizz == this._quizzService.getCuestionarioByIdUser(uid).subscribe(data =>{
      this.listCuestionarios = []; //vaciar el cuestionario
      this.loading = false; 
      data.forEach((element:any) => {
        this.listCuestionarios.push({
          id:element.payload.doc.id,
          ...element.payload.doc.data() //los tres puentos significa copiar el elmento
        })
      });
      console.log(this.listCuestionarios);
    }, error =>{
      console.log(error);
      this.toastr.error('El cuestionario fue eliminado con exito', 'Registro Eliminado')
      this.loading = false; 
    })
  }

  eliminarCuestionario(id: string){
    this.loading = true; 
    this._quizzService.eliminarCuestionario(id).then(data=>{
      this.toastr.error('El cuestionario fue eliminado con exito', 'Registro Eliminado');
      this.loading = false; 
    }).catch(()=>{
      this.loading = false; 
      this.toastr.error('Opss... ocurrio un error', 'Error!')
    })
    
  }
}
