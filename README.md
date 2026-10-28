PhishGuard 🛡️: A Regex and Automata-Based Email & Phishing Pattern Inspector

PhishGuard is an educational, rule-based screening tool designed to detect suspicious email formats, URLs, and social engineering patterns using Regular Expressions (Regex) and Deterministic Finite Automata (DFA). 

Developed as a second-year Computer Science practical project, it bridges theoretical concepts from **Formal Languages & Automata Theory (FLAT)** with practical web security.


🚀 Key Features

1. Multi-Vector Input Analysis: Analyze raw strings, email addresses, URLs, or message bodies in a single dashboard.
2. Regex Pattern Matching: Detects raw IP address host subversion, excessive subdomain stacking (brand mimicry), and social engineering urgency keywords.
3. Automata Visualizer: Implements and visualizes a Deterministic Finite Automaton (DFA) that validates URL protocol prefixes (`http://` or `https://`) with step-by-speed state transition tracking.
4. Interactive Regex Laboratory: Explores formal regular expressions alongside explanations and direct links to test patterns in Regex101.
5. Rule-Based Risk Scoring: Computes a weighted risk score (Low, Medium, or High concern) with detailed explanations for each triggered rule.


🛠️ Technology Stack

* Frontend: HTML5, CSS3 (Custom Pastel Theme: Pink, Green, Yellow), JavaScript (ES6+)
* Pattern Recognition: Regular Expressions (`RegExp` engine)
* Formal Modeling: Deterministic Finite Automata (DFA) state machines
* Companion Tooling: Regex101 for pattern verification and JFLAP for state transition diagrams


├── index.html       Main application interface and tab navigation
├── style.css        Pastel-themed styling (pink, green, yellow palette)
└── script.js        Detection engine, regex rules, and DFA step simulator
