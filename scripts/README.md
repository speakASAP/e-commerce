# Management Scripts

Helper scripts for managing the FlipFlop.cz e-commerce platform.

## Available Scripts

### start-all.sh

Starts all microservices (main platform + notification + logging services).

```bash
./scripts/start-all.sh
```

This script:

- Checks Docker is running
- Creates nginx-network if needed
- Starts logging service first
- Starts notification service
- Starts all main platform services
- Performs health checks on all services

### stop-all.sh

Stops all microservices.

```bash
./scripts/stop-all.sh
```

### restart-service.sh

Restarts a specific service.

```bash
./scripts/restart-service.sh [service-name]
```

**Available services:**

- `api-gateway`
- `user-service`
- `product-service`
- `order-service`
- `supplier-service`
- `ai-service`
- `analytics-service`
- `frontend`
- `notification-service` (external)
- `logging-service` (external)

**Example:**

```bash
./scripts/restart-service.sh order-service
./scripts/restart-service.sh notification-service
```

### view-logs.sh

View logs for a service or all services.

```bash
./scripts/view-logs.sh [service-name] [--follow]
```

**Options:**

- `--follow` - Follow logs in real-time (like `tail -f`)

**Examples:**

```bash
# View order service logs
./scripts/view-logs.sh order-service

# Follow order service logs
./scripts/view-logs.sh order-service --follow

# View all service logs
./scripts/view-logs.sh all --follow
```

### health-check.sh

Check the health of all services.

```bash
./scripts/health-check.sh
```

This script checks all service health endpoints and reports their status.

## Usage Examples

### Starting the Platform

```bash
# Start everything
./scripts/start-all.sh

# Check health
./scripts/health-check.sh

# View logs
./scripts/view-logs.sh all --follow
```

### Restarting a Service

```bash
# Restart order service after code changes
./scripts/restart-service.sh order-service

# View logs to verify
./scripts/view-logs.sh order-service --follow
```

### Debugging

```bash
# Check if all services are healthy
./scripts/health-check.sh

# View logs for a specific service
./scripts/view-logs.sh order-service --follow

# Restart a problematic service
./scripts/restart-service.sh order-service
```

## Notes

- All scripts require Docker to be running
- Scripts automatically handle external services (notification, logging)
- Health checks may take a few seconds after starting services
- Use `--follow` flag to monitor logs in real-time
