// MainHeader.tsx

import './MainHeader.css';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonItem, IonIcon, IonButton } from '@ionic/react';
import { logOutOutline } from 'ionicons/icons';
import { signOut } from '../firebaseConfig';
import { useHistory } from 'react-router-dom';

interface ContainerProps { }

const DashboardHeader: React.FC<ContainerProps> = () => {
    const history = useHistory();

    const handleSignOut = async () => {
        try {
            await signOut();
            history.replace('/home'); // Redirect to login page after sign-out
        } catch (error) {
            console.error('Sign out error:', error);
            // Optionally handle sign-out error
        }
    };

    return (
        <IonHeader>
            <IonItem color='background'>
                <IonToolbar className='top-bar' color='background'>
                    <IonTitle className='title'>Nabia Fellows App</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={handleSignOut}>
                            <IonIcon icon={logOutOutline} />
                            Sign Out
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonItem>
        </IonHeader>
    );
};

export default DashboardHeader;
