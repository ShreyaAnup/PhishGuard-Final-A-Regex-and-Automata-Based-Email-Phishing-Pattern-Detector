const REGEX_RULES = [
  {
    id: "email_val",
    name: "Standard RFC 5322 Email Syntax",
    pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
    explanation: "Validates format username@domain.tld using alphanumeric character sets.",
    severity: "low",
    weight: 0,
    r101: "https://regex101.com/?regex=^[a-zA-Z0-9._%25%2B-]+@[a-zA-Z0-9.-]%2B\\.[a-zA-Z]{2,}$"
  },
  {
    id: "raw_ip",
    name: "Raw IP Address Host Subversion",
    pattern: "http[s]?://(?:[0-9]{1,3}\\.){3}[0-9]{1,3}",
    explanation: "Phishing URLs often use direct IP addresses instead of registered domain names to hide host identity.",
    severity: "high",
    weight: 40,
    r101: "https://regex101.com/?regex=http[s]%3F://(?:[0-9]{1,3}\\.){3}[0-9]{1,3}"
  },
  {
    id: "excessive_subdomains",
    name: "Subdomain Stacking / Brand Mimicry",
    pattern: "http[s]?://(?:[a-zA-Z0-9-]+\\.)={3,}[a-zA-Z]{2,}",
    explanation: "Deeply nested subdomains (e.g., paypal.verify.login.attacker.com) deceive users into seeing legitimate brand names.",
    severity: "high",
    weight: 35,
    r101: "https://regex101.com/?regex=http[s]%3F://(?:[a-zA-Z0-9-]+\\.)%7B3,%7D[a-zA-Z]%7B2,%7D"
  },
  {
    id: "urgency_keywords",
    name: "Social Engineering Urgency Triggers",
    pattern: "(?i)(verify your account|immediate action required|account suspended|unauthorized login|update security)",
    explanation: "Psychological manipulation inducing panic to force hasty compliance without verification.",
    severity: "medium",
    weight: 25,
    r101: "https://regex101.com/?regex=(%3Fi)(verify+your+account%7Cimmediate+action+required%7Caccount+suspended)"
  }
];

// Navigation Switcher
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

function loadSample(num) {
  const input = document.getElementById('targetInput');
  if (num === 1) input.value = "Security Alert! Login immediately at http://192.168.1.105/paypal/login.php to restore access.";
  if (num === 2) input.value = "https://accounts.google.com.verify.security-update.fixed-server.ru/login";
  if (num === 3) input.value = "Urgent: Your bank account suspended! Immediate action required within 24 hours.";
  if (num === 4) input.value = "student.support@university.edu";
}

function clearInput() {
  document.getElementById('targetInput').value = "";
}

function runAnalysis() {
  const text = document.getElementById('targetInput').value;
  if (!text.trim()) { alert("Please provide text to analyze!"); return; }

  let score = 0;
  let matchedRules = [];
  let isEmailValid = false;

  REGEX_RULES.forEach(rule => {
    const regex = new RegExp(rule.pattern, "i");
    if (regex.test(text)) {
      if (rule.id === "email_val") {
        isEmailValid = true;
      } else {
        matchedRules.push(rule);
        score += rule.weight;
      }
    }
  });

  const banner = document.getElementById('scoreBanner');
  const riskTitle = document.getElementById('riskTitle');
  const riskDesc = document.getElementById('riskDesc');
  const scoreVal = document.getElementById('scoreVal');

  score = Math.min(score, 100);
  scoreVal.innerText = `${score}/100`;

  if (score >= 60) {
    banner.className = "score-banner high";
    riskTitle.innerText = "High Phishing Concern";
    riskDesc.innerText = "Multiple severe threat patterns detected in input string.";
  } else if (score >= 25) {
    banner.className = "score-banner medium";
    riskTitle.innerText = "Medium Concern";
    riskDesc.innerText = "Suspicious heuristics matched. Exercise caution.";
  } else {
    banner.className = "score-banner low";
    riskTitle.innerText = "Low Concern";
    riskDesc.innerText = "No immediate threat indicators matched basic rule set.";
  }

  document.getElementById('emailFormatRes').innerText = isEmailValid ? "Valid Syntax" : "Invalid / Not Found";
  document.getElementById('patternCountRes').innerText = `${matchedRules.length} Rule(s) Matched`;

  const listDiv = document.getElementById('patternList');
  listDiv.innerHTML = "";
  if (matchedRules.length === 0) {
    listDiv.innerHTML = "<p style='color:var(--text-muted);'>No suspicious patterns detected.</p>";
  } else {
    matchedRules.forEach(r => {
      listDiv.innerHTML += `
        <div class="pattern-item ${r.severity}">
          <div style="font-weight:700; font-size:15px;">${r.name}</div>
          <div style="font-size:13px; color:var(--text-muted); margin-top:4px;">${r.explanation}</div>
          <div class="code-block" style="margin-top:8px;">${r.pattern}</div>
        </div>
      `;
    });
  }

  document.querySelector('[data-tab="results"]').click();
}

function simulateDFA() {
  const input = document.getElementById('targetInput').value.toLowerCase();
  const nodes = ['q0', 'q1', 'q2', 'q3', 'q4', 'q5'];
  const status = document.getElementById('dfaStatus');
  
  let step = 0;
  nodes.forEach(n => document.getElementById(`state-${n}`).className = "state-node");

  const interval = setInterval(() => {
    if (step > 0 && step <= nodes.length) {
      document.getElementById(`state-${nodes[step-1]}`).classList.remove('active');
    }
    
    if (step < nodes.length) {
      const currNode = document.getElementById(`state-${nodes[step]}`);
      currNode.classList.add('active');
      status.innerText = `Stepping state ${nodes[step]}...`;
      step++;
    } else {
      clearInterval(interval);
      if (input.startsWith("http://") || input.startsWith("https://")) {
        document.getElementById('state-q5').classList.add('accept');
        status.innerText = "Result: ACCEPTED (Valid URL Prefix)";
      } else {
        document.getElementById('state-q0').classList.add('reject');
        status.innerText = "Result: REJECTED (Missing http/https)";
      }
    }
  }, 500);
}

// Render Regex Lab Cards
const labDiv = document.getElementById('regexCards');
if (labDiv) {
  REGEX_RULES.forEach(r => {
    labDiv.innerHTML += `
      <div class="regex-card">
        <strong style="font-size:16px;">${r.name}</strong>
        <div class="code-block">${r.pattern}</div>
        <p style="font-size:14px; color:var(--text-muted); margin:8px 0;">${r.explanation}</p>
        <a href="${r.r101}" target="_blank" class="regex101-btn"><i class="fa-solid fa-arrow-up-right-from-square"></i> Open in Regex101</a>
      </div>
    `;
  });
}
