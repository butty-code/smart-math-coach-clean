import React, { useState, useEffect } from 'react';
import { BookOpen, Lightbulb, RotateCcw, Check, X, Shuffle, Award, TrendingUp } from 'lucide-react';

const MathFlashcards = () => {
  const [currentLevel, setCurrentLevel] = useState('junior');
  const [currentCategory, setCurrentCategory] = useState('all');
  const [currentCard, setCurrentCard] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState('');
  const [quizResult, setQuizResult] = useState(null);
  const [score, setScore] = useState(0);
  const [attempted, setAttempted] = useState(0);
  const [usedCards, setUsedCards] = useState([]);
  const [sessionStats, setSessionStats] = useState({ correct: 0, total: 0 });
  const [showApiSetup, setShowApiSetup] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showAiExplanation, setShowAiExplanation] = useState(false);
  const [aiExplanation, setAiExplanation] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [explanationLevel, setExplanationLevel] = useState('simple');

  // Question bank - this could be expanded infinitely
  const questionBank = {
    junior: {
      algebra: [
        {
          generate: () => {
            const a = Math.floor(Math.random() * 5) + 2;
            const b = Math.floor(Math.random() * 10) + 5;
            const result = Math.floor(Math.random() * 15) + 10;
            const x = (result - b) / a;
            return {
              question: `Solve for x: ${a}x + ${b} = ${result}`,
              hint: `Start by subtracting ${b} from both sides, then divide by ${a}`,
              steps: [
                `Step 1: Subtract ${b} from both sides`,
                `${a}x + ${b} - ${b} = ${result} - ${b}`,
                `${a}x = ${result - b}`,
                `Step 2: Divide both sides by ${a}`,
                `x = ${(result - b) / a}`
              ],
              answer: String(x),
              visual: "equation"
            };
          }
        },
        {
          generate: () => {
            const a = Math.floor(Math.random() * 4) + 2;
            const b = Math.floor(Math.random() * 8) + 2;
            return {
              question: `Expand: ${a}(x + ${b})`,
              hint: `Multiply everything inside the brackets by ${a}`,
              steps: [
                `Step 1: Multiply ${a} by x`,
                `${a} × x = ${a}x`,
                `Step 2: Multiply ${a} by ${b}`,
                `${a} × ${b} = ${a * b}`,
                `Step 3: Combine the results`,
                `Answer: ${a}x + ${a * b}`
              ],
              answer: `${a}x+${a * b}`,
              visual: "distribution"
            };
          }
        },
        {
          generate: () => {
            const factors = [[2,3], [2,4], [2,5], [3,4], [3,5], [2,6], [4,5]];
            const [p, q] = factors[Math.floor(Math.random() * factors.length)];
            const sum = p + q;
            const product = p * q;
            return {
              question: `Factorise: x² + ${sum}x + ${product}`,
              hint: `Find two numbers that multiply to ${product} and add to ${sum}`,
              steps: [
                `Step 1: Find factors of ${product} that add to ${sum}`,
                `Factors: ${p} and ${q} (${p} × ${q} = ${product}, ${p} + ${q} = ${sum})`,
                `Step 2: Write as two brackets`,
                `(x + ${p})(x + ${q})`,
                `Step 3: Check by expanding`,
                `x² + ${q}x + ${p}x + ${product} = x² + ${sum}x + ${product} ✓`
              ],
              answer: `(x+${p})(x+${q})`,
              visual: "factoring"
            };
          }
        }
      ],
      geometry: [
        {
          generate: () => {
            const base = Math.floor(Math.random() * 10) + 4;
            const height = Math.floor(Math.random() * 8) + 3;
            const area = (base * height) / 2;
            return {
              question: `Find the area of a triangle with base ${base}cm and height ${height}cm`,
              hint: `Remember: Area of triangle = ½ × base × height`,
              steps: [
                `Step 1: Write the formula`,
                `Area = ½ × base × height`,
                `Step 2: Substitute the values`,
                `Area = ½ × ${base} × ${height}`,
                `Step 3: Calculate`,
                `Area = ½ × ${base * height} = ${area} cm²`
              ],
              answer: String(area),
              visual: "triangle"
            };
          }
        },
        {
          generate: () => {
            const radius = Math.floor(Math.random() * 8) + 3;
            const circ = (2 * 3.14 * radius).toFixed(2);
            return {
              question: `Calculate the circumference of a circle with radius ${radius}cm (use π = 3.14)`,
              hint: `Circumference = 2πr, where r is the radius`,
              steps: [
                `Step 1: Write the formula`,
                `C = 2πr`,
                `Step 2: Substitute values`,
                `C = 2 × 3.14 × ${radius}`,
                `Step 3: Calculate`,
                `C = ${(2 * 3.14 * radius).toFixed(2)} cm`
              ],
              answer: circ,
              visual: "circle"
            };
          }
        },
        {
          generate: () => {
            const length = Math.floor(Math.random() * 8) + 4;
            const width = Math.floor(Math.random() * 6) + 3;
            const area = length * width;
            return {
              question: `Find the area of a rectangle with length ${length}cm and width ${width}cm`,
              hint: `Area of rectangle = length × width`,
              steps: [
                `Step 1: Write the formula`,
                `Area = length × width`,
                `Step 2: Substitute values`,
                `Area = ${length} × ${width}`,
                `Step 3: Calculate`,
                `Area = ${area} cm²`
              ],
              answer: String(area),
              visual: "rectangle"
            };
          }
        }
      ],
      trigonometry: [
        {
          generate: () => {
            const pairs = [[3,5], [5,13], [8,10], [6,10], [12,13]];
            const [opp, hyp] = pairs[Math.floor(Math.random() * pairs.length)];
            const sin = (opp / hyp).toFixed(2);
            return {
              question: `In a right-angled triangle, if the opposite side is ${opp}cm and hypotenuse is ${hyp}cm, find sin θ`,
              hint: `sin θ = opposite ÷ hypotenuse`,
              steps: [
                `Step 1: Identify the sides`,
                `Opposite = ${opp} cm, Hypotenuse = ${hyp} cm`,
                `Step 2: Apply the formula`,
                `sin θ = opposite ÷ hypotenuse`,
                `Step 3: Calculate`,
                `sin θ = ${opp} ÷ ${hyp} = ${sin}`
              ],
              answer: sin,
              visual: "rightTriangle"
            };
          }
        }
      ]
    },
    leaving: {
      algebra: [
        {
          generate: () => {
            const roots = [[2,3], [1,4], [2,5], [3,4], [1,6], [-2,3], [-1,5]];
            const [r1, r2] = roots[Math.floor(Math.random() * roots.length)];
            const b = -(r1 + r2);
            const c = r1 * r2;
            return {
              question: `Solve the quadratic equation: x² ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c} = 0`,
              hint: `Try factorising first, or use the quadratic formula`,
              steps: [
                `Step 1: Factorise the equation`,
                `Find two numbers that multiply to ${c} and add to ${b}`,
                `Numbers: ${r1} and ${r2}`,
                `Step 2: Write as factors`,
                `(x ${r1 >= 0 ? '-' : '+'} ${Math.abs(r1)})(x ${r2 >= 0 ? '-' : '+'} ${Math.abs(r2)}) = 0`,
                `Step 3: Solve each factor`,
                `x = ${r1} or x = ${r2}`
              ],
              answer: `${r1},${r2}`,
              visual: "quadratic"
            };
          }
        },
        {
          generate: () => {
            const a = Math.floor(Math.random() * 3) + 2;
            const b = Math.floor(Math.random() * 3) + 2;
            const p1 = Math.floor(Math.random() * 3) + 2;
            const p2 = Math.floor(Math.random() * 3) + 1;
            const p3 = Math.floor(Math.random() * 3) + 1;
            const p4 = Math.floor(Math.random() * 3) + 1;
            return {
              question: `Simplify: (${a}x${p1}y${p2}) × (${b}x${p3}y${p4})`,
              hint: `Multiply coefficients and add the powers of like bases`,
              steps: [
                `Step 1: Multiply the coefficients`,
                `${a} × ${b} = ${a * b}`,
                `Step 2: Add powers of x`,
                `x${p1} × x${p3} = x${p1 + p3}`,
                `Step 3: Add powers of y`,
                `y${p2} × y${p4} = y${p2 + p4}`,
                `Answer: ${a * b}x${p1 + p3}y${p2 + p4}`
              ],
              answer: `${a * b}x^${p1 + p3}y^${p2 + p4}`,
              visual: "exponents"
            };
          }
        }
      ],
      geometry: [
        {
          generate: () => {
            const radius = Math.floor(Math.random() * 5) + 3;
            const height = Math.floor(Math.random() * 8) + 6;
            const volume = (3.14 * radius * radius * height).toFixed(1);
            return {
              question: `Find the volume of a cylinder with radius ${radius}cm and height ${height}cm (π = 3.14)`,
              hint: `Volume = πr²h`,
              steps: [
                `Step 1: Write the formula`,
                `V = πr²h`,
                `Step 2: Substitute the values`,
                `V = 3.14 × ${radius}² × ${height}`,
                `Step 3: Calculate r²`,
                `V = 3.14 × ${radius * radius} × ${height}`,
                `Step 4: Final calculation`,
                `V = ${volume} cm³`
              ],
              answer: volume,
              visual: "cylinder"
            };
          }
        },
        {
          generate: () => {
            const side = Math.floor(Math.random() * 6) + 4;
            const area = side * side;
            return {
              question: `Find the area of a square with side length ${side}cm`,
              hint: `Area of square = side × side = side²`,
              steps: [
                `Step 1: Write the formula`,
                `Area = side²`,
                `Step 2: Substitute the value`,
                `Area = ${side}²`,
                `Step 3: Calculate`,
                `Area = ${area} cm²`
              ],
              answer: String(area),
              visual: "square"
            };
          }
        }
      ],
      trigonometry: [
        {
          generate: () => {
            const sinValues = [0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
            const sinTheta = sinValues[Math.floor(Math.random() * sinValues.length)];
            const cosTheta = Math.sqrt(1 - sinTheta * sinTheta).toFixed(2);
            return {
              question: `If sin θ = ${sinTheta} and θ is acute, find cos θ`,
              hint: `Use the Pythagorean identity: sin²θ + cos²θ = 1`,
              steps: [
                `Step 1: Write the identity`,
                `sin²θ + cos²θ = 1`,
                `Step 2: Substitute sin θ = ${sinTheta}`,
                `(${sinTheta})² + cos²θ = 1`,
                `${(sinTheta * sinTheta).toFixed(2)} + cos²θ = 1`,
                `Step 3: Solve for cos²θ`,
                `cos²θ = 1 - ${(sinTheta * sinTheta).toFixed(2)} = ${(1 - sinTheta * sinTheta).toFixed(2)}`,
                `Step 4: Take the square root`,
                `cos θ = ${cosTheta} (positive as θ is acute)`
              ],
              answer: cosTheta,
              visual: "unitCircle"
            };
          }
        }
      ]
    }
  };

  const visuals = {
    equation: (
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="text-center space-y-2">
          <div className="text-lg font-mono">ax + b = c</div>
          <div className="text-sm text-gray-600">↓ (subtract b)</div>
          <div className="text-lg font-mono">ax = c - b</div>
          <div className="text-sm text-gray-600">↓ (divide by a)</div>
          <div className="text-lg font-bold text-green-600 font-mono">x = (c - b) / a</div>
        </div>
      </div>
    ),
    distribution: (
      <div className="bg-purple-50 p-4 rounded-lg">
        <div className="text-center space-y-2">
          <div className="text-lg font-mono">a(x + b)</div>
          <div className="flex justify-center gap-4 mt-2">
            <div className="text-sm">a × x = ax</div>
            <div className="text-sm">a × b = ab</div>
          </div>
          <div className="text-lg font-bold text-purple-600 mt-2 font-mono">= ax + ab</div>
        </div>
      </div>
    ),
    triangle: (
      <div className="bg-green-50 p-4 rounded-lg flex justify-center">
        <svg width="150" height="100" viewBox="0 0 150 100">
          <polygon points="20,80 130,80 75,20" fill="lightblue" stroke="blue" strokeWidth="2"/>
          <text x="75" y="95" textAnchor="middle" fontSize="12">base</text>
          <text x="10" y="50" fontSize="12">h</text>
          <line x1="75" y1="20" x2="75" y2="80" stroke="red" strokeWidth="1" strokeDasharray="3"/>
        </svg>
      </div>
    ),
    circle: (
      <div className="bg-blue-50 p-4 rounded-lg flex justify-center">
        <svg width="150" height="150" viewBox="0 0 150 150">
          <circle cx="75" cy="75" r="50" fill="lightblue" stroke="blue" strokeWidth="2"/>
          <line x1="75" y1="75" x2="125" y2="75" stroke="red" strokeWidth="2"/>
          <text x="95" y="70" fontSize="12" fill="red">r</text>
        </svg>
      </div>
    ),
    rectangle: (
      <div className="bg-yellow-50 p-4 rounded-lg flex justify-center">
        <svg width="150" height="100" viewBox="0 0 150 100">
          <rect x="25" y="20" width="100" height="60" fill="lightyellow" stroke="orange" strokeWidth="2"/>
          <text x="75" y="95" textAnchor="middle" fontSize="12">length</text>
          <text x="10" y="50" fontSize="12">w</text>
        </svg>
      </div>
    ),
    rightTriangle: (
      <div className="bg-orange-50 p-4 rounded-lg flex justify-center">
        <svg width="150" height="120" viewBox="0 0 150 120">
          <polygon points="20,90 20,30 80,90" fill="lightyellow" stroke="orange" strokeWidth="2"/>
          <text x="10" y="60" fontSize="11">opp</text>
          <text x="45" y="105" fontSize="11">θ</text>
          <text x="50" y="55" fontSize="11">hyp</text>
        </svg>
      </div>
    ),
    quadratic: (
      <div className="bg-indigo-50 p-4 rounded-lg">
        <div className="text-center space-y-2">
          <div className="text-lg font-mono">ax² + bx + c = 0</div>
          <div className="text-sm text-gray-600">↓ (factorise)</div>
          <div className="text-lg font-mono">(x - r₁)(x - r₂) = 0</div>
          <div className="text-sm text-gray-600">↓ (solve)</div>
          <div className="text-lg font-bold text-indigo-600 font-mono">x = r₁ or x = r₂</div>
        </div>
      </div>
    ),
    cylinder: (
      <div className="bg-teal-50 p-4 rounded-lg flex justify-center">
        <svg width="120" height="140" viewBox="0 0 120 140">
          <ellipse cx="60" cy="20" rx="40" ry="10" fill="lightblue" stroke="blue" strokeWidth="2"/>
          <rect x="20" y="20" width="80" height="80" fill="lightblue" stroke="blue" strokeWidth="2"/>
          <ellipse cx="60" cy="100" rx="40" ry="10" fill="lightblue" stroke="blue" strokeWidth="2"/>
          <line x1="60" y1="20" x2="100" y2="20" stroke="red" strokeWidth="1.5"/>
          <text x="105" y="25" fontSize="10">r</text>
          <text x="5" y="60" fontSize="10">h</text>
        </svg>
      </div>
    ),
    square: (
      <div className="bg-pink-50 p-4 rounded-lg flex justify-center">
        <svg width="120" height="120" viewBox="0 0 120 120">
          <rect x="20" y="20" width="80" height="80" fill="lightpink" stroke="deeppink" strokeWidth="2"/>
          <text x="60" y="110" textAnchor="middle" fontSize="12">side</text>
        </svg>
      </div>
    )
  };

  const generateNewCard = () => {
    let categories = currentCategory === 'all' 
      ? Object.keys(questionBank[currentLevel])
      : [currentCategory];
    
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const questions = questionBank[currentLevel][randomCategory];
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    
    const newCard = {
      ...randomQuestion.generate(),
      category: randomCategory
    };
    
    setCurrentCard(newCard);
    setIsFlipped(false);
    setShowHint(false);
    setQuizResult(null);
    setQuizAnswer('');
  };

  useEffect(() => {
    generateNewCard();
  }, [currentLevel, currentCategory]);

  const checkAnswer = () => {
    const userAnswer = quizAnswer.trim().toLowerCase().replace(/\s/g, '');
    const correctAnswer = currentCard.answer.toLowerCase().replace(/\s/g, '');
    
    // Handle multiple answers (like "2,3" or "3,2")
    const userAnswers = userAnswer.split(',').sort();
    const correctAnswers = correctAnswer.split(',').sort();
    
    const isCorrect = JSON.stringify(userAnswers) === JSON.stringify(correctAnswers) ||
                      Math.abs(parseFloat(userAnswer) - parseFloat(correctAnswer)) < 0.1;
    
    setQuizResult(isCorrect);
    setAttempted(prev => prev + 1);
    setSessionStats(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));
    if (isCorrect) setScore(prev => prev + 1);
  };

  const handleNextCard = () => {
    generateNewCard();
    setShowAiExplanation(false);
    setAiExplanation('');
  };

  const getAiExplanation = async () => {
    if (!apiKey) {
      alert('Please set up your Claude API key first! Click the "⚙️ AI Setup" button.');
      return;
    }

    setAiLoading(true);
    setShowAiExplanation(true);

    try {
      const explanationPrompts = {
        simple: "Explain this like I'm 5 years old, using simple words and fun examples",
        detailed: "Explain this step-by-step with clear reasoning at each stage",
        visual: "Explain this using analogies, real-world examples, and visual thinking"
      };

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1024,
          messages: [
            {
              role: "user",
              content: `I'm a secondary school student in Ireland and I'm struggling with this math problem:

Question: ${currentCard.question}

The solution steps are:
${currentCard.steps.join('\n')}

${explanationPrompts[explanationLevel]}. Help me understand WHY each step works and what the logic is behind it. Make it relatable to everyday life if possible.`
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      setAiExplanation(data.content[0].text);
    } catch (error) {
      console.error('AI Error:', error);
      setAiExplanation(`❌ Error: ${error.message}\n\nPlease check:\n1. Your API key is valid\n2. You have credits in your Claude account\n3. Your internet connection is working`);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-green-700 mb-2">🎲 Dynamic Irish Maths Tool</h1>
          <p className="text-gray-600">Every question is randomly generated!</p>
          <button
            onClick={() => setShowApiSetup(!showApiSetup)}
            className="mt-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition text-sm font-medium"
          >
            ⚙️ AI Tutor Setup {apiKey && '✓'}
          </button>
        </div>

        {/* API Setup Modal */}
        {showApiSetup && (
          <div className="bg-white rounded-lg shadow-xl p-6 mb-6 border-2 border-purple-300">
            <h3 className="text-xl font-bold text-purple-700 mb-4">🤖 AI Tutor Setup</h3>
            
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
              <p className="text-sm text-blue-900 font-medium mb-2">💡 What is this?</p>
              <p className="text-sm text-blue-800">
                The AI Tutor uses Claude AI to explain solutions in different ways when you're stuck! 
                It's like having a personal maths teacher available 24/7.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">📋 How to get your API Key:</h4>
                <ol className="text-sm space-y-2 ml-4 list-decimal text-gray-700">
                  <li>Go to <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">console.anthropic.com</a></li>
                  <li>Sign up or log in (you can use your email)</li>
                  <li>Click "Get API Keys" in the dashboard</li>
                  <li>Create a new key and copy it</li>
                  <li>Paste it below</li>
                </ol>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3">
                <p className="text-sm text-yellow-900">
                  💰 <strong>Pricing:</strong> Claude offers $5 free credits when you sign up! That's enough for hundreds of explanations. 
                  After that, it's pay-as-you-go (very cheap - about €0.003 per explanation).
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Claude API Key:
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-ant-..."
                  className="w-full p-3 border-2 rounded-lg focus:border-purple-500 focus:outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  🔒 Your API key is stored only in your browser and never sent anywhere except Claude's servers
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    if (apiKey) {
                      alert('✅ API Key saved! You can now use the AI Tutor feature.');
                      setShowApiSetup(false);
                    } else {
                      alert('⚠️ Please enter an API key first');
                    }
                  }}
                  className="flex-1 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
                >
                  Save Key
                </button>
                <button
                  onClick={() => setShowApiSetup(false)}
                  className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
              <select 
                value={currentLevel}
                onChange={(e) => setCurrentLevel(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="junior">Junior Cycle</option>
                <option value="leaving">Leaving Certificate</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
              <select 
                value={currentCategory}
                onChange={(e) => setCurrentCategory(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="all">🎲 Random Mix</option>
                <option value="algebra">Algebra</option>
                <option value="geometry">Geometry</option>
                <option value="trigonometry">Trigonometry</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Question</label>
              <button
                onClick={generateNewCard}
                className="w-full p-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-blue-600 transition flex items-center justify-center gap-2"
              >
                <Shuffle size={18} />
                Shuffle New
              </button>
            </div>
          </div>
        </div>

        {/* Session Stats */}
        {sessionStats.total > 0 && (
          <div className="bg-gradient-to-r from-orange-100 to-pink-100 border-l-4 border-orange-500 p-4 mb-6 rounded">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="text-orange-500" />
                <span className="font-medium">Session Score: {sessionStats.correct}/{sessionStats.total}</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="text-green-600" />
                <span className="text-lg font-bold text-green-600">
                  {Math.round((sessionStats.correct / sessionStats.total) * 100)}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Flashcard */}
        {currentCard && (
          <div className="bg-white rounded-xl shadow-xl p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {currentCard.category.charAt(0).toUpperCase() + currentCard.category.slice(1)}
              </span>
              <button
                onClick={() => setIsFlipped(!isFlipped)}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                <RotateCcw size={16} />
                {isFlipped ? 'Show Question' : 'Show Solution'}
              </button>
            </div>

            {!isFlipped ? (
              /* Front of Card */
              <div className="min-h-64">
                <div className="flex items-start gap-2 mb-4">
                  <BookOpen className="text-green-600 mt-1" />
                  <h2 className="text-xl font-semibold text-gray-800">{currentCard.question}</h2>
                </div>

                {currentCard.visual && visuals[currentCard.visual] && (
                  <div className="my-6">
                    {visuals[currentCard.visual]}
                  </div>
                )}

                {!quizResult && (
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Answer:
                    </label>
                    <input
                      type="text"
                      value={quizAnswer}
                      onChange={(e) => setQuizAnswer(e.target.value)}
                      placeholder="Enter your answer..."
                      className="w-full p-3 border-2 rounded-lg mb-3 focus:border-blue-500 focus:outline-none"
                      onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                    />
                    <button
                      onClick={checkAnswer}
                      className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
                    >
                      Check Answer
                    </button>
                  </div>
                )}

                {quizResult !== null && (
                  <div className={`mt-4 p-4 rounded-lg flex items-center gap-2 ${
                    quizResult 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {quizResult ? <Check size={24} /> : <X size={24} />}
                    <div className="flex-1">
                      <span className="font-medium block">
                        {quizResult 
                          ? '🎉 Correct! Well done!' 
                          : `❌ Not quite. The answer is: ${currentCard.answer}`}
                      </span>
                    </div>
                    <button
                      onClick={handleNextCard}
                      className="px-4 py-2 bg-white rounded-lg hover:bg-gray-50 transition font-medium"
                    >
                      Next Question →
                    </button>
                  </div>
                )}

                <button
                  onClick={() => setShowHint(!showHint)}
                  className="mt-4 flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition"
                >
                  <Lightbulb size={16} />
                  {showHint ? 'Hide Hint' : 'Need a Hint?'}
                </button>

                {showHint && (
                  <div className="mt-3 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                    <p className="text-sm text-gray-700">💡 {currentCard.hint}</p>
                  </div>
                )}

                {/* AI Tutor Button */}
                <div className="mt-6 pt-4 border-t-2 border-gray-200">
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-purple-900">🤖 Still Confused?</h4>
                        <p className="text-sm text-purple-700">Ask AI to explain it differently!</p>
                      </div>
                      {!apiKey && (
                        <button
                          onClick={() => setShowApiSetup(true)}
                          className="text-xs px-3 py-1 bg-purple-200 text-purple-800 rounded hover:bg-purple-300"
                        >
                          Setup AI
                        </button>
                      )}
                    </div>
                    
                    {apiKey && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Explanation Style:
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            <button
                              onClick={() => setExplanationLevel('simple')}
                              className={`py-2 px-3 rounded text-sm font-medium transition ${
                                explanationLevel === 'simple'
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-white text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              👶 Like I'm 5
                            </button>
                            <button
                              onClick={() => setExplanationLevel('detailed')}
                              className={`py-2 px-3 rounded text-sm font-medium transition ${
                                explanationLevel === 'detailed'
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-white text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              📚 Detailed
                            </button>
                            <button
                              onClick={() => setExplanationLevel('visual')}
                              className={`py-2 px-3 rounded text-sm font-medium transition ${
                                explanationLevel === 'visual'
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-white text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              🎨 Visual
                            </button>
                          </div>
                        </div>
                        
                        <button
                          onClick={getAiExplanation}
                          disabled={aiLoading}
                          className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {aiLoading ? '🤔 AI is thinking...' : '✨ Get AI Explanation'}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* AI Explanation Display */}
                  {showAiExplanation && aiExplanation && (
                    <div className="mt-4 p-4 bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-300 rounded-lg">
                      <div className="flex items-start gap-2 mb-3">
                        <span className="text-2xl">🤖</span>
                        <div className="flex-1">
                          <h4 className="font-bold text-purple-900 mb-2">AI Tutor Explanation:</h4>
                          <div className="text-gray-800 whitespace-pre-wrap text-sm leading-relaxed">
                            {aiExplanation}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-purple-200">
                        <p className="text-xs text-purple-700">
                          💡 Try different explanation styles above to find what works best for you!
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Back of Card */
              <div className="min-h-64">
                <h3 className="text-lg font-semibold text-green-700 mb-4">Step-by-Step Solution:</h3>
                <div className="space-y-3">
                  {currentCard.steps.map((step, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-lg border-l-4 border-green-500">
                      <p className="text-gray-800">{step}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-500 rounded">
                  <p className="font-medium text-green-800">✅ Final Answer: {currentCard.answer}</p>
                </div>
                <button
                  onClick={handleNextCard}
                  className="mt-6 w-full py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition font-medium flex items-center justify-center gap-2"
                >
                  <Shuffle size={18} />
                  Generate New Question
                </button>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-sm text-gray-600 bg-white rounded-lg p-4">
          <p className="font-medium text-gray-800 mb-2">🎲 Infinite Practice Questions!</p>
          <p>Every question is randomly generated with different numbers</p>
          <p className="mt-2">📚 Aligned with Irish Junior Cycle & Leaving Certificate</p>
        </div>
      </div>
    </div>
  );
};

export default MathFlashcards;
