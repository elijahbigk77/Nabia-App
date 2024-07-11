import { IonButton, IonContent, IonInput, IonItem, IonLabel, IonPage } from '@ionic/react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from '../toast';
import { registerUser } from '../firebaseConfig'; 
import MainHeader from '../components/MainHeader';
import MainFooter from '../components/MainFooter';
import './Register.css'
import Footer from '../components/Footer';
import Header from '../components/Header';

const Register: React.FC = () => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    async function register() {
        if (password !== confirmPassword) {
            return toast('Passwords do not match');
        }
        if (username.trim() === '' || password.trim() === '') {
            return toast('Username and Password are required');
        }
        if (name.trim() === '') {
            return toast('Name is required');
        }

        try {
            const userRegistered = await registerUser(username, password, name); 
            if (userRegistered) {
                toast('You have registered successfully', 'success');
                // Reset input fields after successful registration
                setName('');
                setUsername('');
                setPassword('');
                setConfirmPassword('');
            } else {
                toast('Registration failed'); // Handle registration failure
            }
        } catch (error) {
            console.error('Error registering user:', error);
            toast('Failed to register user');
        }
    }

    return (
        <IonPage>
            <Header />
            <IonContent fullscreen className='ion-padding' color='background'>

                <IonItem className='name-field' color='background'>
                    <IonLabel style={{ fontSize: '25px', color: 'black' }} position="stacked"> Name: </IonLabel>
                    <IonInput className='ion-padding name-input' type='text' placeholder='Name' value={name} onIonChange={(e: any) => setName(e.target.value)} />
                </IonItem>

                <IonItem className='username-field' color='background'>
                    <IonLabel style={{ fontSize: '25px', color: 'black' }} position="stacked"> Email / Username: </IonLabel>
                    <IonInput className='ion-padding username-input' placeholder='Email / Username' value={username} onIonChange={(e: any) => setUsername(e.target.value)} />
                </IonItem>

                <IonItem className='password-field' color='background'>
                    <IonLabel style={{ fontSize: '25px', color: 'black' }} position="stacked"> Password: </IonLabel>
                    <IonInput className='ion-padding password-input' type='password' placeholder='Password' value={password} onIonChange={(e: any) => setPassword(e.target.value)} />
                </IonItem>

                <IonItem className='confirm-password-field' color='background'>
                    <IonLabel style={{ fontSize: '25px', color: 'black' }} position="stacked"> Confirm Password: </IonLabel>
                    <IonInput className='ion-padding confirm-password-input' type='password' placeholder='Confirm Password' value={confirmPassword} onIonChange={(e: any) => setConfirmPassword(e.target.value)} />
                </IonItem>

                <IonButton className='create-account-button' color='dark' onClick={register}>Create An Account</IonButton>

                <p className='login-text'>
                    Already have an account? <Link to='/login'>Login</Link>
                </p>

            </IonContent>
            <Footer />
        </IonPage>
    );
};

export default Register;
