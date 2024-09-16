import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';  // Importa AngularFireAuth para autenticación
import { AngularFirestore } from '@angular/fire/compat/firestore';  // Importa Firestore para roles
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';  // Importa CryptoJS para encriptación
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private afAuth: AngularFireAuth,  // Inyección de dependencias para AngularFireAuth
    private firestore: AngularFirestore,  // Inyección de dependencias para Firestore
    private router: Router  // Inyección de dependencias para Router
  ) {}

  // Método para registrar un nuevo usuario
  registerUser(email: string, password: string, role: string): Promise<any> {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        // Guardar el rol del usuario en Firestore
        this.firestore.collection('users').doc(result.user?.uid).set({
          email: email,
          role: role
        });
      })
      .catch((error) => {
        console.error('Error al registrar usuario', error);
        throw error;
      });
  }

  // Método para iniciar sesión
  loginUser(email: string, password: string): Promise<any> {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        // Redirigir al dashboard según el rol del usuario
        this.getUserRole(result.user?.uid).subscribe((role) => {
          if (role === 'admin') {
            this.router.navigate(['/dashboard']);
          } else if (role === 'logistica') {
            this.router.navigate(['/logistica']);
          } else if (role === 'consulta') {
            this.router.navigate(['/consulta']);
          }
        });
      })
      .catch((error) => {
        console.error('Error al iniciar sesión', error);
        throw error;
      });
  }

  // Método para obtener el rol del usuario desde Firestore
  getUserRole(uid: string | undefined): Observable<string> {
    return this.firestore.collection('users').doc(uid).valueChanges().pipe(
      map((user: any) => user?.role)
    );
  }

  // Método para encriptar contraseñas
  encryptPassword(password: string): string {
    return CryptoJS.AES.encrypt(password, 'secret_key').toString();
  }

  // Método para desencriptar contraseñas
  decryptPassword(encryptedPassword: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedPassword, 'secret_key');
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  // Método para cerrar sesión
  logoutUser(): Promise<void> {
    return this.afAuth.signOut()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        console.error('Error al cerrar sesión', error);
        throw error;
      });
  }
}
