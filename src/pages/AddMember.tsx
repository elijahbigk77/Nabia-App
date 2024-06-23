import React, { useState } from 'react';
import { IonPage, IonContent, IonItem, IonLabel, IonInput, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import MainHeader from '../components/MainHeader';
import MainFooter from '../components/MainFooter';
import { addMember, MemberData } from '../firebaseConfig';
import { toast } from '../toast';

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
  const history = useHistory();

  const handleAddMember = async () => {
    // Validate required fields
    if (!name || !parentGuardianName) {
      toast('Please fill in all required fields');
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
    };

    // Add member to Firestore
    const added = await addMember(newMemberData);
    if (added) {
      history.push('/member-list');
    } else {
      alert('Failed to add member');
    }
  };

  return (
    <IonPage>
      <MainHeader />
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="floating">Name</IonLabel>
          <IonInput value={name} onIonChange={(e) => setName(e.detail.value!)} />
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Birthdate</IonLabel>
          <IonInput type="date" value={birthdate} onIonChange={(e) => setBirthdate(e.detail.value!)} />
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Residential Address</IonLabel>
          <IonInput value={residentialAddress} onIonChange={(e) => setResidentialAddress(e.detail.value!)} />
        </IonItem>
        <IonItem>
          <IonLabel position="floating">School Address</IonLabel>
          <IonInput value={schoolAddress} onIonChange={(e) => setSchoolAddress(e.detail.value!)} />
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Parent/Guardian Name</IonLabel>
          <IonInput value={parentGuardianName} onIonChange={(e) => setParentGuardianName(e.detail.value!)} />
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Relationship of Parent/Guardian</IonLabel>
          <IonInput value={parentGuardianRelationship} onIonChange={(e) => setParentGuardianRelationship(e.detail.value!)} />
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Contact of Parent/Guardian</IonLabel>
          <IonInput value={parentGuardianContact} onIonChange={(e) => setParentGuardianContact(e.detail.value!)} />
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Teacher Name</IonLabel>
          <IonInput value={teacherName} onIonChange={(e) => setTeacherName(e.detail.value!)} />
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Teacher Contact</IonLabel>
          <IonInput value={teacherContact} onIonChange={(e) => setTeacherContact(e.detail.value!)} />
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Teacher Class</IonLabel>
          <IonInput value={teacherClass} onIonChange={(e) => setTeacherClass(e.detail.value!)} />
        </IonItem>
        <IonButton expand="full" onClick={handleAddMember}>Add Member</IonButton>
      </IonContent>
      <MainFooter />
    </IonPage>
  );
};

export default AddMember;