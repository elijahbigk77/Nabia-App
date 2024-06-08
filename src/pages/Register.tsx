import { IonButton, IonContent, IonInput, IonPage } from '@ionic/react';
import MainHeader from '../components/MainHeader';
import './Home.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from '../toast';
import { registerUser } from '../firebaseConfig';

const Register: React.FC = () => {
    const [Username, setUsename] = useState('')
    const [Password, setPassword] = useState('')
    const [ConfirmPassword, setConfirmPassword] = useState('')

    async function register() {
      if(Password !== ConfirmPassword){
        return toast('Passwords do not match')
      }
      if(Username.trim() == '' && Password.trim() == ''){
        return toast('Username and Password are required')
      }
      if(Username.trim() == ''){
        return toast('Username is required')
      }
      if(Password.trim() == ''){
        return toast('Password is required')
      }
      const user = await registerUser(Username, Password);
    }

  return (
    <IonPage>
      <MainHeader />
      <IonContent fullscreen className='ion-padding'color='background'>
        <IonInput placeholder='Username' onIonChange={(e: any) => setUsename(e.target.value)}/>
        <IonInput type='password' placeholder='Password'onIonChange={(e: any) => setPassword(e.target.value)}/>
        <IonInput type='password' placeholder='Confirm Password'onIonChange={(e: any) => setConfirmPassword(e.target.value)}/>
        <IonButton onClick={register}>Create An Account</IonButton>
        <p> 
            Already have an account? <Link to='/login'>Login</Link>
        </p>
      </IonContent>
    </IonPage>
  );
};

export default Register;
