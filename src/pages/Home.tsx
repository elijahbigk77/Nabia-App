import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Home.css';
import MainHeader from '../components/MainHeader';

const Home: React.FC = () => {
  return (
    <IonPage>
      <MainHeader />
      <IonContent fullscreen className='home-content'color='background' >
        <IonButton routerLink='/Login'>Login</IonButton>
        <IonButton routerLink='/register'>Register</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Home;
