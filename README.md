# MoysterCard Fare Calculation Engine

> A TypeScript-based fare calculation engine for the MoysterCard metro system

## Overview

>> For people who live in Londinium.

This project implements a comprehensive fare calculation engine for the MoysterCard metro system. It computes journey fares based on zones, peak/off-peak hours, and daily/weekly fare capping rules.


## Fare Rules

### Peak Hours

All times are in **UTC** with **inclusive boundaries**.

#### Weekdays (Monday-Friday)
- Morning: 07:00 - 10:30 UTC
- Evening: 17:00 - 20:00 UTC

#### Weekends (Saturday-Sunday)
- Morning: 09:00 - 11:00 UTC
- Evening: 18:00 - 22:00 UTC



## Tech

- Typescript
- Jest
- dayjs