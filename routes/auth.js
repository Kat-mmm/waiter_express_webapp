// import { Strategy as LocalStrategy } from "passport-local";
// import bcrypt from 'bcrypt';

// export default function initialize(passport, db){
//     const authenticateUser = async (email, password, done) => {
//         const user = await db.getUserByEmail(email);
        
//         if (!user) {
//             return done(null, false, { message: 'User not found' });
//         }
    
//         try {
//             if (await bcrypt.compare(password, user.password)) {
//                 return done(null, user);
//             } else {
//                 return done(null, false, { message: 'Incorrect password' });
//             }
//         } catch (e) {
//             return done(e);
//         }
//     };    

//     passport.use(new LocalStrategy(
//         { usernameField: "email", passwordField: "password" },
//         authenticateUser
//     ))
//     passport.serializeUser((user, done) => done(null, user.id))
//     passport.deserializeUser(async (id, done) => {
//         const user = await db.getUserById(id);
//         if (user) {
//             done(null, user);
//         } else {
//             done(new Error('User not found'));
//         }
//     });
// }