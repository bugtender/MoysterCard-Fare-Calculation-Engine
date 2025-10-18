# MoysterCard Fare Calculation Engine

> A TypeScript-based fare calculation engine for the MoysterCard metro system

## Overview

>> For people who live in Londinium.

This project implements a comprehensive fare calculation engine for the MoysterCard metro system. It computes journey fares based on zones, peak/off-peak hours, and daily/weekly fare capping rules.


## Features

- **Zone-based pricing**: Support for multiple zone combinations (1-1, 1-2, 2-1, 2-2)
- **Peak/off-peak rates**: Different pricing for weekday and weekend peak hours
- **Daily fare capping**: Automatic application of daily spending limits
- **Type-safe**: Full TypeScript strict mode compliance
- **Well-tested**: Comprehensive test coverage with Jest


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


## Tech Stack

- **TypeScript**
- **Jest**
- **ESLint**
- **Prettier** 
- **Day.js**
