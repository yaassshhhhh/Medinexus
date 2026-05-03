import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";

// Reschedule an appointment to a new slot
const rescheduleAppointment = async (req, res) => {
    try {
        const { userId, appointmentId, newSlotDate, newSlotTime } = req.body;

        const appointment = await appointmentModel.findById(appointmentId);
        if (!appointment) return res.json({ success: false, message: "Appointment not found" });
        if (appointment.userId !== userId) return res.json({ success: false, message: "Unauthorized" });
        if (appointment.cancelled || appointment.isCompleted)
            return res.json({ success: false, message: "Cannot reschedule this appointment" });

        // Validate new slot date is in the future
        if (newSlotDate) {
            const [d, m, y] = newSlotDate.split('_').map(Number);
            const slotDateTime = new Date(y, m - 1, d);
            slotDateTime.setHours(23, 59, 59, 999);
            if (slotDateTime < new Date()) {
                return res.json({ success: false, message: "Cannot reschedule to a past date" });
            }
        }

        const doctor = await doctorModel.findById(appointment.docId);
        if (!doctor) return res.json({ success: false, message: "Doctor not found" });

        let slots_booked = doctor.slots_booked || {};

        // Check new slot availability
        if (slots_booked[newSlotDate]?.includes(newSlotTime))
            return res.json({ success: false, message: "New slot is not available" });

        // Release old slot
        const { slotDate, slotTime } = appointment;
        if (slots_booked[slotDate]) {
            slots_booked[slotDate] = slots_booked[slotDate].filter(t => t !== slotTime);
        }

        // Book new slot
        if (!slots_booked[newSlotDate]) slots_booked[newSlotDate] = [];
        slots_booked[newSlotDate].push(newSlotTime);

        await doctorModel.findByIdAndUpdate(appointment.docId, { slots_booked });
        await appointmentModel.findByIdAndUpdate(appointmentId, {
            slotDate: newSlotDate,
            slotTime: newSlotTime,
        });

        res.json({ success: true, message: "Appointment rescheduled successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { rescheduleAppointment };
