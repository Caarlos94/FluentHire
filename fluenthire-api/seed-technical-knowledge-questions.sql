-- 140 Technology-Specific Technical Knowledge Questions
-- 14 technologies x 10 questions each (3 JUNIOR, 4 MID, 3 SENIOR)
-- Cross-referenced from Toptal, Turing, Arc.dev, Andela, Glassdoor, Interviewing.io
-- and US tech company remote hiring practices

BEGIN;

-- ════════════════════════════════════════════════════════════════════════════
-- JAVA (501-510)
-- ════════════════════════════════════════════════════════════════════════════

INSERT INTO questions (id, title, content, category, difficulty, created_at) VALUES
(501, 'OOP Four Pillars in Java', 'Can you walk me through the four pillars of object-oriented programming in Java — encapsulation, abstraction, inheritance, and polymorphism? For each one, give me a real-world example of when you''d apply it and explain why it matters in a production codebase.', 'TECHNICAL_KNOWLEDGE', 'JUNIOR', NOW()),
(502, 'String Immutability and Security', 'Strings in Java are immutable and stored in the String pool. Can you explain what that means in practice? Why is it recommended to use a char array instead of a String for storing sensitive data like passwords, and what are the security implications?', 'TECHNICAL_KNOWLEDGE', 'JUNIOR', NOW()),
(503, 'Checked vs Unchecked Exceptions', 'What is the difference between checked and unchecked exceptions in Java? When would you choose to throw a checked exception versus an unchecked one in your own code, and how does your decision affect the callers of your method?', 'TECHNICAL_KNOWLEDGE', 'JUNIOR', NOW()),
(504, 'Generational Garbage Collection', 'Can you explain how generational garbage collection works in Java? What are the young generation, old generation, and how does an object move between them? In a real application, how would you recognize that garbage collection is causing performance issues, and what initial steps would you take to diagnose it?', 'TECHNICAL_KNOWLEDGE', 'MID', NOW()),
(505, 'Volatile Keyword and Thread Visibility', 'What does the volatile keyword do in Java, and how does it relate to the Java Memory Model? When would you use volatile instead of synchronized, and what are the limitations of volatile — what problems can''t it solve?', 'TECHNICAL_KNOWLEDGE', 'MID', NOW()),
(506, 'Fail-fast vs Fail-safe Iterators', 'Describe the difference between fail-fast and fail-safe iterators in Java. Can you give me concrete examples of each from the Collections framework, and explain what happens if you modify a collection while iterating over it in each case?', 'TECHNICAL_KNOWLEDGE', 'MID', NOW()),
(507, 'HashMap Internal Implementation', 'Describe the internal working of HashMap in Java, including how hashing and collision resolution work, and what changes were introduced in Java 8 for better performance.', 'TECHNICAL_KNOWLEDGE', 'MID', NOW()),
(508, 'JVM GC Tuning and Collector Selection', 'If you were architecting a latency-sensitive Java application — say, a real-time trading system — how would you choose between G1GC, ZGC, and Shenandoah? Walk me through the tradeoffs between throughput, pause times, and memory footprint, and describe how you''d tune the JVM for your specific use case.', 'TECHNICAL_KNOWLEDGE', 'SENIOR', NOW()),
(509, 'Concurrency Design and Deadlock Prevention', 'You''re designing a high-throughput Java service that processes thousands of concurrent requests. How do you decide between using synchronized blocks, ReentrantLock, and java.util.concurrent utilities like ConcurrentHashMap or ExecutorService? Describe a real scenario where a deadlock could occur in production, and walk me through how you would detect and prevent it.', 'TECHNICAL_KNOWLEDGE', 'SENIOR', NOW()),
(510, 'Diagnosing Memory Issues in Production', 'In a long-running Java application experiencing OutOfMemoryErrors or high GC activity, what tools and steps would you take to identify and resolve a memory leak?', 'TECHNICAL_KNOWLEDGE', 'SENIOR', NOW());

INSERT INTO question_tags (question_id, tag) VALUES
(501, 'java'), (501, 'oop'), (501, 'fundamentals'),
(502, 'java'), (502, 'strings'), (502, 'security'), (502, 'memory-management'),
(503, 'java'), (503, 'exceptions'), (503, 'error-handling'), (503, 'api-design'),
(504, 'java'), (504, 'garbage-collection'), (504, 'jvm'), (504, 'performance'),
(505, 'java'), (505, 'concurrency'), (505, 'memory-model'), (505, 'threads'),
(506, 'java'), (506, 'collections'), (506, 'concurrency'), (506, 'iterators'),
(507, 'java'), (507, 'collections'), (507, 'data-structures'), (507, 'hashing'),
(508, 'java'), (508, 'jvm'), (508, 'garbage-collection'), (508, 'performance'),
(509, 'java'), (509, 'concurrency'), (509, 'deadlock'), (509, 'architecture'),
(510, 'java'), (510, 'memory-management'), (510, 'debugging'), (510, 'jvm');

-- ════════════════════════════════════════════════════════════════════════════
-- PYTHON (511-520)
-- ════════════════════════════════════════════════════════════════════════════

INSERT INTO questions (id, title, content, category, difficulty, created_at) VALUES
(511, 'Lists vs Tuples', 'What are the key differences between lists and tuples in Python? Beyond mutability, when and why would you choose one over the other in a real project? Are there any performance differences between them, and why?', 'TECHNICAL_KNOWLEDGE', 'JUNIOR', NOW()),
(512, 'Global Interpreter Lock (GIL)', 'What is the GIL in Python, and how does it affect the execution of multi-threaded programs? If you have a CPU-bound task that needs to run in parallel, how would you work around the GIL''s limitations?', 'TECHNICAL_KNOWLEDGE', 'JUNIOR', NOW()),
(513, 'Python Memory Management', 'How does Python manage memory? Can you explain how reference counting and garbage collection work together, and what is a reference cycle? As a developer, what practices should you follow to help Python manage memory efficiently?', 'TECHNICAL_KNOWLEDGE', 'JUNIOR', NOW()),
(514, 'Decorators and Practical Use Cases', 'Explain what a decorator is in Python and how it works under the hood. Can you walk me through a real-world scenario where you''d write a custom decorator — for example, for logging, authentication, or rate-limiting — and explain how you''d handle decorating functions that accept different numbers of arguments?', 'TECHNICAL_KNOWLEDGE', 'MID', NOW()),
(515, 'Generators and Memory Efficiency', 'How do generators differ from regular functions and lists in Python? Can you explain the yield keyword, and walk me through a real-world scenario — such as processing a very large file or streaming data — where generators provide a significant advantage?', 'TECHNICAL_KNOWLEDGE', 'MID', NOW()),
(516, 'Context Managers', 'What are context managers in Python, and how does the ''with'' statement work? How would you implement your own context manager for resource management like file handling or database connections?', 'TECHNICAL_KNOWLEDGE', 'MID', NOW()),
(517, 'Threading vs asyncio vs multiprocessing', 'Compare and contrast threading, asyncio, and multiprocessing in Python. For each approach, describe a concrete use case where it would be the best choice. If you had a web application that needs to make hundreds of external API calls concurrently, which approach would you use and why?', 'TECHNICAL_KNOWLEDGE', 'MID', NOW()),
(518, 'Profiling and Optimizing Applications', 'You''ve been told that a production Python application is running too slowly under high load. Walk me through your approach to diagnosing and fixing this. What profiling tools and techniques would you use? How would you distinguish between CPU-bound bottlenecks, I/O-bound bottlenecks, and memory issues?', 'TECHNICAL_KNOWLEDGE', 'SENIOR', NOW()),
(519, 'Memory Leak Debugging in Production', 'Imagine you have a memory leak in a Python application running in production. Memory usage keeps growing until the service eventually crashes. How would you start debugging this? What tools — such as tracemalloc, objgraph, or memory_profiler — would you use, and what are the most common causes of memory leaks in Python?', 'TECHNICAL_KNOWLEDGE', 'SENIOR', NOW()),
(520, 'Designing Async Systems at Scale', 'If you were designing a high-performance async API server in Python from scratch, which framework would you choose — FastAPI, aiohttp, or something else — and why? How would you handle backpressure when producers generate data faster than consumers can process it? How do you ensure the maintainability of a large Python codebase over time?', 'TECHNICAL_KNOWLEDGE', 'SENIOR', NOW());

INSERT INTO question_tags (question_id, tag) VALUES
(511, 'python'), (511, 'data-structures'), (511, 'fundamentals'),
(512, 'python'), (512, 'concurrency'), (512, 'threading'), (512, 'performance'),
(513, 'python'), (513, 'memory-management'), (513, 'garbage-collection'),
(514, 'python'), (514, 'decorators'), (514, 'functions'), (514, 'design-patterns'),
(515, 'python'), (515, 'generators'), (515, 'memory-management'), (515, 'performance'),
(516, 'python'), (516, 'context-managers'), (516, 'resource-management'),
(517, 'python'), (517, 'concurrency'), (517, 'asyncio'), (517, 'architecture'),
(518, 'python'), (518, 'profiling'), (518, 'performance'), (518, 'debugging'),
(519, 'python'), (519, 'memory-management'), (519, 'debugging'), (519, 'production'),
(520, 'python'), (520, 'async'), (520, 'architecture'), (520, 'scalability');

-- ════════════════════════════════════════════════════════════════════════════
-- JAVASCRIPT (521-530)
-- ════════════════════════════════════════════════════════════════════════════

INSERT INTO questions (id, title, content, category, difficulty, created_at) VALUES
(521, 'Strict vs Loose Equality', 'What is the difference between the == and === operators in JavaScript? Can you give me examples where using double-equals could lead to unexpected bugs in production code? When, if ever, is it appropriate to use loose equality?', 'TECHNICAL_KNOWLEDGE', 'JUNIOR', NOW()),
(522, 'Hoisting and Variable Scoping', 'Can you explain what hoisting is in JavaScript? How does it affect variables declared with var, let, and const differently? And how does function hoisting differ from variable hoisting? Walk me through an example where not understanding hoisting could introduce a subtle bug.', 'TECHNICAL_KNOWLEDGE', 'JUNIOR', NOW()),
(523, 'The this Keyword', 'The ''this'' keyword in JavaScript behaves differently depending on context. Can you explain how ''this'' is determined in these scenarios: a regular function call, a method call on an object, a constructor with ''new'', and when using call, apply, or bind? How do arrow functions change this behavior, and why does that matter in practice?', 'TECHNICAL_KNOWLEDGE', 'JUNIOR', NOW()),
(524, 'Closures and Practical Applications', 'What is a closure in JavaScript, and how does it work? Can you describe two or three practical use cases for closures in production code — for example, in data privacy, function factories, or event handlers? Are there any potential downsides to using closures, such as memory implications?', 'TECHNICAL_KNOWLEDGE', 'MID', NOW()),
(525, 'The Event Loop and Task Queues', 'Can you explain how the JavaScript event loop works, including the difference between the microtask queue and the macrotask queue? If I have a setTimeout with 0 delay, a Promise.resolve().then() callback, and a synchronous console.log, in what order do they execute and why?', 'TECHNICAL_KNOWLEDGE', 'MID', NOW()),
(526, 'Promises and Async/Await', 'Walk me through the evolution from callbacks to Promises to async/await in JavaScript. How does error handling differ across these patterns? In a real-world scenario — say you need to make three API calls where the second depends on the first, but the third is independent — how would you structure this for both correctness and performance?', 'TECHNICAL_KNOWLEDGE', 'MID', NOW()),
(527, 'Prototypal Inheritance', 'JavaScript uses prototypal inheritance, but ES6 introduced class syntax. Can you explain how prototypal inheritance actually works under the hood, and how the class keyword is essentially syntactic sugar over it? When would you choose composition over inheritance in a JavaScript application?', 'TECHNICAL_KNOWLEDGE', 'MID', NOW()),
(528, 'Memory Management and Leak Prevention', 'How does garbage collection work in JavaScript, and what are the most common causes of memory leaks in single-page applications — such as detached DOM nodes, forgotten event listeners, or closures holding references? Walk me through how you would identify and fix a memory leak in a production web application.', 'TECHNICAL_KNOWLEDGE', 'SENIOR', NOW()),
(529, 'CommonJS vs ES Modules', 'Compare CommonJS and ES Modules in JavaScript. What are the benefits of using modules, and how do they impact bundling and tree-shaking in modern applications?', 'TECHNICAL_KNOWLEDGE', 'SENIOR', NOW()),
(530, 'Performance Optimization at Scale', 'You''re brought in to optimize a JavaScript-heavy web application that has become sluggish — slow initial load, janky scrolling, and unresponsive interactions. Walk me through your systematic approach. How would you use code splitting, tree shaking, lazy loading, and Web Workers? How do you decide between client-side and server-side rendering?', 'TECHNICAL_KNOWLEDGE', 'SENIOR', NOW());

INSERT INTO question_tags (question_id, tag) VALUES
(521, 'javascript'), (521, 'fundamentals'), (521, 'type-coercion'),
(522, 'javascript'), (522, 'hoisting'), (522, 'scoping'), (522, 'fundamentals'),
(523, 'javascript'), (523, 'this-context'), (523, 'functions'), (523, 'fundamentals'),
(524, 'javascript'), (524, 'closures'), (524, 'functions'), (524, 'memory-management'),
(525, 'javascript'), (525, 'event-loop'), (525, 'async'), (525, 'performance'),
(526, 'javascript'), (526, 'promises'), (526, 'async-await'), (526, 'error-handling'),
(527, 'javascript'), (527, 'prototypes'), (527, 'oop'), (527, 'inheritance'),
(528, 'javascript'), (528, 'memory-management'), (528, 'debugging'), (528, 'performance'),
(529, 'javascript'), (529, 'modules'), (529, 'bundling'), (529, 'architecture'),
(530, 'javascript'), (530, 'performance'), (530, 'optimization'), (530, 'architecture');

-- ════════════════════════════════════════════════════════════════════════════
-- TYPESCRIPT (531-540)
-- ════════════════════════════════════════════════════════════════════════════

INSERT INTO questions (id, title, content, category, difficulty, created_at) VALUES
(531, 'TypeScript vs JavaScript', 'Can you explain what TypeScript is, how it relates to JavaScript, and what specific problems it solves that JavaScript alone doesn''t? In your experience, what are the most impactful benefits of adopting TypeScript in a project?', 'TECHNICAL_KNOWLEDGE', 'JUNIOR', NOW()),
(532, 'Interfaces vs Type Aliases', 'What is the difference between an interface and a type alias in TypeScript? When would you choose one over the other, and can you describe a real scenario where that distinction actually mattered in your code?', 'TECHNICAL_KNOWLEDGE', 'JUNIOR', NOW()),
(533, 'Type Narrowing and Type Guards', 'What is type narrowing in TypeScript, and what are the different techniques you can use to narrow a type — such as typeof, instanceof, or custom type guards? Can you walk me through a practical example where type narrowing prevented a bug?', 'TECHNICAL_KNOWLEDGE', 'JUNIOR', NOW()),
(534, 'Generics and Constraints', 'Explain how generics work in TypeScript. How do you use the ''extends'' keyword to constrain a generic type, and why is that useful? Can you describe a situation where you wrote a generic function or component and what tradeoffs you considered?', 'TECHNICAL_KNOWLEDGE', 'MID', NOW()),
(535, 'Utility Types in Practice', 'TypeScript ships with several built-in utility types like Partial, Pick, Omit, Required, and Record. Can you explain when you''d use each of these, and describe a real-world scenario where utility types helped you avoid duplicating type definitions?', 'TECHNICAL_KNOWLEDGE', 'MID', NOW()),
(536, 'Type Inference', 'How does type inference work in TypeScript? Give examples of where the compiler infers types and when you need explicit annotations. What is contextual typing?', 'TECHNICAL_KNOWLEDGE', 'MID', NOW()),
(537, 'any vs unknown vs never', 'Explain the differences between ''any'', ''unknown'', and ''never'' types in TypeScript. Why is ''unknown'' preferred over ''any'' in many cases? When does the ''never'' type naturally appear?', 'TECHNICAL_KNOWLEDGE', 'MID', NOW()),
(538, 'Conditional Types and the infer Keyword', 'Explain how conditional types work in TypeScript and what role the ''infer'' keyword plays. Can you walk me through a practical example — say building a custom utility type — where conditional types solved a problem that couldn''t be handled with simpler type constructs?', 'TECHNICAL_KNOWLEDGE', 'SENIOR', NOW()),
(539, 'Migrating a JavaScript Codebase to TypeScript', 'If you were leading the migration of a large, existing JavaScript codebase to TypeScript, how would you approach it? What strategy would you use — big bang or incremental? How do you handle third-party libraries without type definitions, and what are the biggest pitfalls teams typically encounter?', 'TECHNICAL_KNOWLEDGE', 'SENIOR', NOW()),
(540, 'TypeScript at Scale — Performance and Limits', 'In large-scale TypeScript projects, teams sometimes hit performance issues with the type checker — slow compilation, IDE lag, or overly complex type errors. What patterns or anti-patterns have you seen cause these problems, and what strategies do you use to keep TypeScript''s type system performant and maintainable as a codebase grows?', 'TECHNICAL_KNOWLEDGE', 'SENIOR', NOW());

INSERT INTO question_tags (question_id, tag) VALUES
(531, 'typescript'), (531, 'fundamentals'), (531, 'type-safety'),
(532, 'typescript'), (532, 'interfaces'), (532, 'types'), (532, 'best-practices'),
(533, 'typescript'), (533, 'type-guards'), (533, 'narrowing'), (533, 'debugging'),
(534, 'typescript'), (534, 'generics'), (534, 'reusability'), (534, 'architecture'),
(535, 'typescript'), (535, 'utility-types'), (535, 'maintainability'),
(536, 'typescript'), (536, 'type-inference'), (536, 'type-system'),
(537, 'typescript'), (537, 'type-system'), (537, 'safety'), (537, 'best-practices'),
(538, 'typescript'), (538, 'conditional-types'), (538, 'advanced-types'),
(539, 'typescript'), (539, 'migration'), (539, 'architecture'), (539, 'strategy'),
(540, 'typescript'), (540, 'performance'), (540, 'scalability'), (540, 'architecture');

-- ════════════════════════════════════════════════════════════════════════════
-- REACT (541-550)
-- ════════════════════════════════════════════════════════════════════════════

INSERT INTO questions (id, title, content, category, difficulty, created_at) VALUES
(541, 'Virtual DOM and Reconciliation', 'Can you explain what the Virtual DOM is in React and why it exists? How does React''s reconciliation process decide what to update in the real DOM, and what role do keys play in this process?', 'TECHNICAL_KNOWLEDGE', 'JUNIOR', NOW()),
(542, 'Props vs State', 'What is the difference between props and state in React? Can you explain the concept of unidirectional data flow and describe a scenario where you had to decide whether a piece of data should live as local state or be passed down as props?', 'TECHNICAL_KNOWLEDGE', 'JUNIOR', NOW()),
(543, 'Understanding useEffect', 'Walk me through how the useEffect hook works. What is the role of the dependency array, what happens when you pass an empty array versus no array at all, and what are common mistakes developers make when using useEffect?', 'TECHNICAL_KNOWLEDGE', 'JUNIOR', NOW()),
(544, 'Keys in Lists and Reconciliation', 'Why are keys important in React lists? What problems occur with unstable keys like array index? Explain how React''s reconciliation algorithm uses keys to minimize DOM updates.', 'TECHNICAL_KNOWLEDGE', 'MID', NOW()),
(545, 'React Performance Optimization', 'What techniques do you use to optimize performance in a React application? Explain how React.memo, useMemo, and useCallback work, and more importantly, when you should NOT use them. How do you identify performance bottlenecks?', 'TECHNICAL_KNOWLEDGE', 'MID', NOW()),
(546, 'Custom Hooks Design', 'What are custom hooks in React and what problems do they solve? Walk me through designing a custom hook you''ve built — for example, for data fetching, form handling, or debouncing. What principles guide you when deciding to extract logic into a custom hook?', 'TECHNICAL_KNOWLEDGE', 'MID', NOW()),
(547, 'State Management Approaches', 'React offers several options for managing state — useState, useReducer, Context API, and external libraries like Redux or Zustand. How do you decide which approach to use in a given situation? What are the tradeoffs between using Context API for global state versus a dedicated state management library?', 'TECHNICAL_KNOWLEDGE', 'MID', NOW()),
(548, 'SSR vs CSR vs SSG', 'Can you compare server-side rendering, client-side rendering, and static site generation in the context of React? How do you decide which rendering strategy to use for a given application, and what are the implications for performance, SEO, and developer experience — particularly with frameworks like Next.js?', 'TECHNICAL_KNOWLEDGE', 'SENIOR', NOW()),
(549, 'React Architecture at Scale', 'If you were architecting a large-scale React application from scratch — say a complex dashboard used by thousands of users — how would you structure the project? Walk me through your decisions on folder structure, component composition patterns, code splitting, lazy loading, and how you''d ensure the codebase remains maintainable as the team grows.', 'TECHNICAL_KNOWLEDGE', 'SENIOR', NOW()),
(550, 'Concurrent Rendering and React 18', 'Can you explain React''s concurrent rendering model introduced in React 18? What problems does it solve compared to synchronous rendering? How do features like useTransition and Suspense change the way you think about building responsive UIs, and what are the practical implications for how you architect data loading and state updates?', 'TECHNICAL_KNOWLEDGE', 'SENIOR', NOW());

INSERT INTO question_tags (question_id, tag) VALUES
(541, 'react'), (541, 'virtual-dom'), (541, 'reconciliation'), (541, 'performance'),
(542, 'react'), (542, 'props'), (542, 'state'), (542, 'data-flow'),
(543, 'react'), (543, 'hooks'), (543, 'useEffect'), (543, 'lifecycle'),
(544, 'react'), (544, 'keys'), (544, 'lists'), (544, 'reconciliation'),
(545, 'react'), (545, 'performance'), (545, 'memoization'), (545, 'optimization'),
(546, 'react'), (546, 'custom-hooks'), (546, 'reusability'), (546, 'best-practices'),
(547, 'react'), (547, 'state-management'), (547, 'context'), (547, 'architecture'),
(548, 'react'), (548, 'ssr'), (548, 'csr'), (548, 'nextjs'), (548, 'architecture'),
(549, 'react'), (549, 'architecture'), (549, 'scalability'), (549, 'code-splitting'),
(550, 'react'), (550, 'concurrent-rendering'), (550, 'suspense'), (550, 'performance');

-- ════════════════════════════════════════════════════════════════════════════
-- NODE.JS (551-560)
-- ════════════════════════════════════════════════════════════════════════════

INSERT INTO questions (id, title, content, category, difficulty, created_at) VALUES
(551, 'Non-blocking I/O in Node.js', 'What does it mean for Node.js to have non-blocking I/O? Can you explain the difference between blocking and non-blocking operations with a practical example, and why is it critical to avoid blocking the event loop in a Node.js application?', 'TECHNICAL_KNOWLEDGE', 'JUNIOR', NOW()),
(552, 'Callbacks to Promises to Async/Await', 'Walk me through the evolution of asynchronous patterns in Node.js — from callbacks to Promises to async/await. What problems does each solve over the previous approach, and what is callback hell? How does async/await improve error handling compared to raw Promises?', 'TECHNICAL_KNOWLEDGE', 'JUNIOR', NOW()),
(553, 'Error Handling in Node.js', 'How do you handle errors in Node.js asynchronous code? Discuss callbacks, Promises, and try/catch with async/await. What happens if a Promise rejection goes unhandled?', 'TECHNICAL_KNOWLEDGE', 'JUNIOR', NOW()),
(554, 'Event Loop Phases', 'Can you explain the different phases of the Node.js event loop — timers, pending callbacks, poll, check, and close callbacks? Where do Promises and process.nextTick() fit in this cycle? How does understanding these phases help you debug timing issues in production?', 'TECHNICAL_KNOWLEDGE', 'MID', NOW()),
(555, 'Streams and Backpressure', 'What are Node.js streams, and what are the four types — readable, writable, duplex, and transform? Why are streams important for performance, especially when handling large files or datasets? Can you describe a scenario where using streams instead of loading everything into memory made a significant difference?', 'TECHNICAL_KNOWLEDGE', 'MID', NOW()),
(556, 'Clustering for Scalability', 'How does the Cluster module work for scaling Node.js apps across CPU cores? Compare it to PM2 or worker threads. When would you use each approach?', 'TECHNICAL_KNOWLEDGE', 'MID', NOW()),
(557, 'Node.js Security Best Practices', 'What are the most important security concerns when building a Node.js API? Walk me through how you''d protect against common vulnerabilities like injection attacks, XSS, CSRF, and dependency-based vulnerabilities. How do you approach validating and sanitizing user input?', 'TECHNICAL_KNOWLEDGE', 'MID', NOW()),
(558, 'Scaling Node.js Applications', 'Node.js runs on a single thread by default, so how do you scale a Node.js application to take advantage of multi-core systems and handle high traffic? Explain the Cluster module, worker threads, and how you''d architect a deployment using process managers, load balancers, and horizontal scaling.', 'TECHNICAL_KNOWLEDGE', 'SENIOR', NOW()),
(559, 'Diagnosing Production Performance Issues', 'Imagine your Node.js application in production is experiencing increased latency and occasional timeouts, but CPU and memory metrics look normal. Walk me through your debugging process. What tools would you use — profiling, flame graphs, event loop monitoring?', 'TECHNICAL_KNOWLEDGE', 'SENIOR', NOW()),
(560, 'Microservices Architecture with Node.js', 'If you were designing a microservices architecture using Node.js, how would you approach inter-service communication — REST, gRPC, or message queues? How do you handle distributed transactions, data consistency, and service discovery?', 'TECHNICAL_KNOWLEDGE', 'SENIOR', NOW());

INSERT INTO question_tags (question_id, tag) VALUES
(551, 'nodejs'), (551, 'non-blocking'), (551, 'event-loop'), (551, 'fundamentals'),
(552, 'nodejs'), (552, 'async'), (552, 'promises'), (552, 'error-handling'),
(553, 'nodejs'), (553, 'error-handling'), (553, 'async'), (553, 'best-practices'),
(554, 'nodejs'), (554, 'event-loop'), (554, 'internals'), (554, 'debugging'),
(555, 'nodejs'), (555, 'streams'), (555, 'performance'), (555, 'memory-management'),
(556, 'nodejs'), (556, 'clustering'), (556, 'scalability'), (556, 'concurrency'),
(557, 'nodejs'), (557, 'security'), (557, 'input-validation'), (557, 'best-practices'),
(558, 'nodejs'), (558, 'scaling'), (558, 'architecture'), (558, 'deployment'),
(559, 'nodejs'), (559, 'debugging'), (559, 'profiling'), (559, 'performance'),
(560, 'nodejs'), (560, 'microservices'), (560, 'architecture'), (560, 'distributed-systems');

-- ════════════════════════════════════════════════════════════════════════════
-- C# .NET (561-570)
-- ════════════════════════════════════════════════════════════════════════════

INSERT INTO questions (id, title, content, category, difficulty, created_at) VALUES
(561, 'Value Types vs Reference Types', 'Can you explain the difference between value types and reference types in C#? When would you choose a struct over a class, and what are the performance implications of that choice?', 'TECHNICAL_KNOWLEDGE', 'JUNIOR', NOW()),
(562, 'Async/Await Fundamentals', 'How does asynchronous programming with async and await work in C#? Can you walk me through what happens when you await a Task — what does the runtime do behind the scenes, and how does it differ from just spinning up a new thread?', 'TECHNICAL_KNOWLEDGE', 'JUNIOR', NOW()),
(563, 'Dependency Injection in .NET', 'What is Dependency Injection and why is it important in .NET applications? How does ASP.NET Core''s built-in DI container work, and how does it improve testability and maintainability of your code?', 'TECHNICAL_KNOWLEDGE', 'JUNIOR', NOW()),
(564, 'Garbage Collection in .NET', 'How does garbage collection work in the .NET CLR? Describe the generational approach and when you might need to tune it for performance-critical applications.', 'TECHNICAL_KNOWLEDGE', 'MID', NOW()),
(565, 'LINQ and Query Performance', 'What is LINQ and how does it translate to SQL or in-memory operations? When would deferred execution cause issues, and how do you avoid common performance pitfalls?', 'TECHNICAL_KNOWLEDGE', 'MID', NOW()),
(566, 'Task vs Thread', 'What is the difference between a Task and a Thread in .NET? When would you prefer using Task and the ThreadPool over manually creating threads? How does the Task Parallel Library fit into the picture for CPU-bound vs I/O-bound work?', 'TECHNICAL_KNOWLEDGE', 'MID', NOW()),
(567, 'Entity Framework Core Performance', 'What are the most common performance pitfalls when working with Entity Framework Core, and how would you address them? How do you deal with N+1 query problems, what''s the difference between eager and lazy loading, and when would you fall back to raw SQL?', 'TECHNICAL_KNOWLEDGE', 'MID', NOW()),
(568, 'Avoiding Async Deadlocks', 'A common issue in C# applications is async deadlocks — for example, when calling .Result or .Wait() on an async method in a context with a SynchronizationContext. Can you explain why this happens, what role ConfigureAwait(false) plays, and how you''d design an API layer to avoid these issues entirely?', 'TECHNICAL_KNOWLEDGE', 'SENIOR', NOW()),
(569, 'Application Performance and Caching Strategy', 'You''ve been asked to improve the performance of a high-traffic .NET API that''s experiencing slow response times under load. Walk me through your diagnostic approach — what profiling tools and metrics would you look at, what caching strategies would you consider, and how would you handle cache invalidation?', 'TECHNICAL_KNOWLEDGE', 'SENIOR', NOW()),
(570, 'Microservices Patterns in .NET', 'If you were designing a new system of microservices in .NET, how would you approach inter-service communication — when would you choose synchronous REST/gRPC vs asynchronous messaging? Can you discuss patterns like CQRS or the Outbox pattern, and explain how you''d handle distributed transactions?', 'TECHNICAL_KNOWLEDGE', 'SENIOR', NOW());

INSERT INTO question_tags (question_id, tag) VALUES
(561, 'csharp'), (561, 'dotnet'), (561, 'types'), (561, 'fundamentals'),
(562, 'csharp'), (562, 'dotnet'), (562, 'async-await'), (562, 'concurrency'),
(563, 'csharp'), (563, 'dotnet'), (563, 'dependency-injection'), (563, 'architecture'),
(564, 'csharp'), (564, 'dotnet'), (564, 'garbage-collection'), (564, 'performance'),
(565, 'csharp'), (565, 'dotnet'), (565, 'linq'), (565, 'performance'),
(566, 'csharp'), (566, 'dotnet'), (566, 'concurrency'), (566, 'threads'),
(567, 'csharp'), (567, 'dotnet'), (567, 'entity-framework'), (567, 'performance'),
(568, 'csharp'), (568, 'dotnet'), (568, 'async-await'), (568, 'deadlock'), (568, 'debugging'),
(569, 'csharp'), (569, 'dotnet'), (569, 'performance'), (569, 'caching'), (569, 'architecture'),
(570, 'csharp'), (570, 'dotnet'), (570, 'microservices'), (570, 'architecture');

-- ════════════════════════════════════════════════════════════════════════════
-- GO (571-580)
-- ════════════════════════════════════════════════════════════════════════════

INSERT INTO questions (id, title, content, category, difficulty, created_at) VALUES
(571, 'Goroutines vs OS Threads', 'What is a goroutine in Go, and how does it differ from a traditional OS thread? Why can you spin up thousands of goroutines efficiently, and what are the practical implications of this for how you design concurrent Go programs?', 'TECHNICAL_KNOWLEDGE', 'JUNIOR', NOW()),
(572, 'Interfaces and Structural Typing', 'How do interfaces work in Go, and why is it significant that Go uses implicit (structural) interface satisfaction rather than an explicit ''implements'' keyword? Can you give an example of how this design enables writing flexible, decoupled code and simplifies testing?', 'TECHNICAL_KNOWLEDGE', 'JUNIOR', NOW()),
(573, 'Error Handling Philosophy', 'Go doesn''t have exceptions — instead it uses explicit error return values. Can you explain Go''s approach to error handling, why it was designed this way, and how you use error wrapping and the errors.Is/errors.As functions introduced in Go 1.13?', 'TECHNICAL_KNOWLEDGE', 'JUNIOR', NOW()),
(574, 'Channels — Buffered vs Unbuffered', 'What''s the difference between a buffered and an unbuffered channel in Go? Can you describe a scenario where choosing one over the other would matter, and explain what conditions lead to a goroutine blocking on a channel send or receive? How would you debug a deadlock caused by improper channel usage?', 'TECHNICAL_KNOWLEDGE', 'MID', NOW()),
(575, 'The Context Package', 'What is the purpose of the context package in Go, and why is it considered essential in production services? Can you walk me through how you''d use context for request cancellation, timeouts, and passing request-scoped values — and what happens to downstream goroutines when a parent context is cancelled?', 'TECHNICAL_KNOWLEDGE', 'MID', NOW()),
(576, 'Channels vs Mutexes', 'Go famously says "Do not communicate by sharing memory; instead, share memory by communicating." In practice, when would you reach for channels to coordinate goroutines, and when would a sync.Mutex or sync.RWMutex be the better choice? Can you discuss the tradeoffs?', 'TECHNICAL_KNOWLEDGE', 'MID', NOW()),
(577, 'Slices Internals and Common Gotchas', 'Under the hood, a Go slice is backed by an array with a length and capacity. Can you explain how append works, when it causes a new underlying array allocation, and what subtle bugs can arise from multiple slices sharing the same backing array?', 'TECHNICAL_KNOWLEDGE', 'MID', NOW()),
(578, 'The Go Scheduler — GMP Model', 'Can you explain how Go''s runtime scheduler works in terms of the G, M, and P model? What is the role of GOMAXPROCS, how does work-stealing help with load balancing, and what happens when a goroutine makes a blocking system call?', 'TECHNICAL_KNOWLEDGE', 'SENIOR', NOW()),
(579, 'Concurrency Patterns for Production Systems', 'Describe the concurrency patterns you''d use to build a high-throughput data processing pipeline in Go — for example, fan-out/fan-in, worker pools, or rate limiting. How would you handle graceful shutdown so that in-flight work is completed before the service exits? How do you detect and prevent goroutine leaks?', 'TECHNICAL_KNOWLEDGE', 'SENIOR', NOW()),
(580, 'GC Tuning and Performance Profiling', 'Go uses a concurrent tri-color mark-and-sweep garbage collector. How does it work at a high level, and what impact does it have on latency-sensitive applications? If you identified GC pressure as a bottleneck, what tools like pprof would you use to diagnose it, and what techniques would you apply to optimize performance?', 'TECHNICAL_KNOWLEDGE', 'SENIOR', NOW());

INSERT INTO question_tags (question_id, tag) VALUES
(571, 'go'), (571, 'goroutines'), (571, 'concurrency'), (571, 'fundamentals'),
(572, 'go'), (572, 'interfaces'), (572, 'architecture'), (572, 'testability'),
(573, 'go'), (573, 'error-handling'), (573, 'best-practices'), (573, 'fundamentals'),
(574, 'go'), (574, 'channels'), (574, 'concurrency'), (574, 'debugging'),
(575, 'go'), (575, 'context'), (575, 'concurrency'), (575, 'best-practices'),
(576, 'go'), (576, 'concurrency'), (576, 'channels'), (576, 'synchronization'),
(577, 'go'), (577, 'slices'), (577, 'data-structures'), (577, 'debugging'),
(578, 'go'), (578, 'scheduler'), (578, 'concurrency'), (578, 'performance'),
(579, 'go'), (579, 'concurrency'), (579, 'architecture'), (579, 'scalability'),
(580, 'go'), (580, 'garbage-collection'), (580, 'profiling'), (580, 'performance');

-- ════════════════════════════════════════════════════════════════════════════
-- RUST (581-590)
-- ════════════════════════════════════════════════════════════════════════════

INSERT INTO questions (id, title, content, category, difficulty, created_at) VALUES
(581, 'Ownership Model Fundamentals', 'Rust''s ownership system is central to the language. Can you explain the three ownership rules, what happens when you assign a String to a new variable, and why Rust uses move semantics instead of copying by default? How does this approach eliminate entire classes of memory bugs without needing a garbage collector?', 'TECHNICAL_KNOWLEDGE', 'JUNIOR', NOW()),
(582, 'Borrowing and References', 'What is borrowing in Rust, and what''s the difference between an immutable reference and a mutable reference? Why does Rust enforce the rule that you can have either one mutable reference or any number of immutable references at a time, and what real-world bugs does this prevent?', 'TECHNICAL_KNOWLEDGE', 'JUNIOR', NOW()),
(583, 'Error Handling with Result and Option', 'Rust doesn''t have null or exceptions. Instead it uses Result<T, E> and Option<T> for error handling. Can you explain the difference between these two types, when you''d use each one, and how the ? operator simplifies error propagation? When is it acceptable to use unwrap() or expect()?', 'TECHNICAL_KNOWLEDGE', 'JUNIOR', NOW()),
(584, 'Lifetimes and the Borrow Checker', 'What are lifetimes in Rust, and why does the compiler sometimes require explicit lifetime annotations? Can you walk me through an example where the borrow checker would reject your code without a lifetime annotation, explain what problem it''s preventing, and describe how lifetime elision rules reduce the annotation burden?', 'TECHNICAL_KNOWLEDGE', 'MID', NOW()),
(585, 'Traits and Generics', 'How do traits work in Rust, and how do they compare to interfaces in languages like Go or C#? Can you explain the difference between static dispatch with generics and dynamic dispatch with trait objects (dyn Trait), and discuss the performance tradeoffs between the two approaches?', 'TECHNICAL_KNOWLEDGE', 'MID', NOW()),
(586, 'Smart Pointers — Box, Rc, Arc', 'Rust provides several smart pointer types including Box<T>, Rc<T>, and Arc<T>. Can you explain the purpose and use case for each, how Rc and Arc differ in terms of thread safety, and when you''d pair Arc with Mutex or RwLock for shared mutable state? What about reference cycle pitfalls?', 'TECHNICAL_KNOWLEDGE', 'MID', NOW()),
(587, 'Concurrency with Channels and Mutex', 'How does Rust handle concurrency safely with channels and Mutex? Compare Rust''s approach to Go''s. How does the compiler enforce thread safety at compile time?', 'TECHNICAL_KNOWLEDGE', 'MID', NOW()),
(588, 'Unsafe Code and FFI', 'What does the unsafe keyword in Rust allow you to do, and what specific guarantees does it bypass? In what scenarios is unsafe code warranted — for example, FFI with C libraries or low-level performance optimization — and how would you structure your codebase to minimize the surface area of unsafe code?', 'TECHNICAL_KNOWLEDGE', 'SENIOR', NOW()),
(589, 'Concurrency Safety with Send and Sync', 'Rust claims to prevent data races at compile time. Can you explain how the Send and Sync marker traits work, what it means for a type to be Send or Sync, and how these traits interact with Rust''s ownership system to guarantee thread safety? Give an example of a type that is not Send and explain why.', 'TECHNICAL_KNOWLEDGE', 'SENIOR', NOW()),
(590, 'Async/Await and Runtime', 'Explain async/await in Rust with tokio. What tradeoffs exist vs synchronous code? How does Rust''s zero-cost async model differ from languages like JavaScript or Python?', 'TECHNICAL_KNOWLEDGE', 'SENIOR', NOW());

INSERT INTO question_tags (question_id, tag) VALUES
(581, 'rust'), (581, 'ownership'), (581, 'memory-safety'), (581, 'fundamentals'),
(582, 'rust'), (582, 'borrowing'), (582, 'references'), (582, 'memory-safety'),
(583, 'rust'), (583, 'error-handling'), (583, 'result'), (583, 'option'),
(584, 'rust'), (584, 'lifetimes'), (584, 'borrow-checker'), (584, 'memory-safety'),
(585, 'rust'), (585, 'traits'), (585, 'generics'), (585, 'performance'),
(586, 'rust'), (586, 'smart-pointers'), (586, 'concurrency'), (586, 'memory-management'),
(587, 'rust'), (587, 'concurrency'), (587, 'channels'), (587, 'mutex'),
(588, 'rust'), (588, 'unsafe'), (588, 'ffi'), (588, 'architecture'),
(589, 'rust'), (589, 'concurrency'), (589, 'send-sync'), (589, 'thread-safety'),
(590, 'rust'), (590, 'async-await'), (590, 'tokio'), (590, 'performance');

-- ════════════════════════════════════════════════════════════════════════════
-- AWS (591-600)
-- ════════════════════════════════════════════════════════════════════════════

INSERT INTO questions (id, title, content, category, difficulty, created_at) VALUES
(591, 'Regions, Availability Zones, and Edge Locations', 'Can you explain the difference between AWS Regions, Availability Zones, and Edge Locations? How would you decide which Region to deploy your application in, and why does this decision matter?', 'TECHNICAL_KNOWLEDGE', 'JUNIOR', NOW()),
(592, 'IAM and the Shared Responsibility Model', 'Walk me through how AWS Identity and Access Management works. What is the AWS Shared Responsibility Model, and how would you apply the principle of least privilege when setting up access for a new team joining your project?', 'TECHNICAL_KNOWLEDGE', 'JUNIOR', NOW()),
(593, 'EC2 Pricing Models', 'AWS offers On-Demand, Reserved, Spot, and Savings Plan pricing for EC2 instances. Can you explain the tradeoffs between these options and describe a scenario where you''d use each one?', 'TECHNICAL_KNOWLEDGE', 'JUNIOR', NOW()),
(594, 'Lambda vs EC2 Tradeoffs', 'If you were designing a new service, how would you decide between using AWS Lambda and EC2 for your compute layer? Walk me through the tradeoffs in terms of cost, performance, cold starts, execution limits, and operational overhead.', 'TECHNICAL_KNOWLEDGE', 'MID', NOW()),
(595, 'Auto Scaling and Load Balancing', 'Explain Auto Scaling Groups and the difference between Application Load Balancer, Network Load Balancer, and Classic Load Balancer. How do they handle traffic spikes? What metrics would you use to trigger scaling?', 'TECHNICAL_KNOWLEDGE', 'MID', NOW()),
(596, 'S3 Storage Classes and Lifecycle Policies', 'AWS S3 offers multiple storage classes — Standard, Intelligent-Tiering, Glacier, and Glacier Deep Archive. How would you design a cost-effective storage strategy for an application that generates large amounts of data with varying access patterns? How do lifecycle policies fit in?', 'TECHNICAL_KNOWLEDGE', 'MID', NOW()),
(597, 'High Availability and Disaster Recovery', 'How would you design a highly available architecture on AWS for a critical production application? Walk me through the differences between Backup & Restore, Pilot Light, Warm Standby, and Multi-Site Active-Active strategies. How do RPO and RTO influence your choice?', 'TECHNICAL_KNOWLEDGE', 'MID', NOW()),
(598, 'Multi-Region Active-Active Architecture', 'A client needs their application to serve users across multiple continents with minimal latency and survive an entire regional outage. How would you design a multi-region active-active architecture on AWS? What services would you use for traffic routing, data replication, and conflict resolution?', 'TECHNICAL_KNOWLEDGE', 'SENIOR', NOW()),
(599, 'Securing a Multi-Tier Application', 'Describe how you would implement a defense-in-depth security strategy for a three-tier web application on AWS — covering the network layer, application layer, and data layer. How do VPCs, Security Groups, NACLs, WAF, encryption at rest and in transit, and IAM roles all fit together?', 'TECHNICAL_KNOWLEDGE', 'SENIOR', NOW()),
(600, 'Cost Optimization at Scale', 'You''ve inherited an AWS environment where the monthly bill has grown significantly and leadership wants a 30% cost reduction without impacting performance. Walk me through your approach — what tools would you use to analyze spending, what are the most common sources of waste, and what architectural changes might you propose?', 'TECHNICAL_KNOWLEDGE', 'SENIOR', NOW());

INSERT INTO question_tags (question_id, tag) VALUES
(591, 'aws'), (591, 'infrastructure'), (591, 'architecture'), (591, 'fundamentals'),
(592, 'aws'), (592, 'iam'), (592, 'security'), (592, 'best-practices'),
(593, 'aws'), (593, 'ec2'), (593, 'cost-optimization'), (593, 'fundamentals'),
(594, 'aws'), (594, 'lambda'), (594, 'serverless'), (594, 'architecture'),
(595, 'aws'), (595, 'auto-scaling'), (595, 'load-balancer'), (595, 'scalability'),
(596, 'aws'), (596, 's3'), (596, 'storage'), (596, 'cost-optimization'),
(597, 'aws'), (597, 'high-availability'), (597, 'disaster-recovery'), (597, 'architecture'),
(598, 'aws'), (598, 'multi-region'), (598, 'architecture'), (598, 'scalability'),
(599, 'aws'), (599, 'security'), (599, 'vpc'), (599, 'networking'),
(600, 'aws'), (600, 'cost-optimization'), (600, 'architecture'), (600, 'performance');

-- ════════════════════════════════════════════════════════════════════════════
-- SQL (601-610)
-- ════════════════════════════════════════════════════════════════════════════

INSERT INTO questions (id, title, content, category, difficulty, created_at) VALUES
(601, 'Types of JOINs', 'Explain the different types of SQL JOINs — INNER, LEFT, RIGHT, FULL OUTER, and CROSS JOIN. Can you give me a real-world example of when you''d use a LEFT JOIN versus an INNER JOIN, and what happens to NULL values in each case?', 'TECHNICAL_KNOWLEDGE', 'JUNIOR', NOW()),
(602, 'GROUP BY, HAVING, and Aggregate Functions', 'Explain how GROUP BY works in SQL and how it differs from WHERE. When would you use HAVING instead of WHERE to filter results? Walk me through an example where you need to find all customers who have placed more than five orders in the past year.', 'TECHNICAL_KNOWLEDGE', 'JUNIOR', NOW()),
(603, 'Indexing Strategy and Tradeoffs', 'What is a database index, and how does it improve query performance? Explain the difference between a clustered index and a non-clustered index. What are the tradeoffs of adding indexes — when would too many indexes actually hurt performance?', 'TECHNICAL_KNOWLEDGE', 'JUNIOR', NOW()),
(604, 'ACID Properties and Transaction Management', 'What are the ACID properties in a relational database, and why does each one matter? Can you describe a real-world scenario where a transaction''s isolation level caused a problem — like a dirty read or a phantom read — and how you would resolve it?', 'TECHNICAL_KNOWLEDGE', 'MID', NOW()),
(605, 'Normalization vs Denormalization', 'Can you explain database normalization through at least the first three normal forms? In what scenarios would you deliberately denormalize a database, and what are the risks? How does the choice between OLTP and OLAP workloads influence this decision?', 'TECHNICAL_KNOWLEDGE', 'MID', NOW()),
(606, 'Execution Plans and Query Debugging', 'When a query is running slowly, how do you diagnose the problem? Walk me through how you would use an execution plan — what are you looking for when you see a table scan versus an index scan or an index seek? What steps do you take to optimize a poorly performing query?', 'TECHNICAL_KNOWLEDGE', 'MID', NOW()),
(607, 'Transaction Isolation Levels', 'Describe the different transaction isolation levels — Read Uncommitted, Read Committed, Repeatable Read, and Serializable. What anomalies can occur at each level, and how do they impact concurrency and performance?', 'TECHNICAL_KNOWLEDGE', 'MID', NOW()),
(608, 'Window Functions', 'Explain what window functions are and how they differ from regular aggregate functions and correlated subqueries. When would you use ROW_NUMBER, RANK, or DENSE_RANK, and can you describe a business scenario — such as calculating running totals or ranking results — where window functions are clearly the better approach?', 'TECHNICAL_KNOWLEDGE', 'SENIOR', NOW()),
(609, 'Database Partitioning and Sharding at Scale', 'You''re working with a table that has grown to billions of rows and queries are becoming unacceptably slow even with proper indexing. Walk me through your approach — how would you evaluate and implement table partitioning? What''s the difference between horizontal and vertical partitioning? At what point would you consider sharding?', 'TECHNICAL_KNOWLEDGE', 'SENIOR', NOW()),
(610, 'Data Integrity in Distributed Systems', 'In a system where multiple services write to the same database — or where data is replicated across databases — how do you ensure data integrity and handle conflicts? Discuss the tradeoffs between strong consistency and eventual consistency, and what patterns like idempotent writes or change data capture you''d employ.', 'TECHNICAL_KNOWLEDGE', 'SENIOR', NOW());

INSERT INTO question_tags (question_id, tag) VALUES
(601, 'sql'), (601, 'joins'), (601, 'fundamentals'), (601, 'databases'),
(602, 'sql'), (602, 'aggregation'), (602, 'group-by'), (602, 'fundamentals'),
(603, 'sql'), (603, 'indexes'), (603, 'performance'), (603, 'databases'),
(604, 'sql'), (604, 'acid'), (604, 'transactions'), (604, 'databases'),
(605, 'sql'), (605, 'normalization'), (605, 'database-design'), (605, 'architecture'),
(606, 'sql'), (606, 'query-optimization'), (606, 'performance'), (606, 'debugging'),
(607, 'sql'), (607, 'transactions'), (607, 'isolation-levels'), (607, 'concurrency'),
(608, 'sql'), (608, 'window-functions'), (608, 'advanced-queries'), (608, 'analytics'),
(609, 'sql'), (609, 'partitioning'), (609, 'sharding'), (609, 'scalability'),
(610, 'sql'), (610, 'distributed-systems'), (610, 'consistency'), (610, 'architecture');

-- ════════════════════════════════════════════════════════════════════════════
-- RUBY (611-620)
-- ════════════════════════════════════════════════════════════════════════════

INSERT INTO questions (id, title, content, category, difficulty, created_at) VALUES
(611, 'Blocks, Procs, and Lambdas', 'Can you explain the differences between blocks, Procs, and lambdas in Ruby? When would you choose one over the other, and what are the practical implications — for example, in how they handle return statements and argument checking?', 'TECHNICAL_KNOWLEDGE', 'JUNIOR', NOW()),
(612, 'Everything is an Object', 'Ruby is often described as a "pure" object-oriented language where everything is an object. What does that actually mean in practice? Can you give examples of how this differs from languages like Java or Python, and how it affects the way you write everyday Ruby code?', 'TECHNICAL_KNOWLEDGE', 'JUNIOR', NOW()),
(613, 'Modules and Mixins vs Inheritance', 'Ruby doesn''t support multiple inheritance, but it has modules and mixins. Can you explain how you decide between using module inclusion versus class inheritance when designing your object model? What are the tradeoffs, and what pitfalls have you seen with heavy use of mixins?', 'TECHNICAL_KNOWLEDGE', 'JUNIOR', NOW()),
(614, 'The Global Interpreter Lock in Ruby', 'Ruby MRI uses a Global Interpreter Lock. Can you explain what the GIL is, how it affects concurrency and parallelism in Ruby applications, and what strategies you use to work around its limitations — for example, when building a high-throughput web service?', 'TECHNICAL_KNOWLEDGE', 'MID', NOW()),
(615, 'Metaprogramming Basics', 'Explain metaprogramming in Ruby with method_missing and define_method. Walk through a real-world scenario where you used metaprogramming effectively. What are the risks and downsides?', 'TECHNICAL_KNOWLEDGE', 'MID', NOW()),
(616, 'Ruby Garbage Collection', 'How does Ruby''s garbage collector work (MRI)? Discuss the generational aspects introduced in Ruby 2.1+ and how they impact performance.', 'TECHNICAL_KNOWLEDGE', 'MID', NOW()),
(617, 'N+1 Queries and Rails Performance', 'One of the most common performance issues in Rails applications is the N+1 query problem. Can you explain what it is, how you detect it in a production application, and what tools and techniques — such as eager loading, caching, or query optimization — you use to address it?', 'TECHNICAL_KNOWLEDGE', 'MID', NOW()),
(618, 'Advanced Metaprogramming', 'Ruby has powerful metaprogramming capabilities — method_missing, define_method, open classes, class_eval, and instance_eval. Walk me through a real-world scenario where you used metaprogramming effectively. When is it the right tool versus when does it create more problems than it solves?', 'TECHNICAL_KNOWLEDGE', 'SENIOR', NOW()),
(619, 'Scaling a Rails Monolith', 'You''re working on a large Rails monolith that''s starting to show scaling issues — slow response times, growing test suites, and team bottlenecks. Walk me through how you would evaluate whether to refactor the monolith, extract microservices, or take a different approach. What are the key tradeoffs?', 'TECHNICAL_KNOWLEDGE', 'SENIOR', NOW()),
(620, 'Ruby GC and Memory Optimization', 'Ruby''s garbage collector has evolved significantly since Ruby 2.1 with generational GC. Can you explain how it works at a high level, how you would diagnose and fix a memory bloat or leak in a production Rails application, and what tools you rely on for memory profiling?', 'TECHNICAL_KNOWLEDGE', 'SENIOR', NOW());

INSERT INTO question_tags (question_id, tag) VALUES
(611, 'ruby'), (611, 'blocks'), (611, 'closures'), (611, 'fundamentals'),
(612, 'ruby'), (612, 'oop'), (612, 'fundamentals'), (612, 'language-design'),
(613, 'ruby'), (613, 'modules'), (613, 'mixins'), (613, 'architecture'),
(614, 'ruby'), (614, 'concurrency'), (614, 'gil'), (614, 'performance'),
(615, 'ruby'), (615, 'metaprogramming'), (615, 'dynamic'), (615, 'best-practices'),
(616, 'ruby'), (616, 'garbage-collection'), (616, 'memory-management'), (616, 'performance'),
(617, 'ruby'), (617, 'rails'), (617, 'n-plus-one'), (617, 'performance'), (617, 'databases'),
(618, 'ruby'), (618, 'metaprogramming'), (618, 'architecture'), (618, 'maintainability'),
(619, 'ruby'), (619, 'rails'), (619, 'scalability'), (619, 'microservices'), (619, 'architecture'),
(620, 'ruby'), (620, 'garbage-collection'), (620, 'memory-management'), (620, 'debugging');

-- ════════════════════════════════════════════════════════════════════════════
-- PHP (621-630)
-- ════════════════════════════════════════════════════════════════════════════

INSERT INTO questions (id, title, content, category, difficulty, created_at) VALUES
(621, 'Sessions vs Cookies', 'Can you explain the difference between sessions and cookies in PHP? When would you use one versus the other, and what are the security considerations you need to keep in mind — for example, regarding session fixation or cookie tampering?', 'TECHNICAL_KNOWLEDGE', 'JUNIOR', NOW()),
(622, 'Abstract Classes vs Interfaces', 'What is the difference between an abstract class and an interface in PHP? Can you describe a practical scenario where you would choose one over the other, and explain how PHP''s support for traits fits into this picture?', 'TECHNICAL_KNOWLEDGE', 'JUNIOR', NOW()),
(623, 'PDO vs MySQLi', 'Compare PDO and MySQLi for database access in PHP. Why is PDO generally preferred for security and portability? How do prepared statements work in each?', 'TECHNICAL_KNOWLEDGE', 'JUNIOR', NOW()),
(624, 'Traits in PHP', 'PHP doesn''t support multiple inheritance, but it provides traits. Can you explain how traits work, what problems they solve, and what potential issues they can introduce — such as method conflicts or hidden coupling — in a large codebase?', 'TECHNICAL_KNOWLEDGE', 'MID', NOW()),
(625, 'SQL Injection Prevention', 'SQL injection is one of the most common security vulnerabilities in PHP applications. Can you walk me through how prepared statements work to prevent SQL injection, the difference between PDO and MySQLi approaches, and any other security practices you follow when interacting with a database?', 'TECHNICAL_KNOWLEDGE', 'MID', NOW()),
(626, 'Dependency Injection in PHP', 'Can you explain what Dependency Injection is, why it matters for writing testable and maintainable PHP code, and how you''ve implemented it in practice — either manually or using a framework''s service container like Laravel''s or Symfony''s?', 'TECHNICAL_KNOWLEDGE', 'MID', NOW()),
(627, 'Namespaces and Composer', 'How do namespaces and Composer manage dependencies in modern PHP apps? Explain autoloading strategies (PSR-4) and how Composer''s dependency resolution works.', 'TECHNICAL_KNOWLEDGE', 'MID', NOW()),
(628, 'OPcache and Performance Optimization', 'When you''re tasked with improving the performance of a PHP application in production, what is your approach? Can you explain how OPcache works, what other caching strategies you employ — such as Redis or Memcached — and how you profile and identify bottlenecks?', 'TECHNICAL_KNOWLEDGE', 'SENIOR', NOW()),
(629, 'PHP Security Best Practices', 'What security practices do you follow when writing PHP applications? Walk me through how you prevent CSRF, XSS, SQL injection, and session-related attacks. How do you handle password hashing and input validation?', 'TECHNICAL_KNOWLEDGE', 'SENIOR', NOW()),
(630, 'Designing a Scalable PHP API Architecture', 'If you were designing a new REST or GraphQL API in PHP that needs to handle millions of requests per day, walk me through the architectural decisions you would make. How would you choose between Laravel and Symfony? What would your approach be to rate limiting, authentication, versioning, and horizontal scaling?', 'TECHNICAL_KNOWLEDGE', 'SENIOR', NOW());

INSERT INTO question_tags (question_id, tag) VALUES
(621, 'php'), (621, 'sessions'), (621, 'cookies'), (621, 'security'),
(622, 'php'), (622, 'oop'), (622, 'interfaces'), (622, 'fundamentals'),
(623, 'php'), (623, 'pdo'), (623, 'databases'), (623, 'security'),
(624, 'php'), (624, 'traits'), (624, 'oop'), (624, 'code-reuse'),
(625, 'php'), (625, 'security'), (625, 'sql-injection'), (625, 'databases'),
(626, 'php'), (626, 'dependency-injection'), (626, 'architecture'), (626, 'testing'),
(627, 'php'), (627, 'composer'), (627, 'namespaces'), (627, 'autoloading'),
(628, 'php'), (628, 'opcache'), (628, 'performance'), (628, 'caching'),
(629, 'php'), (629, 'security'), (629, 'xss'), (629, 'csrf'), (629, 'best-practices'),
(630, 'php'), (630, 'architecture'), (630, 'scalability'), (630, 'api-design');

-- ════════════════════════════════════════════════════════════════════════════
-- C/C++ (631-640)
-- ════════════════════════════════════════════════════════════════════════════

INSERT INTO questions (id, title, content, category, difficulty, created_at) VALUES
(631, 'Pointers vs References', 'Can you explain the fundamental differences between pointers and references in C++? When would you choose to use a pointer over a reference and vice versa? What are the safety implications of each, and how do modern C++ best practices guide this decision?', 'TECHNICAL_KNOWLEDGE', 'JUNIOR', NOW()),
(632, 'Stack vs Heap Memory', 'Can you explain the difference between stack memory and heap memory in C++? When is memory allocated on each, what are the performance implications, and what are the risks of mismanaging heap memory — such as memory leaks or fragmentation?', 'TECHNICAL_KNOWLEDGE', 'JUNIOR', NOW()),
(633, 'The RAII Principle', 'RAII — Resource Acquisition Is Initialization — is considered one of the most important idioms in C++. Can you explain what it means, give examples of how it applies beyond just memory management — such as file handles, mutexes, or network connections — and discuss why it''s critical for writing exception-safe code?', 'TECHNICAL_KNOWLEDGE', 'JUNIOR', NOW()),
(634, 'Smart Pointers and Ownership Semantics', 'C++11 introduced smart pointers — unique_ptr, shared_ptr, and weak_ptr. Can you explain what each one does, what ownership semantics they represent, and when you would choose one over another? Why are smart pointers preferred over raw pointers in modern C++?', 'TECHNICAL_KNOWLEDGE', 'MID', NOW()),
(635, 'Virtual Functions and Vtables', 'Can you explain how virtual functions work in C++ at both a conceptual level and an implementation level — for instance, what is a vtable? Why is it important to declare destructors as virtual in base classes, and what happens if you forget?', 'TECHNICAL_KNOWLEDGE', 'MID', NOW()),
(636, 'Undefined Behavior', 'What is undefined behavior in C++? Give examples and explain why it matters for both correctness and compiler optimization. How do you avoid it in production code?', 'TECHNICAL_KNOWLEDGE', 'MID', NOW()),
(637, 'Templates and Generic Programming', 'How do templates enable generic code in C++? What are the compile-time costs of heavy template usage? When would you use template specialization?', 'TECHNICAL_KNOWLEDGE', 'MID', NOW()),
(638, 'Move Semantics and Perfect Forwarding', 'C++11 introduced move semantics with rvalue references. Can you explain the problem that move semantics solves, how move constructors and move assignment operators work, and what std::move actually does? Additionally, explain perfect forwarding and when you would use std::forward.', 'TECHNICAL_KNOWLEDGE', 'SENIOR', NOW()),
(639, 'Concurrency with std::thread and Atomics', 'How do std::thread and atomics work in C++? Discuss mutexes, race conditions, and lock-free programming. When would you reach for std::atomic versus a mutex, and what are the tradeoffs?', 'TECHNICAL_KNOWLEDGE', 'SENIOR', NOW()),
(640, 'Debugging Memory Issues in Production C++', 'You''re working on a large C++ system that''s exhibiting intermittent crashes and suspected memory corruption in production. Walk me through your diagnostic approach. What tools would you use — such as Valgrind, AddressSanitizer, or custom allocators — and how would you identify use-after-free, double-delete, buffer overflows, or memory fragmentation?', 'TECHNICAL_KNOWLEDGE', 'SENIOR', NOW());

INSERT INTO question_tags (question_id, tag) VALUES
(631, 'cpp'), (631, 'pointers'), (631, 'references'), (631, 'fundamentals'),
(632, 'cpp'), (632, 'memory-management'), (632, 'stack'), (632, 'heap'),
(633, 'cpp'), (633, 'raii'), (633, 'resource-management'), (633, 'best-practices'),
(634, 'cpp'), (634, 'smart-pointers'), (634, 'memory-management'), (634, 'modern-cpp'),
(635, 'cpp'), (635, 'virtual-functions'), (635, 'oop'), (635, 'polymorphism'),
(636, 'cpp'), (636, 'undefined-behavior'), (636, 'debugging'), (636, 'safety'),
(637, 'cpp'), (637, 'templates'), (637, 'generics'), (637, 'performance'),
(638, 'cpp'), (638, 'move-semantics'), (638, 'modern-cpp'), (638, 'performance'),
(639, 'cpp'), (639, 'concurrency'), (639, 'threads'), (639, 'atomics'),
(640, 'cpp'), (640, 'memory-management'), (640, 'debugging'), (640, 'production');

COMMIT;
