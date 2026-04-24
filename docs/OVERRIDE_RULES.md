# Checkout OS: Rules of Engagement for Manual Overrides

To maintain the long-term health and stability of the self-optimizing match engine, the following rules must be strictly adhered to when using manual overrides.

## 1. Trigger Conditions
Manual overrides should **ONLY** be used when:
- The **Health Monitor** triggers a warning or critical status for a specific metric.
- OR you are testing a specific, documented hypothesis for platform growth.

## 2. Anti-Patterns (NEVER Override for)
- Personal aesthetic preference or gut feeling.
- One-off feedback from a single user.
- Minor daily performance fluctuations (Wait for the 7-day trend).

## 3. The Single-Variable Rule
You must **ONLY** adjust one factor at a time (e.g., `intent` OR `expertise` OR `recency`). 
- **Reasoning**: Changing multiple variables simultaneously makes it impossible to attribute performance shifts to a specific cause.
- **System Enforcement**: The `setWeights` API will reject any attempt to change multiple variables at once.

## 4. Duration & Cooling Period
- **Default Duration**: 24 hours.
- **Maximum Duration**: 48 hours.
- **Cooling Period**: After an override expires, the system **MUST** run on automated tuning for at least 24 hours before another override can be applied.

## 5. Documentation Requirements
Every override command requires:
- **Reason**: Why is this change being made? (e.g., "Feed CTR dropped 12% below 7-day average").
- **Expected Outcome**: What is the target improvement? (e.g., "Restore CTR to >10%").

## 6. Priority Modes Usage
- **Growth Mode**: Use only during early node expansion to maximize visibility.
- **Precision Mode**: Use only when connection success rates are critically low (<20%).
- **Normal Mode**: The default state. Revert to this as soon as targets are met.

## 7. Fallback Protocol
If any system metric degrades further after a manual override is applied:
- **Immediately** run `resetToBaseline()` to restore safe system defaults.

---
*Checkout Operating System | Automated Intelligence & Guided Direction*
