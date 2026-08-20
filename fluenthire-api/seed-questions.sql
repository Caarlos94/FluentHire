-- Seed 57 new questions (CODING, SYSTEM_DESIGN, TECHNICAL_KNOWLEDGE)
-- Behavioral questions are handled entirely by DataSeeder
-- Based on most commonly asked interview questions at FAANG and top tech companies worldwide
-- Sources: Tech Interview Handbook, IGotAnOffer, Educative, InterviewBit, DataCamp, roadmap.sh

BEGIN;

-- ════════════════════════════════════════════════════════════════════════════
-- CODING — 20 new (5 existing → 25 total)
-- ════════════════════════════════════════════════════════════════════════════

-- Junior (8 new → 8 total)
INSERT INTO questions (id, title, content, category, difficulty, created_at) VALUES
(201, 'Reversing a string', 'How would you reverse a string without using built-in reverse methods? Walk me through your approach and discuss the time complexity.', 'CODING', 'JUNIOR', NOW()),
(202, 'Finding duplicates in an array', 'Given an array of integers, how would you find all duplicate values? Explain your approach and the trade-offs between different solutions.', 'CODING', 'JUNIOR', NOW()),
(203, 'FizzBuzz with a twist', 'Implement FizzBuzz, but also explain how you would make it extensible — for example, if the rules changed or new conditions were added.', 'CODING', 'JUNIOR', NOW()),
(204, 'Validating a palindrome', 'How would you check if a given string is a palindrome? Consider edge cases like spaces, punctuation, and case sensitivity.', 'CODING', 'JUNIOR', NOW()),
(205, 'Two Sum problem', 'Given an array of numbers and a target sum, find two numbers that add up to the target. Explain your approach, from brute force to optimal.', 'CODING', 'JUNIOR', NOW()),
(206, 'Implementing a stack', 'How would you implement a stack data structure? Explain the operations, time complexity, and a real-world use case.', 'CODING', 'JUNIOR', NOW()),
(207, 'Counting character frequency', 'Given a string, how would you count the frequency of each character? What data structure would you use and why?', 'CODING', 'JUNIOR', NOW()),
(208, 'Merging two sorted arrays', 'How would you merge two sorted arrays into a single sorted array? Walk me through your approach step by step.', 'CODING', 'JUNIOR', NOW());

INSERT INTO question_tags (question_id, tag) VALUES
(201, 'strings'), (201, 'algorithms'), (201, 'basics'),
(202, 'arrays'), (202, 'hash-tables'), (202, 'algorithms'),
(203, 'loops'), (203, 'design'), (203, 'extensibility'),
(204, 'strings'), (204, 'edge-cases'), (204, 'algorithms'),
(205, 'arrays'), (205, 'hash-tables'), (205, 'optimization'),
(206, 'data-structures'), (206, 'stack'), (206, 'basics'),
(207, 'strings'), (207, 'hash-tables'), (207, 'data-structures'),
(208, 'arrays'), (208, 'sorting'), (208, 'algorithms');

-- Mid (7 new → 11 total)
INSERT INTO questions (id, title, content, category, difficulty, created_at) VALUES
(209, 'Implementing an LRU Cache', 'How would you design and implement an LRU (Least Recently Used) cache? Discuss the data structures you would use and the time complexity of operations.', 'CODING', 'MID', NOW()),
(210, 'Finding the longest substring without repeating characters', 'Given a string, find the length of the longest substring without repeating characters. Explain your approach and optimize it.', 'CODING', 'MID', NOW()),
(211, 'Binary tree traversal', 'Explain the different ways to traverse a binary tree (in-order, pre-order, post-order, level-order). When would you use each one?', 'CODING', 'MID', NOW()),
(212, 'Detecting a cycle in a linked list', 'How would you detect if a linked list has a cycle? Explain multiple approaches and their trade-offs.', 'CODING', 'MID', NOW()),
(213, 'Designing a clean API endpoint', 'You need to build a REST API endpoint for searching products with filters, pagination, and sorting. Walk me through how you would design it.', 'CODING', 'MID', NOW()),
(214, 'Handling race conditions', 'Describe a scenario where a race condition could occur in a web application. How would you detect it and prevent it?', 'CODING', 'MID', NOW()),
(215, 'Writing effective unit tests', 'How do you decide what to test? Walk me through how you would write unit tests for a service that processes payments.', 'CODING', 'MID', NOW());

INSERT INTO question_tags (question_id, tag) VALUES
(209, 'data-structures'), (209, 'caching'), (209, 'design'),
(210, 'strings'), (210, 'sliding-window'), (210, 'optimization'),
(211, 'trees'), (211, 'traversal'), (211, 'data-structures'),
(212, 'linked-lists'), (212, 'algorithms'), (212, 'fast-slow-pointers'),
(213, 'api'), (213, 'rest'), (213, 'design'), (213, 'backend'),
(214, 'concurrency'), (214, 'race-conditions'), (214, 'backend'),
(215, 'testing'), (215, 'unit-tests'), (215, 'best-practices');

-- Senior (5 new → 6 total)
INSERT INTO questions (id, title, content, category, difficulty, created_at) VALUES
(216, 'Designing a task scheduler', 'How would you design a distributed task scheduler that can handle millions of jobs with different priorities and retry logic?', 'CODING', 'SENIOR', NOW()),
(217, 'Implementing eventual consistency', 'Explain how you would implement eventual consistency between two microservices that need to share data. What patterns would you use?', 'CODING', 'SENIOR', NOW()),
(218, 'Optimizing a database-heavy application', 'You inherit an application where most API endpoints take over 2 seconds to respond due to database queries. Walk me through your optimization strategy.', 'CODING', 'SENIOR', NOW()),
(219, 'Building a resilient integration', 'How would you build a resilient integration with a third-party API that has frequent downtime? Discuss patterns like circuit breakers, retries, and fallbacks.', 'CODING', 'SENIOR', NOW()),
(220, 'Migrating a monolith to microservices', 'You are tasked with breaking a monolithic application into microservices. How would you approach this? What would you extract first and why?', 'CODING', 'SENIOR', NOW());

INSERT INTO question_tags (question_id, tag) VALUES
(216, 'distributed-systems'), (216, 'scheduling'), (216, 'architecture'),
(217, 'microservices'), (217, 'consistency'), (217, 'event-driven'),
(218, 'performance'), (218, 'databases'), (218, 'optimization'), (218, 'backend'),
(219, 'resilience'), (219, 'integration'), (219, 'patterns'), (219, 'backend'),
(220, 'microservices'), (220, 'architecture'), (220, 'migration');

-- ════════════════════════════════════════════════════════════════════════════
-- SYSTEM_DESIGN — 20 new (5 existing → 25 total)
-- ════════════════════════════════════════════════════════════════════════════

-- Junior (7 new → 7 total)
INSERT INTO questions (id, title, content, category, difficulty, created_at) VALUES
(301, 'Design a simple REST API', 'Design a REST API for a to-do list application. Define the endpoints, HTTP methods, request/response formats, and basic error handling.', 'SYSTEM_DESIGN', 'JUNIOR', NOW()),
(302, 'Design a user authentication system', 'How would you design a basic user authentication system with registration, login, and password reset? What security considerations are important?', 'SYSTEM_DESIGN', 'JUNIOR', NOW()),
(303, 'Design a simple file upload service', 'Design a service that allows users to upload and download files. What storage options would you consider? How would you handle large files?', 'SYSTEM_DESIGN', 'JUNIOR', NOW()),
(304, 'Design a blog platform', 'How would you design a simple blogging platform where users can create, edit, and delete posts? Discuss the database schema and API design.', 'SYSTEM_DESIGN', 'JUNIOR', NOW()),
(305, 'Design a caching strategy', 'Explain how you would add caching to a web application. When would you use caching, and what are the common pitfalls?', 'SYSTEM_DESIGN', 'JUNIOR', NOW()),
(306, 'Design a contact form service', 'Design a service that handles contact form submissions, sends email notifications, and prevents spam. Walk me through the components.', 'SYSTEM_DESIGN', 'JUNIOR', NOW()),
(307, 'Design a basic search feature', 'How would you implement a search feature for a product catalog? Discuss different approaches from simple LIKE queries to full-text search.', 'SYSTEM_DESIGN', 'JUNIOR', NOW());

INSERT INTO question_tags (question_id, tag) VALUES
(301, 'api'), (301, 'rest'), (301, 'basics'),
(302, 'authentication'), (302, 'security'), (302, 'backend'),
(303, 'file-storage'), (303, 'uploads'), (303, 'cloud'),
(304, 'databases'), (304, 'crud'), (304, 'api'),
(305, 'caching'), (305, 'redis'), (305, 'performance'),
(306, 'email'), (306, 'api'), (306, 'spam-prevention'),
(307, 'search'), (307, 'databases'), (307, 'full-text-search');

-- Mid (6 new → 8 total)
INSERT INTO questions (id, title, content, category, difficulty, created_at) VALUES
(308, 'Design a job queue system', 'Design a background job processing system that handles tasks like sending emails, generating reports, and processing images. How would you handle failures and retries?', 'SYSTEM_DESIGN', 'MID', NOW()),
(309, 'Design a real-time leaderboard', 'How would you design a real-time leaderboard for an online game that supports millions of players? Discuss data structures and scaling strategies.', 'SYSTEM_DESIGN', 'MID', NOW()),
(310, 'Design a social media feed', 'Design a news feed system like Twitter or Instagram. How would you generate the feed, handle ranking, and scale to millions of users?', 'SYSTEM_DESIGN', 'MID', NOW()),
(311, 'Design an API rate limiter', 'Design a rate limiting system for an API. Discuss different algorithms (token bucket, sliding window) and how you would implement it at scale.', 'SYSTEM_DESIGN', 'MID', NOW()),
(312, 'Design a logging and monitoring system', 'How would you design a centralized logging and monitoring system for a microservices architecture? What tools and patterns would you use?', 'SYSTEM_DESIGN', 'MID', NOW()),
(313, 'Design a payment processing system', 'Design a system that handles credit card payments. Discuss idempotency, failure handling, PCI compliance, and reconciliation.', 'SYSTEM_DESIGN', 'MID', NOW());

INSERT INTO question_tags (question_id, tag) VALUES
(308, 'queues'), (308, 'background-jobs'), (308, 'reliability'),
(309, 'real-time'), (309, 'redis'), (309, 'scaling'),
(310, 'feed'), (310, 'ranking'), (310, 'scaling'), (310, 'databases'),
(311, 'rate-limiting'), (311, 'algorithms'), (311, 'api'),
(312, 'logging'), (312, 'monitoring'), (312, 'microservices'), (312, 'devops'),
(313, 'payments'), (313, 'security'), (313, 'idempotency'), (313, 'backend');

-- Senior (7 new → 10 total)
INSERT INTO questions (id, title, content, category, difficulty, created_at) VALUES
(314, 'Design a video streaming platform', 'Design a video streaming service like YouTube or Netflix. Discuss content delivery, transcoding, storage, and how to handle millions of concurrent viewers.', 'SYSTEM_DESIGN', 'SENIOR', NOW()),
(315, 'Design a ride-sharing service', 'Design a system like Uber or Lyft. How would you handle real-time location tracking, matching riders with drivers, surge pricing, and ETA calculation?', 'SYSTEM_DESIGN', 'SENIOR', NOW()),
(316, 'Design a distributed search engine', 'Design a web search engine. Discuss crawling, indexing, ranking, and how to serve results with low latency at scale.', 'SYSTEM_DESIGN', 'SENIOR', NOW()),
(317, 'Design a collaborative document editor', 'Design a real-time collaborative editor like Google Docs. How would you handle concurrent edits, conflict resolution, and offline support?', 'SYSTEM_DESIGN', 'SENIOR', NOW()),
(318, 'Design a multi-region database strategy', 'Your application needs to serve users globally with low latency. Design a multi-region database architecture. Discuss consistency trade-offs and conflict resolution.', 'SYSTEM_DESIGN', 'SENIOR', NOW()),
(319, 'Design a CI/CD pipeline for microservices', 'Design a CI/CD pipeline for an organization with 50+ microservices. How would you handle testing, deployment strategies, rollbacks, and canary releases?', 'SYSTEM_DESIGN', 'SENIOR', NOW()),
(320, 'Design a real-time analytics platform', 'Design a system that processes millions of events per second and provides real-time dashboards and alerts. Discuss ingestion, processing, storage, and querying.', 'SYSTEM_DESIGN', 'SENIOR', NOW());

INSERT INTO question_tags (question_id, tag) VALUES
(314, 'streaming'), (314, 'cdn'), (314, 'scaling'), (314, 'storage'),
(315, 'real-time'), (315, 'geolocation'), (315, 'matching'), (315, 'scaling'),
(316, 'search'), (316, 'distributed-systems'), (316, 'indexing'),
(317, 'real-time'), (317, 'collaboration'), (317, 'conflict-resolution'),
(318, 'databases'), (318, 'multi-region'), (318, 'consistency'), (318, 'distributed-systems'),
(319, 'ci-cd'), (319, 'microservices'), (319, 'devops'), (319, 'deployment'),
(320, 'analytics'), (320, 'streaming'), (320, 'real-time'), (320, 'big-data');

-- ════════════════════════════════════════════════════════════════════════════
-- TECHNICAL_KNOWLEDGE — 17 new (8 existing → 25 total)
-- ════════════════════════════════════════════════════════════════════════════

-- Junior (6 new → 8 total)
INSERT INTO questions (id, title, content, category, difficulty, created_at) VALUES
(401, 'HTTP methods and status codes', 'Explain the main HTTP methods (GET, POST, PUT, PATCH, DELETE) and when you would use each one. What are the most common status codes and what do they mean?', 'TECHNICAL_KNOWLEDGE', 'JUNIOR', NOW()),
(402, 'What is version control?', 'Explain how Git works at a high level. What is a branch, a merge, and a pull request? Why is version control important in a team?', 'TECHNICAL_KNOWLEDGE', 'JUNIOR', NOW()),
(403, 'Relational database basics', 'Explain what a relational database is. What are tables, rows, columns, primary keys, and foreign keys? Give an example of how you would model a simple relationship.', 'TECHNICAL_KNOWLEDGE', 'JUNIOR', NOW()),
(404, 'What is an API?', 'Explain what an API is to a non-technical person. Then explain it at a technical level — what happens when a client makes an API call?', 'TECHNICAL_KNOWLEDGE', 'JUNIOR', NOW()),
(405, 'Object-Oriented Programming basics', 'Explain the four pillars of OOP: encapsulation, abstraction, inheritance, and polymorphism. Give a real-world example for each.', 'TECHNICAL_KNOWLEDGE', 'JUNIOR', NOW()),
(406, 'What happens when you type a URL in the browser?', 'Walk me through everything that happens from the moment you type a URL in the browser to when the page is fully loaded.', 'TECHNICAL_KNOWLEDGE', 'JUNIOR', NOW());

INSERT INTO question_tags (question_id, tag) VALUES
(401, 'http'), (401, 'rest'), (401, 'basics'), (401, 'api'),
(402, 'git'), (402, 'version-control'), (402, 'basics'), (402, 'collaboration'),
(403, 'databases'), (403, 'sql'), (403, 'basics'), (403, 'relational'),
(404, 'api'), (404, 'basics'), (404, 'communication'),
(405, 'oop'), (405, 'design'), (405, 'basics'),
(406, 'networking'), (406, 'dns'), (406, 'http'), (406, 'browser');

-- Mid (6 new → 11 total)
INSERT INTO questions (id, title, content, category, difficulty, created_at) VALUES
(407, 'CAP Theorem explained', 'Explain the CAP theorem. Give real-world examples of databases that prioritize different combinations of Consistency, Availability, and Partition Tolerance.', 'TECHNICAL_KNOWLEDGE', 'MID', NOW()),
(408, 'How does OAuth 2.0 work?', 'Explain the OAuth 2.0 authorization flow. What is the difference between authentication and authorization? When would you use OAuth vs. JWT?', 'TECHNICAL_KNOWLEDGE', 'MID', NOW()),
(409, 'Database transactions and ACID', 'Explain ACID properties in database transactions. What happens if one of them is violated? Give an example of when you would need a transaction.', 'TECHNICAL_KNOWLEDGE', 'MID', NOW()),
(410, 'Message queues and when to use them', 'Explain what a message queue is (e.g., RabbitMQ, Kafka). When would you use one instead of a direct API call? What problems do they solve?', 'TECHNICAL_KNOWLEDGE', 'MID', NOW()),
(411, 'Caching strategies explained', 'Explain the difference between cache-aside, read-through, write-through, and write-behind caching patterns. When would you use each one?', 'TECHNICAL_KNOWLEDGE', 'MID', NOW()),
(412, 'Design patterns you use regularly', 'What design patterns do you use most often in your daily work? Explain two or three patterns with concrete examples from projects you have worked on.', 'TECHNICAL_KNOWLEDGE', 'MID', NOW());

INSERT INTO question_tags (question_id, tag) VALUES
(407, 'distributed-systems'), (407, 'databases'), (407, 'cap-theorem'),
(408, 'oauth'), (408, 'authentication'), (408, 'security'), (408, 'jwt'),
(409, 'databases'), (409, 'transactions'), (409, 'acid'),
(410, 'message-queues'), (410, 'kafka'), (410, 'rabbitmq'), (410, 'async'),
(411, 'caching'), (411, 'redis'), (411, 'patterns'), (411, 'performance'),
(412, 'design-patterns'), (412, 'architecture'), (412, 'best-practices');

-- Senior (5 new → 6 total)
INSERT INTO questions (id, title, content, category, difficulty, created_at) VALUES
(413, 'Event-driven architecture', 'Explain event-driven architecture. What are the benefits and challenges compared to request-response? When would you choose one over the other?', 'TECHNICAL_KNOWLEDGE', 'SENIOR', NOW()),
(414, 'Database sharding strategies', 'Explain different sharding strategies (hash-based, range-based, geographic). What are the challenges of sharding, and how do you handle cross-shard queries?', 'TECHNICAL_KNOWLEDGE', 'SENIOR', NOW()),
(415, 'Observability in production systems', 'Explain the three pillars of observability: logs, metrics, and traces. How do they work together? How would you set up observability for a microservices architecture?', 'TECHNICAL_KNOWLEDGE', 'SENIOR', NOW()),
(416, 'Zero-downtime deployments', 'Explain how you would achieve zero-downtime deployments. Discuss blue-green deployments, canary releases, rolling updates, and database migration strategies.', 'TECHNICAL_KNOWLEDGE', 'SENIOR', NOW()),
(417, 'Scaling a system from 1K to 1M users', 'Walk me through how you would scale a web application as it grows from 1,000 to 1,000,000 users. What changes at each stage?', 'TECHNICAL_KNOWLEDGE', 'SENIOR', NOW());

INSERT INTO question_tags (question_id, tag) VALUES
(413, 'event-driven'), (413, 'architecture'), (413, 'microservices'),
(414, 'sharding'), (414, 'databases'), (414, 'scaling'), (414, 'distributed-systems'),
(415, 'observability'), (415, 'monitoring'), (415, 'logging'), (415, 'devops'),
(416, 'deployment'), (416, 'devops'), (416, 'ci-cd'), (416, 'zero-downtime'),
(417, 'scaling'), (417, 'architecture'), (417, 'infrastructure');

COMMIT;
