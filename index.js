import express from 'express';
import { engine } from 'express-handlebars';
import bodyParser from 'body-parser';
import flash from 'express-flash';
import session from 'express-session';
import pgPromise from 'pg-promise';
import bcrypt from 'bcrypt';
import 'dotenv/config';
import WaiterDatabase from './services/waiter.database.js';
import WaiterApp from './waiterapp.js';
import AuthRoutes from './routes/authRoutes.js';
import WaiterRoutes from './routes/waiter-routes.js';

const username = 'postgres';
const password = process.env.Password;
const host = 'localhost';
const port = 5432;
const databaseName = 'waiterdb';

const encodedUsername = encodeURIComponent(username);
const encodedPassword = encodeURIComponent(password);

const connection = process.env.DATABASE_URL || `postgresql://${encodedUsername}:${encodedPassword}@${host}:${port}/${databaseName}`;

const db = pgPromise()(connection);
const waiterService = WaiterDatabase(db);
const waiterRoutes = WaiterRoutes(waiterService);

const authRoutes = AuthRoutes(waiterService, bcrypt);

let app = express();


app.engine('handlebars', engine({ 
    defaultLayout: false,
}));
app.set('view engine', 'handlebars');
app.set('views', './views');
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

app.use(flash());

app.get('/',authenticateUser, authRoutes.index)

app.get('/login', authRoutes.getLogin)

app.get('/register', authRoutes.getRegister)

app.post('/register', authRoutes.register)

app.post('/login', authRoutes.login);

app.get('/waiter', authenticateUser, async function(req, res) {
    const userId = req.session.user.id;

    try {
        const selectedDays = await db.any('SELECT d.day_name FROM waiter_selected_days wd JOIN days d ON wd.day_id = d.day_id WHERE wd.waiter_id = $1', [userId]);

        res.render('dashboard', { name: req.session.user.name, selectedDays });
    } catch (error) {
        console.error('Error fetching selected days:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/waiter', authenticateUser, async function(req, res) {
    const userId = req.session.user.id;
    const selectedDays = Array.isArray(req.body.day) ? req.body.day : [req.body.day];

    try {
        await db.none('DELETE FROM waiter_selected_days WHERE waiter_id = $1', [userId]);

        for (const day of selectedDays) {
            await db.none('INSERT INTO waiter_selected_days (waiter_id, day_id) VALUES ($1, $2)', [userId, day]);
        }

        res.redirect('/waiter');
    } catch (error) {
        console.error('Error saving selected days:', error);
        res.status(500).send('Internal Server Error');
    }
})

app.get('/days', authenticateUser, checkAdmin, async function(req, res) {
    try {
        const query = `
            SELECT days.day_name, users.name, users.email
            FROM waiter_selected_days
            JOIN days ON waiter_selected_days.day_id = days.day_id
            JOIN users ON waiter_selected_days.waiter_id = users.id
        `;
        const scheduleData = await db.any(query);

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
);

app.post('/days/clear', waiterRoutes.clearDays);

app.get('/logout', function(req, res) {
    req.session.destroy(() => {
        res.redirect('/');
    });
});


function authenticateUser(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

function checkAdmin(req, res, next) {
    if (req.session.user && req.session.user.is_admin) {
        next();
    } else {
        res.redirect('/waiter');
    }
}

let PORT = process.env.PORT || 3000;

app.listen(PORT, function(){
    console.log('App running on port ' + PORT);
})

