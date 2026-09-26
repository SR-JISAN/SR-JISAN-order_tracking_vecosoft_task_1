USING chatGpt
ai prompt: 
Act as an expert Senior Frontend Developer. I need you to write a clean, modern, and production-ready mobile Order Tracking Screen component for an e-commerce application using Next.js (App Router), Tailwind CSS, TypeScript, and shadcn/ui components (like Card, Button, Badge, Alert, etc.).

The screen must be fully responsive, tailored perfectly for mobile widths between 360px and 430px.

Here are the strict functional and UI requirements:

1. Information to Display:
- Clear visual delivery progress/timeline showing 4 states: Processing -> Shipped -> Out for Delivery -> Delivered.
- Current order status & Estimated delivery date/time.
- Order/product summary (items list, quantity, price) inside an expandable/collapsible shadcn component (Accordion or Card).
- Clear action buttons to contact support or report a delivery issue.
- Beautiful loading and empty/error states where relevant.
- Clean spacing, typography hierarchy, and visual consistency.

2. Mandatory Scenario Testing Panel:
Include a top switcher or tabs component (only for the examiner to toggle) that allows swapping the UI dynamically between these 3 specific edge-case scenarios using mockup state data:
- Scenario 1: Delayed Order — The estimated delivery time has passed or the order is significantly delayed. Clearly communicate the delay with an Alert and provide an appropriate next step.
- Scenario 2: Delivered but Not Received — The system shows 'Delivered', but the customer reports they did not receive it. Provide a prominent action button to "Dispute Delivery" or contact fraud/support.
- Scenario 3: Tracking Not Available Yet — The order exists, but tracking info is missing. Avoid an empty screen; instead, show a creative "Preparing your package" placeholder/empty state.

3. Coding Style:
- Use TypeScript with proper interfaces for Order data and Scenario states.
- Use Lucide React icons for the timeline and status indicators.
- Structure everything into a self-contained component or clean modular files that I can easily paste into my Next.js project.
- Ensure the main content card has a max-width of [420px] and centers nicely on the screen to simulate a real mobile app.

Please provide the full source code with mock data.