import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { error } from 'selenium-webdriver';
import { User } from 'src/app/interfaces/User';
import { ErrorService } from 'src/app/services/error.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false; 

  constructor(private fb: FormBuilder, private afAuth: AngularFireAuth, private erroService: ErrorService, private toastr: ToastrService, private router: Router) { 
    this.loginForm = this.fb.group({
      usuario: ['', [Validators.required, Validators.email]], 
      password: ['', Validators.required]
    })
  }

  ngOnInit(): void {
  }

  login(){
    const usuario = this.loginForm.get('usuario')?.value;
    const password = this.loginForm.get('password')?.value;
    
    this.loading = true; 
    this.afAuth.signInWithEmailAndPassword(usuario, password).then((respuesta) => {
      //Verificaccion de correo
      if(respuesta.user?.emailVerified == false){
        this.router.navigate(['/usuario/verificarCorreo'])
      }else{
        this.setLocalStorage(respuesta.user)
        this.router.navigate(['/dashboard']);
      }
      this.loading = false; 
    }, error=>{
      this.loading = false; 
      this.toastr.error(this.erroService.error(error.code), 'Error!')
      this.loginForm.reset();
      console.log(error)
    })
  }

  setLocalStorage(user:any){
    const usuario: User = {
      uid: user.uid,
      email: user.email
    }
    localStorage.setItem('user',JSON.stringify(usuario));
  }
}
