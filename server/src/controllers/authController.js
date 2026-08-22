const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '30d' });
};

exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      headline,
      skills,
      experienceLevel,
      companyName,
      companyWebsite,
      industry,
      companySize,
      location,
      bio,
      resumeUrl,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Normalize skills to array if provided as string
    let parsedSkills = [];
    if (Array.isArray(skills)) {
      parsedSkills = skills.map(s => s.trim()).filter(Boolean);
    } else if (typeof skills === 'string' && skills.trim()) {
      parsedSkills = skills.split(',').map(s => s.trim()).filter(Boolean);
    }

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'job-seeker',
      headline: headline || '',
      skills: parsedSkills,
      experienceLevel: experienceLevel || '',
      companyName: companyName || '',
      companyWebsite: companyWebsite || '',
      industry: industry || '',
      companySize: companySize || '',
      location: location || '',
      bio: bio || '',
      resumeUrl: resumeUrl || '',
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        headline: user.headline,
        companyName: user.companyName,
        skills: user.skills,
        location: user.location,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data provided' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
