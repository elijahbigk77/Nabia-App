import { IonButton, IonContent, IonPage, IonText } from '@ionic/react';
import './Home.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Home: React.FC = () => {
  return (
    <IonPage>
      <Header />
      <IonContent fullscreen className='home-content' color='background'>
        <div className="home-container">
          <p className="ion-padding welcome-text">
            <i><IonText>Welcome to the Nabia Fellows App</IonText></i>
          </p>
          <IonButton className='login-button' color='dark' routerLink='/Login'>Login</IonButton>
          <IonButton className='register-button' color='dark' routerLink='/register'>Create New Account</IonButton>
        </div>
      </IonContent>
      <Footer />
    </IonPage>
  );
};

export default Home;
