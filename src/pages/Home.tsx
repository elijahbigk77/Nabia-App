import { IonButton, IonContent, IonHeader, IonItem, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Home.css';
import MainFooter from '../components/MainFooter';
import Header from '../components/Header';

const Home: React.FC = () => {
  return (
    <IonPage>
      <Header />
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
