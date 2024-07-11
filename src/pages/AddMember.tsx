import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonText,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import MainHeader from '../components/MainHeader';
import MainFooter from '../components/MainFooter';
import { addMember, MemberData, ClubData, getAllClubs, Tribe, tribes } from '../firebaseConfig';
import { toast } from '../toast';
import './AddMember.css';

const AddMember: React.FC = () => {
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [residentialAddress, setResidentialAddress] = useState('');
  const [schoolAddress, setSchoolAddress] = useState('');
  const [parentGuardianName, setParentGuardianName] = useState('');
  const [parentGuardianRelationship, setParentGuardianRelationship] = useState('');
  const [parentGuardianContact, setParentGuardianContact] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [teacherContact, setTeacherContact] = useState('');
  const [teacherClass, setTeacherClass] = useState('');
  const [clubId, setClubId] = useState(''); 
  const [clubs, setClubs] = useState<ClubData[]>([]); 
  const [tribeId, setTribeId] = useState<string>('');
  const history = useHistory();

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    const fetchedClubs = await getAllClubs();
    setClubs(fetchedClubs);
  };

  const handleAddMember = async () => {
    if (!name || !clubId) {
      toast('Please fill in all required fields and select a club');
      return;
    }

    const newMemberData: MemberData = {
      name,
      birthdate,
      residentialAddress,
      schoolAddress,
      parentGuardianName,
      parentGuardianRelationship,
      parentGuardianContact,
      teacherName,
      teacherContact,
      teacherClass,
      tribeId: '',
      clubId,
      id: ''
    };

  const added = await addMember(newMemberData);
  if (added) {
    history.push({
      pathname: '/member-list',
      state: { refresh: true } // Pass refresh flag
    });
  } else {
    alert('Failed to add member');
  }
};

  return (
    <IonPage>
      <MainHeader />
      <IonContent fullscreen className="ion-padding" color='background'>
        <IonGrid>
          <IonRow>
            <IonCol size="12" className="ion-text-center">
              <IonText color="dark">
                <h2>Add a New Member</h2>
              </IonText>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="12">
              <IonItem className='ion-item-custom'>
                <IonLabel position="floating">Name</IonLabel>
                <IonInput value={name} onIonChange={(e) => setName(e.detail.value!)} />
              </IonItem>
              <IonItem className='ion-item-custom'>
                <IonLabel position="floating">Birthdate</IonLabel>
                <IonInput type="date" value={birthdate} onIonChange={(e) => setBirthdate(e.detail.value!)} />
              </IonItem>
              <IonItem className='ion-item-custom'>
                <IonLabel position="floating">Residential Address</IonLabel>
                <IonInput value={residentialAddress} onIonChange={(e) => setResidentialAddress(e.detail.value!)} />
              </IonItem>
              <IonItem className='ion-item-custom'>
                <IonLabel position="floating">School Address</IonLabel>
                <IonInput value={schoolAddress} onIonChange={(e) => setSchoolAddress(e.detail.value!)} />
              </IonItem>
              <IonItem className='ion-item-custom'>
                <IonLabel position="floating">Parent/Guardian Name</IonLabel>
                <IonInput value={parentGuardianName} onIonChange={(e) => setParentGuardianName(e.detail.value!)} />
              </IonItem>
              <IonItem className='ion-item-custom'>
                <IonLabel position="floating">Relationship of Parent/Guardian</IonLabel>
                <IonInput value={parentGuardianRelationship} onIonChange={(e) => setParentGuardianRelationship(e.detail.value!)} />
              </IonItem>
              <IonItem className='ion-item-custom'>
                <IonLabel position="floating">Contact of Parent/Guardian</IonLabel>
                <IonInput value={parentGuardianContact} onIonChange={(e) => setParentGuardianContact(e.detail.value!)} />
              </IonItem>
              <IonItem className='ion-item-custom'>
                <IonLabel position="floating">Teacher Name</IonLabel>
                <IonInput value={teacherName} onIonChange={(e) => setTeacherName(e.detail.value!)} />
              </IonItem>
              <IonItem className='ion-item-custom'>
                <IonLabel position="floating">Teacher Contact</IonLabel>
                <IonInput value={teacherContact} onIonChange={(e) => setTeacherContact(e.detail.value!)} />
              </IonItem>
              <IonItem className='ion-item-custom'>
                <IonLabel position="floating">Teacher Class</IonLabel>
                <IonInput value={teacherClass} onIonChange={(e) => setTeacherClass(e.detail.value!)} />
              </IonItem>
              <IonItem className='ion-item-custom'>
                <IonLabel>Club</IonLabel>
                <IonSelect value={clubId} placeholder="Select Club" onIonChange={(e) => setClubId(e.detail.value)}>
                  {clubs.map((club: ClubData) => (
                    <IonSelectOption key={club.id} value={club.id}>
                      {club.name}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
              <IonItem className='ion-item-custom'>
                <IonLabel>Tribe</IonLabel>
                <IonSelect value={tribeId} placeholder="Select Tribe" onIonChange={(e) => setTribeId(e.detail.value)}>
                  {tribes.map((tribe: Tribe) => (
                    <IonSelectOption key={tribe.id} value={tribe.id}>
                      {tribe.name}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
              <IonButton className='add-member-btn' expand="full" color='primary' onClick={handleAddMember}>
                Add Member
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
      <MainFooter />
    </IonPage>
  );
};

export default AddMember;
