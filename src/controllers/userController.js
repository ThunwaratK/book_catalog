const UserModel = require('../models/userModel');

class UserController {
    constructor() {
        this.userModel = null;
    }
    
    initialize(client) {
        this.userModel = new UserModel(client);
        // Create users table if it doesn't exist
        this.userModel.createTable()
            .then(() => console.log('Users table ready'))
            .catch(err => console.error('Error creating users table:', err));
    }
    
    // Display the registration form
    showRegister(req, res) {
        res.render('users/register');
    }
    
    // Display the login form
    showLogin(req, res) {
        res.render('users/login');
    }
    
    // Handle user registration
    async register(req, res) {
        try {
            const { username, email, password, confirmPassword } = req.body;
            
            // Basic validation
            if (password !== confirmPassword) {
                return res.render('users/register', { 
                    error: 'Passwords do not match',
                    username,
                    email
                });
            }
            
            // Check if user already exists
            const existingUser = await this.userModel.getUserByEmail(email);
            if (existingUser) {
                return res.render('users/register', { 
                    error: 'Email already registered',
                    username
                });
            }
            
            // Register the user
            const user = await this.userModel.registerUser(username, email, password);
            
            // Store user in session
            req.session.user = {
                id: user.id,
                username: user.username,
                email: user.email
            };
            
            res.redirect('/api/books');
        } catch (error) {
            console.error('Registration error:', error);
            res.render('users/register', {
                error: 'Registration failed. Please try again.',
                username: req.body.username,
                email: req.body.email
            });
        }
    }
    
    // Handle user login
    async login(req, res) {
        try {
            const { email, password } = req.body;
            
            // Get user by email
            const user = await this.userModel.getUserByEmail(email);
            
            if (!user) {
                return res.render('users/login', {
                    error: 'Invalid email or password',
                    email
                });
            }
            
            // Validate password
            const isMatch = await this.userModel.validatePassword(password, user.password);
            
            if (!isMatch) {
                return res.render('users/login', {
                    error: 'Invalid email or password',
                    email
                });
            }
            
            // Store user in session
            req.session.user = {
                id: user.id,
                username: user.username,
                email: user.email
            };
            
            res.redirect('/api/books');
        } catch (error) {
            console.error('Login error:', error);
            res.render('users/login', {
                error: 'Login failed. Please try again.',
                email: req.body.email
            });
        }
    }
    
    // Handle user logout
    logout(req, res) {
        req.session.destroy();
        res.redirect('/auth/login');
    }
}

module.exports = UserController;