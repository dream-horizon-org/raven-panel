#!/bin/bash
set -e

echo "🧪 Testing Docker Build Locally"
echo "================================"

# Build
echo "📦 Building Docker image..."
docker build -t raven-panel:local . || {
    echo "❌ Build failed!"
    exit 1
}
echo "✅ Build successful!"

# Run
echo "🚀 Starting container..."
docker run -d \
  --name raven-panel-test \
  -p 3000:3000 \
  -e NODE_ENV=production \
  raven-panel:local || {
    echo "❌ Failed to start container!"
    exit 1
}

# Wait
echo "⏳ Waiting for app to start..."
sleep 5

# Check status
if ! docker ps | grep -q raven-panel-test; then
    echo "❌ Container is not running!"
    docker logs raven-panel-test
    docker rm raven-panel-test
    exit 1
fi
echo "✅ Container is running!"

# Test health
echo "🏥 Testing health check..."
HEALTH=$(curl -s http://localhost:3000/healthcheck.txt || echo "FAILED")
if [ "$HEALTH" = "OK" ] || [ "$HEALTH" = "raven-panel is online and healthy." ]; then
    echo "✅ Health check passed!"
else
    echo "❌ Health check failed! Got: $HEALTH"
    docker logs raven-panel-test
    docker stop raven-panel-test
    docker rm raven-panel-test
    exit 1
fi

# Test main page
echo "🌐 Testing main page..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 || echo "000")
if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "302" ] || [ "$HTTP_CODE" = "307" ]; then
    echo "✅ Main page accessible! (HTTP $HTTP_CODE)"
else
    echo "⚠️  Main page returned HTTP $HTTP_CODE"
fi

echo ""
echo "✅ All local tests passed!"
echo ""
echo "To clean up, run:"
echo "  docker stop raven-panel-test"
echo "  docker rm raven-panel-test"

