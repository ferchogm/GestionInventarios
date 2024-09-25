import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router
  ) {}

  registerUser(email: string, password: string, role: string): Promise<any> {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        return this.firestore.collection('users').doc(result.user?.uid).set({
          email: email,
          role: role
        });
      });
  }

  loginUser(email: string, password: string): Promise<any> {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  getUserRole(): Observable<string> {
    return this.afAuth.authState.pipe(
      map(user => {
        if (user) {
          return this.firestore.collection('users').doc(user.uid).valueChanges().pipe(
            map((userData: any) => userData?.role)
          );
        } else {
          return '';
        }
      })
    );
  }

  logoutUser(): Promise<void> {
    return this.afAuth.signOut()
      .then(() => {
        this.router.navigate(['/login']);
      });
  }
}