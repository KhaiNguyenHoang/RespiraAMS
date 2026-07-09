# RespiraAMS frontend

## How to setup

1. Create .env in the root directory and add the following variables:

```bash
GATEWAY_URL=https://gateway # Fix
LOG_LEVEL=debug # Depend on your needs
```

2. Run project with Aspire:

```bash
aspire run
```

3. Open your browser and go to http://localhost:3000 (**You must use the local link, don't use the Aspire link provided in the dashboard, since run dev server use HMR (internally use WebSocket), and Aspire didn't support forwarding WebSocket**). With the
local link, you can use HMR (hot reload) to see your changes in real time, just like running in the local, standalone project.