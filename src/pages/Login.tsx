import { IonBackButton, IonButtons, IonButton, IonContent, IonInput, IonItem, IonLabel, IonPage } from '@ionic/react';
import MainHeader from '../components/MainHeader';
import './Home.css';
import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { loginUser } from '../firebaseConfig';
import { toast } from '../toast';
import MainFooter from '../components/MainFooter';
import './Login.css';
import Header from '../components/Header';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();

    async function login() {
        try {
            const user = await loginUser(username, password);
            if (user) {
                toast('Login Successful', 'success');
                console.log('Login Successful', user);
                // Reset input fields after successful registration
                setUsername('');
                setPassword('');
                history.push({
                    pathname: '/dashboard',
                    state: { username: user.email || 'Guest' } 
                });
            }
        } catch (error) {
            toast('Error logging in with your credentials', 'red');
            console.error('Login Failed', error);
        }
    }

    return (
        <IonPage>
            <Header />
            <IonContent fullscreen className='ion-padding' color='background'>
                <IonItem className='username-field' color='background'>
                    <IonLabel style={{ fontSize: '25px', fontWeight: 'bold', color: 'black' }} position="stacked"> Email / Username: </IonLabel>
                    <IonInput className='ion-padding username-input' placeholder=' Email / Username' onIonChange={(e: any) => setUsername(e.target.value)} />
                </IonItem>
                <IonItem className='password-field' color='background'>
                    <IonLabel style={{ fontSize: '25px', fontWeight: 'bold', color: 'black' }} position="stacked"> Password: </IonLabel>
                    <IonInput className='ion-padding password-input' type='password' placeholder=' Password' onIonChange={(e: any) => setPassword(e.target.value)} />
                </IonItem>
                <IonButton className='login-button' color='dark' onClick={login}>Login</IonButton>
                <p className='register-text'>
                    First time user? <Link to='/register'>Create New Account</Link>
                </p>
            </IonContent>
            <MainFooter />
        </IonPage>
    );
};

export default Login;
