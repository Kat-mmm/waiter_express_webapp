export default function WaiterDatabase(db){
    async function getUserByEmail(email) {
        let result = await db.oneOrNone(`SELECT * FROM users WHERE email = $1;`, [email]);
        return result;
    }
    
    async function getUserById(id) {
        let result = await db.oneOrNone(`SELECT * FROM users WHERE id = $1;`, [id]);
        return result;
    }

    async function addUser(name, email, hashedPassword){
        let result = await db.oneOrNone(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id;`,[name, email, hashedPassword])

        return result;
    }

    async function clearSchedule() {
        try {
            await db.none('DELETE FROM waiter_selected_days');
    
        } catch (error) {
            console.error('Error clearing schedule:', error);
            throw error;
        }
    }

    async function deleteWaiterDays(userId){
        await db.none('DELETE FROM waiter_selected_days WHERE waiter_id = $1', [userId]);
    }

    async function addWaiterDays(userId, day){
        await db.none('INSERT INTO waiter_selected_days (waiter_id, day_id) VALUES ($1, $2)', [userId, day]);
    }

    async function getSelectedDays(userId){
        let result = await db.any('SELECT d.day_name FROM waiter_selected_days wd JOIN days d ON wd.day_id = d.day_id WHERE wd.waiter_id = $1', [userId]);

        return result;
    }

    async function getAdminSchedule(){
        const query = `
                SELECT days.day_name, users.name, users.email
                FROM waiter_selected_days
                JOIN days ON waiter_selected_days.day_id = days.day_id
                JOIN users ON waiter_selected_days.waiter_id = users.id
            `;
        
        const result = await db.any(query);

        return result;
    }

    return{
        getUserByEmail,
        getUserById,
        addUser,
        clearSchedule,
        deleteWaiterDays,
        addWaiterDays,
        getSelectedDays,
        getAdminSchedule
    }
}