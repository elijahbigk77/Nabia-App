import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonSelect,
  IonSelectOption
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import MainHeader from '../components/MainHeader';
import MainFooter from '../components/MainFooter';
import { addMember, MemberData, ClubData, getAllClubs, Tribe, tribes } from '../firebaseConfig'; // Update imports
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
  const [clubId, setClubId] = useState(''); // State for club selection
  const [clubs, setClubs] = useState<ClubData[]>([]); // State to store clubs
  const [tribeId, setTribeId] = useState<string>('');
  const history = useHistory();

  useEffect(() => {
    fetchClubs(); // Fetch clubs when component mounts
  }, []);

  const fetchClubs = async () => {
    const fetchedClubs = await getAllClubs();
    setClubs(fetchedClubs);
  };

  const handleAddMember = async () => {
    // Validate required fields including club selection
    if (!name || !clubId) {
      toast('Please fill in all required fields and select a club');
      return;
    }

    // Prepare member data
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

    // Add member to Firestore
    const added = await addMember(newMemberData);
    if (added) {
      history.push(`/member-list`); 
    } else {
      alert('Failed to add member');
    }
  };

  return (
    <IonPage className='item-background-color'>
      <MainHeader />
      <IonContent className='item-background-color'>
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
        <IonButton className='add-member-btn' expand="full" color='dark' onClick={handleAddMember}>Add Member</IonButton>
      </IonContent>
      <MainFooter />
    </IonPage>
  );
};

export default AddMember;
