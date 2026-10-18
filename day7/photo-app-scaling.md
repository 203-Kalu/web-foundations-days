# SnapShare System Scaling Plan

Markdown
# SnapShare System Scaling Plan

This document details the capacity estimations, system architecture, component roles, data flows, and trade-offs for SnapShare, a photo-sharing platform.

---

## 1. Assumptions & Calculations

### Core Assumptions
- Total registered users: 10,000,000
- Daily Active Users (DAU): 10% of total registered users
- Photos uploaded per DAU: 1 photo/day
- Feed pages viewed per DAU: 50 feed pages/day
- Average original photo size: 2 MB
- Average thumbnail photo size: 50 KB (0.05 MB)
- Seconds in a day: 86,400 seconds
- Peak traffic multiplier: 5× average load

### Daily Active Users (DAU)
$$\text{DAU} = 10,000,000 \times 0.10 = 1,000,000 \text{ active users/day}$$

### Traffic Metrics

1. **Uploads Per Second**
   - **Daily Uploads:** $1,000,000 \times 1 = 1,000,000 \text{ uploads/day}$
   - **Average Uploads/Sec:** $\frac{1,000,000}{86,400} \approx 11.57 \text{ uploads/sec}$
   - **Peak Uploads/Sec (5×):** $11.57 \times 5 \approx 57.87 \text{ uploads/sec}$

2. **Feed Views Per Second**
   - **Daily Feed Views:** $1,000,000 \times 50 = 50,000,000 \text{ views/day}$
   - **Average Feed Views/Sec:** $\frac{50,000,000}{86,400} \approx 578.70 \text{ views/sec}$
   - **Peak Feed Views/Sec (5×):** $578.70 \times 5 \approx 2,893.52 \text{ views/sec}$

### Storage Metrics Per Year
- **Storage per upload:** $2\text{ MB (original)} + 0.05\text{ MB (thumbnail)} = 2.05\text{ MB/photo}$
- **Daily Storage:** $1,000,000 \text{ uploads} \times 2.05\text{ MB} = 2,050,000\text{ MB/day} \approx 2.05\text{ TB/day}$
- **Annual Storage (365 days):** $2.05\text{ TB/day} \times 365 \approx 748.25\text{ TB/year}$

---

## 2. Workload Characteristics: Read-Heavy vs. Write-Heavy

SnapShare is **read-heavy**. 

With 50,000,000 feed views per day compared to 1,000,000 photo uploads per day, the system processes a **50:1 read-to-write ratio**. 

### Architectural Implications
1. **Aggressive Caching:** Frequently accessed feeds, metadata, and user relationship graphs must be cached in memory (e.g., Redis) to bypass primary database hits.
2. **Database Read Replication:** Read requests must be routed to secondary database replicas to preserve primary database write capacity.
3. **CDN Offloading:** Static image files and thumbnails must be cached at edge locations close to users to relieve application servers and object storage bandwidth.

---

## 3. Media Storage Rationale: Database vs. Object Storage

Binary photo data (BLOBs) should **never** be stored directly inside a relational database.

- **Why DB storage fails:** Storing raw images in relational databases increases database file sizes exponentially, degrades indexing efficiency, causes high memory consumption during backups, and drastically increases hosting costs.
- **Where photos belong:** Original photos and thumbnails should be stored in dedicated **Object Storage** (e.g., Amazon S3, MinIO). The relational database stores only the lightweight string URLs pointing to those object storage locations.

---

## 4. Architecture Diagram
[ User Clients (Mobile App / Web) ]
|
v
[ Content Delivery Network (CDN) ]
|
v
[ Load Balancer (Nginx / ALB) ]
|
v
[ App Servers (Node.js / Express) ]
/         |             \

/          |              \

v           v               v          v
[ In-Memory Cache ] [ Primary DB ] [ Read Replicas ] [ Message Queue ]
(Redis Feed)      (Writes)       (Feed Reads)      (RabbitMQ/SQS)
|
v
[ Worker Servers ]
(Thumbnail Gen)
|
v
[ Object Storage ]
(S3 Buckets)



---

## 5. Component Explanations

- **CDN (Content Delivery Network):** Caches photos and static assets geographically close to users to minimize latency and offload server traffic.
- **Load Balancer:** Distributes incoming HTTP traffic evenly across app servers to maintain high availability and prevent single-point bottlenecks.
- **App Servers:** Executes core application business logic, manages authentication, processes feed generation, and communicates with database and caching layers.
- **In-Memory Cache (Redis):** Stores pre-computed user feeds and session metadata in RAM for ultra-low latency read responses.
- **Primary Database (Relational SQL):** Handles write transactions for core structured data, including user accounts, post records, and follower relationships.
- **Database Read Replica:** Handles read-only database queries to distribute read pressure away from the primary database instance.
- **Object Storage (Cloud Storage / S3):** Provides scalable, cost-effective storage for raw image files and thumbnail media assets.
- **Message Queue (RabbitMQ / SQS):** Holds background task notifications asynchronously to decouple instant API requests from heavy processing pipelines.
- **Background Worker:** Consumes background queue tasks to asynchronously process, resize, and store photo thumbnails.

---

## 6. Step-by-Step Photo Upload Flow

1. **Upload Request:** The client app sends an HTTP `POST` request containing the original photo file and metadata to the Load Balancer, which routes it to an active App Server.
2. **Direct Media Save:** The App Server uploads the raw original photo file directly to Object Storage and receives a persistent file URL back.
3. **Metadata Write:** The App Server writes the post record (User ID, photo URL, timestamp) into the Primary Database.
4. **Queue Task Dispatch:** The App Server pushes a background job event (`generate_thumbnail`) containing the photo ID and file URL onto the Message Queue.
5. **Immediate Client Response:** The App Server responds to the user client with `201 Created`, providing immediate feedback without waiting for thumbnail generation.
6. **Async Thumbnail Processing:** A Background Worker pulls the job from the Message Queue, downloads the original image from Object Storage, generates the 50 KB thumbnail, saves the thumbnail back to Object Storage, and updates the post record in the Database with the thumbnail URL.

---

## 7. Architectural Trade-offs

### Trade-off 1: Asynchronous Processing vs. Instant Thumbnail Availability
- **Choice:** Generating thumbnails asynchronously via a Message Queue and Workers rather than synchronously inside the upload API endpoint.
- **Trade-off:** The user receives a faster upload confirmation response, but there is a slight delay (eventual consistency) before the thumbnail appears in the global feed.

### Trade-off 2: Cache Pre-computation (Fan-out on Write) vs. Query Computation (Fan-out on Read)
- **Choice:** Pre-computing and caching user feeds in Redis when a photo is uploaded.
- **Trade-off:** Fast $O(1)$ read response times for 50,000,000 daily feed views, at the expense of higher write overhead and storage consumption in Redis when users with large follower counts upload a photo.
Step 2: Push to GitHub from Termux
Once saved in Acode, switch to Termux, verify your directory, stage, commit, and push:


