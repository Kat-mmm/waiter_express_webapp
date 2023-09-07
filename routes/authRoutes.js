export default function AuthRoutes(waiterService, bcrypt){
    async function login(req, res) {
        const { email, password } = req.body;
        const user = await waiterService.getUserByEmail(email);

        if (user && await bcrypt.compare(password, user.password)) {
            req.session.user = user; // Store user data in session
            if (user.is_admin) {
                res.redirect('/days'); // Redirect admin users to admin-dashboard
            } else {
                res.redirect('/waiter'); // Redirect non-admin users to dashboard
            }
        } else {
            res.redirect('/login');
        }
    }

    async function register(req, res) {
        let { name, email, password } = req.body;
    
        try{
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await waiterService.getUserByEmail(email);
            console.log(user);
    
            if(!user){
                waiterService.addUser(name, email, hashedPassword);
                res.redirect('/login')
            }
            else{
                req.flash('error', 'User already exists');
            }
        }
        catch(err){
            console.log(err);
            res.redirect('/register');
        }
    }

    function getLogin(req, res) {
        res.render('login');
    }

    function getRegister(req, res) {
        res.render('register');
    }

    function index(req, res) {
        res.render('index');
    }

    function logout(req, res) {
        req.session.destroy(() => {
            res.redirect('/');
        });
    }

    return{
        login,
        getLogin,
        getRegister,
        register,
        index,
        logout
    }
}