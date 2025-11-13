# Contributing to FlipFlop.cz

Thank you for your interest in contributing to the FlipFlop.cz e-commerce platform!

## Getting Started

### Prerequisites

- Node.js 20+
- Docker and Docker Compose
- PostgreSQL
- Git

### Development Setup

1. **Clone the repository**

   ```bash
   git clone git@github.com:speakASAP/e-commerce.git
   cd e-commerce
   ```

2. **Set up environment**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start services**

   ```bash
   ./scripts/start-all.sh
   ```

4. **Verify setup**

   ```bash
   ./scripts/health-check.sh
   ```

## Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Changes

- Write clean, readable code
- Follow existing code style
- Add comments where needed
- Update documentation

### 3. Test Your Changes

```bash
# Run linter
npm run lint

# Test your service
./scripts/restart-service.sh [service-name]
./scripts/view-logs.sh [service-name] --follow
```

### 4. Commit Changes

```bash
git add .
git commit -m "feat: add your feature description"
```

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

## Code Style

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow NestJS conventions
- Use async/await for async operations
- Handle errors properly
- Add type annotations

### Naming Conventions

- **Files**: kebab-case (e.g., `user-service.ts`)
- **Classes**: PascalCase (e.g., `UserService`)
- **Functions/Variables**: camelCase (e.g., `getUserProfile`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_RETRY_COUNT`)

### Code Structure

```typescript
// 1. Imports
import { ... } from '...';

// 2. Class definition
@Injectable()
export class ServiceName {
  // 3. Constructor
  constructor(...) {}

  // 4. Public methods
  public method() {}

  // 5. Private methods
  private helper() {}
}
```

## Documentation

### Code Comments

- Document complex logic
- Explain business rules
- Add JSDoc for public methods

### Documentation Updates

- Update relevant docs when adding features
- Keep API documentation current
- Update examples if needed

## Testing

### Writing Tests

- Write unit tests for services
- Write integration tests for APIs
- Test error cases
- Test edge cases

### Running Tests

```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e
```

## Pull Request Process

### Before Submitting

- [ ] Code follows style guidelines
- [ ] Tests pass
- [ ] Documentation updated
- [ ] No linting errors
- [ ] Changes tested locally

### PR Description

Include:

- What changes were made
- Why changes were made
- How to test
- Screenshots (if UI changes)

### Review Process

1. Code review by maintainers
2. Address feedback
3. Approval and merge

## Project Structure

### Backend Services

```text
services/
├── [service-name]/
│   ├── src/
│   │   ├── [feature]/
│   │   │   ├── [feature].controller.ts
│   │   │   ├── [feature].service.ts
│   │   │   ├── [feature].module.ts
│   │   │   └── dto/
│   │   └── main.ts
│   └── package.json
```

### Frontend

```text
services/frontend/
├── app/              # Pages
├── components/       # React components
├── lib/             # Utilities
└── contexts/        # React contexts
```

## Areas for Contribution

### High Priority

- Automated testing
- Image handling
- Performance optimization
- Security improvements

### Medium Priority

- New features (see Roadmap)
- Documentation improvements
- Bug fixes
- UI/UX enhancements

### Low Priority

- Code refactoring
- Optimization
- Tooling improvements

## Questions?

- Check documentation in `/docs`
- Review existing code
- Ask in issues or discussions

## Code of Conduct

- Be respectful
- Be constructive
- Be collaborative
- Follow best practices

Thank you for contributing! 🎉
