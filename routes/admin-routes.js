export default function AdminRoutes(db){
    async function clearSchedule(req, res) {
        await db.clearSchedule();

        res.redirect("/days")
    }

    async function getWeeklySchedule(req, res) {
        try {
            
            const scheduleData = await db.getAdminSchedule();
    
            const scheduleByDay = {};
    
            scheduleData.forEach(row => {
                const { day_name, name, email } = row;
                if (!scheduleByDay[day_name]) {
                    scheduleByDay[day_name] = [];
                }
                scheduleByDay[day_name].push({ name, email });
            });
    
            res.render('admin', { scheduleByDay });
        } catch (error) {
            console.error('Error fetching schedule data:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    return{
        getWeeklySchedule,
        clearSchedule
    }
}