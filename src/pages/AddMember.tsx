import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonContent,
  IonLabel,
  IonInput,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
  IonDatetime,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import MainHeader from "../components/MainHeader";
import MainFooter from "../components/MainFooter";
import {
  addMember,
  MemberData,
  ClubData,
  getAllClubs,
  Tribe,
  tribes,
} from "../firebaseConfig";
import { toast } from "../toast";
import "./AddMember.css";

const AddMember: React.FC = () => {
  const initialFormState = {
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
    clubId: "",
    tribeId: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [clubs, setClubs] = useState<ClubData[]>([]);
  const history = useHistory();

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    const fetchedClubs = await getAllClubs();
    setClubs(fetchedClubs);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleAddMember = async () => {
    const { name, clubId } = formData;
    if (!name || !clubId) {
      toast("Please fill in all required fields and select a club");
      return;
    }

    const newMemberData: MemberData = {
      ...formData,
      tribeId: formData.tribeId || "", // Ensure tribeId is not undefined
      id: "",
    };

    const added = await addMember(newMemberData);
    if (added) {
      toast("Member added successfully!");
      setFormData(initialFormState); // Clear the form
      history.push({
        pathname: "/member-list",
        state: { refresh: true }, // Pass refresh flag
      });
    } else {
      alert("Failed to add member");
    }
  };

  return (
    <IonPage>
      <MainHeader />
      <IonContent fullscreen className="ion-padding" color="background">
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
              <div className="form-group">
                <IonLabel>Name</IonLabel>
                <IonInput
                  value={formData.name}
                  onIonChange={(e) =>
                    handleInputChange("name", e.detail.value!)
                  }
                />
              </div>
              <div className="form-group">
                <IonLabel>Birthdate</IonLabel>
                <IonDatetime
                  
                  value={formData.birthdate}
                  onIonChange={(e) =>
                    handleInputChange("birthdate", e.detail.value!)
                  }
                />
              </div>
              <div className="form-group">
                <IonLabel>Residential Address</IonLabel>
                <IonInput
                  value={formData.residentialAddress}
                  onIonChange={(e) =>
                    handleInputChange("residentialAddress", e.detail.value!)
                  }
                />
              </div>
              <div className="form-group">
                <IonLabel>School Address</IonLabel>
                <IonInput
                  value={formData.schoolAddress}
                  onIonChange={(e) =>
                    handleInputChange("schoolAddress", e.detail.value!)
                  }
                />
              </div>
              <div className="form-group">
                <IonLabel>Parent/Guardian Name</IonLabel>
                <IonInput
                  value={formData.parentGuardianName}
                  onIonChange={(e) =>
                    handleInputChange("parentGuardianName", e.detail.value!)
                  }
                />
              </div>
              <div className="form-group">
                <IonLabel>Relationship of Parent/Guardian</IonLabel>
                <IonInput
                  value={formData.parentGuardianRelationship}
                  onIonChange={(e) =>
                    handleInputChange(
                      "parentGuardianRelationship",
                      e.detail.value!
                    )
                  }
                />
              </div>
              <div className="form-group">
                <IonLabel>Contact of Parent/Guardian</IonLabel>
                <IonInput
                  value={formData.parentGuardianContact}
                  onIonChange={(e) =>
                    handleInputChange("parentGuardianContact", e.detail.value!)
                  }
                />
              </div>
              <div className="form-group">
                <IonLabel>Teacher Name</IonLabel>
                <IonInput
                  value={formData.teacherName}
                  onIonChange={(e) =>
                    handleInputChange("teacherName", e.detail.value!)
                  }
                />
              </div>
              <div className="form-group">
                <IonLabel>Teacher Contact</IonLabel>
                <IonInput
                  value={formData.teacherContact}
                  onIonChange={(e) =>
                    handleInputChange("teacherContact", e.detail.value!)
                  }
                />
              </div>
              <div className="form-group">
                <IonLabel>Teacher Class</IonLabel>
                <IonInput
                  value={formData.teacherClass}
                  onIonChange={(e) =>
                    handleInputChange("teacherClass", e.detail.value!)
                  }
                />
              </div>
              <div className="form-group">
                <IonLabel>Club</IonLabel>
                <IonSelect
                  value={formData.clubId}
                  placeholder="Select Club"
                  onIonChange={(e) =>
                    handleInputChange("clubId", e.detail.value)
                  }
                >
                  {clubs.map((club: ClubData) => (
                    <IonSelectOption key={club.id} value={club.id}>
                      {club.name}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </div>
              <div className="form-group">
                <IonLabel>Tribe</IonLabel>
                <IonSelect
                  value={formData.tribeId}
                  placeholder="Select Tribe"
                  onIonChange={(e) =>
                    handleInputChange("tribeId", e.detail.value)
                  }
                >
                  {tribes.map((tribe: Tribe) => (
                    <IonSelectOption key={tribe.id} value={tribe.id}>
                      {tribe.name}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </div>
              <IonButton
                className="add-member-btn"
                expand="full"
                color="dark"
                onClick={handleAddMember}
              >
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
