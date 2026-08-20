package com.fluenthire.config.seed;

import com.fluenthire.entity.DifficultyLevel;
import com.fluenthire.entity.Question;
import com.fluenthire.entity.QuestionCategory;

import java.util.ArrayList;
import java.util.List;

/**
 * 50 system design interview questions cross-referenced across 7 sources:
 * Glassdoor, Blind, LeetCode Discuss, interviewing.io, Exponent,
 * IGotAnOffer, and Educative (2023-2026 reports).
 *
 * Covers: FAANG + Microsoft, consulting firms (Accenture, Deloitte, EPAM,
 * Globant, Cognizant, Infosys, Wipro, TCS), remote platforms (Toptal,
 * Turing, Arc.dev, Andela, Crossover, BairesDev), and startups/mid-size
 * US companies hiring internationally.
 *
 * Distribution: 10 JUNIOR · 22 MID · 18 SENIOR
 */
public final class SystemDesignQuestions {

    private SystemDesignQuestions() {}

    public static List<Question> getAll() {
        List<Question> questions = new ArrayList<>();
        addJunior(questions);
        addMid(questions);
        addSenior(questions);
        return questions;
    }

    // ── JUNIOR (10) ─────────────────────────────────────────────────────

    private static void addJunior(List<Question> list) {
        list.add(q("Design a URL Shortener",
                "Design a service like Bitly that generates short, unique aliases for long URLs and redirects users. "
                + "Discuss hashing strategies, collision avoidance, link expiration, and click analytics. "
                + "How do you generate unique short codes without collisions at scale? "
                + "How would you track click analytics without slowing redirects?",
                DifficultyLevel.JUNIOR,
                "api-design", "databases", "hashing", "caching", "scalability"));

        list.add(q("Design a Rate Limiter",
                "Build a service that throttles API requests per user, IP, or endpoint using token bucket or sliding window algorithms. "
                + "Cover enforcement across distributed servers and edge cases like traffic bursts. "
                + "How do you implement rate limiting across multiple API servers without a single point of failure? "
                + "What algorithm would you choose for bursty vs steady traffic and why?",
                DifficultyLevel.JUNIOR,
                "api-design", "caching", "algorithms", "distributed-systems"));

        list.add(q("Design a Basic Authentication System",
                "Design user login, signup, password reset, and session management with JWT or sessions. "
                + "Cover token expiration, refresh tokens, and role-based access control. "
                + "How do you handle token refresh without forcing re-login? "
                + "How would you revoke a compromised JWT before it expires?",
                DifficultyLevel.JUNIOR,
                "security", "api-design", "databases", "jwt", "oauth"));

        list.add(q("Design a Parking Lot System",
                "Design a system to manage a multi-level parking lot — tracking available spots by vehicle size, "
                + "vehicle entry/exit, and billing with dynamic pricing. "
                + "How would you handle different vehicle sizes (motorcycle, car, bus)? "
                + "How would you calculate dynamic pricing based on duration?",
                DifficultyLevel.JUNIOR,
                "oop-design", "databases", "crud", "state-management"));

        list.add(q("Design an Elevator Control System",
                "Design an elevator controller for multiple elevators, floors, and request queuing. "
                + "Optimize for shortest wait time and peak-hour efficiency. "
                + "How do you optimize for shortest path or peak hours? "
                + "What about emergency handling and priority overrides?",
                DifficultyLevel.JUNIOR,
                "oop-design", "algorithms", "state-management", "scheduling"));

        list.add(q("Design a Leaderboard / Top-K System",
                "Design a real-time leaderboard that maintains rankings of top-K items (top players, trending hashtags). "
                + "Must support high-frequency score updates and efficient rank queries. "
                + "How do you maintain a sorted leaderboard with millions of entries and frequent updates? "
                + "How do you compute time-windowed rankings (top this hour vs top all-time)?",
                DifficultyLevel.JUNIOR,
                "databases", "caching", "real-time", "sorted-sets", "scalability"));

        list.add(q("Design a Unique ID Generator",
                "Design a system that generates globally unique, roughly time-sortable IDs at massive scale "
                + "across multiple data centers with no coordination. Discuss Snowflake IDs, UUIDs, and trade-offs. "
                + "How does Snowflake embed timestamp, machine ID, and sequence number? "
                + "What happens during clock skew between servers?",
                DifficultyLevel.JUNIOR,
                "distributed-systems", "scalability", "databases", "consistency"));

        list.add(q("Design a Simple Pub/Sub Notification System",
                "Design a basic publish-subscribe system where services publish events and subscribers receive them "
                + "in near real-time. Cover topics, subscriptions, and delivery guarantees. "
                + "How do you guarantee at-least-once delivery? "
                + "How do you handle slow subscribers without blocking publishers?",
                DifficultyLevel.JUNIOR,
                "messaging", "pub-sub", "event-driven", "scalability"));

        list.add(q("Design a Basic E-Commerce API",
                "Design the REST API layer for a simple online store — product catalog CRUD, shopping cart, "
                + "and checkout flow. Focus on resource modeling, pagination, and input validation. "
                + "How would you handle inventory updates during checkout? "
                + "How would you structure nested resources like /orders/{id}/items?",
                DifficultyLevel.JUNIOR,
                "api-design", "rest-api", "databases", "crud", "microservices"));

        list.add(q("Design a Simple Caching Layer",
                "Design a basic caching layer for a web application — discuss cache-aside pattern, TTL, "
                + "eviction policies (LRU, LFU), and when to cache vs not. "
                + "How would you handle cache invalidation when data changes? "
                + "When would you choose Redis vs Memcached?",
                DifficultyLevel.JUNIOR,
                "caching", "databases", "performance", "key-value"));
    }

    // ── MID (22) ────────────────────────────────────────────────────────

    private static void addMid(List<Question> list) {
        list.add(q("Design a Real-Time Chat Application",
                "Build a messaging platform supporting 1:1 and group chats, message delivery guarantees "
                + "(sent/delivered/read), presence indicators, offline queuing, and message history. "
                + "How do you guarantee message ordering in group chats across distributed servers? "
                + "How do you handle delivery when the recipient is offline and comes back on a different device?",
                DifficultyLevel.MID,
                "websockets", "messaging", "real-time", "pub-sub", "databases", "consistency"));

        list.add(q("Design a Notification Service",
                "Build a notification service delivering push, email, SMS, and in-app notifications. "
                + "Cover user preferences, deduplication, throttling, delivery guarantees, and retry logic. "
                + "How do you prevent duplicate notifications for the same event? "
                + "How do you implement user preference controls per channel?",
                DifficultyLevel.MID,
                "notifications", "message-queues", "multi-channel", "event-driven", "delivery"));

        list.add(q("Design a Social Media News Feed",
                "Design the home feed for a social platform — posts from followed accounts, ranked by relevance "
                + "or chronology. Cover fan-out-on-write vs fan-out-on-read trade-offs. "
                + "Would you use fan-out-on-write or fan-out-on-read? "
                + "How do you handle celebrity users with millions of followers?",
                DifficultyLevel.MID,
                "feed-ranking", "fan-out", "caching", "social-graph", "databases", "scalability"));

        list.add(q("Design an E-Commerce Platform",
                "Design a scalable online store — product catalog, search, shopping cart, checkout, "
                + "payment processing, order management, and inventory consistency. "
                + "How do you prevent overselling during flash sales? "
                + "How do you handle partial failures in the checkout flow (payment succeeds but order service is down)?",
                DifficultyLevel.MID,
                "microservices", "databases", "transactions", "caching", "search", "scalability"));

        list.add(q("Design a File Storage and Sync Service",
                "Design a cloud file storage system like Dropbox or Google Drive — upload, download, sharing, "
                + "sync across devices, versioning, chunked uploads, and conflict resolution. "
                + "How do you handle conflict resolution when two devices edit the same file? "
                + "How do you implement block-level deduplication and delta sync?",
                DifficultyLevel.MID,
                "file-storage", "sync", "chunking", "versioning", "distributed-systems", "consistency"));

        list.add(q("Design a Payment Processing System",
                "Design a system handling credit card charges, refunds, idempotent retries, multi-currency support, "
                + "and reconciliation. Must guarantee exactly-once payment processing. "
                + "How do you ensure exactly-once processing with idempotency keys? "
                + "How do you handle refunds and the reconciliation ledger?",
                DifficultyLevel.MID,
                "payments", "idempotency", "consistency", "transactions", "security"));

        list.add(q("Design a Ride-Sharing Service",
                "Design rider-driver matching like Uber — location tracking, geospatial matching, ETA estimation, "
                + "surge pricing, and trip management in real time. "
                + "How do you efficiently match riders with nearby drivers using geospatial indexing? "
                + "How do you implement surge pricing based on supply/demand?",
                DifficultyLevel.MID,
                "geospatial", "real-time", "matching-algorithm", "location-tracking", "scalability"));

        list.add(q("Design Search Autocomplete / Typeahead",
                "Build a system providing real-time search suggestions with sub-100ms latency. "
                + "Cover trie data structures, ranking by popularity/personalization, and real-time updates. "
                + "How do you rank suggestions — popularity, personalization, or recency? "
                + "How do you update the corpus as new queries trend?",
                DifficultyLevel.MID,
                "search", "trie", "caching", "ranking", "latency"));

        list.add(q("Design an API Gateway",
                "Design a centralized gateway handling request routing, authentication, rate limiting, "
                + "load balancing, circuit breaking, and observability for a microservices backend. "
                + "How do you implement circuit breaking to prevent cascading failures? "
                + "How do you handle API versioning across hundreds of backend services?",
                DifficultyLevel.MID,
                "api-design", "load-balancing", "microservices", "circuit-breaker", "scalability"));

        list.add(q("Design a Hotel Booking System",
                "Design a reservation system — search by date/location, book rooms, prevent double-booking, "
                + "manage cancellations. Handle concurrent booking attempts and dynamic pricing. "
                + "How do you prevent two users from booking the same room for the same dates? "
                + "How do you implement dynamic pricing based on demand and seasonality?",
                DifficultyLevel.MID,
                "booking", "availability", "search", "transactions", "concurrency", "locking"));

        list.add(q("Design a Job Scheduler / Task Queue",
                "Build a distributed task scheduling system — delayed execution, recurring tasks (cron), "
                + "priority queues, retries with backoff, and exactly-once execution guarantees. "
                + "How do you ensure a job runs exactly once even if a worker crashes mid-execution? "
                + "How do you implement priorities so critical tasks aren't blocked by bulk processing?",
                DifficultyLevel.MID,
                "task-queue", "scheduling", "reliability", "retries", "distributed-systems"));

        list.add(q("Design a Web Crawler",
                "Build a distributed web crawler that downloads and indexes billions of pages — URL frontier, "
                + "politeness policies, deduplication, priority scheduling, and distributed coordination. "
                + "How do you avoid crawling duplicate or near-duplicate content? "
                + "How do you respect robots.txt and implement rate limiting per domain?",
                DifficultyLevel.MID,
                "crawling", "distributed-systems", "deduplication", "scheduling", "storage"));

        list.add(q("Design a Distributed Cache",
                "Design a distributed caching system with consistent hashing, eviction policies, replication, "
                + "and high availability. Discuss cache-aside, write-through, and write-behind patterns. "
                + "How do you handle cache stampede (thundering herd) when a hot key expires? "
                + "How do you maintain cache consistency with the database during writes?",
                DifficultyLevel.MID,
                "caching", "distributed-systems", "consistency", "scalability", "availability"));

        list.add(q("Design Instagram / Photo Sharing Service",
                "Design a photo/video sharing platform — upload, storage, feed generation, following/followers, "
                + "likes, comments. Handle massive media storage and CDN delivery. "
                + "How do you design the media upload pipeline for different resolutions and thumbnail generation? "
                + "How do you build and serve the user feed efficiently?",
                DifficultyLevel.MID,
                "storage", "cdn", "databases", "caching", "scalability", "media"));

        list.add(q("Design a Social Graph Service",
                "Design the backend for storing and querying social relationships — friends, followers, "
                + "mutual friends, friend-of-friend suggestions. Handle billions of nodes and edges. "
                + "How do you efficiently compute mutual friends or second-degree connections? "
                + "Would you use a graph DB, adjacency list in relational DB, or a custom solution?",
                DifficultyLevel.MID,
                "databases", "graph", "caching", "scalability", "data-modeling"));

        list.add(q("Design a Recommendation Engine",
                "Build a personalized recommendation system for videos or products using collaborative filtering "
                + "and content-based approaches. Handle cold start, real-time updates, and A/B testing. "
                + "How do you handle the cold-start problem for new users? "
                + "Real-time updates vs batch processing — when would you use each?",
                DifficultyLevel.MID,
                "recommendations", "machine-learning", "databases", "scalability", "personalization"));

        list.add(q("Design a Ticketing System",
                "Design a ticket booking platform like Ticketmaster — seat selection under high concurrency, "
                + "reservation with timeout, payment processing, and virtual waiting rooms for on-sale events. "
                + "How do you implement seat reservation with a time-based hold under extreme concurrency? "
                + "How do you handle the virtual waiting room when millions of users hit the system?",
                DifficultyLevel.MID,
                "consistency", "concurrency", "databases", "scalability", "transactions"));

        list.add(q("Design a Webhook Delivery System",
                "Design a reliable system for delivering webhook events to third-party endpoints — "
                + "retry with exponential backoff, dead letter queues, signature verification, and delivery guarantees. "
                + "How do you handle consistently slow or unresponsive endpoints? "
                + "How do subscribers verify that a webhook is genuinely from your system?",
                DifficultyLevel.MID,
                "webhooks", "reliability", "retries", "event-driven", "queues"));

        list.add(q("Design a Location-Based Service",
                "Design a service like Yelp for searching nearby businesses, viewing details, and reading/writing reviews. "
                + "Focus on geospatial indexing (QuadTree, Geohash) and search relevance ranking. "
                + "How do you index businesses for efficient radius queries? "
                + "How do you rank results by distance, ratings, and relevance?",
                DifficultyLevel.MID,
                "search", "databases", "caching", "geospatial", "scalability"));

        list.add(q("Design a Stock Ticker / Market Data Feed",
                "Design a system that ingests real-time market data, processes it, and distributes price updates "
                + "to thousands of subscribers with minimal latency. "
                + "How do you handle burst traffic during market open? "
                + "How do you ensure all subscribers get consistent data without losing updates?",
                DifficultyLevel.MID,
                "real-time", "streaming", "pub-sub", "scalability", "low-latency"));

        list.add(q("Design an Online Code Judge",
                "Design a platform like LeetCode where users submit code that is compiled and run against test cases "
                + "in a sandboxed environment, with timing and memory metrics returned. "
                + "How do you sandbox code execution securely to prevent malicious code? "
                + "How do you handle time and memory limits and prevent resource abuse?",
                DifficultyLevel.MID,
                "sandboxing", "containers", "task-queue", "security", "scalability"));

        list.add(q("Design a Multi-Tenant SaaS Platform",
                "Design architecture for a SaaS application serving multiple tenants with data isolation, "
                + "per-tenant customization, usage metering, and billing. "
                + "Shared DB with tenant IDs vs separate schemas vs separate databases — what are the trade-offs? "
                + "How do you implement per-tenant rate limiting and usage metering?",
                DifficultyLevel.MID,
                "multi-tenancy", "data-isolation", "saas", "billing", "scalability"));
    }

    // ── SENIOR (18) ─────────────────────────────────────────────────────

    private static void addSenior(List<Question> list) {
        list.add(q("Design a Monitoring and Alerting System",
                "Design a time-series metrics platform like Datadog — collection from thousands of services, "
                + "storage, aggregation, flexible queries, dashboards, and real-time alerting with minimal false positives. "
                + "How do you store high-cardinality time-series data efficiently? "
                + "How do you evaluate thousands of alert rules with minimal delay?",
                DifficultyLevel.SENIOR,
                "monitoring", "time-series", "aggregation", "alerting", "distributed-systems", "ingestion"));

        list.add(q("Design a Collaborative Document Editor",
                "Design a real-time collaborative editor like Google Docs — multiple users editing simultaneously "
                + "with conflict-free merging using OT or CRDTs, cursor presence, version history, and offline support. "
                + "How do you implement CRDTs for concurrent edits without a central server? "
                + "How do you reconcile changes made offline when the user comes back online?",
                DifficultyLevel.SENIOR,
                "collaboration", "crdt", "ot", "real-time", "conflict-resolution", "websockets"));

        list.add(q("Design YouTube / Video Streaming Platform",
                "Design a video platform — upload, transcoding into multiple resolutions, adaptive bitrate streaming, "
                + "CDN delivery, search, recommendations, and view counting at scale. "
                + "How do you design a cost-efficient transcoding pipeline that handles upload spikes? "
                + "How do you implement adaptive bitrate streaming to minimize buffering?",
                DifficultyLevel.SENIOR,
                "storage", "cdn", "scalability", "transcoding", "streaming", "distributed-systems"));

        list.add(q("Design a Content Delivery Network",
                "Design a CDN that caches and delivers content from edge servers worldwide — cache invalidation, "
                + "origin shielding, SSL termination, geographic routing, and DDoS mitigation. "
                + "How do you design cache invalidation to balance freshness vs hit ratio? "
                + "How do you route requests to the optimal edge server considering latency and load?",
                DifficultyLevel.SENIOR,
                "cdn", "caching", "distributed-systems", "scalability", "availability", "dns"));

        list.add(q("Design Twitter / X at Scale",
                "Design the full Twitter platform — tweet ingestion, fan-out to millions of followers, "
                + "timelines, trending topics in real time, and search. Handle write amplification from celebrity accounts. "
                + "How do you compute trending topics in real time across billions of tweets? "
                + "How do you handle write amplification for accounts with tens of millions of followers?",
                DifficultyLevel.SENIOR,
                "distributed-systems", "caching", "databases", "real-time", "scalability", "search"));

        list.add(q("Design Google Maps / Navigation Service",
                "Design a navigation system — map tile rendering, route calculation (shortest path algorithms), "
                + "real-time traffic integration, ETA estimation, and point-of-interest search with geospatial indexing. "
                + "How do you partition geospatial data using QuadTree, Geohash, or S2 cells? "
                + "How do you incorporate real-time traffic data from millions of devices to update ETAs dynamically?",
                DifficultyLevel.SENIOR,
                "distributed-systems", "databases", "geospatial", "cdn", "real-time", "algorithms"));

        list.add(q("Design a Distributed Key-Value Store",
                "Design a distributed key-value store like DynamoDB with configurable consistency, replication, "
                + "partitioning, and failure handling. Discuss CAP theorem trade-offs. "
                + "How do you implement consistent hashing with virtual nodes for data partitioning? "
                + "How do you resolve conflicts with vector clocks in multi-leader replication?",
                DifficultyLevel.SENIOR,
                "storage", "partitioning", "replication", "consistency", "cap-theorem", "distributed-systems"));

        list.add(q("Design a Distributed Message Queue",
                "Design a distributed log-based message queue like Kafka — pub/sub, guaranteed delivery, "
                + "ordering, consumer groups, replay, and high throughput with partitioning and replication. "
                + "How do you guarantee ordering within a partition while maintaining throughput? "
                + "How do you handle consumer group rebalancing without message loss?",
                DifficultyLevel.SENIOR,
                "distributed-systems", "message-queues", "scalability", "consistency", "availability"));

        list.add(q("Design a Search Engine",
                "Design a large-scale web search engine — crawling, indexing (inverted index), ranking algorithms "
                + "(PageRank), query parsing, and serving results with low latency at massive scale. "
                + "How do you build and update the inverted index efficiently? "
                + "How do you rank results considering relevance, freshness, and authority?",
                DifficultyLevel.SENIOR,
                "distributed-systems", "indexing", "ranking", "storage", "caching", "search"));

        list.add(q("Design Netflix / Video Streaming Service",
                "Design a streaming service — content delivery with edge caching (Open Connect), personalized "
                + "recommendations, multi-device playback, DRM, and handling massive concurrent viewership. "
                + "How do you architect an Open Connect-style edge caching strategy? "
                + "How do you handle the thundering herd problem when a new show drops?",
                DifficultyLevel.SENIOR,
                "cdn", "distributed-systems", "caching", "scalability", "availability", "recommendations"));

        list.add(q("Design a Video Conferencing System",
                "Design a real-time multi-party video/audio platform like Zoom — low latency, SFU/MCU architecture, "
                + "screen sharing, recording, and global failover for reliability. "
                + "How do you optimize bandwidth with SFU vs MCU architecture? "
                + "How do you handle failover for active rooms when a server goes down?",
                DifficultyLevel.SENIOR,
                "real-time", "webrtc", "scalability", "networking", "streaming"));

        list.add(q("Design a Live Streaming Platform",
                "Design a live streaming system like Twitch — ingest live video, transcode, distribute to thousands "
                + "of concurrent viewers with sub-5-second latency, and integrate live chat alongside the stream. "
                + "How do you achieve low latency while supporting adaptive bitrate? "
                + "How do you scale live chat for channels with 100K+ concurrent viewers?",
                DifficultyLevel.SENIOR,
                "video-streaming", "cdn", "transcoding", "real-time", "chat"));

        list.add(q("Design a Stock Trading / Order Book System",
                "Design the core trading system for a platform like Robinhood — order placement, buy/sell matching "
                + "with price-time priority, real-time price updates, and regulatory audit trails. "
                + "How do you match buy and sell orders in real time with price-time priority? "
                + "How do you handle order surges during volatile market events without dropping any?",
                DifficultyLevel.SENIOR,
                "fintech", "order-matching", "low-latency", "consistency", "event-sourcing"));

        list.add(q("Design an Ad Targeting and Serving System",
                "Design a real-time ad serving platform — user targeting, auction-based bidding, click tracking, "
                + "fraud detection, and billing with exactly-once counting semantics. "
                + "How do you run ad auctions in under 100ms at global scale? "
                + "How do you detect and filter click fraud in real time?",
                DifficultyLevel.SENIOR,
                "distributed-systems", "real-time", "machine-learning", "streaming", "databases"));

        list.add(q("Design a Distributed Lock Manager",
                "Design a distributed coordination service like ZooKeeper — locks, leader election, "
                + "configuration management, and service discovery with strong consistency across network partitions. "
                + "How do you implement fencing tokens to prevent stale lock holders from corrupting data? "
                + "How does your system behave during a network partition — consistency or availability?",
                DifficultyLevel.SENIOR,
                "distributed-systems", "consistency", "coordination", "availability"));

        list.add(q("Design an Email Service",
                "Design an email system like Gmail — sending, receiving, inbox management, full-text search across "
                + "billions of emails, spam filtering, and attachments with reliable SMTP delivery. "
                + "How do you design storage for fast full-text search across billions of emails? "
                + "How do you implement spam detection at email ingestion speed?",
                DifficultyLevel.SENIOR,
                "distributed-systems", "storage", "search", "scalability", "notifications"));

        list.add(q("Design a Real-Time Analytics Pipeline",
                "Design a system that ingests billions of events per second, processes them in real time, "
                + "and serves aggregated results for dashboards and ad-hoc queries. "
                + "How do you handle late-arriving events in a streaming pipeline? "
                + "How do you ensure exactly-once processing semantics when nodes fail?",
                DifficultyLevel.SENIOR,
                "streaming", "distributed-systems", "databases", "aggregation", "real-time"));

        list.add(q("Design an Event Sourcing and CQRS System",
                "Design a system using event sourcing (storing all state changes as immutable events) with CQRS "
                + "(separate read and write models). Cover event stores, projections, and eventual consistency. "
                + "How do you rebuild read models from the event log after a schema change? "
                + "How do you handle schema evolution of events over time?",
                DifficultyLevel.SENIOR,
                "event-sourcing", "cqrs", "distributed-systems", "consistency", "databases"));
    }

    private static Question q(String title, String content, DifficultyLevel difficulty, String... tags) {
        return Question.builder()
                .title(title)
                .content(content)
                .category(QuestionCategory.SYSTEM_DESIGN)
                .difficulty(difficulty)
                .tags(List.of(tags))
                .build();
    }
}
