export default function WaiterRoutes(waiterService){
    async function clearDays(req, res) {
        await waiterService.clearSchedule();

        res.redirect("/days")
    }

    return{
        clearDays
    }
}