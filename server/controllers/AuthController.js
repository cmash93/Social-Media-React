import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../models/User';

// Signup
export const signup = async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(req.body.password, salt);
    
    req.body.password = hashed;

    const newUser = new User(req.body);
    const { username } = req.body;

    try {
        // new
        const oldUser = await User.findOne({ username });

        if (oldUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // changed
        const user = await newUser.save();
        const token = jwt.sign(
            { 
                username: user.username, 
                id: user._id 
            },
            process.env.JWTKEY,
            { 
                expiresIn: '1h' 
            }
        );
        res.status(200).json({ user, token })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

// Login
export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username: username });

        if (user) {
            const validate = await bcrypt.compare(password, user.password);

            if (!validate) {
                res.status(400).json({ message: 'Wrong password.' })
            } else {
                const token = jwt.sign(
                    {
                        username: user.username, 
                        id: user._id
                    },
                    process.env.JWTKEY,
                    {
                        expiresIn: '1h'
                    }
                );
                res.status(200).json({ user, token })
            }
        } else {
            res.status(404).json({ message: 'User not found.' })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

