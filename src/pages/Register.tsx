import { IonButton, IonContent, IonInput, IonItem, IonLabel, IonPage } from '@ionic/react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from '../toast';
import { registerUser } from '../firebaseConfig'; // Import registerUser function from firebaseConfig
import MainHeader from '../components/MainHeader';
import MainFooter from '../components/MainFooter';

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
            const userRegistered = await registerUser(username, password, name); // Call registerUser with username, password, and name
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
            <MainHeader />
            <IonContent fullscreen className='ion-padding' color='background'>

                <IonItem className='name-field' color='background'>
                    <IonLabel style={{ fontSize: '25px', color: 'black' }} position="stacked"> Name: </IonLabel>
                    <IonInput className='name-input' type='text' placeholder='Name' value={name} onIonChange={(e: any) => setName(e.target.value)} />
                </IonItem>

                <IonItem className='username-field' color='background'>
                    <IonLabel style={{ fontSize: '25px', color: 'black' }} position="stacked"> Email: </IonLabel>
                    <IonInput className='username-input' placeholder='Email' value={username} onIonChange={(e: any) => setUsername(e.target.value)} />
                </IonItem>

                <IonItem className='password-field' color='background'>
                    <IonLabel style={{ fontSize: '25px', color: 'black' }} position="stacked"> Password: </IonLabel>
                    <IonInput className='password-input' type='password' placeholder='Password' value={password} onIonChange={(e: any) => setPassword(e.target.value)} />
                </IonItem>

                <IonItem className='confirm-password-field' color='background'>
                    <IonLabel style={{ fontSize: '25px', color: 'black' }} position="stacked"> Confirm Password: </IonLabel>
                    <IonInput className='confirm-password-input' type='password' placeholder='Confirm Password' value={confirmPassword} onIonChange={(e: any) => setConfirmPassword(e.target.value)} />
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
