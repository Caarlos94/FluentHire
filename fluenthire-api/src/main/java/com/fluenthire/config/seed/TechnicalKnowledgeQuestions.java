package com.fluenthire.config.seed;

import com.fluenthire.entity.DifficultyLevel;
import com.fluenthire.entity.Question;
import com.fluenthire.entity.QuestionCategory;

import java.util.ArrayList;
import java.util.List;

public final class TechnicalKnowledgeQuestions {

    private TechnicalKnowledgeQuestions() {}

    public static List<Question> getAll() {
        List<Question> questions = new ArrayList<>();
        addGenericQuestions(questions);
        addTechnologySpecificQuestions(questions);
        return questions;
    }

    // ════════════════════════════════════════════════════════════════════════
    // Generic Technical Knowledge (25 questions)
    // ════════════════════════════════════════════════════════════════════════

    private static void addGenericQuestions(List<Question> questions) {
        // ── Junior ──
        questions.add(q("SQL vs NoSQL",
                "When would you choose a SQL database over a NoSQL database? Give examples of use cases for each.",
                DifficultyLevel.JUNIOR, "databases", "sql", "nosql", "architecture"));

        questions.add(q("Docker and Containers",
                "Explain what Docker is and why containers are useful. How have you used Docker in your projects?",
                DifficultyLevel.JUNIOR, "docker", "containers", "devops", "infrastructure"));

        questions.add(q("HTTP methods and status codes",
                "Explain the main HTTP methods (GET, POST, PUT, PATCH, DELETE) and when you would use each one. What are the most common status codes and what do they mean?",
                DifficultyLevel.JUNIOR, "http", "rest", "basics", "api"));

        questions.add(q("What is version control?",
                "Explain how Git works at a high level. What is a branch, a merge, and a pull request? Why is version control important in a team?",
                DifficultyLevel.JUNIOR, "git", "version-control", "basics", "collaboration"));

        questions.add(q("Relational database basics",
                "Explain what a relational database is. What are tables, rows, columns, primary keys, and foreign keys? Give an example of how you would model a simple relationship.",
                DifficultyLevel.JUNIOR, "databases", "sql", "basics", "relational"));

        questions.add(q("What is an API?",
                "Explain what an API is to a non-technical person. Then explain it at a technical level — what happens when a client makes an API call?",
                DifficultyLevel.JUNIOR, "api", "basics", "communication"));

        questions.add(q("Object-Oriented Programming basics",
                "Explain the four pillars of OOP: encapsulation, abstraction, inheritance, and polymorphism. Give a real-world example for each.",
                DifficultyLevel.JUNIOR, "oop", "design", "basics"));

        questions.add(q("What happens when you type a URL in the browser?",
                "Walk me through everything that happens from the moment you type a URL in the browser to when the page is fully loaded.",
                DifficultyLevel.JUNIOR, "networking", "dns", "http", "browser"));

        // ── Mid ──
        questions.add(q("REST vs GraphQL",
                "Explain the differences between REST and GraphQL. When would you choose one over the other?",
                DifficultyLevel.MID, "api", "rest", "graphql", "backend"));

        questions.add(q("SOLID Principles",
                "Explain the SOLID principles. Can you give a real example from your experience where applying one of them improved your code?",
                DifficultyLevel.MID, "oop", "design-patterns", "clean-code"));

        questions.add(q("How database indexes work",
                "Explain how database indexes work. When should you add an index and when can they hurt performance?",
                DifficultyLevel.MID, "databases", "sql", "performance", "postgresql"));

        questions.add(q("Authentication and Authorization",
                "Explain the difference between authentication and authorization. How would you implement a secure auth system in a web application?",
                DifficultyLevel.MID, "security", "jwt", "oauth", "backend"));

        questions.add(q("CI/CD Pipeline",
                "Describe what a CI/CD pipeline is and how you've set one up. What stages should it include?",
                DifficultyLevel.MID, "devops", "ci-cd", "automation", "deployment"));

        questions.add(q("CAP Theorem explained",
                "Explain the CAP theorem. Give real-world examples of databases that prioritize different combinations of Consistency, Availability, and Partition Tolerance.",
                DifficultyLevel.MID, "distributed-systems", "databases", "cap-theorem"));

        questions.add(q("How does OAuth 2.0 work?",
                "Explain the OAuth 2.0 authorization flow. What is the difference between authentication and authorization? When would you use OAuth vs. JWT?",
                DifficultyLevel.MID, "oauth", "authentication", "security", "jwt"));

        questions.add(q("Database transactions and ACID",
                "Explain ACID properties in database transactions. What happens if one of them is violated? Give an example of when you would need a transaction.",
                DifficultyLevel.MID, "databases", "transactions", "acid"));

        questions.add(q("Message queues and when to use them",
                "Explain what a message queue is (e.g., RabbitMQ, Kafka). When would you use one instead of a direct API call? What problems do they solve?",
                DifficultyLevel.MID, "message-queues", "kafka", "rabbitmq", "async"));

        questions.add(q("Caching strategies explained",
                "Explain the difference between cache-aside, read-through, write-through, and write-behind caching patterns. When would you use each one?",
                DifficultyLevel.MID, "caching", "redis", "patterns", "performance"));

        questions.add(q("Design patterns you use regularly",
                "What design patterns do you use most often in your daily work? Explain two or three patterns with concrete examples from projects you have worked on.",
                DifficultyLevel.MID, "design-patterns", "architecture", "best-practices"));

        // ── Senior ──
        questions.add(q("Microservices vs Monolith",
                "What are the tradeoffs between microservices and monolithic architecture? When would you choose each approach?",
                DifficultyLevel.SENIOR, "architecture", "microservices", "backend", "scalability"));

        questions.add(q("Event-driven architecture",
                "Explain event-driven architecture. What are the benefits and challenges compared to request-response? When would you choose one over the other?",
                DifficultyLevel.SENIOR, "event-driven", "architecture", "microservices"));

        questions.add(q("Database sharding strategies",
                "Explain different sharding strategies (hash-based, range-based, geographic). What are the challenges of sharding, and how do you handle cross-shard queries?",
                DifficultyLevel.SENIOR, "sharding", "databases", "scaling", "distributed-systems"));

        questions.add(q("Observability in production systems",
                "Explain the three pillars of observability: logs, metrics, and traces. How do they work together? How would you set up observability for a microservices architecture?",
                DifficultyLevel.SENIOR, "observability", "monitoring", "logging", "devops"));

        questions.add(q("Zero-downtime deployments",
                "Explain how you would achieve zero-downtime deployments. Discuss blue-green deployments, canary releases, rolling updates, and database migration strategies.",
                DifficultyLevel.SENIOR, "deployment", "devops", "ci-cd", "zero-downtime"));

        questions.add(q("Scaling a system from 1K to 1M users",
                "Walk me through how you would scale a web application as it grows from 1,000 to 1,000,000 users. What changes at each stage?",
                DifficultyLevel.SENIOR, "scaling", "architecture", "infrastructure"));
    }

    // ════════════════════════════════════════════════════════════════════════
    // Technology-Specific (140 questions)
    // 14 technologies x 10 questions (3 JUNIOR, 4 MID, 3 SENIOR)
    // Cross-referenced from Toptal, Turing, Arc.dev, Glassdoor, Interviewing.io
    // ════════════════════════════════════════════════════════════════════════

    private static void addTechnologySpecificQuestions(List<Question> questions) {

        // ═══════════════════════════════════════════════════════════════
        // JAVA
        // ═══════════════════════════════════════════════════════════════
        questions.add(q("OOP Four Pillars in Java",
                "Can you walk me through the four pillars of object-oriented programming in Java — encapsulation, abstraction, inheritance, and polymorphism? For each one, give me a real-world example of when you'd apply it and explain why it matters in a production codebase.",
                DifficultyLevel.JUNIOR, "java", "oop", "fundamentals"));

        questions.add(q("String Immutability and Security",
                "Strings in Java are immutable and stored in the String pool. Can you explain what that means in practice? Why is it recommended to use a char array instead of a String for storing sensitive data like passwords, and what are the security implications?",
                DifficultyLevel.JUNIOR, "java", "strings", "security", "memory-management"));

        questions.add(q("Checked vs Unchecked Exceptions",
                "What is the difference between checked and unchecked exceptions in Java? When would you choose to throw a checked exception versus an unchecked one in your own code, and how does your decision affect the callers of your method?",
                DifficultyLevel.JUNIOR, "java", "exceptions", "error-handling", "api-design"));

        questions.add(q("Generational Garbage Collection",
                "Can you explain how generational garbage collection works in Java? What are the young generation, old generation, and how does an object move between them? In a real application, how would you recognize that garbage collection is causing performance issues, and what initial steps would you take to diagnose it?",
                DifficultyLevel.MID, "java", "garbage-collection", "jvm", "performance"));

        questions.add(q("Volatile Keyword and Thread Visibility",
                "What does the volatile keyword do in Java, and how does it relate to the Java Memory Model? When would you use volatile instead of synchronized, and what are the limitations of volatile — what problems can't it solve?",
                DifficultyLevel.MID, "java", "concurrency", "memory-model", "threads"));

        questions.add(q("Fail-fast vs Fail-safe Iterators",
                "Describe the difference between fail-fast and fail-safe iterators in Java. Can you give me concrete examples of each from the Collections framework, and explain what happens if you modify a collection while iterating over it in each case?",
                DifficultyLevel.MID, "java", "collections", "concurrency", "iterators"));

        questions.add(q("HashMap Internal Implementation",
                "Describe the internal working of HashMap in Java, including how hashing and collision resolution work, and what changes were introduced in Java 8 for better performance.",
                DifficultyLevel.MID, "java", "collections", "data-structures", "hashing"));

        questions.add(q("JVM GC Tuning and Collector Selection",
                "If you were architecting a latency-sensitive Java application — say, a real-time trading system — how would you choose between G1GC, ZGC, and Shenandoah? Walk me through the tradeoffs between throughput, pause times, and memory footprint, and describe how you'd tune the JVM for your specific use case.",
                DifficultyLevel.SENIOR, "java", "jvm", "garbage-collection", "performance"));

        questions.add(q("Concurrency Design and Deadlock Prevention",
                "You're designing a high-throughput Java service that processes thousands of concurrent requests. How do you decide between using synchronized blocks, ReentrantLock, and java.util.concurrent utilities like ConcurrentHashMap or ExecutorService? Describe a real scenario where a deadlock could occur in production, and walk me through how you would detect and prevent it.",
                DifficultyLevel.SENIOR, "java", "concurrency", "deadlock", "architecture"));

        questions.add(q("Diagnosing Memory Issues in Production",
                "In a long-running Java application experiencing OutOfMemoryErrors or high GC activity, what tools and steps would you take to identify and resolve a memory leak?",
                DifficultyLevel.SENIOR, "java", "memory-management", "debugging", "jvm"));

        // ═══════════════════════════════════════════════════════════════
        // PYTHON
        // ═══════════════════════════════════════════════════════════════
        questions.add(q("Lists vs Tuples",
                "What are the key differences between lists and tuples in Python? Beyond mutability, when and why would you choose one over the other in a real project? Are there any performance differences between them, and why?",
                DifficultyLevel.JUNIOR, "python", "data-structures", "fundamentals"));

        questions.add(q("Global Interpreter Lock (GIL)",
                "What is the GIL in Python, and how does it affect the execution of multi-threaded programs? If you have a CPU-bound task that needs to run in parallel, how would you work around the GIL's limitations?",
                DifficultyLevel.JUNIOR, "python", "concurrency", "threading", "performance"));

        questions.add(q("Python Memory Management",
                "How does Python manage memory? Can you explain how reference counting and garbage collection work together, and what is a reference cycle? As a developer, what practices should you follow to help Python manage memory efficiently?",
                DifficultyLevel.JUNIOR, "python", "memory-management", "garbage-collection"));

        questions.add(q("Decorators and Practical Use Cases",
                "Explain what a decorator is in Python and how it works under the hood. Can you walk me through a real-world scenario where you'd write a custom decorator — for example, for logging, authentication, or rate-limiting — and explain how you'd handle decorating functions that accept different numbers of arguments?",
                DifficultyLevel.MID, "python", "decorators", "functions", "design-patterns"));

        questions.add(q("Generators and Memory Efficiency",
                "How do generators differ from regular functions and lists in Python? Can you explain the yield keyword, and walk me through a real-world scenario — such as processing a very large file or streaming data — where generators provide a significant advantage?",
                DifficultyLevel.MID, "python", "generators", "memory-management", "performance"));

        questions.add(q("Context Managers",
                "What are context managers in Python, and how does the 'with' statement work? How would you implement your own context manager for resource management like file handling or database connections?",
                DifficultyLevel.MID, "python", "context-managers", "resource-management"));

        questions.add(q("Threading vs asyncio vs multiprocessing",
                "Compare and contrast threading, asyncio, and multiprocessing in Python. For each approach, describe a concrete use case where it would be the best choice. If you had a web application that needs to make hundreds of external API calls concurrently, which approach would you use and why?",
                DifficultyLevel.MID, "python", "concurrency", "asyncio", "architecture"));

        questions.add(q("Profiling and Optimizing Applications",
                "You've been told that a production Python application is running too slowly under high load. Walk me through your approach to diagnosing and fixing this. What profiling tools and techniques would you use? How would you distinguish between CPU-bound bottlenecks, I/O-bound bottlenecks, and memory issues?",
                DifficultyLevel.SENIOR, "python", "profiling", "performance", "debugging"));

        questions.add(q("Memory Leak Debugging in Production",
                "Imagine you have a memory leak in a Python application running in production. Memory usage keeps growing until the service eventually crashes. How would you start debugging this? What tools — such as tracemalloc, objgraph, or memory_profiler — would you use, and what are the most common causes of memory leaks in Python?",
                DifficultyLevel.SENIOR, "python", "memory-management", "debugging", "production"));

        questions.add(q("Designing Async Systems at Scale",
                "If you were designing a high-performance async API server in Python from scratch, which framework would you choose — FastAPI, aiohttp, or something else — and why? How would you handle backpressure when producers generate data faster than consumers can process it? How do you ensure the maintainability of a large Python codebase over time?",
                DifficultyLevel.SENIOR, "python", "async", "architecture", "scalability"));

        // ═══════════════════════════════════════════════════════════════
        // JAVASCRIPT
        // ═══════════════════════════════════════════════════════════════
        questions.add(q("Strict vs Loose Equality",
                "What is the difference between the == and === operators in JavaScript? Can you give me examples where using double-equals could lead to unexpected bugs in production code? When, if ever, is it appropriate to use loose equality?",
                DifficultyLevel.JUNIOR, "javascript", "fundamentals", "type-coercion"));

        questions.add(q("Hoisting and Variable Scoping",
                "Can you explain what hoisting is in JavaScript? How does it affect variables declared with var, let, and const differently? And how does function hoisting differ from variable hoisting? Walk me through an example where not understanding hoisting could introduce a subtle bug.",
                DifficultyLevel.JUNIOR, "javascript", "hoisting", "scoping", "fundamentals"));

        questions.add(q("The this Keyword",
                "The 'this' keyword in JavaScript behaves differently depending on context. Can you explain how 'this' is determined in these scenarios: a regular function call, a method call on an object, a constructor with 'new', and when using call, apply, or bind? How do arrow functions change this behavior, and why does that matter in practice?",
                DifficultyLevel.JUNIOR, "javascript", "this-context", "functions", "fundamentals"));

        questions.add(q("Closures and Practical Applications",
                "What is a closure in JavaScript, and how does it work? Can you describe two or three practical use cases for closures in production code — for example, in data privacy, function factories, or event handlers? Are there any potential downsides to using closures, such as memory implications?",
                DifficultyLevel.MID, "javascript", "closures", "functions", "memory-management"));

        questions.add(q("The Event Loop and Task Queues",
                "Can you explain how the JavaScript event loop works, including the difference between the microtask queue and the macrotask queue? If I have a setTimeout with 0 delay, a Promise.resolve().then() callback, and a synchronous console.log, in what order do they execute and why?",
                DifficultyLevel.MID, "javascript", "event-loop", "async", "performance"));

        questions.add(q("Promises and Async/Await",
                "Walk me through the evolution from callbacks to Promises to async/await in JavaScript. How does error handling differ across these patterns? In a real-world scenario — say you need to make three API calls where the second depends on the first, but the third is independent — how would you structure this for both correctness and performance?",
                DifficultyLevel.MID, "javascript", "promises", "async-await", "error-handling"));

        questions.add(q("Prototypal Inheritance",
                "JavaScript uses prototypal inheritance, but ES6 introduced class syntax. Can you explain how prototypal inheritance actually works under the hood, and how the class keyword is essentially syntactic sugar over it? When would you choose composition over inheritance in a JavaScript application?",
                DifficultyLevel.MID, "javascript", "prototypes", "oop", "inheritance"));

        questions.add(q("Memory Management and Leak Prevention",
                "How does garbage collection work in JavaScript, and what are the most common causes of memory leaks in single-page applications — such as detached DOM nodes, forgotten event listeners, or closures holding references? Walk me through how you would identify and fix a memory leak in a production web application.",
                DifficultyLevel.SENIOR, "javascript", "memory-management", "debugging", "performance"));

        questions.add(q("CommonJS vs ES Modules",
                "Compare CommonJS and ES Modules in JavaScript. What are the benefits of using modules, and how do they impact bundling and tree-shaking in modern applications?",
                DifficultyLevel.SENIOR, "javascript", "modules", "bundling", "architecture"));

        questions.add(q("Performance Optimization at Scale",
                "You're brought in to optimize a JavaScript-heavy web application that has become sluggish — slow initial load, janky scrolling, and unresponsive interactions. Walk me through your systematic approach. How would you use code splitting, tree shaking, lazy loading, and Web Workers? How do you decide between client-side and server-side rendering?",
                DifficultyLevel.SENIOR, "javascript", "performance", "optimization", "architecture"));

        // ═══════════════════════════════════════════════════════════════
        // TYPESCRIPT
        // ═══════════════════════════════════════════════════════════════
        questions.add(q("TypeScript vs JavaScript",
                "Can you explain what TypeScript is, how it relates to JavaScript, and what specific problems it solves that JavaScript alone doesn't? In your experience, what are the most impactful benefits of adopting TypeScript in a project?",
                DifficultyLevel.JUNIOR, "typescript", "fundamentals", "type-safety"));

        questions.add(q("Interfaces vs Type Aliases",
                "What is the difference between an interface and a type alias in TypeScript? When would you choose one over the other, and can you describe a real scenario where that distinction actually mattered in your code?",
                DifficultyLevel.JUNIOR, "typescript", "interfaces", "types", "best-practices"));

        questions.add(q("Type Narrowing and Type Guards",
                "What is type narrowing in TypeScript, and what are the different techniques you can use to narrow a type — such as typeof, instanceof, or custom type guards? Can you walk me through a practical example where type narrowing prevented a bug?",
                DifficultyLevel.JUNIOR, "typescript", "type-guards", "narrowing", "debugging"));

        questions.add(q("Generics and Constraints",
                "Explain how generics work in TypeScript. How do you use the 'extends' keyword to constrain a generic type, and why is that useful? Can you describe a situation where you wrote a generic function or component and what tradeoffs you considered?",
                DifficultyLevel.MID, "typescript", "generics", "reusability", "architecture"));

        questions.add(q("Utility Types in Practice",
                "TypeScript ships with several built-in utility types like Partial, Pick, Omit, Required, and Record. Can you explain when you'd use each of these, and describe a real-world scenario where utility types helped you avoid duplicating type definitions?",
                DifficultyLevel.MID, "typescript", "utility-types", "maintainability"));

        questions.add(q("Type Inference",
                "How does type inference work in TypeScript? Give examples of where the compiler infers types and when you need explicit annotations. What is contextual typing?",
                DifficultyLevel.MID, "typescript", "type-inference", "type-system"));

        questions.add(q("any vs unknown vs never",
                "Explain the differences between 'any', 'unknown', and 'never' types in TypeScript. Why is 'unknown' preferred over 'any' in many cases? When does the 'never' type naturally appear?",
                DifficultyLevel.MID, "typescript", "type-system", "safety", "best-practices"));

        questions.add(q("Conditional Types and the infer Keyword",
                "Explain how conditional types work in TypeScript and what role the 'infer' keyword plays. Can you walk me through a practical example — say building a custom utility type — where conditional types solved a problem that couldn't be handled with simpler type constructs?",
                DifficultyLevel.SENIOR, "typescript", "conditional-types", "advanced-types"));

        questions.add(q("Migrating a JavaScript Codebase to TypeScript",
                "If you were leading the migration of a large, existing JavaScript codebase to TypeScript, how would you approach it? What strategy would you use — big bang or incremental? How do you handle third-party libraries without type definitions, and what are the biggest pitfalls teams typically encounter?",
                DifficultyLevel.SENIOR, "typescript", "migration", "architecture", "strategy"));

        questions.add(q("TypeScript at Scale — Performance and Limits",
                "In large-scale TypeScript projects, teams sometimes hit performance issues with the type checker — slow compilation, IDE lag, or overly complex type errors. What patterns or anti-patterns have you seen cause these problems, and what strategies do you use to keep TypeScript's type system performant and maintainable as a codebase grows?",
                DifficultyLevel.SENIOR, "typescript", "performance", "scalability", "architecture"));

        // ═══════════════════════════════════════════════════════════════
        // REACT
        // ═══════════════════════════════════════════════════════════════
        questions.add(q("Virtual DOM and Reconciliation",
                "Can you explain what the Virtual DOM is in React and why it exists? How does React's reconciliation process decide what to update in the real DOM, and what role do keys play in this process?",
                DifficultyLevel.JUNIOR, "react", "virtual-dom", "reconciliation", "performance"));

        questions.add(q("Props vs State",
                "What is the difference between props and state in React? Can you explain the concept of unidirectional data flow and describe a scenario where you had to decide whether a piece of data should live as local state or be passed down as props?",
                DifficultyLevel.JUNIOR, "react", "props", "state", "data-flow"));

        questions.add(q("Understanding useEffect",
                "Walk me through how the useEffect hook works. What is the role of the dependency array, what happens when you pass an empty array versus no array at all, and what are common mistakes developers make when using useEffect?",
                DifficultyLevel.JUNIOR, "react", "hooks", "useEffect", "lifecycle"));

        questions.add(q("Keys in Lists and Reconciliation",
                "Why are keys important in React lists? What problems occur with unstable keys like array index? Explain how React's reconciliation algorithm uses keys to minimize DOM updates.",
                DifficultyLevel.MID, "react", "keys", "lists", "reconciliation"));

        questions.add(q("React Performance Optimization",
                "What techniques do you use to optimize performance in a React application? Explain how React.memo, useMemo, and useCallback work, and more importantly, when you should NOT use them. How do you identify performance bottlenecks?",
                DifficultyLevel.MID, "react", "performance", "memoization", "optimization"));

        questions.add(q("Custom Hooks Design",
                "What are custom hooks in React and what problems do they solve? Walk me through designing a custom hook you've built — for example, for data fetching, form handling, or debouncing. What principles guide you when deciding to extract logic into a custom hook?",
                DifficultyLevel.MID, "react", "custom-hooks", "reusability", "best-practices"));

        questions.add(q("State Management Approaches",
                "React offers several options for managing state — useState, useReducer, Context API, and external libraries like Redux or Zustand. How do you decide which approach to use in a given situation? What are the tradeoffs between using Context API for global state versus a dedicated state management library?",
                DifficultyLevel.MID, "react", "state-management", "context", "architecture"));

        questions.add(q("SSR vs CSR vs SSG",
                "Can you compare server-side rendering, client-side rendering, and static site generation in the context of React? How do you decide which rendering strategy to use for a given application, and what are the implications for performance, SEO, and developer experience — particularly with frameworks like Next.js?",
                DifficultyLevel.SENIOR, "react", "ssr", "csr", "nextjs", "architecture"));

        questions.add(q("React Architecture at Scale",
                "If you were architecting a large-scale React application from scratch — say a complex dashboard used by thousands of users — how would you structure the project? Walk me through your decisions on folder structure, component composition patterns, code splitting, lazy loading, and how you'd ensure the codebase remains maintainable as the team grows.",
                DifficultyLevel.SENIOR, "react", "architecture", "scalability", "code-splitting"));

        questions.add(q("Concurrent Rendering and React 18",
                "Can you explain React's concurrent rendering model introduced in React 18? What problems does it solve compared to synchronous rendering? How do features like useTransition and Suspense change the way you think about building responsive UIs, and what are the practical implications for how you architect data loading and state updates?",
                DifficultyLevel.SENIOR, "react", "concurrent-rendering", "suspense", "performance"));

        // ═══════════════════════════════════════════════════════════════
        // NODE.JS
        // ═══════════════════════════════════════════════════════════════
        questions.add(q("Non-blocking I/O in Node.js",
                "What does it mean for Node.js to have non-blocking I/O? Can you explain the difference between blocking and non-blocking operations with a practical example, and why is it critical to avoid blocking the event loop in a Node.js application?",
                DifficultyLevel.JUNIOR, "nodejs", "non-blocking", "event-loop", "fundamentals"));

        questions.add(q("Callbacks to Promises to Async/Await",
                "Walk me through the evolution of asynchronous patterns in Node.js — from callbacks to Promises to async/await. What problems does each solve over the previous approach, and what is callback hell? How does async/await improve error handling compared to raw Promises?",
                DifficultyLevel.JUNIOR, "nodejs", "async", "promises", "error-handling"));

        questions.add(q("Error Handling in Node.js",
                "How do you handle errors in Node.js asynchronous code? Discuss callbacks, Promises, and try/catch with async/await. What happens if a Promise rejection goes unhandled?",
                DifficultyLevel.JUNIOR, "nodejs", "error-handling", "async", "best-practices"));

        questions.add(q("Event Loop Phases",
                "Can you explain the different phases of the Node.js event loop — timers, pending callbacks, poll, check, and close callbacks? Where do Promises and process.nextTick() fit in this cycle? How does understanding these phases help you debug timing issues in production?",
                DifficultyLevel.MID, "nodejs", "event-loop", "internals", "debugging"));

        questions.add(q("Streams and Backpressure",
                "What are Node.js streams, and what are the four types — readable, writable, duplex, and transform? Why are streams important for performance, especially when handling large files or datasets? Can you describe a scenario where using streams instead of loading everything into memory made a significant difference?",
                DifficultyLevel.MID, "nodejs", "streams", "performance", "memory-management"));

        questions.add(q("Clustering for Scalability",
                "How does the Cluster module work for scaling Node.js apps across CPU cores? Compare it to PM2 or worker threads. When would you use each approach?",
                DifficultyLevel.MID, "nodejs", "clustering", "scalability", "concurrency"));

        questions.add(q("Node.js Security Best Practices",
                "What are the most important security concerns when building a Node.js API? Walk me through how you'd protect against common vulnerabilities like injection attacks, XSS, CSRF, and dependency-based vulnerabilities. How do you approach validating and sanitizing user input?",
                DifficultyLevel.MID, "nodejs", "security", "input-validation", "best-practices"));

        questions.add(q("Scaling Node.js Applications",
                "Node.js runs on a single thread by default, so how do you scale a Node.js application to take advantage of multi-core systems and handle high traffic? Explain the Cluster module, worker threads, and how you'd architect a deployment using process managers, load balancers, and horizontal scaling.",
                DifficultyLevel.SENIOR, "nodejs", "scaling", "architecture", "deployment"));

        questions.add(q("Diagnosing Production Performance Issues",
                "Imagine your Node.js application in production is experiencing increased latency and occasional timeouts, but CPU and memory metrics look normal. Walk me through your debugging process. What tools would you use — profiling, flame graphs, event loop monitoring?",
                DifficultyLevel.SENIOR, "nodejs", "debugging", "profiling", "performance"));

        questions.add(q("Microservices Architecture with Node.js",
                "If you were designing a microservices architecture using Node.js, how would you approach inter-service communication — REST, gRPC, or message queues? How do you handle distributed transactions, data consistency, and service discovery?",
                DifficultyLevel.SENIOR, "nodejs", "microservices", "architecture", "distributed-systems"));

        // ═══════════════════════════════════════════════════════════════
        // C# (.NET)
        // ═══════════════════════════════════════════════════════════════
        questions.add(q("Value Types vs Reference Types",
                "Can you explain the difference between value types and reference types in C#? When would you choose a struct over a class, and what are the performance implications of that choice?",
                DifficultyLevel.JUNIOR, "csharp", "dotnet", "types", "fundamentals"));

        questions.add(q("Async/Await Fundamentals in C#",
                "How does asynchronous programming with async and await work in C#? Can you walk me through what happens when you await a Task — what does the runtime do behind the scenes, and how does it differ from just spinning up a new thread?",
                DifficultyLevel.JUNIOR, "csharp", "dotnet", "async-await", "concurrency"));

        questions.add(q("Dependency Injection in .NET",
                "What is Dependency Injection and why is it important in .NET applications? How does ASP.NET Core's built-in DI container work, and how does it improve testability and maintainability of your code?",
                DifficultyLevel.JUNIOR, "csharp", "dotnet", "dependency-injection", "architecture"));

        questions.add(q("Garbage Collection in .NET",
                "How does garbage collection work in the .NET CLR? Describe the generational approach and when you might need to tune it for performance-critical applications.",
                DifficultyLevel.MID, "csharp", "dotnet", "garbage-collection", "performance"));

        questions.add(q("LINQ and Query Performance",
                "What is LINQ and how does it translate to SQL or in-memory operations? When would deferred execution cause issues, and how do you avoid common performance pitfalls?",
                DifficultyLevel.MID, "csharp", "dotnet", "linq", "performance"));

        questions.add(q("Task vs Thread in .NET",
                "What is the difference between a Task and a Thread in .NET? When would you prefer using Task and the ThreadPool over manually creating threads? How does the Task Parallel Library fit into the picture for CPU-bound vs I/O-bound work?",
                DifficultyLevel.MID, "csharp", "dotnet", "concurrency", "threads"));

        questions.add(q("Entity Framework Core Performance",
                "What are the most common performance pitfalls when working with Entity Framework Core, and how would you address them? How do you deal with N+1 query problems, what's the difference between eager and lazy loading, and when would you fall back to raw SQL?",
                DifficultyLevel.MID, "csharp", "dotnet", "entity-framework", "performance"));

        questions.add(q("Avoiding Async Deadlocks",
                "A common issue in C# applications is async deadlocks — for example, when calling .Result or .Wait() on an async method in a context with a SynchronizationContext. Can you explain why this happens, what role ConfigureAwait(false) plays, and how you'd design an API layer to avoid these issues entirely?",
                DifficultyLevel.SENIOR, "csharp", "dotnet", "async-await", "deadlock", "debugging"));

        questions.add(q("Application Performance and Caching Strategy",
                "You've been asked to improve the performance of a high-traffic .NET API that's experiencing slow response times under load. Walk me through your diagnostic approach — what profiling tools and metrics would you look at, what caching strategies would you consider, and how would you handle cache invalidation?",
                DifficultyLevel.SENIOR, "csharp", "dotnet", "performance", "caching", "architecture"));

        questions.add(q("Microservices Patterns in .NET",
                "If you were designing a new system of microservices in .NET, how would you approach inter-service communication — when would you choose synchronous REST/gRPC vs asynchronous messaging? Can you discuss patterns like CQRS or the Outbox pattern, and explain how you'd handle distributed transactions?",
                DifficultyLevel.SENIOR, "csharp", "dotnet", "microservices", "architecture"));

        // ═══════════════════════════════════════════════════════════════
        // GO
        // ═══════════════════════════════════════════════════════════════
        questions.add(q("Goroutines vs OS Threads",
                "What is a goroutine in Go, and how does it differ from a traditional OS thread? Why can you spin up thousands of goroutines efficiently, and what are the practical implications of this for how you design concurrent Go programs?",
                DifficultyLevel.JUNIOR, "go", "goroutines", "concurrency", "fundamentals"));

        questions.add(q("Interfaces and Structural Typing",
                "How do interfaces work in Go, and why is it significant that Go uses implicit (structural) interface satisfaction rather than an explicit 'implements' keyword? Can you give an example of how this design enables writing flexible, decoupled code and simplifies testing?",
                DifficultyLevel.JUNIOR, "go", "interfaces", "architecture", "testability"));

        questions.add(q("Error Handling Philosophy",
                "Go doesn't have exceptions — instead it uses explicit error return values. Can you explain Go's approach to error handling, why it was designed this way, and how you use error wrapping and the errors.Is/errors.As functions introduced in Go 1.13?",
                DifficultyLevel.JUNIOR, "go", "error-handling", "best-practices", "fundamentals"));

        questions.add(q("Channels — Buffered vs Unbuffered",
                "What's the difference between a buffered and an unbuffered channel in Go? Can you describe a scenario where choosing one over the other would matter, and explain what conditions lead to a goroutine blocking on a channel send or receive? How would you debug a deadlock caused by improper channel usage?",
                DifficultyLevel.MID, "go", "channels", "concurrency", "debugging"));

        questions.add(q("The Context Package",
                "What is the purpose of the context package in Go, and why is it considered essential in production services? Can you walk me through how you'd use context for request cancellation, timeouts, and passing request-scoped values — and what happens to downstream goroutines when a parent context is cancelled?",
                DifficultyLevel.MID, "go", "context", "concurrency", "best-practices"));

        questions.add(q("Channels vs Mutexes",
                "Go famously says \"Do not communicate by sharing memory; instead, share memory by communicating.\" In practice, when would you reach for channels to coordinate goroutines, and when would a sync.Mutex or sync.RWMutex be the better choice? Can you discuss the tradeoffs?",
                DifficultyLevel.MID, "go", "concurrency", "channels", "synchronization"));

        questions.add(q("Slices Internals and Common Gotchas",
                "Under the hood, a Go slice is backed by an array with a length and capacity. Can you explain how append works, when it causes a new underlying array allocation, and what subtle bugs can arise from multiple slices sharing the same backing array?",
                DifficultyLevel.MID, "go", "slices", "data-structures", "debugging"));

        questions.add(q("The Go Scheduler — GMP Model",
                "Can you explain how Go's runtime scheduler works in terms of the G, M, and P model? What is the role of GOMAXPROCS, how does work-stealing help with load balancing, and what happens when a goroutine makes a blocking system call?",
                DifficultyLevel.SENIOR, "go", "scheduler", "concurrency", "performance"));

        questions.add(q("Concurrency Patterns for Production Systems",
                "Describe the concurrency patterns you'd use to build a high-throughput data processing pipeline in Go — for example, fan-out/fan-in, worker pools, or rate limiting. How would you handle graceful shutdown so that in-flight work is completed before the service exits? How do you detect and prevent goroutine leaks?",
                DifficultyLevel.SENIOR, "go", "concurrency", "architecture", "scalability"));

        questions.add(q("GC Tuning and Performance Profiling",
                "Go uses a concurrent tri-color mark-and-sweep garbage collector. How does it work at a high level, and what impact does it have on latency-sensitive applications? If you identified GC pressure as a bottleneck, what tools like pprof would you use to diagnose it, and what techniques would you apply to optimize performance?",
                DifficultyLevel.SENIOR, "go", "garbage-collection", "profiling", "performance"));

        // ═══════════════════════════════════════════════════════════════
        // RUST
        // ═══════════════════════════════════════════════════════════════
        questions.add(q("Ownership Model Fundamentals",
                "Rust's ownership system is central to the language. Can you explain the three ownership rules, what happens when you assign a String to a new variable, and why Rust uses move semantics instead of copying by default? How does this approach eliminate entire classes of memory bugs without needing a garbage collector?",
                DifficultyLevel.JUNIOR, "rust", "ownership", "memory-safety", "fundamentals"));

        questions.add(q("Borrowing and References",
                "What is borrowing in Rust, and what's the difference between an immutable reference and a mutable reference? Why does Rust enforce the rule that you can have either one mutable reference or any number of immutable references at a time, and what real-world bugs does this prevent?",
                DifficultyLevel.JUNIOR, "rust", "borrowing", "references", "memory-safety"));

        questions.add(q("Error Handling with Result and Option",
                "Rust doesn't have null or exceptions. Instead it uses Result<T, E> and Option<T> for error handling. Can you explain the difference between these two types, when you'd use each one, and how the ? operator simplifies error propagation? When is it acceptable to use unwrap() or expect()?",
                DifficultyLevel.JUNIOR, "rust", "error-handling", "result", "option"));

        questions.add(q("Lifetimes and the Borrow Checker",
                "What are lifetimes in Rust, and why does the compiler sometimes require explicit lifetime annotations? Can you walk me through an example where the borrow checker would reject your code without a lifetime annotation, explain what problem it's preventing, and describe how lifetime elision rules reduce the annotation burden?",
                DifficultyLevel.MID, "rust", "lifetimes", "borrow-checker", "memory-safety"));

        questions.add(q("Traits and Generics",
                "How do traits work in Rust, and how do they compare to interfaces in languages like Go or C#? Can you explain the difference between static dispatch with generics and dynamic dispatch with trait objects (dyn Trait), and discuss the performance tradeoffs between the two approaches?",
                DifficultyLevel.MID, "rust", "traits", "generics", "performance"));

        questions.add(q("Smart Pointers — Box, Rc, Arc",
                "Rust provides several smart pointer types including Box<T>, Rc<T>, and Arc<T>. Can you explain the purpose and use case for each, how Rc and Arc differ in terms of thread safety, and when you'd pair Arc with Mutex or RwLock for shared mutable state? What about reference cycle pitfalls?",
                DifficultyLevel.MID, "rust", "smart-pointers", "concurrency", "memory-management"));

        questions.add(q("Concurrency with Channels and Mutex",
                "How does Rust handle concurrency safely with channels and Mutex? Compare Rust's approach to Go's. How does the compiler enforce thread safety at compile time?",
                DifficultyLevel.MID, "rust", "concurrency", "channels", "mutex"));

        questions.add(q("Unsafe Code and FFI",
                "What does the unsafe keyword in Rust allow you to do, and what specific guarantees does it bypass? In what scenarios is unsafe code warranted — for example, FFI with C libraries or low-level performance optimization — and how would you structure your codebase to minimize the surface area of unsafe code?",
                DifficultyLevel.SENIOR, "rust", "unsafe", "ffi", "architecture"));

        questions.add(q("Concurrency Safety with Send and Sync",
                "Rust claims to prevent data races at compile time. Can you explain how the Send and Sync marker traits work, what it means for a type to be Send or Sync, and how these traits interact with Rust's ownership system to guarantee thread safety? Give an example of a type that is not Send and explain why.",
                DifficultyLevel.SENIOR, "rust", "concurrency", "send-sync", "thread-safety"));

        questions.add(q("Async/Await and Runtime",
                "Explain async/await in Rust with tokio. What tradeoffs exist vs synchronous code? How does Rust's zero-cost async model differ from languages like JavaScript or Python?",
                DifficultyLevel.SENIOR, "rust", "async-await", "tokio", "performance"));

        // ═══════════════════════════════════════════════════════════════
        // AWS
        // ═══════════════════════════════════════════════════════════════
        questions.add(q("Regions, Availability Zones, and Edge Locations",
                "Can you explain the difference between AWS Regions, Availability Zones, and Edge Locations? How would you decide which Region to deploy your application in, and why does this decision matter?",
                DifficultyLevel.JUNIOR, "aws", "infrastructure", "architecture", "fundamentals"));

        questions.add(q("IAM and the Shared Responsibility Model",
                "Walk me through how AWS Identity and Access Management works. What is the AWS Shared Responsibility Model, and how would you apply the principle of least privilege when setting up access for a new team joining your project?",
                DifficultyLevel.JUNIOR, "aws", "iam", "security", "best-practices"));

        questions.add(q("EC2 Pricing Models",
                "AWS offers On-Demand, Reserved, Spot, and Savings Plan pricing for EC2 instances. Can you explain the tradeoffs between these options and describe a scenario where you'd use each one?",
                DifficultyLevel.JUNIOR, "aws", "ec2", "cost-optimization", "fundamentals"));

        questions.add(q("Lambda vs EC2 Tradeoffs",
                "If you were designing a new service, how would you decide between using AWS Lambda and EC2 for your compute layer? Walk me through the tradeoffs in terms of cost, performance, cold starts, execution limits, and operational overhead.",
                DifficultyLevel.MID, "aws", "lambda", "serverless", "architecture"));

        questions.add(q("Auto Scaling and Load Balancing",
                "Explain Auto Scaling Groups and the difference between Application Load Balancer, Network Load Balancer, and Classic Load Balancer. How do they handle traffic spikes? What metrics would you use to trigger scaling?",
                DifficultyLevel.MID, "aws", "auto-scaling", "load-balancer", "scalability"));

        questions.add(q("S3 Storage Classes and Lifecycle Policies",
                "AWS S3 offers multiple storage classes — Standard, Intelligent-Tiering, Glacier, and Glacier Deep Archive. How would you design a cost-effective storage strategy for an application that generates large amounts of data with varying access patterns? How do lifecycle policies fit in?",
                DifficultyLevel.MID, "aws", "s3", "storage", "cost-optimization"));

        questions.add(q("High Availability and Disaster Recovery",
                "How would you design a highly available architecture on AWS for a critical production application? Walk me through the differences between Backup & Restore, Pilot Light, Warm Standby, and Multi-Site Active-Active strategies. How do RPO and RTO influence your choice?",
                DifficultyLevel.MID, "aws", "high-availability", "disaster-recovery", "architecture"));

        questions.add(q("Multi-Region Active-Active Architecture",
                "A client needs their application to serve users across multiple continents with minimal latency and survive an entire regional outage. How would you design a multi-region active-active architecture on AWS? What services would you use for traffic routing, data replication, and conflict resolution?",
                DifficultyLevel.SENIOR, "aws", "multi-region", "architecture", "scalability"));

        questions.add(q("Securing a Multi-Tier Application",
                "Describe how you would implement a defense-in-depth security strategy for a three-tier web application on AWS — covering the network layer, application layer, and data layer. How do VPCs, Security Groups, NACLs, WAF, encryption at rest and in transit, and IAM roles all fit together?",
                DifficultyLevel.SENIOR, "aws", "security", "vpc", "networking"));

        questions.add(q("Cost Optimization at Scale",
                "You've inherited an AWS environment where the monthly bill has grown significantly and leadership wants a 30% cost reduction without impacting performance. Walk me through your approach — what tools would you use to analyze spending, what are the most common sources of waste, and what architectural changes might you propose?",
                DifficultyLevel.SENIOR, "aws", "cost-optimization", "architecture", "performance"));

        // ═══════════════════════════════════════════════════════════════
        // SQL
        // ═══════════════════════════════════════════════════════════════
        questions.add(q("Types of JOINs",
                "Explain the different types of SQL JOINs — INNER, LEFT, RIGHT, FULL OUTER, and CROSS JOIN. Can you give me a real-world example of when you'd use a LEFT JOIN versus an INNER JOIN, and what happens to NULL values in each case?",
                DifficultyLevel.JUNIOR, "sql", "joins", "fundamentals", "databases"));

        questions.add(q("GROUP BY, HAVING, and Aggregate Functions",
                "Explain how GROUP BY works in SQL and how it differs from WHERE. When would you use HAVING instead of WHERE to filter results? Walk me through an example where you need to find all customers who have placed more than five orders in the past year.",
                DifficultyLevel.JUNIOR, "sql", "aggregation", "group-by", "fundamentals"));

        questions.add(q("Indexing Strategy and Tradeoffs",
                "What is a database index, and how does it improve query performance? Explain the difference between a clustered index and a non-clustered index. What are the tradeoffs of adding indexes — when would too many indexes actually hurt performance?",
                DifficultyLevel.JUNIOR, "sql", "indexes", "performance", "databases"));

        questions.add(q("ACID Properties and Transaction Management",
                "What are the ACID properties in a relational database, and why does each one matter? Can you describe a real-world scenario where a transaction's isolation level caused a problem — like a dirty read or a phantom read — and how you would resolve it?",
                DifficultyLevel.MID, "sql", "acid", "transactions", "databases"));

        questions.add(q("Normalization vs Denormalization",
                "Can you explain database normalization through at least the first three normal forms? In what scenarios would you deliberately denormalize a database, and what are the risks? How does the choice between OLTP and OLAP workloads influence this decision?",
                DifficultyLevel.MID, "sql", "normalization", "database-design", "architecture"));

        questions.add(q("Execution Plans and Query Debugging",
                "When a query is running slowly, how do you diagnose the problem? Walk me through how you would use an execution plan — what are you looking for when you see a table scan versus an index scan or an index seek? What steps do you take to optimize a poorly performing query?",
                DifficultyLevel.MID, "sql", "query-optimization", "performance", "debugging"));

        questions.add(q("Transaction Isolation Levels",
                "Describe the different transaction isolation levels — Read Uncommitted, Read Committed, Repeatable Read, and Serializable. What anomalies can occur at each level, and how do they impact concurrency and performance?",
                DifficultyLevel.MID, "sql", "transactions", "isolation-levels", "concurrency"));

        questions.add(q("Window Functions",
                "Explain what window functions are and how they differ from regular aggregate functions and correlated subqueries. When would you use ROW_NUMBER, RANK, or DENSE_RANK, and can you describe a business scenario — such as calculating running totals or ranking results — where window functions are clearly the better approach?",
                DifficultyLevel.SENIOR, "sql", "window-functions", "advanced-queries", "analytics"));

        questions.add(q("Database Partitioning and Sharding at Scale",
                "You're working with a table that has grown to billions of rows and queries are becoming unacceptably slow even with proper indexing. Walk me through your approach — how would you evaluate and implement table partitioning? What's the difference between horizontal and vertical partitioning? At what point would you consider sharding?",
                DifficultyLevel.SENIOR, "sql", "partitioning", "sharding", "scalability"));

        questions.add(q("Data Integrity in Distributed Systems",
                "In a system where multiple services write to the same database — or where data is replicated across databases — how do you ensure data integrity and handle conflicts? Discuss the tradeoffs between strong consistency and eventual consistency, and what patterns like idempotent writes or change data capture you'd employ.",
                DifficultyLevel.SENIOR, "sql", "distributed-systems", "consistency", "architecture"));

        // ═══════════════════════════════════════════════════════════════
        // RUBY
        // ═══════════════════════════════════════════════════════════════
        questions.add(q("Blocks, Procs, and Lambdas",
                "Can you explain the differences between blocks, Procs, and lambdas in Ruby? When would you choose one over the other, and what are the practical implications — for example, in how they handle return statements and argument checking?",
                DifficultyLevel.JUNIOR, "ruby", "blocks", "closures", "fundamentals"));

        questions.add(q("Everything is an Object",
                "Ruby is often described as a \"pure\" object-oriented language where everything is an object. What does that actually mean in practice? Can you give examples of how this differs from languages like Java or Python, and how it affects the way you write everyday Ruby code?",
                DifficultyLevel.JUNIOR, "ruby", "oop", "fundamentals", "language-design"));

        questions.add(q("Modules and Mixins vs Inheritance",
                "Ruby doesn't support multiple inheritance, but it has modules and mixins. Can you explain how you decide between using module inclusion versus class inheritance when designing your object model? What are the tradeoffs, and what pitfalls have you seen with heavy use of mixins?",
                DifficultyLevel.JUNIOR, "ruby", "modules", "mixins", "architecture"));

        questions.add(q("The Global Interpreter Lock in Ruby",
                "Ruby MRI uses a Global Interpreter Lock. Can you explain what the GIL is, how it affects concurrency and parallelism in Ruby applications, and what strategies you use to work around its limitations — for example, when building a high-throughput web service?",
                DifficultyLevel.MID, "ruby", "concurrency", "gil", "performance"));

        questions.add(q("Metaprogramming Basics",
                "Explain metaprogramming in Ruby with method_missing and define_method. Walk through a real-world scenario where you used metaprogramming effectively. What are the risks and downsides?",
                DifficultyLevel.MID, "ruby", "metaprogramming", "dynamic", "best-practices"));

        questions.add(q("Ruby Garbage Collection",
                "How does Ruby's garbage collector work (MRI)? Discuss the generational aspects introduced in Ruby 2.1+ and how they impact performance.",
                DifficultyLevel.MID, "ruby", "garbage-collection", "memory-management", "performance"));

        questions.add(q("N+1 Queries and Rails Performance",
                "One of the most common performance issues in Rails applications is the N+1 query problem. Can you explain what it is, how you detect it in a production application, and what tools and techniques — such as eager loading, caching, or query optimization — you use to address it?",
                DifficultyLevel.MID, "ruby", "rails", "n-plus-one", "performance", "databases"));

        questions.add(q("Advanced Metaprogramming",
                "Ruby has powerful metaprogramming capabilities — method_missing, define_method, open classes, class_eval, and instance_eval. Walk me through a real-world scenario where you used metaprogramming effectively. When is it the right tool versus when does it create more problems than it solves?",
                DifficultyLevel.SENIOR, "ruby", "metaprogramming", "architecture", "maintainability"));

        questions.add(q("Scaling a Rails Monolith",
                "You're working on a large Rails monolith that's starting to show scaling issues — slow response times, growing test suites, and team bottlenecks. Walk me through how you would evaluate whether to refactor the monolith, extract microservices, or take a different approach. What are the key tradeoffs?",
                DifficultyLevel.SENIOR, "ruby", "rails", "scalability", "microservices", "architecture"));

        questions.add(q("Ruby GC and Memory Optimization",
                "Ruby's garbage collector has evolved significantly since Ruby 2.1 with generational GC. Can you explain how it works at a high level, how you would diagnose and fix a memory bloat or leak in a production Rails application, and what tools you rely on for memory profiling?",
                DifficultyLevel.SENIOR, "ruby", "garbage-collection", "memory-management", "debugging"));

        // ═══════════════════════════════════════════════════════════════
        // PHP
        // ═══════════════════════════════════════════════════════════════
        questions.add(q("Sessions vs Cookies",
                "Can you explain the difference between sessions and cookies in PHP? When would you use one versus the other, and what are the security considerations you need to keep in mind — for example, regarding session fixation or cookie tampering?",
                DifficultyLevel.JUNIOR, "php", "sessions", "cookies", "security"));

        questions.add(q("Abstract Classes vs Interfaces",
                "What is the difference between an abstract class and an interface in PHP? Can you describe a practical scenario where you would choose one over the other, and explain how PHP's support for traits fits into this picture?",
                DifficultyLevel.JUNIOR, "php", "oop", "interfaces", "fundamentals"));

        questions.add(q("PDO vs MySQLi",
                "Compare PDO and MySQLi for database access in PHP. Why is PDO generally preferred for security and portability? How do prepared statements work in each?",
                DifficultyLevel.JUNIOR, "php", "pdo", "databases", "security"));

        questions.add(q("Traits in PHP",
                "PHP doesn't support multiple inheritance, but it provides traits. Can you explain how traits work, what problems they solve, and what potential issues they can introduce — such as method conflicts or hidden coupling — in a large codebase?",
                DifficultyLevel.MID, "php", "traits", "oop", "code-reuse"));

        questions.add(q("SQL Injection Prevention",
                "SQL injection is one of the most common security vulnerabilities in PHP applications. Can you walk me through how prepared statements work to prevent SQL injection, the difference between PDO and MySQLi approaches, and any other security practices you follow when interacting with a database?",
                DifficultyLevel.MID, "php", "security", "sql-injection", "databases"));

        questions.add(q("Dependency Injection in PHP",
                "Can you explain what Dependency Injection is, why it matters for writing testable and maintainable PHP code, and how you've implemented it in practice — either manually or using a framework's service container like Laravel's or Symfony's?",
                DifficultyLevel.MID, "php", "dependency-injection", "architecture", "testing"));

        questions.add(q("Namespaces and Composer",
                "How do namespaces and Composer manage dependencies in modern PHP apps? Explain autoloading strategies (PSR-4) and how Composer's dependency resolution works.",
                DifficultyLevel.MID, "php", "composer", "namespaces", "autoloading"));

        questions.add(q("OPcache and Performance Optimization",
                "When you're tasked with improving the performance of a PHP application in production, what is your approach? Can you explain how OPcache works, what other caching strategies you employ — such as Redis or Memcached — and how you profile and identify bottlenecks?",
                DifficultyLevel.SENIOR, "php", "opcache", "performance", "caching"));

        questions.add(q("PHP Security Best Practices",
                "What security practices do you follow when writing PHP applications? Walk me through how you prevent CSRF, XSS, SQL injection, and session-related attacks. How do you handle password hashing and input validation?",
                DifficultyLevel.SENIOR, "php", "security", "xss", "csrf", "best-practices"));

        questions.add(q("Designing a Scalable PHP API Architecture",
                "If you were designing a new REST or GraphQL API in PHP that needs to handle millions of requests per day, walk me through the architectural decisions you would make. How would you choose between Laravel and Symfony? What would your approach be to rate limiting, authentication, versioning, and horizontal scaling?",
                DifficultyLevel.SENIOR, "php", "architecture", "scalability", "api-design"));

        // ═══════════════════════════════════════════════════════════════
        // C/C++
        // ═══════════════════════════════════════════════════════════════
        questions.add(q("Pointers vs References",
                "Can you explain the fundamental differences between pointers and references in C++? When would you choose to use a pointer over a reference and vice versa? What are the safety implications of each, and how do modern C++ best practices guide this decision?",
                DifficultyLevel.JUNIOR, "cpp", "pointers", "references", "fundamentals"));

        questions.add(q("Stack vs Heap Memory",
                "Can you explain the difference between stack memory and heap memory in C++? When is memory allocated on each, what are the performance implications, and what are the risks of mismanaging heap memory — such as memory leaks or fragmentation?",
                DifficultyLevel.JUNIOR, "cpp", "memory-management", "stack", "heap"));

        questions.add(q("The RAII Principle",
                "RAII — Resource Acquisition Is Initialization — is considered one of the most important idioms in C++. Can you explain what it means, give examples of how it applies beyond just memory management — such as file handles, mutexes, or network connections — and discuss why it's critical for writing exception-safe code?",
                DifficultyLevel.JUNIOR, "cpp", "raii", "resource-management", "best-practices"));

        questions.add(q("Smart Pointers and Ownership Semantics",
                "C++11 introduced smart pointers — unique_ptr, shared_ptr, and weak_ptr. Can you explain what each one does, what ownership semantics they represent, and when you would choose one over another? Why are smart pointers preferred over raw pointers in modern C++?",
                DifficultyLevel.MID, "cpp", "smart-pointers", "memory-management", "modern-cpp"));

        questions.add(q("Virtual Functions and Vtables",
                "Can you explain how virtual functions work in C++ at both a conceptual level and an implementation level — for instance, what is a vtable? Why is it important to declare destructors as virtual in base classes, and what happens if you forget?",
                DifficultyLevel.MID, "cpp", "virtual-functions", "oop", "polymorphism"));

        questions.add(q("Undefined Behavior",
                "What is undefined behavior in C++? Give examples and explain why it matters for both correctness and compiler optimization. How do you avoid it in production code?",
                DifficultyLevel.MID, "cpp", "undefined-behavior", "debugging", "safety"));

        questions.add(q("Templates and Generic Programming",
                "How do templates enable generic code in C++? What are the compile-time costs of heavy template usage? When would you use template specialization?",
                DifficultyLevel.MID, "cpp", "templates", "generics", "performance"));

        questions.add(q("Move Semantics and Perfect Forwarding",
                "C++11 introduced move semantics with rvalue references. Can you explain the problem that move semantics solves, how move constructors and move assignment operators work, and what std::move actually does? Additionally, explain perfect forwarding and when you would use std::forward.",
                DifficultyLevel.SENIOR, "cpp", "move-semantics", "modern-cpp", "performance"));

        questions.add(q("Concurrency with std::thread and Atomics",
                "How do std::thread and atomics work in C++? Discuss mutexes, race conditions, and lock-free programming. When would you reach for std::atomic versus a mutex, and what are the tradeoffs?",
                DifficultyLevel.SENIOR, "cpp", "concurrency", "threads", "atomics"));

        questions.add(q("Debugging Memory Issues in Production C++",
                "You're working on a large C++ system that's exhibiting intermittent crashes and suspected memory corruption in production. Walk me through your diagnostic approach. What tools would you use — such as Valgrind, AddressSanitizer, or custom allocators — and how would you identify use-after-free, double-delete, buffer overflows, or memory fragmentation?",
                DifficultyLevel.SENIOR, "cpp", "memory-management", "debugging", "production"));
    }

    // ════════════════════════════════════════════════════════════════════════
    // Helper
    // ════════════════════════════════════════════════════════════════════════

    private static Question q(String title, String content, DifficultyLevel difficulty, String... tags) {
        return Question.builder()
                .title(title)
                .content(content)
                .category(QuestionCategory.TECHNICAL_KNOWLEDGE)
                .difficulty(difficulty)
                .tags(List.of(tags))
                .build();
    }
}
