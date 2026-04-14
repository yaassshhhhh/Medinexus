# 🤝 Contributing to MediNexus AI

Thank you for considering contributing to MediNexus AI! We welcome contributions from the community.

## 📋 Table of Contents
- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

---

## 📜 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect differing viewpoints and experiences

---

## 🚀 How to Contribute

### Reporting Bugs
1. Check if the bug has already been reported
2. Create a detailed bug report with:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots (if applicable)
   - Environment details

### Suggesting Features
1. Check if the feature has been suggested
2. Create a feature request with:
   - Clear description
   - Use cases
   - Potential implementation approach

### Code Contributions
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 💻 Development Setup

### Prerequisites
- Node.js v18+
- MongoDB
- Git

### Setup Steps
```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/doctor-appointment-system.git
cd doctor-appointment-system/Medinexus-Ai

# Install dependencies
cd backend && npm install
cd ../frontend && npm install
cd ../admin && npm install

# Setup environment variables
# Copy .env.example to .env in each folder
# Add your credentials

# Start development servers
# Terminal 1: Backend
cd backend && npm start

# Terminal 2: Frontend
cd frontend && npm run dev

# Terminal 3: Admin (optional)
cd admin && npm run dev
```

---

## 📝 Coding Standards

### JavaScript/React
- Use ES6+ features
- Follow functional programming principles
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused

### File Structure
```
component/
├── ComponentName.jsx
├── ComponentName.css (if needed)
└── index.js (if needed)
```

### Naming Conventions
- Components: PascalCase (`UserProfile.jsx`)
- Functions: camelCase (`getUserData()`)
- Constants: UPPER_SNAKE_CASE (`API_BASE_URL`)
- Files: kebab-case or PascalCase

### Code Style
- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons
- Use template literals for string interpolation
- Destructure props and state

---

## 📝 Commit Guidelines

### Commit Message Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### Examples
```bash
feat(auth): add password reset functionality

fix(appointment): resolve booking time conflict

docs(readme): update installation instructions

style(navbar): improve responsive design

refactor(api): optimize database queries

test(user): add unit tests for user service

chore(deps): update dependencies
```

---

## 🔄 Pull Request Process

### Before Submitting
1. ✅ Test your changes locally
2. ✅ Update documentation if needed
3. ✅ Add comments to complex code
4. ✅ Follow coding standards
5. ✅ Ensure no console errors
6. ✅ Check responsive design

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested locally
- [ ] Added unit tests
- [ ] Tested on mobile

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No new warnings
- [ ] Added tests
```

### Review Process
1. Maintainers will review your PR
2. Address feedback if requested
3. Once approved, PR will be merged
4. Your contribution will be credited

---

## 🏗️ Project Structure

```
Medinexus-Ai/
├── backend/              # Node.js API
│   ├── config/          # Database & cloud config
│   ├── controllers/     # Business logic
│   ├── middlewares/     # Auth & validation
│   ├── models/          # Database schemas
│   ├── routes/          # API routes
│   └── server.js        # Entry point
│
├── frontend/            # React user app
│   ├── src/
│   │   ├── assets/     # Images & icons
│   │   ├── components/ # Reusable components
│   │   ├── context/    # State management
│   │   ├── pages/      # Page components
│   │   └── App.jsx     # Main app
│   └── package.json
│
└── admin/               # React admin panel
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   └── App.jsx
    └── package.json
```

---

## 🧪 Testing Guidelines

### Manual Testing
- Test all user flows
- Check responsive design
- Verify error handling
- Test edge cases
- Check browser compatibility

### Areas to Test
- User registration/login
- Appointment booking
- Payment processing
- Video consultation
- Admin panel
- Doctor portal
- Chatbot functionality

---

## 📚 Resources

- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Manual](https://docs.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 🎯 Good First Issues

Look for issues labeled:
- `good first issue`
- `beginner friendly`
- `documentation`
- `help wanted`

---

## 💡 Feature Ideas

### High Priority
- SMS notifications
- Mobile app
- Prescription management UI
- Medical records UI
- Advanced analytics

### Medium Priority
- Multi-language support
- Appointment calendar sync
- Doctor availability bulk upload
- Patient feedback surveys

### Low Priority
- Social media integration
- Referral system
- Loyalty program
- Advanced search filters

---

## 🐛 Known Issues

Check [Issues](https://github.com/yaassshhhhh/doctor-appointment-system/issues) for current bugs and feature requests.

---

## 📞 Contact

- GitHub Issues: [Create an issue](https://github.com/yaassshhhhh/doctor-appointment-system/issues)
- Email: support@medinexus.ai

---

## 🙏 Thank You!

Your contributions make MediNexus AI better for everyone. We appreciate your time and effort!

---

**Happy Coding! 🚀**
