.PHONY: help install dev build build-lib build-storybook preview lint lint-fix format test test-unit clean

help: ## Show this help
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	yarn

dev: ## Start Storybook dev server (port 6006)
	yarn storybook

build: build-lib build-storybook ## Build library and Storybook

build-lib: ## Build the component library (ES module)
	yarn build:lib

build-storybook: ## Build Storybook static site
	yarn build:storybook

preview: ## Preview the built Storybook site
	npx http-server storybook-static -p 6006

lint: ## Run ESLint across all files
	yarn lint

lint-fix: ## Run ESLint with auto-fix
	yarn lint:fix

format: ## Format code with Prettier
	yarn format

test: ## Run all tests in watch mode
	yarn test

test-unit: ## Run all tests once
	yarn test:unit

clean: ## Remove build artifacts and node_modules
	rm -rf node_modules dist storybook-static
