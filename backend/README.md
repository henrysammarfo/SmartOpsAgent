# SmartOpsAgent Backend

AI-powered DevOps monitoring backend with real-time data streaming.

## Quick Start

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Copy `.env.example` to `.env` and fill in your credentials:
\`\`\`bash
cp .env.example .env
\`\`\`

3. Run in development mode:
\`\`\`bash
npm run dev
\`\`\`

4. Build for production:
\`\`\`bash
npm run build
npm start
\`\`\`

## Docker Deployment

\`\`\`bash
docker-compose up -d
\`\`\`

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/aws/services` - AWS service status
- `GET /api/aws/metrics` - CloudWatch metrics
- `GET /api/github/deployments` - GitHub workflow runs
- `GET /api/github/pipeline` - Latest pipeline status
- `GET /api/github/logs/:runId` - Workflow logs
- `GET /api/web3/networks` - All Web3 networks
- `GET /api/web3/ethereum` - Ethereum metrics
- `GET /api/web3/polygon` - Polygon metrics

## WebSocket Events

Connect to `ws://localhost:3002`

Events emitted:
- `aws-services` - AWS service updates
- `deployments` - GitHub deployment updates
- `pipeline` - Pipeline status updates
- `web3-networks` - Web3 network updates
