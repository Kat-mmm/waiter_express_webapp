export default function AdminRoutes(db){
    async function clearSchedule(req, res) {
        await db.clearSchedule();

        res.redirect("/days")
    }

    async function getWeeklySchedule(req, res) {
        try {
            const scheduleData = await db.getAdminSchedule();

            let waiters = await db.getAdminSchedule();
            const days = await db.getDays();

            //remove duplicate waiters
            const uniqueList = waiters.reduce((accumulator, currentValue) => {
                const existingItem = accumulator.find(item => item.name === currentValue.name && item.id === currentValue.id);
            
                if (!existingItem) {
                    accumulator.push(currentValue);
                }
            
                return accumulator;
            }, []);
                        
            const scheduleByDay = {};
    
            scheduleData.forEach(row => {
                const { day_name, name, email } = row;
                if (!scheduleByDay[day_name]) {
                    scheduleByDay[day_name] = [];
                }
                scheduleByDay[day_name].push({ name, email });
            });
    
            res.render('admin', { scheduleByDay, waiters: uniqueList, days });
        } catch (error) {
            console.error('Error fetching schedule data:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async function rescheduleWaiters(req, res){
        const { waiter } = req.body;
        let day = Array.isArray(req.body.day) ? req.body.day : [req.body.day];
    
        try {
            // Remove the waiter from their current days
            await db.deleteWaiter(waiter);
            // Insert the waiter into the new selected days
            const insertPromises = day.map(newDay => {
                return db.none('INSERT INTO waiter_selected_days (waiter_id, day_id) VALUES ($1, (SELECT day_id FROM days WHERE day_name = $2))', [waiter, newDay]);
            });
            await Promise.all(insertPromises);
    
            res.redirect('/days');
        } catch (error) {
            console.error('Error rescheduling waiter:', error);
        }
    }

    return{
        getWeeklySchedule,
        clearSchedule,
        rescheduleWaiters
    }
}