import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Home.css';
import MainHeader from '../components/MainHeader';
import MainFooter from '../components/MainFooter';

const Home: React.FC = () => {
  return (
    <IonPage>
      <MainHeader />
      <IonContent fullscreen className='home-content'color='background' >
        <p className='welcome-text'><i> Welcome to the Nabia Fellows app</i></p>
        <IonButton className='login-button' color='light' routerLink='/Login'>Login</IonButton>
        <IonButton className='register-button' color='light' routerLink='/register'>Create New Account</IonButton>
      </IonContent>
      <MainFooter />
    </IonPage>
  );
};

export default Home;
