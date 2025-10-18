# MoysterCard Fare Calculation Engine

A TypeScript-based fare calculation engine for the MoysterCard metro system

## Overview

> For people who lives in Londinium.

This project implements a comprehensive fare calculation engine for the MoysterCard metro system. It computes journey fares based on zones, peak/off-peak hours, and daily/weekly fare capping rules.


## Features

- **Compute fares by zone**: Supports 1-1, 1-2, 2-1, and 2-2 journeys
- **Apply peak/off-peak pricing**: Different rates for weekday and weekend hours
- **Apply daily capping**: Automatically enforces per-day fare limits
- **Apply weekly capping**: Progressive Monday–Sunday capping logic
- **Fully type-safe**: Uses TypeScript strict mode
- **Comprehensively tested**: High Jest coverage with edge case validation


## Installation & Setup

```bash
# Install dependencies
npm install

# Run tests
npm test

# Lint and prettier code
npm run lint:fix  
```

## Fare Rules

### Peak Hours

All times are in **UTC** with **inclusive boundaries**.

#### Weekdays (Monday-Friday)
- Morning: 07:00 - 10:30 UTC
- Evening: 17:00 - 20:00 UTC

#### Weekends (Saturday-Sunday)
- Morning: 09:00 - 11:00 UTC
- Evening: 18:00 - 22:00 UTC

### Fare Table

| Zone | Peak | Off-Peak |
|------|------|----------|
| 1-1  | 30   | 25       |
| 1-2  | 35   | 30       |
| 2-1  | 35   | 30       |
| 2-2  | 25   | 20       |

### Cap Table

| Zone | Daily | Weekly |
|------|-------|--------|
| 1-1  | 100   | 500    |
| 1-2  | 120   | 600    |
| 2-1  | 120   | 600    |
| 2-2  | 80    | 400    |


## Design Choices & Assumptions

### Architectural Decisions

1. **Separation of Concerns** — Core logic, types, and utilities are organized into distinct modules.  
2. **Single Responsibility** —  
   - `FareRules`: encapsulates fare tables and peak-hour logic  
   - `Journey`: represents immutable journey data  
   - `FareCalculator`: coordinates daily and weekly fare calculations  
3. **Immutability** — Each `Journey` instance is read-only after creation.  
4. **Type Safety** — All modules use TypeScript strict mode with clear interfaces.  
5. **Dependency Injection** — `FareRules` can be injected for configurability and testing.  

### Technical Assumptions

- **UTC Timezone**: All datetime operations use UTC
- **ISO Week**: Weekly periods follow ISO week (Monday-Sunday)
- **Inclusive Boundaries**: Peak hour ranges include both start and end times
- **Progressive Capping**: Weekly caps apply progressively across sorted days


## Testing

Test suites cover:
- ✅ Peak hour detection (weekday/weekend, boundaries)
- ✅ Fare calculation (all zone combinations, peak/off-peak)
- ✅ Daily capping (single/multiple zones)
- ✅ Weekly capping (progressive, multi-zone)
- ✅ Single-week and multi-week scenarios
- ✅ Edge cases (empty inputs, invalid data)


## Example

```typescript
import { FareCalculator } from './core/FareCalculator';
import { JourneyInput } from './types/JourneyInput';

const journeys: JourneyInput[] = [
  { datetime: '2025-10-13T10:20:00Z', fromZone: 2, toZone: 1 },
  { datetime: '2025-10-13T18:15:00Z', fromZone: 1, toZone: 2 },
];

const calculator = new FareCalculator();
console.log(calculator.calculate(journeys)); // 120 (daily cap)
```

## Tech Stack

- **TypeScript**
- **Jest**
- **ESLint**
- **Prettier** 
- **Day.js**
