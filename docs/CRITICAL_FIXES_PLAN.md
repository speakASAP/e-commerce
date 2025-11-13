# Critical Fixes Execution Plan

## Overview

This plan addresses the critical issues identified in IMPLEMENTATION_PLAN_ANALYSIS.md.

## Critical Fix 1: Container Name References

### 1.1 Fix Notification Service Container Name

**Files to update:**

- `docs/ENVIRONMENT_VARIABLES.md` - Change `notification-service` to `notification-microservice`
- `docs/INTEGRATION_GUIDE.md` - Change `notification-service` to `notification-microservice`
- Verify all code uses `NOTIFICATION_SERVICE_URL` environment variable

### 1.2 Fix Logging Service Container Name

**Files to update:**

- `docs/ENVIRONMENT_VARIABLES.md` - Change `logging-service` to `logging-microservice` where inconsistent
- Verify logger code uses correct container name

## Critical Fix 2: Notification Service Integration

### 2.1 Create Notification Client Module

**File to create:**

- `shared/notifications/notification.module.ts` - NestJS module for notification service
- `shared/notifications/notification.service.ts` - Service to call notification-microservice
- `shared/notifications/notification.interface.ts` - TypeScript interfaces

### 2.2 Integrate in Order Service

**Files to update:**

- `services/order-service/src/orders/orders.service.ts` - Add notification calls
- `services/order-service/src/orders/orders.module.ts` - Import NotificationModule
- `services/order-service/src/payu/payu.service.ts` - Add payment confirmation notification
- `services/order-service/src/payu/payu.module.ts` - Import NotificationModule

### 2.3 Add Environment Variables

**File to update:**

- `docs/ENVIRONMENT_VARIABLES.md` - Add NOTIFICATION_SERVICE_URL to order-service section
- `.env.example` - Add NOTIFICATION_SERVICE_URL if missing

## Critical Fix 3: Standardize Service URLs

### 3.1 Update Environment Variables Documentation

**File to update:**

- `docs/ENVIRONMENT_VARIABLES.md` - Standardize all service URL references

### 3.2 Verify Code Uses Environment Variables

**Files to check:**

- All service files that reference notification or logging services
- Ensure no hardcoded URLs

## Implementation Checklist

1. [x] Update docs/ENVIRONMENT_VARIABLES.md - Fix notification-service references
2. [x] Update docs/ENVIRONMENT_VARIABLES.md - Fix logging-service references  
3. [x] Update docs/INTEGRATION_GUIDE.md - Fix notification-service references
4. [x] Create shared/notifications/notification.interface.ts
5. [x] Create shared/notifications/notification.service.ts
6. [x] Create shared/notifications/notification.module.ts
7. [x] Update shared/index.ts to export notification module
8. [x] Update services/order-service/src/orders/orders.module.ts
9. [x] Update services/order-service/src/orders/orders.service.ts - Add notification on order create
10. [x] Update services/order-service/src/payu/payu.module.ts
11. [x] Update services/order-service/src/payu/payu.service.ts - Add notification on payment verify (via orders.service.updatePaymentStatus)
12. [x] Update docs/ENVIRONMENT_VARIABLES.md with NOTIFICATION_SERVICE_URL for order-service
13. [x] Verify all code uses environment variables (no hardcoded URLs)
14. [x] Fix import path inconsistencies in orders.service.ts

## ✅ Status: ALL CRITICAL FIXES COMPLETED

See `CRITICAL_FIXES_COMPLETION.md` for detailed completion summary.
