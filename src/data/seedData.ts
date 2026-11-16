import { addDaysIso, formatIsoDate } from "@/lib/studyLogic";
import type {
  ChatThread,
  Flashcard,
  QuizQuestion,
  StudyGoal,
  StudyNote,
  StudyState,
} from "@/lib/studyTypes";

const todayIso = formatIsoDate(new Date());

export const SEED_GOALS: StudyGoal[] = [
  {
    id: "dsa-core",
    title: "Data Structures & Algorithms",
    category: "Computer Science",
    description:
      "Build problem-solving fluency with arrays, trees, graphs, and dynamic programming using free interactive courses.",
    weeklyHoursTarget: 6,
    isActive: true,
    createdAt: addDaysIso(todayIso, -12),
    milestones: [
      {
        id: "dsa-m1",
        title: "Complexity & Big-O Intuition",
        summary: "Time/space trade-offs, recurrence patterns, and amortized growth.",
        estimatedMinutes: 45,
        completed: true,
        resources: [
          {
            id: "dsa-r1",
            title: "Big-O Notation & Complexity Reference",
            provider: "Big-O Cheat Sheet",
            kind: "Docs",
            duration: "20 min",
            url: "https://www.bigocheatsheet.com/",
          },
          {
            id: "dsa-r2",
            title: "MIT 6.006 Lecture 1: Algorithms & Computation",
            provider: "MIT OpenCourseWare",
            kind: "Video",
            duration: "48 min",
            url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/",
          },
        ],
      },
      {
        id: "dsa-m2",
        title: "Two Pointers & Sliding Window",
        summary: "Solve linear subarray and string scanning problems without nested loops.",
        estimatedMinutes: 60,
        completed: true,
        resources: [
          {
            id: "dsa-r3",
            title: "NeetCode Roadmap — Arrays & Two Pointers",
            provider: "NeetCode",
            kind: "Interactive",
            duration: "45 min",
            url: "https://neetcode.io/roadmap",
          },
        ],
      },
      {
        id: "dsa-m3",
        title: "Trees, Recursion & BFS / DFS",
        summary: "Traverse binary trees cleanly with iterative queues and recursive call stacks.",
        estimatedMinutes: 75,
        completed: false,
        resources: [
          {
            id: "dsa-r4",
            title: "Binary Search Trees & Traversals Visualizer",
            provider: "VisuAlgo",
            kind: "Interactive",
            duration: "35 min",
            url: "https://visualgo.net/en/bst",
          },
          {
            id: "dsa-r5",
            title: "Graph & Tree Traversal Guide",
            provider: "CP-Algorithms",
            kind: "Article",
            duration: "30 min",
            url: "https://cp-algorithms.com/graph/breadth-first-search.html",
          },
        ],
      },
      {
        id: "dsa-m4",
        title: "Graphs & Shortest Paths",
        summary: "Topological sort, Union-Find, and Dijkstra's priority queue intuition.",
        estimatedMinutes: 90,
        completed: false,
        resources: [
          {
            id: "dsa-r6",
            title: "Shortest Path Visualizer",
            provider: "VisuAlgo",
            kind: "Interactive",
            duration: "40 min",
            url: "https://visualgo.net/en/sssp",
          },
        ],
      },
      {
        id: "dsa-m5",
        title: "Dynamic Programming Patterns",
        summary: "Translate recursive state transitions into memoized tables.",
        estimatedMinutes: 90,
        completed: false,
        resources: [
          {
            id: "dsa-r7",
            title: "Dynamic Programming from Scratch",
            provider: "freeCodeCamp",
            kind: "Video",
            duration: "60 min",
            url: "https://www.freecodecamp.org/news/learn-dynamic-programming-to-solve-coding-challenges/",
          },
        ],
      },
    ],
  },
  {
    id: "web-eng",
    title: "Modern Web Engineering",
    category: "Web Engineering",
    description:
      "Master TypeScript, React mental models, browser rendering, and REST/state architecture with official docs.",
    weeklyHoursTarget: 5,
    isActive: true,
    createdAt: addDaysIso(todayIso, -9),
    milestones: [
      {
        id: "web-m1",
        title: "Semantic HTML & CSS Layout Geometry",
        summary: "Flexbox, Grid, and accessible document structure.",
        estimatedMinutes: 50,
        completed: true,
        resources: [
          {
            id: "web-r1",
            title: "Learn CSS Grid & Flexbox",
            provider: "web.dev",
            kind: "Article",
            duration: "35 min",
            url: "https://web.dev/learn/css/",
          },
        ],
      },
      {
        id: "web-m2",
        title: "TypeScript Type Narrowing & Generics",
        summary: "Design strict interfaces and eliminate runtime surprises.",
        estimatedMinutes: 60,
        completed: false,
        resources: [
          {
            id: "web-r2",
            title: "The TypeScript Handbook — Narrowing",
            provider: "TypeScript Docs",
            kind: "Docs",
            duration: "40 min",
            url: "https://www.typescriptlang.org/docs/handbook/2/narrowing.html",
          },
        ],
      },
      {
        id: "web-m3",
        title: "React Thinking in State & Effects",
        summary: "Derived state, lifting state cleanly, and avoiding redundant effects.",
        estimatedMinutes: 65,
        completed: false,
        resources: [
          {
            id: "web-r3",
            title: "You Might Not Need an Effect",
            provider: "React Docs",
            kind: "Docs",
            duration: "30 min",
            url: "https://react.dev/learn/you-might-not-need-an-effect",
          },
        ],
      },
      {
        id: "web-m4",
        title: "Full-Stack API Design & Persistence",
        summary: "HTTP semantics, validation, and optimistic UI updates.",
        estimatedMinutes: 70,
        completed: false,
        resources: [
          {
            id: "web-r4",
            title: "Full Stack Open — Communicating with Server",
            provider: "University of Helsinki",
            kind: "Interactive",
            duration: "60 min",
            url: "https://fullstackopen.com/en/part3",
          },
        ],
      },
    ],
  },
  {
    id: "ai-ml",
    title: "AI & Neural Networks",
    category: "AI & Math",
    description:
      "Understand backpropagation, transformers, and LLM engineering from intuition up to working code.",
    weeklyHoursTarget: 4,
    isActive: true,
    createdAt: addDaysIso(todayIso, -5),
    milestones: [
      {
        id: "ai-m1",
        title: "Linear Algebra & Gradient Descent Intuition",
        summary: "Vectors, dot products, and why gradients point uphill.",
        estimatedMinutes: 45,
        completed: false,
        resources: [
          {
            id: "ai-r1",
            title: "But what is a Neural Network? (Chapter 1–3)",
            provider: "3Blue1Brown",
            kind: "Video",
            duration: "45 min",
            url: "https://www.3blue1brown.com/topics/neural-networks",
          },
        ],
      },
      {
        id: "ai-m2",
        title: "Micrograd & Backpropagation from Scratch",
        summary: "Implement an autograd engine in pure Python.",
        estimatedMinutes: 90,
        completed: false,
        resources: [
          {
            id: "ai-r2",
            title: "Neural Networks: Zero to Hero",
            provider: "Andrej Karpathy",
            kind: "Video",
            duration: "120 min",
            url: "https://karpathy.ai/zero-to-hero.html",
          },
        ],
      },
      {
        id: "ai-m3",
        title: "Attention & Transformer Architecture",
        summary: "Queries, keys, values, and token context scaling.",
        estimatedMinutes: 75,
        completed: false,
        resources: [
          {
            id: "ai-r3",
            title: "The Illustrated Transformer",
            provider: "Jay Alammar",
            kind: "Article",
            duration: "35 min",
            url: "https://jalammar.github.io/illustrated-transformer/",
          },
          {
            id: "ai-r4",
            title: "Hugging Face LLM Course",
            provider: "Hugging Face",
            kind: "Interactive",
            duration: "50 min",
            url: "https://huggingface.co/learn/llm-course",
          },
        ],
      },
    ],
  },
  {
    id: "japanese-n5",
    title: "Japanese N5 Foundation",
    category: "Languages",
    description:
      "Build reading confidence with Hiragana, Katakana, core particles, and everyday sentence patterns.",
    weeklyHoursTarget: 4,
    isActive: false,
    createdAt: addDaysIso(todayIso, -4),
    milestones: [
      {
        id: "jp-m1",
        title: "Hiragana Reading & Stroke Flow",
        summary: "Read all 46 basic kana cleanly without romaji crutches.",
        estimatedMinutes: 60,
        completed: false,
        resources: [
          {
            id: "jp-r1",
            title: "Tofugu Hiragana Guide",
            provider: "Tofugu",
            kind: "Article",
            duration: "45 min",
            url: "https://www.tofugu.com/japanese/learn-hiragana/",
          },
        ],
      },
      {
        id: "jp-m2",
        title: "Core Particles: は, が, を, に, で",
        summary: "Anchor topic, subject, object, and location markers.",
        estimatedMinutes: 50,
        completed: false,
        resources: [
          {
            id: "jp-r2",
            title: "Tae Kim's Guide to Japanese Grammar",
            provider: "Tae Kim",
            kind: "Docs",
            duration: "40 min",
            url: "https://guidetojapanese.org/learn/",
          },
        ],
      },
      {
        id: "jp-m3",
        title: "Everyday Verb Conjugations (ます / ない / て)",
        summary: "Polite present, negative, and chaining actions.",
        estimatedMinutes: 60,
        completed: false,
        resources: [
          {
            id: "jp-r3",
            title: "NHK Easy Japanese Lessons",
            provider: "NHK World",
            kind: "Interactive",
            duration: "30 min",
            url: "https://www.nhk.or.jp/lesson/en/",
          },
        ],
      },
    ],
  },
  {
    id: "system-design",
    title: "System Design Essentials",
    category: "System Design",
    description:
      "Reason clearly about caching, sharding, queues, rate limiters, and latency budgets.",
    weeklyHoursTarget: 3,
    isActive: false,
    createdAt: addDaysIso(todayIso, -2),
    milestones: [
      {
        id: "sd-m1",
        title: "Latency Numbers, Caching & CDNs",
        summary: "Cache-aside, write-through, and eviction trade-offs.",
        estimatedMinutes: 45,
        completed: false,
        resources: [
          {
            id: "sd-r1",
            title: "The System Design Primer",
            provider: "GitHub Open Source",
            kind: "Docs",
            duration: "45 min",
            url: "https://github.com/donnemartin/system-design-primer",
          },
        ],
      },
      {
        id: "sd-m2",
        title: "SQL vs NoSQL, Indexing & Partitioning",
        summary: "B-trees, replication lag, and consistent hashing.",
        estimatedMinutes: 55,
        completed: false,
        resources: [
          {
            id: "sd-r2",
            title: "System Design Visual Guides",
            provider: "ByteByteGo Blog",
            kind: "Article",
            duration: "35 min",
            url: "https://blog.bytebytego.com/",
          },
        ],
      },
    ],
  },
];

export const SEED_QUIZ_QUESTIONS: QuizQuestion[] = [
  // DSA
  {
    id: "q-dsa-1",
    topicId: "dsa-core",
    question: "Why does Binary Search achieve O(log n) worst-case time complexity?",
    options: [
      "It inspects only the first and last items in memory",
      "Each comparison discards half of the remaining sorted search space",
      "It hashes every element into constant-time buckets",
      "It uses two pointers moving one step at a time",
    ],
    correctIndex: 1,
    explanation:
      "Because the array is sorted, comparing the middle element lets you eliminate half of the remaining elements on every step, yielding log2(n) steps.",
  },
  {
    id: "q-dsa-2",
    topicId: "dsa-core",
    question: "Which traversal order visits a Binary Search Tree in ascending sorted order?",
    options: [
      "Pre-order (Root, Left, Right)",
      "Level-order (BFS)",
      "In-order (Left, Root, Right)",
      "Post-order (Left, Right, Root)",
    ],
    correctIndex: 2,
    explanation:
      "In a BST, all left descendants are smaller than the node and all right descendants are larger, so Left → Root → Right yields sorted values.",
  },
  {
    id: "q-dsa-3",
    topicId: "dsa-core",
    question: "When should you reach for a Sliding Window over a Hash Map alone?",
    options: [
      "When you need the shortest or longest contiguous subarray/substring meeting a condition",
      "When elements must be sorted alphabetically first",
      "When finding connected components in an undirected graph",
      "When computing Fibonacci numbers recursively",
    ],
    correctIndex: 0,
    explanation:
      "Sliding Window maintains a contiguous range [left, right] in O(n) time by expanding and shrinking boundaries cleanly.",
  },
  {
    id: "q-dsa-4",
    topicId: "dsa-core",
    question: "Which data structure guarantees finding the shortest path in an unweighted graph?",
    options: [
      "Stack (Depth-First Search)",
      "Queue (Breadth-First Search)",
      "Linked List",
      "Trie",
    ],
    correctIndex: 1,
    explanation:
      "BFS explores nodes layer by layer in order of edge distance from the source, so the first time it reaches a target is guaranteed to be shortest.",
  },

  // Web Engineering
  {
    id: "q-web-1",
    topicId: "web-eng",
    question: "In React, when is a value best computed during render instead of stored in useState + useEffect?",
    options: [
      "When it can be derived directly from existing props or state",
      "When it comes from a WebSocket stream",
      "When the user types into a controlled input",
      "When syncing with browser localStorage",
    ],
    correctIndex: 0,
    explanation:
      "Deriving values directly during render avoids extra render passes, stale intermediate state, and unnecessary useEffect synchronization bugs.",
  },
  {
    id: "q-web-2",
    topicId: "web-eng",
    question: "What does TypeScript's discriminated union pattern enable?",
    options: [
      "Automatic CSS styling for React components",
      "Exhaustive compile-time type narrowing via a shared literal tag field",
      "Running SQL queries inside the browser",
      "Disabling strict null checks globally",
    ],
    correctIndex: 1,
    explanation:
      "Checking a literal tag like `status === 'success'` lets TypeScript narrow the exact payload fields available in each branch.",
  },
  {
    id: "q-web-3",
    topicId: "web-eng",
    question: "Why should keys in a dynamic React list NOT be array indices when items can reorder or delete?",
    options: [
      "React forbids numeric keys at runtime",
      "Index keys tie component state to position instead of item identity, causing state mix-ups",
      "Array indices slow down CSS animations",
      "Keys must always be UUIDs generated during render",
    ],
    correctIndex: 1,
    explanation:
      "If item 0 is removed, the old item 1 becomes index 0, causing React to reuse the wrong DOM/component state unless keys match stable IDs.",
  },

  // AI & ML
  {
    id: "q-ai-1",
    topicId: "ai-ml",
    question: "During backpropagation, what does the chain rule compute?",
    options: [
      "The token limit of the context window",
      "How much each weight contributed to the final loss via local derivatives",
      "The number of layers in a convolutional network",
      "The HTTP latency of the inference server",
    ],
    correctIndex: 1,
    explanation:
      "Backpropagation multiplies local gradients backwards from the loss to each parameter so gradient descent knows which direction reduces error.",
  },
  {
    id: "q-ai-2",
    topicId: "ai-ml",
    question: "In Transformer self-attention, what is the role of Query (Q) and Key (K) dot products?",
    options: [
      "Compressing images into JPEG files",
      "Measuring how strongly each token should attend to every other token",
      "Shuffling training batches randomly",
      "Encrypting model weights on disk",
    ],
    correctIndex: 1,
    explanation:
      "The scaled dot product between Query and Key vectors produces attention weights (after softmax) that blend Value vectors contextually.",
  },
  {
    id: "q-ai-3",
    topicId: "ai-ml",
    question: "Why do neural networks require non-linear activation functions like ReLU or GELU between linear layers?",
    options: [
      "To convert floating-point numbers into integers",
      "Without non-linearities, stacked linear layers collapse into a single linear transformation",
      "To reduce GPU memory to zero",
      "To enforce alphabetical sorting on outputs",
    ],
    correctIndex: 1,
    explanation:
      "A composition of linear matrix multiplications is still just a linear map; non-linearities allow networks to approximate complex curved boundaries.",
  },

  // Japanese N5
  {
    id: "q-jp-1",
    topicId: "japanese-n5",
    question: "Which particle marks the direct object of an action verb (e.g., 'I drink water')?",
    options: ["は (wa)", "に (ni)", "を (o / wo)", "で (de)"],
    correctIndex: 2,
    explanation:
      "を (pronounced 'o' as a particle) marks the direct object receiving the verb's action, as in みず を のみます (mizu o nomimasu).",
  },
  {
    id: "q-jp-2",
    topicId: "japanese-n5",
    question: "What does the particle で (de) indicate in 「としょかん で べんきょうします」?",
    options: [
      "The destination someone is moving toward",
      "The location where an action takes place",
      "The possessive owner of an object",
      "A yes/no question marker",
    ],
    correctIndex: 1,
    explanation:
      "で marks the location where an active verb occurs ('study AT the library'), whereas に marks static existence or destination.",
  },

  // System Design
  {
    id: "q-sd-1",
    topicId: "system-design",
    question: "What problem does Consistent Hashing solve in distributed caches or databases?",
    options: [
      "Compressing JSON payloads",
      "Minimizing key remapping when servers are added or removed",
      "Preventing SQL injection attacks",
      "Rendering React components on the server",
    ],
    correctIndex: 1,
    explanation:
      "With modulo hashing (`hash % N`), changing N moves almost every key. Consistent hashing on a ring only moves ~1/N keys when a node joins or leaves.",
  },
  {
    id: "q-sd-2",
    topicId: "system-design",
    question: "What happens in a 'Cache-Aside' read miss?",
    options: [
      "The cache deletes the database row",
      "The app reads from the database, returns the data, and populates the cache for next time",
      "The request fails with HTTP 503",
      "The CDN rewrites the DNS record",
    ],
    correctIndex: 1,
    explanation:
      "In Cache-Aside, the application checks the cache first; on a miss, it fetches from the primary DB and writes the entry into the cache.",
  },
];

export const SEED_FLASHCARDS: Flashcard[] = [
  {
    id: "fc-1",
    topicId: "dsa-core",
    front: "When is BFS preferred over DFS?",
    back: "When you need the shortest path in an unweighted graph or level-by-level traversal.",
    mastered: false,
  },
  {
    id: "fc-2",
    topicId: "dsa-core",
    front: "Time & Space complexity of Merge Sort?",
    back: "O(n log n) time in all cases (best/avg/worst); O(n) auxiliary space for merging.",
    mastered: true,
  },
  {
    id: "fc-3",
    topicId: "dsa-core",
    front: "Two conditions for a problem to fit Dynamic Programming?",
    back: "1) Optimal substructure (optimal solution builds from subproblems) and 2) Overlapping subproblems.",
    mastered: false,
  },
  {
    id: "fc-4",
    topicId: "web-eng",
    front: "What is the purpose of AbortController in fetch()?",
    back: "Cancels stale in-flight HTTP requests (e.g., on search input change or component unmount) to prevent race conditions.",
    mastered: false,
  },
  {
    id: "fc-5",
    topicId: "web-eng",
    front: "Difference between `unknown` and `any` in TypeScript?",
    back: "`any` disables type checking; `unknown` is type-safe and forces narrowing before accessing properties.",
    mastered: false,
  },
  {
    id: "fc-6",
    topicId: "ai-ml",
    front: "What does Temperature control in LLM sampling?",
    back: "Scales logits before softmax: low temperature sharpens high-probability tokens (deterministic), high temperature flattens distribution (creative).",
    mastered: false,
  },
  {
    id: "fc-7",
    topicId: "japanese-n5",
    front: "Difference between は (wa) and が (ga)?",
    back: "は sets the broad topic ('As for X...'); が identifies/emphasizes the specific subject performing or being something.",
    mastered: false,
  },
  {
    id: "fc-8",
    topicId: "system-design",
    front: "What is Backpressure in a message queue?",
    back: "A mechanism signaling upstream producers to slow down or buffer when downstream consumers are saturated.",
    mastered: false,
  },
];

export const SEED_NOTES: StudyNote[] = [
  {
    id: "note-1",
    title: "Sliding Window Mental Template",
    goalId: "dsa-core",
    tags: ["dsa", "patterns"],
    updatedAt: addDaysIso(todayIso, -1),
    content: `Key insight: Two pointers (left, right) both only move forward → O(n) total work.

1. Expand right pointer to include new element into window state.
2. While window condition is invalid (or valid for min-length problems), shrink from left.
3. Update best answer at the valid window boundary.

Remember to double-check whether the window tracks frequency counts (Map) or running sum.`,
  },
  {
    id: "note-2",
    title: "React Derived State Checklist",
    goalId: "web-eng",
    tags: ["react", "architecture"],
    updatedAt: todayIso,
    content: `Before adding useEffect:
- Can this value be computed from existing props/state during render? If yes, delete the effect.
- Does this only need to happen when a user clicks something? Put it in the event handler, not an effect.`,
  },
  {
    id: "note-3",
    title: "Attention Formula Breakdown",
    goalId: "ai-ml",
    tags: ["transformers", "math"],
    updatedAt: addDaysIso(todayIso, -2),
    content: `Attention(Q, K, V) = softmax((Q · K^T) / sqrt(d_k)) · V

Why divide by sqrt(d_k)?
When dimension d_k is large, dot products grow large in magnitude, pushing softmax into regions with tiny gradients.`,
  },
];

export const SEED_THREADS: ChatThread[] = [
  {
    id: "thread-welcome",
    title: "Binary Tree BFS vs DFS Intuition",
    goalId: "dsa-core",
    mode: "explain",
    updatedAt: todayIso,
    messages: [
      {
        id: "m-1",
        role: "user",
        content: "When should I choose BFS over DFS for a tree or graph problem?",
        createdAt: todayIso,
      },
      {
        id: "m-2",
        role: "assistant",
        content: `Great question—here is the clean rule of thumb:

1. Choose **BFS (Queue)** when distance from the start matters:
   - Finding the **shortest path** in an unweighted graph.
   - Level-order problems (e.g., zigzag tree traversal, minimum depth of a binary tree).

2. Choose **DFS (Recursion / Stack)** when exploring full paths or structure matters:
   - Checking if a path exists, backtracking, topological sort, or detecting cycles.
   - Tree height, subtree sums, or validating a Binary Search Tree.

**Quick Check:** If you needed the *minimum* number of knight moves on a chessboard from (0,0) to (x,y), would you reach for BFS or DFS first?`,
        createdAt: todayIso,
      },
    ],
  },
];

export function createInitialStudyState(): StudyState {
  const activityLog: Record<string, number> = {
    [addDaysIso(todayIso, -18)]: 2,
    [addDaysIso(todayIso, -17)]: 1,
    [addDaysIso(todayIso, -14)]: 3,
    [addDaysIso(todayIso, -11)]: 2,
    [addDaysIso(todayIso, -10)]: 4,
    [addDaysIso(todayIso, -6)]: 1,
    [addDaysIso(todayIso, -5)]: 2,
    [addDaysIso(todayIso, -4)]: 3,
    [addDaysIso(todayIso, -3)]: 2,
    [addDaysIso(todayIso, -2)]: 3,
    [addDaysIso(todayIso, -1)]: 2,
    [todayIso]: 1,
  };

  return {
    profile: {
      name: "Learner",
      handle: "study-desk",
      email: "",
      bio: "Building deep technical fluency one focused milestone at a time.",
      dailyFocusTask: "Finish Trees & BFS milestone + 4 practice checks",
      dailyFocusCompleted: false,
      dailyTargetMinutes: 45,
      isSignedIn: false,
    },
    goals: SEED_GOALS,
    threads: SEED_THREADS,
    activeThreadId: SEED_THREADS[0].id,
    notes: SEED_NOTES,
    flashcards: SEED_FLASHCARDS,
    quizHistory: [],
    activityLog,
  };
}
