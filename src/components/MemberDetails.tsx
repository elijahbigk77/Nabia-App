import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonDatetime,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonAlert,
} from "@ionic/react";
import { useParams, useHistory } from "react-router-dom";
import { pencilOutline, trashOutline } from "ionicons/icons";
import MainHeader from "../components/MainHeader";
import MainFooter from "../components/MainFooter";
import {
  MemberData,
  //getMemberById,
  updateMember,
  deleteMember,
  getTribes,
  getAllClubs,
} from "../firebaseConfig";
import { toast } from "../toast";
import { Tribe, ClubData } from "../firebaseConfig";


const MemberDetails: React.FC = () => {
  const { memberId } = useParams<{ memberId: string }>();
  const history = useHistory();
  const [member, setMember] = useState<MemberData | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editMemberData, setEditMemberData] = useState<MemberData>({
    id: "",
    name: "",
    birthdate: "",
    residentialAddress: "",
    schoolAddress: "",
    parentGuardianName: "",
    parentGuardianRelationship: "",
    parentGuardianContact: "",
    teacherName: "",
    teacherContact: "",
    teacherClass: "",
    tribeId: "",
    clubId: "",
  });
  const [tribesList, setTribesList] = useState<Tribe[]>([]);
  const [clubs, setClubs] = useState<ClubData[]>([]);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  useEffect(() => {
    //etchMember();
    fetchTribes();
    fetchClubs();
  }, [memberId]);

  /**const fetchMember = async () => {
    if (memberId) {
      const fetchedMember = await getMemberById(memberId);
      if (fetchedMember) {
        setMember(fetchedMember);
        setEditMemberData(fetchedMember);
      }
    }
  };**/

  const fetchTribes = async () => {
    const fetchedTribes = await getTribes();
    setTribesList(fetchedTribes);
  };

  const fetchClubs = async () => {
    const fetchedClubs = await getAllClubs();
    setClubs(fetchedClubs);
  };

  const calculateAge = (birthdate: string): string => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age.toString();
  };

  const handleEditMember = async () => {
    if (!editMemberData.name) {
      toast("Please fill in all required fields.");
      return;
    }

    const updated = await updateMember(memberId, editMemberData);
    if (updated) {
      history.goBack(); // Go back to the previous page
    }
  };

  const handleDeleteMember = async () => {
    if (member) {
      const deleted = await deleteMember(member.id);
      if (deleted) {
        history.goBack(); // Go back to the previous page
      }
    }
  };



  const formatBirthdate = (birthdate: string): string => {
    const date = new Date(birthdate);
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const month = months[monthIndex];

    let suffix = "th";
    if (day % 10 === 1 && day !== 11) {
      suffix = "st";
    } else if (day % 10 === 2 && day !== 12) {
      suffix = "nd";
    } else if (day % 10 === 3 && day !== 13) {
      suffix = "rd";
    }

    return `${day}${suffix} ${month}, ${year}`;
  };

  return (
    <IonPage>
      <MainHeader />
      <IonContent fullscreen>
        {editMode ? (
          <IonContent fullscreen>
            <IonItem>
              <IonLabel position="stacked">Name</IonLabel>
              <IonInput
                value={editMemberData.name}
                onIonInput={(e: any) =>
                  setEditMemberData({
                    ...editMemberData,
                    name: e.target.value,
                  })
                }
              />
            </IonItem>
            <IonItem className="item-background-color">
              <IonLabel position="stacked">Birthdate</IonLabel>
              <IonDatetime
                color="success"
                value={editMemberData.birthdate}
                onIonChange={(e: any) =>
                  setEditMemberData({
                    ...editMemberData,
                    birthdate: e.detail.value!,
                  })
                }
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Residential Address</IonLabel>
              <IonInput
                value={editMemberData.residentialAddress}
                onIonInput={(e: any) =>
                  setEditMemberData({
                    ...editMemberData,
                    residentialAddress: e.target.value,
                  })
                }
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">School Address</IonLabel>
              <IonInput
                value={editMemberData.schoolAddress}
                onIonInput={(e: any) =>
                  setEditMemberData({
                    ...editMemberData,
                    schoolAddress: e.target.value,
                  })
                }
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Parent/Guardian Name</IonLabel>
              <IonInput
                value={editMemberData.parentGuardianName}
                onIonInput={(e: any) =>
                  setEditMemberData({
                    ...editMemberData,
                    parentGuardianName: e.target.value,
                  })
                }
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Relationship</IonLabel>
              <IonInput
                value={editMemberData.parentGuardianRelationship}
                onIonInput={(e: any) =>
                  setEditMemberData({
                    ...editMemberData,
                    parentGuardianRelationship: e.target.value,
                  })
                }
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Parent/Guardian Contact</IonLabel>
              <IonInput
                value={editMemberData.parentGuardianContact}
                onIonInput={(e: any) =>
                  setEditMemberData({
                    ...editMemberData,
                    parentGuardianContact: e.target.value,
                  })
                }
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Teacher Name</IonLabel>
              <IonInput
                value={editMemberData.teacherName}
                onIonInput={(e: any) =>
                  setEditMemberData({
                    ...editMemberData,
                    teacherName: e.target.value,
                  })
                }
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Teacher Contact</IonLabel>
              <IonInput
                value={editMemberData.teacherContact}
                onIonInput={(e: any) =>
                  setEditMemberData({
                    ...editMemberData,
                    teacherContact: e.target.value,
                  })
                }
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Teacher Class</IonLabel>
              <IonInput
                value={editMemberData.teacherClass}
                onIonInput={(e: any) =>
                  setEditMemberData({
                    ...editMemberData,
                    teacherClass: e.target.value,
                  })
                }
              />
            </IonItem>
            <IonItem>
                <IonLabel position="stacked">Tribe</IonLabel>
                <IonSelect
                  value={editMemberData.tribeId}
                  onIonChange={(e: any) =>
                    setEditMemberData({
                      ...editMemberData,
                      tribeId: e.target.value,
                    })
                  }
                >
                  {tribes.map((tribe: Tribe) => (
                    <IonSelectOption key={tribe.id} value={tribe.id}>
                      {tribe.name}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
            <IonItem>
              <IonLabel position="stacked">Club</IonLabel>
              <IonSelect
                value={editMemberData.clubId}
                onIonChange={(e: any) =>
                  setEditMemberData({
                    ...editMemberData,
                    clubId: e.target.value,
                  })
                }
              >
                {clubs.map((club: ClubData) => (
                  <IonSelectOption key={club.id} value={club.id}>
                    {club.name}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
            <IonButton expand="full" onClick={handleEditMember}>
              Save
            </IonButton>
            <IonButton expand="full" color="medium" onClick={() => setEditMode(false)}>
              Cancel
            </IonButton>
          </IonContent>
        ) : (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>{member?.name}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonList>
                <IonItem>
                  <IonLabel>
                    <h2>Birthdate</h2>
                    <p>{member?.birthdate ? formatBirthdate(member.birthdate) : "N/A"}</p>
                  </IonLabel>
                </IonItem>
                <IonItem>
                  <IonLabel>
                    <h2>Age</h2>
                    <p>{member?.birthdate ? calculateAge(member.birthdate) : "N/A"}</p>
                  </IonLabel>
                </IonItem>
                <IonItem>
                  <IonLabel>
                    <h2>Residential Address</h2>
                    <p>{member?.residentialAddress}</p>
                  </IonLabel>
                </IonItem>
                <IonItem>
                  <IonLabel>
                    <h2>School Address</h2>
                    <p>{member?.schoolAddress}</p>
                  </IonLabel>
                </IonItem>
                <IonItem>
                  <IonLabel>
                    <h2>Parent/Guardian Name</h2>
                    <p>{member?.parentGuardianName}</p>
                  </IonLabel>
                </IonItem>
                <IonItem>
                  <IonLabel>
                    <h2>Relationship</h2>
                    <p>{member?.parentGuardianRelationship}</p>
                  </IonLabel>
                </IonItem>
                <IonItem>
                  <IonLabel>
                    <h2>Parent/Guardian Contact</h2>
                    <p>{member?.parentGuardianContact}</p>
                  </IonLabel>
                </IonItem>
                <IonItem>
                  <IonLabel>
                    <h2>Teacher Name</h2>
                    <p>{member?.teacherName}</p>
                  </IonLabel>
                </IonItem>
                <IonItem>
                  <IonLabel>
                    <h2>Teacher Contact</h2>
                    <p>{member?.teacherContact}</p>
                  </IonLabel>
                </IonItem>
                <IonItem>
                  <IonLabel>
                    <h2>Teacher Class</h2>
                    <p>{member?.teacherClass}</p>
                  </IonLabel>
                </IonItem>
                <IonItem>
                  <IonLabel>
                    <h2>Tribe</h2>
                    <p>
                      {tribes.find(
                        (tribe: Tribe) => tribe.id === member?.tribeId
                      )?.name}
                    </p>
                  </IonLabel>
                </IonItem>
                <IonItem>
                  <IonLabel>
                    <h2>Club</h2>
                    <p>{clubs.find((club) => club.id === member?.clubId)?.name}</p>
                  </IonLabel>
                </IonItem>
              </IonList>
              <IonButton
                fill="clear"
                color="primary"
                onClick={() => setEditMode(true)}
              >
                <IonIcon slot="start" icon={pencilOutline} />
                Edit
              </IonButton>
              <IonButton
                fill="clear"
                color="danger"
                onClick={() => setShowDeleteAlert(true)}
              >
                <IonIcon slot="start" icon={trashOutline} />
                Delete
              </IonButton>
              <IonAlert
                isOpen={showDeleteAlert}
                onDidDismiss={() => setShowDeleteAlert(false)}
                header={"Delete Member"}
                message={"Are you sure you want to delete this member?"}
                buttons={[
                  {
                    text: "Cancel",
                    role: "cancel",
                    handler: () => {
                      setShowDeleteAlert(false);
                    },
                  },
                  {
                    text: "Delete",
                    handler: handleDeleteMember,
                  },
                ]}
              />
            </IonCardContent>
          </IonCard>
        )}
      </IonContent>
      <MainFooter />
    </IonPage>
  );
};



export const tribes: Tribe[] = [
    { id: "1", name: "Asher" },
    { id: "2", name: "Dan" },
    { id: "3", name: "Judah" },
    { id: "4", name: "Reuben" },
    { id: "5", name: "Joseph" },
    { id: "6", name: "Naphtali" },
    { id: "7", name: "Issachar" },
    { id: "8", name: "Simeon" },
    { id: "9", name: "Benjamin" },
    { id: "10", name: "Gad" },
    { id: "11", name: "Zebulun" },
    { id: "12", name: "Levi" }
];

export default MemberDetails;