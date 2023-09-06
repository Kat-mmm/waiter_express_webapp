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


    return{
        getUserByEmail,
        getUserById,
        addUser,
        clearSchedule
    }
}