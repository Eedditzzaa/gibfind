\# Gibfind — Gibwork Bounty Matcher



Gibfind is a command-line tool that helps users discover Gibwork bounties that match their own preferences.



Instead of manually checking every available bounty, users define filters such as:



\- Category

\- Minimum payment

\- Skills

\- Maximum deadline

\- Keywords



Gibfind fetches available bounties using the Gibwork SDK, applies the user's matching rules, and can continuously monitor for new matching bounties.



When a new match is detected, Gibfind can send an email notification.



\---



\## Why Gibfind?



Gibwork can have multiple bounties available at different times.



A user may only be interested in specific types of work, payment ranges, skills, or keywords.



Gibfind reduces this manual filtering process by automatically checking available bounties and notifying the user when a relevant one appears.



\---



\## Core Workflow



```text

Gibwork

&#x20;  │

&#x20;  ▼

Gibwork SDK

&#x20;  │

&#x20;  ▼

Bounty Fetcher

&#x20;  │

&#x20;  ▼

Preference Matcher

&#x20;  │

&#x20;  ├── No match ──► Ignore

&#x20;  │

&#x20;  └── Match

&#x20;       │

&#x20;       ▼

&#x20;  Duplicate Check

&#x20;       │

&#x20;       ▼

&#x20;  Notification

&#x20;       │

&#x20;       ▼

&#x20;     Gmail

