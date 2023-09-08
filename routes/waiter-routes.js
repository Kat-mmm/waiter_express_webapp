export default function WaiterRoutes(waiterService){
    async function setWaiterDays(req, res) {
        const userId = req.session.user.id;
        const selectedDays = Array.isArray(req.body.day) ? req.body.day : [req.body.day];
    
        try {
            await waiterService.deleteWaiterDays(userId);

            for (const day of selectedDays) {
                await waiterService.addWaiterDays(userId, day);
            }
    
            res.redirect('/waiter');
        } catch (error) {
            console.error('Error saving selected days:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async function getWaiterDays(req, res) {
        const userId = req.session.user.id;
    
        try {
            const selectedDays = await waiterService.getSelectedDays(userId);

            const modifiedDays = selectedDays.map(day => {
                const { day_name, ...rest } = day;
                return { ...rest, [day_name]: true, day_id: day.day_id };
            });
                  
            res.render('dashboard', { name: req.session.user.name, selectedDays, modifiedDays });
        } catch (error) {
            console.error('Error fetching selected days:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    return{
        setWaiterDays,
        getWaiterDays
    }
}