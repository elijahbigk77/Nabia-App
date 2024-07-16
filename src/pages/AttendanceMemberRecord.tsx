import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButton, IonIcon } from '@ionic/react';
import { format } from 'date-fns';
import { useParams, useHistory } from 'react-router-dom';
import { MemberData, getAttendanceByDate, getClubById, getAllAttendanceDates } from '../firebaseConfig';
import MainHeader from '../components/Header';
import MainFooter from '../components/MainFooter';
import { toDate, toZonedTime } from 'date-fns-tz';
import { closeOutline, downloadOutline } from 'ionicons/icons';
import { PDFDocument, rgb, StandardFonts, PageSizes } from 'pdf-lib';
import './AttendanceMemberRecord.css'; // Import CSS file

const timeZone = 'UTC'; // Set the time zone you want to display (e.g., UTC)

const AttendanceMemberRecord: React.FC = () => {
    const { clubId } = useParams<{ clubId: string }>();
    const [attendanceRecords, setAttendanceRecords] = useState<Record<string, MemberData[]>>({});
    const [clubName, setClubName] = useState<string>('');
    const history = useHistory();

    useEffect(() => {
        fetchAttendanceRecords(clubId);
        fetchClubName(clubId);
    }, [clubId]);

    const fetchAttendanceRecords = async (clubId: string) => {
        const attendanceDates = await getAllAttendanceDates(clubId);
        const records: Record<string, MemberData[]> = {};
        for (const date of attendanceDates) {
            const members = await getAttendanceByDate(clubId, date);
            records[date] = members;
        }
        setAttendanceRecords(records);
    };

    const fetchClubName = async (clubId: string) => {
        const club = await getClubById(clubId);
        setClubName(club?.name || '');
    };

    const handleDownload = async (format: 'csv' | 'pdf' | 'doc') => {
        switch (format) {
            case 'csv':
                downloadCSV();
                break;
            case 'pdf':
                downloadPDF();
                break;
            case 'doc':
                downloadDOC();
                break;
            default:
                break;
        }
    };

    const downloadCSV = () => {
        const csvData = convertToCSV(attendanceRecords);
        if (csvData) {
            const blob = new Blob([csvData], { type: 'text/csv' });
            downloadFile(blob, `Attendance_Records_${clubName}.csv`);
        }
    };

    const downloadPDF = async () => {
        try {
            const pdfBytes = await generatePDF();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            downloadFile(blob, `Attendance_Records_${clubName}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    };

    const generatePDF = async () => {
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage(PageSizes.A4);
    
        let y = page.getHeight() - 50;
    
        const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    
        // Add header with club name
        page.drawText(`Attendance records for ${clubName} Club`, {
            x: 50,
            y,
            size: 18,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
        });
    
        y -= 30;
    
        Object.keys(attendanceRecords).forEach(dateString => {
            const date = new Date(dateString); // Ensure date is interpreted correctly
            const formattedDate = format(toZonedTime(date, timeZone), 'EEEE, do MMMM, yyyy');
    
            page.drawText(`Attendance for ${formattedDate}`, {
                x: 50,
                y,
                size: 14,
                font: timesRomanFont,
                color: rgb(0, 0, 0),
            });
    
            y -= 20;
    
            attendanceRecords[dateString].forEach(member => {
                y -= 20;
                const attendanceStatus = member.attended ? 'Present' : 'Absent';
                const memberText = `${member.name}: ${attendanceStatus}`;
                page.drawText(memberText, {
                    x: 70,
                    y,
                    size: 12,
                    font: timesRomanFont,
                    color: rgb(0, 0, 0),
                });
            });
    
            y -= 30;
        });
    
        const pdfBytes = await pdfDoc.save();
        return pdfBytes;
    };
    


    const downloadDOC = () => {
        const htmlContent = generateHTML();
        if (htmlContent) {
            const blob = new Blob([htmlContent], { type: 'application/msword' });
            downloadFile(blob, `Attendance_Records_${clubName}.doc`);
        }
    };

    const generateHTML = () => {
        let html = `<html><head><title>Attendance Records</title></head><body><h1>Attendance Records for ${clubName} Club</h1>`;
    
        Object.keys(attendanceRecords).forEach(dateString => {
            const date = new Date(dateString); // Ensure date is interpreted correctly
            const formattedDate = format(toZonedTime(date, timeZone), 'EEEE, do MMMM, yyyy');
    
            html += `<h2>Attendance for ${formattedDate}</h2><ul>`;
            attendanceRecords[dateString].forEach(member => {
                const attendanceStatus = member.attended ? 'Present' : 'Absent';
                html += `<li>${member.name}: ${attendanceStatus}</li>`;
            });
            html += `</ul>`;
        });
    
        html += `</body></html>`;
        return html;
    };
    

    const downloadFile = (blob: Blob, filename: string) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    const convertToCSV = (data: Record<string, MemberData[]>): string | null => {
        try {
            let csv = 'Date,Member Name,Attendance\n';
    
            for (const date in data) {
                const formattedDate = format(new Date(date), 'yyyy-MM-dd'); // Format date as yyyy-MM-dd for CSV
                data[date].forEach(member => {
                    csv += `${formattedDate},${member.name},${member.attended ? 'Present' : 'Absent'}\n`;
                });
            }
    
            return csv;
        } catch (error) {
            console.error('Error converting to CSV:', error);
            return null;
        }
    };
    

    const handleClose = () => {
        history.replace('/attendance-record'); 
    };

    return (
        <IonPage>
            <MainHeader />
            <IonHeader>
                <IonToolbar>
                    <IonButton slot="start" onClick={handleClose} color='danger'>
                        <IonIcon icon={closeOutline} />
                    </IonButton>
                    <IonTitle>Attendance Records for {clubName} Club</IonTitle>
                    <IonButton slot="end" onClick={() => handleDownload('csv')}>
                        <IonIcon icon={downloadOutline} />
                        CSV
                    </IonButton>
                    <IonButton slot="end" onClick={() => handleDownload('pdf')}>
                        <IonIcon icon={downloadOutline} />
                        PDF
                    </IonButton>
                    <IonButton slot="end" onClick={() => handleDownload('doc')}>
                        <IonIcon icon={downloadOutline} />
                        DOC
                    </IonButton>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {Object.keys(attendanceRecords).map(date => (
                    <div key={date}>
                        <IonLabel>
                            <p className='ion-padding'>
                                <h6><i>Attendance for {format(toZonedTime(toDate(new Date(date)), timeZone), 'EEEE, do MMMM, yyyy')}</i></h6>
                            </p>
                        </IonLabel>
                        <IonList>
                            {attendanceRecords[date].map(member => (
                                <IonItem key={member.id} className={member.attended ? 'present' : 'absent'}>
                                    <IonLabel>{member.name}</IonLabel>
                                    <IonLabel slot="end">{member.attended ? 'Present' : 'Absent'}</IonLabel>
                                </IonItem>
                            ))}
                        </IonList>
                    </div>
                ))}
            </IonContent>
            <MainFooter />
        </IonPage>
    );
};

export default AttendanceMemberRecord;
