#!/bin/bash

# Easy-CV Deployment Script
# This script handles the deployment of the Easy-CV application

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="easy-cv"
DOCKER_IMAGE_NAME="${PROJECT_NAME}:latest"
DOCKER_CONTAINER_NAME="${PROJECT_NAME}-app"

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_dependencies() {
    log_info "Checking dependencies..."

    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker first."
        exit 1
    fi

    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        log_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi

    log_success "Dependencies check passed"
}

build_application() {
    log_info "Building application..."

    # Build Docker image
    docker build -t $DOCKER_IMAGE_NAME .

    if [ $? -eq 0 ]; then
        log_success "Application built successfully"
    else
        log_error "Failed to build application"
        exit 1
    fi
}

deploy_with_docker_compose() {
    log_info "Deploying with Docker Compose..."

    # Check if docker-compose command exists, otherwise use docker compose
    if command -v docker-compose &> /dev/null; then
        COMPOSE_CMD="docker-compose"
    else
        COMPOSE_CMD="docker compose"
    fi

    # Stop existing containers
    log_info "Stopping existing containers..."
    $COMPOSE_CMD down || true

    # Start services
    log_info "Starting services..."
    $COMPOSE_CMD up -d

    if [ $? -eq 0 ]; then
        log_success "Application deployed successfully"
        log_info "Application is running on:"
        log_info "  - API: http://localhost:5000"
        log_info "  - Health Check: http://localhost:5000/health"
    else
        log_error "Failed to deploy application"
        exit 1
    fi
}

deploy_with_docker() {
    log_info "Deploying with Docker..."

    # Stop existing container
    docker stop $DOCKER_CONTAINER_NAME 2>/dev/null || true
    docker rm $DOCKER_CONTAINER_NAME 2>/dev/null || true

    # Run new container
    docker run -d \
        --name $DOCKER_CONTAINER_NAME \
        -p 5000:5000 \
        --restart unless-stopped \
        --env-file .env.production \
        $DOCKER_IMAGE_NAME

    if [ $? -eq 0 ]; then
        log_success "Application deployed successfully"
        log_info "Application is running on:"
        log_info "  - API: http://localhost:5000"
        log_info "  - Health Check: http://localhost:5000/health"
    else
        log_error "Failed to deploy application"
        exit 1
    fi
}

check_health() {
    log_info "Checking application health..."

    # Wait for application to start
    sleep 10

    # Check health endpoint
    max_attempts=30
    attempt=1

    while [ $attempt -le $max_attempts ]; do
        if curl -f http://localhost:5000/health &>/dev/null; then
            log_success "Application is healthy"
            return 0
        fi

        log_info "Waiting for application to be healthy (attempt $attempt/$max_attempts)..."
        sleep 5
        ((attempt++))
    done

    log_error "Application failed health check"
    return 1
}

cleanup_old_images() {
    log_info "Cleaning up old Docker images..."

    # Remove dangling images
    docker image prune -f

    # Remove images older than 30 days (optional)
    # docker image prune -a --filter "until=720h" -f

    log_success "Cleanup completed"
}

show_logs() {
    log_info "Showing application logs..."
    echo ""
    echo "Press Ctrl+C to stop viewing logs"
    echo ""

    if command -v docker-compose &> /dev/null; then
        docker-compose logs -f $DOCKER_CONTAINER_NAME
    else
        docker compose logs -f $DOCKER_CONTAINER_NAME
    fi
}

show_usage() {
    echo "Easy-CV Deployment Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  deploy          Deploy the application (default)"
    echo "  build           Build the Docker image only"
    echo "  start           Start the application"
    echo "  stop            Stop the application"
    echo "  restart         Restart the application"
    echo "  logs            Show application logs"
    echo "  cleanup         Clean up old Docker images"
    echo "  health          Check application health"
    echo "  help            Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 deploy       # Deploy the application"
    echo "  $0 logs         # Show logs"
    echo "  $0 restart      # Restart the application"
}

# Main script logic
case "${1:-deploy}" in
    "deploy")
        log_info "Starting Easy-CV deployment..."
        check_dependencies
        build_application
        deploy_with_docker_compose
        check_health
        cleanup_old_images
        log_success "Deployment completed successfully!"
        ;;
    "build")
        check_dependencies
        build_application
        ;;
    "start")
        deploy_with_docker_compose
        ;;
    "stop")
        log_info "Stopping application..."
        if command -v docker-compose &> /dev/null; then
            docker-compose down
        else
            docker compose down
        fi
        log_success "Application stopped"
        ;;
    "restart")
        log_info "Restarting application..."
        if command -v docker-compose &> /dev/null; then
            docker-compose restart
        else
            docker compose restart
        fi
        check_health
        log_success "Application restarted"
        ;;
    "logs")
        show_logs
        ;;
    "cleanup")
        cleanup_old_images
        ;;
    "health")
        check_health
        ;;
    "help"|"-h"|"--help")
        show_usage
        ;;
    *)
        log_error "Unknown command: $1"
        echo ""
        show_usage
        exit 1
        ;;
esac