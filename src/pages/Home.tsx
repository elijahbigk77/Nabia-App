import { IonButton, IonContent, IonHeader, IonItem, IonPage, IonText, IonTitle, IonToolbar } from '@ionic/react';
import './Home.css';
import MainFooter from '../components/MainFooter';
import Header from '../components/Header';

const Home: React.FC = () => {
  return (
    <IonPage>
      <Header />
      <IonContent fullscreen className='home-content' color='background' >
        <div className="home-container">
          <p className="ion-padding welcome-text">
            <i><IonText>Welcome to the Nabia Fellows App</IonText></i>
          </p>
          <IonButton className='login-button' color='dark' routerLink='/Login'>Login</IonButton>
          <IonButton className='register-button' color='dark' routerLink='/register'>Create New Account</IonButton>
        </div>
      </IonContent>
      <MainFooter />
    </IonPage>
  );
};

export default Home;
