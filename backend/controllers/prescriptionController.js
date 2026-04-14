import prescriptionModel from '../models/prescriptionModel.js';
import appointmentModel from '../models/appointmentModel.js';
import nodemailer from 'nodemailer';

// Create prescription
const createPrescription = async (req, res) => {
    try {
        const { appointmentId, diagnosis, medications, labTests, notes, followUpDate } = req.body;
        const { docId } = req.body;

        const appointment = await appointmentModel.findById(appointmentId);
        if (!appointment) {
            return res.json({ success: false, message: 'Appointment not found' });
        }

        const prescription = new prescriptionModel({
            appointmentId,
            doctorId: docId,
            patientId: appointment.userId,
            patientName: appointment.userData.name,
            doctorName: appointment.docData.name,
            diagnosis,
            medications,
            labTests,
            notes,
            followUpDate
        });

        await prescription.save();

        // Send email to patient
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.ADMIN_EMAIL,
                pass: process.env.ADMIN_PASSWORD
            }
        });

        const emailHTML = `
            <h2>Your Prescription from Dr. ${appointment.docData.name}</h2>
            <p><strong>Diagnosis:</strong> ${diagnosis}</p>
            <h3>Medications:</h3>
            <ul>
                ${medications.map(med => `
                    <li>
                        <strong>${med.name}</strong> - ${med.dosage}<br>
                        Frequency: ${med.frequency}, Duration: ${med.duration}<br>
                        ${med.instructions ? `Instructions: ${med.instructions}` : ''}
                    </li>
                `).join('')}
            </ul>
            ${labTests && labTests.length > 0 ? `
                <h3>Lab Tests Recommended:</h3>
                <ul>${labTests.map(test => `<li>${test}</li>`).join('')}</ul>
            ` : ''}
            ${notes ? `<p><strong>Additional Notes:</strong> ${notes}</p>` : ''}
            ${followUpDate ? `<p><strong>Follow-up Date:</strong> ${followUpDate}</p>` : ''}
        `;

        await transporter.sendMail({
            from: process.env.ADMIN_EMAIL,
            to: appointment.userData.email,
            subject: 'Your Medical Prescription - Rogveda',
            html: emailHTML
        });

        res.json({ success: true, message: 'Prescription created and sent to patient' });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Get prescription by appointment ID
const getPrescription = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const prescription = await prescriptionModel.findOne({ appointmentId });

        if (!prescription) {
            return res.json({ success: false, message: 'Prescription not found' });
        }

        res.json({ success: true, prescription });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get all prescriptions for a patient
const getPatientPrescriptions = async (req, res) => {
    try {
        const { userId } = req.body;
        const prescriptions = await prescriptionModel.find({ patientId: userId }).sort({ createdAt: -1 });
        res.json({ success: true, prescriptions });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export { createPrescription, getPrescription, getPatientPrescriptions };
