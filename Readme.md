# Modern Calculator

A modern, feature-rich scientific calculator built with vanilla JavaScript, featuring a clean modular architecture, accessibility support, themes, and comprehensive keyboard shortcuts.

## 📸 Screenshots

### Light Theme
![Calculator Light Theme](screenshots/calculator-light-theme.png)

### Dark Theme  
![Calculator Dark Theme](screenshots/calculator-dark-theme.png)

## ✨ Features

### 🧮 Mathematical Operations
- **Basic Operations**: Addition, subtraction, multiplication, division
- **Advanced Functions**: Trigonometric (sin, cos, tan), logarithmic, exponential
- **Special Functions**: Square root, power, factorial, reciprocal, percentage
- **Constants**: Pi (π), Euler's number (e), Golden ratio (φ)
- **Memory Functions**: Store, recall, add, subtract values
- **Angle Modes**: Radians and degrees support

### 🎨 Modern UI/UX
- **Responsive Design**: Dynamic breakpoints for all device sizes (XS, SM, MD, LG, XL, XXL)
- **Theme Support**: Light and dark themes with smooth transitions
- **Smooth Animations**: Fluid transitions and visual feedback with hover effects
- **Accessibility**: Full keyboard navigation and screen reader support
- **Modern Layout**: CSS Grid-based responsive design with custom scrollbars

### ⌨️ Keyboard Shortcuts
- **Numbers & Operators**: Direct input (0-9, +, -, *, /, etc.)
- **Functions**: Quick access (s=sin, c=cos, t=tan, l=log, q=sqrt)
- **Shortcuts**: Ctrl+C (clear), Ctrl+H (history), Ctrl+T (theme)
- **Navigation**: Enter (=), Escape (clear), Backspace

### 📊 History Management
- **Calculation History**: View and reuse previous calculations
- **Persistent Storage**: History saved in localStorage
- **Search & Filter**: Find specific calculations
- **Export/Import**: Save and restore history data

### 🔧 Technical Features
- **Modular Architecture**: Clean separation of concerns
- **ES6+ Modules**: Modern JavaScript with proper imports/exports
- **Error Handling**: Comprehensive error management
- **Security**: Safe expression evaluation (no eval)
- **Performance**: Optimized calculations and rendering
- **Testing**: Unit tests with Jest

## 🚀 Quick Start

### Option 1: Direct Usage
1. Clone the repository:
   ```bash
   git clone https://github.com/HRG-OFFICIAL/Calculator.git
   cd Calculator
   ```

2. Open `index.html` in your web browser

### Option 2: Development Server
1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Open http://localhost:3000 in your browser

### Option 3: Production Build
1. Install dependencies:
   ```bash
   npm install
   ```

2. Build for production:
   ```bash
   npm run build
   ```

3. Serve the built files:
   ```bash
   npm run serve
   ```

## 📁 Project Structure

```
Calculator/
├── index.html              # Main HTML file
├── styles/
│   └── main.css           # Main stylesheet with CSS custom properties
├── js/
│   ├── main.js            # Application entry point
│   └── modules/
│       ├── Calculator.js  # Core calculator logic
│       ├── HistoryManager.js # History management
│       ├── ThemeManager.js   # Theme switching
│       ├── KeyboardHandler.js # Keyboard input handling
│       ├── UIManager.js   # UI updates and interactions
│       └── ResponsiveManager.js # Responsive design management
├── tests/
│   └── Calculator.test.js # Unit tests
├── screenshots/
│   ├── calculator-light-theme.png # Light theme screenshot
│   └── calculator-dark-theme.png  # Dark theme screenshot
├── package.json           # Dependencies and scripts
├── rollup.config.js       # Build configuration
├── .eslintrc.js          # Linting rules
└── README.md             # This file
```

## 🎯 Usage

### Basic Operations
- Click buttons or use keyboard to input numbers and operators
- Press `Enter` or `=` to calculate
- Use `Escape` or `AC` to clear

### Advanced Functions
- **Trigonometric**: `sin`, `cos`, `tan` (with angle mode support)
- **Logarithmic**: `log` (natural), `log10` (base 10)
- **Power**: `x^y` or `^` for exponentiation
- **Root**: `sqrt` for square root
- **Factorial**: `x!` for factorial calculation

### Memory Functions
- `MC`: Memory Clear
- `MR`: Memory Recall
- `M+`: Memory Add
- `M-`: Memory Subtract

### Keyboard Shortcuts
| Key | Action | Key | Action |
|-----|--------|-----|--------|
| `0-9` | Numbers | `+`, `-`, `*`, `/` | Operators |
| `Enter` | Calculate | `Escape` | Clear |
| `Backspace` | Delete | `s` | sin |
| `c` | cos | `t` | tan |
| `l` | log | `q` | sqrt |
| `p` | pi | `e` | e |
| `b` | abs | `w` | random |
| `a` | ans | `r` | sqrt |
| `Ctrl+C` | Clear | `Ctrl+H` | History |
| `Ctrl+T` | Theme | `F1` | Help |

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## 🔧 Development

### Code Quality
Lint your code:
```bash
npm run lint
```

Fix linting issues:
```bash
npm run lint:fix
```

### Building
Create production build:
```bash
npm run build
```

## 🎨 Customization

### Themes
The calculator supports two themes with smooth transitions:
- **Light**: Clean, bright interface with blue accent colors
- **Dark**: Easy-on-the-eyes dark interface with purple accent colors

The theme toggle shows the opposite theme icon for intuitive switching.

### Adding New Functions
1. Add the function to `Calculator.js` in the `functions` object
2. Add a button to `index.html` with the appropriate `data-action`
3. Update keyboard mappings in `KeyboardHandler.js` if needed

### Responsive Design
The calculator features a dynamic responsive system with:
- **Breakpoints**: XS (0-575px), SM (576-767px), MD (768-991px), LG (992-1199px), XL (1200-1399px), XXL (1400px+)
- **Device Detection**: Automatic mobile, tablet, and desktop detection
- **Orientation Support**: Landscape and portrait mode handling
- **Adaptive Layout**: History panel visibility and button sizing based on screen size
- **Custom Scrollbars**: Styled scrollbars for overflow content on mobile devices

### Styling
The calculator uses CSS custom properties for theming. Modify the `:root` and `[data-theme]` selectors in `styles/main.css` to customize colors.

## 🌐 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📱 Mobile Support

The calculator is fully responsive and works on:
- iOS Safari 12+
- Chrome Mobile 60+
- Samsung Internet 8+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Add tests for new functionality
5. Run the test suite: `npm test`
6. Commit your changes: `git commit -m 'Add feature'`
7. Push to the branch: `git push origin feature-name`
8. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Math.js](https://mathjs.org/) for mathematical expression parsing
- Modern CSS Grid and Flexbox for layout
- ES6+ modules for clean architecture
- Jest for testing framework

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/HRG-OFFICIAL/Calculator/issues) page
2. Create a new issue with detailed information
3. Include browser version and steps to reproduce

---

**Built with ❤️ using modern web technologies**