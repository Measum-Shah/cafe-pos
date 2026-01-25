import {
  createUser,
  loginUser,
  getAllUsers,
} from "../services/user.service.js";

// Create new user (Admin only)
export const registerUser = async (req, res) => {
  try {
    const user = await createUser(req.body);
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { user, token } = await loginUser(req.body);
    res.status(200).json({ message: "Login successful", user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log(user)
    console.log(token)
  
  }
};

// Get all users (Admin only)
export const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
