import { IonButton, IonContent, IonInput, IonPage } from '@ionic/react';
import MainHeader from '../components/MainHeader';
import './Home.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { loginUser } from '../firebaseConfig';
import { toast } from '../toast';
import MainFooter from '../components/MainFooter';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    async function login() {
        try {
            const user = await loginUser(username, password);
            if (user) {
                toast('Login Successful');
                console.log('Login Successful', user);
            }
        } catch (error) {
            toast('Error logging in with your credentials');
            console.error('Login Failed', error);
        }
    }

    return (
        <IonPage>
            <MainHeader />
            <IonContent fullscreen className='ion-padding' color='background'>
                <IonInput
                    placeholder='Username'
                    onIonChange={(e: any) => setUsername(e.target.value)}
                />
                <IonInput
                    type='password'
                    placeholder='Password'
                    onIonChange={(e: any) => setPassword(e.target.value)}
                />
                <IonButton onClick={login}>Login</IonButton>
                <p>
                    First time user? <Link to='/register'>Register</Link>
                </p>
            </IonContent>
            <MainFooter />
        </IonPage>
    );
};

export default Login;
