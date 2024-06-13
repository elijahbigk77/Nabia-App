import { IonButton, IonContent, IonInput, IonItem, IonLabel, IonPage } from '@ionic/react';
import MainHeader from '../components/MainHeader';
import './Home.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from '../toast';
import { registerUser } from '../firebaseConfig';
import MainFooter from '../components/MainFooter';
import './Register.css'

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
      if(user){
        toast('You have registered Succesfully')
      }
    }

  return (
    <IonPage>

      <MainHeader />
      <IonContent fullscreen className='ion-padding'color='background'>

        <IonItem className='username-field' color='background'>
          <IonLabel style={{fontSize: '25px', color: 'black'}} position="stacked"> Email: </IonLabel>
          <IonInput className='username-input' placeholder=' Email' onIonChange={(e: any) => setUsename(e.target.value)}/>
        </IonItem>

        <IonItem className='password-field' color='background'>
          <IonLabel style={{fontSize: '25px', color: 'black'}} position="stacked"> Password: </IonLabel>
          <IonInput className='password-input' type='password' placeholder=' Password'onIonChange={(e: any) => setPassword(e.target.value)}/>
        </IonItem>

        <IonItem className='confirm-password-field' color='background'>
          <IonLabel style={{fontSize: '25px', color: 'black'}} position="stacked"> Conform Password: </IonLabel>
          <IonInput className='confirm-password-input' type='password' placeholder=' Confirm Password'onIonChange={(e: any) => setConfirmPassword(e.target.value)}/>
        </IonItem>

        
        <IonButton className='create-account-button' color='light' onClick={register}>Create An Account</IonButton>
        
        <p className='login-text'> 
            Already have an account? <Link to='/login'>Login</Link>
        </p>

      </IonContent>
      <MainFooter />
      
    </IonPage>
  );
};

export default Register;
