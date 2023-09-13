import assert from 'assert';
import WaiterDatabase from '../services/waiter.database.js';
import pgPromise from 'pg-promise';
import bcrypt from 'bcrypt';

const DATABASE_URL = 'postgresql://postgres:Delegates13@localhost:5432/waiterdb';

const connectionString = process.env.DATABASE_URL || DATABASE_URL;
const db = pgPromise()(connectionString);

describe("The restaurant booking table", function () {
    beforeEach(async function () {
        try {
            // clean the tables before each test run
            await db.none("DELETE FROM waiter_selected_days;");
            await db.none("DELETE FROM users WHERE name <> $1", ['admin']);
        } catch (err) {
            console.log(err);
            throw err;
        }
    });
    
    it("should be able to add a user", async function () {
        let waiterScheduling = WaiterDatabase(db);

        const hashedPassword = await bcrypt.hash('user1234', 10);

        await waiterScheduling.addUser('Liam Carter', 'Liam@gmail.com', hashedPassword);

        const users = await waiterScheduling.getUsers();

        assert.strictEqual(2, users.length);
    });

    it("should be able to get a user by email", async function () {
        let waiterScheduling = WaiterDatabase(db);

        const hashedPassword = await bcrypt.hash('userFrank', 10);

        await waiterScheduling.addUser('Frank', 'Frank@gmail.com', hashedPassword);
        const user = await waiterScheduling.getUserByEmail('Frank@gmail.com');

        assert.strictEqual(user.name, 'Frank');
    });

    it("should be able to get a user by id", async function () {
        let waiterScheduling = WaiterDatabase(db);

        const hashedPassword = await bcrypt.hash('userJim', 10);

        const user = await waiterScheduling.addUser('Jim', 'Jim@gmail.com', hashedPassword);
        const fetchedUser = await waiterScheduling.getUserById(user.id);

        assert.strictEqual(fetchedUser.email, 'Jim@gmail.com');
    });

    it("should be able to clear schedule", async function () {
        let waiterScheduling = WaiterDatabase(db);

        const hashedPassword = await bcrypt.hash('userTim', 10);

        const user = await waiterScheduling.addUser('Tim', 'Tim@gmail.com', hashedPassword);
        await waiterScheduling.addWaiterDays(user.id, 1);

        await waiterScheduling.clearSchedule();

        const selectedDays = await waiterScheduling.getSelectedDays(user.id);
        assert.strictEqual(selectedDays.length, 0);
    });

    it("should be able to get selected days for a waiter", async function () {
        let waiterScheduling = WaiterDatabase(db);

        const hashedPassword = await bcrypt.hash('userPrice', 10);

        const user = await waiterScheduling.addUser('Prince', 'Prince@gmail.com', hashedPassword);
        await waiterScheduling.addWaiterDays(user.id, 1);

        const selectedDays = await waiterScheduling.getSelectedDays(user.id);
        assert.strictEqual(selectedDays.length, 1);
    });

    after(function () {
        db.$pool.end;
    });
})