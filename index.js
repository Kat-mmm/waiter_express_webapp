import express from 'express';
import { engine } from 'express-handlebars';
import bodyParser from 'body-parser';
import flash from 'express-flash';
import session from 'express-session';
import db from './config.js';
import bcrypt from 'bcrypt';
import WaiterDatabase from './services/waiter.database.js';
import AuthRoutes from './routes/authRoutes.js';
import WaiterRoutes from './routes/waiter-routes.js';
import AdminRoutes from './routes/admin-routes.js';

const waiterService = WaiterDatabase(db);

const waiterRoutes = WaiterRoutes(waiterService);
const authRoutes = AuthRoutes(waiterService, bcrypt);
const adminRoutes = AdminRoutes(waiterService);

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

//Auth Routes
app.get('/login', authRoutes.getLogin)
app.get('/register', authRoutes.getRegister)
app.post('/register', authRoutes.register)
app.post('/login', authRoutes.login);
app.get('/logout', authRoutes.logout);

//Waiter Routes
app.get('/waiter', authenticateUser, waiterRoutes.getWaiterDays);
app.post('/waiter', authenticateUser, waiterRoutes.setWaiterDays)

//Admin Routes
app.get('/days', authenticateUser, checkAdmin, adminRoutes.getWeeklySchedule);
app.post('/days/clear', adminRoutes.clearSchedule);


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

