match kar - [x] Import ProviderHome in App.jsx
- [x] Add protected route for '/provider-landing' rendering ProviderHome

# UI Color Changes

- [x] Update Frontend/tailwind.config.js: Extend theme.colors with new vibrant options (e.g., success green, warning yellow, info teal).

- [x] Update Frontend/src/pages/Portal.jsx: Apply new colors to backgrounds (gradients), buttons (primary/secondary), text accents.

- [x] Update Frontend/src/pages/ServiceCard.jsx: Apply new colors to badges, buttons, and features.

- [x] Test: Run dev server and verify colorful UI in browser.

# Add General Feedback Button

- [ ] Modify BACKEND/models/feedback.model.js: Make bookingId and providerId optional.
- [ ] Modify BACKEND/controllers/feedback.controller.js: Handle general feedback when bookingId is null.
- [ ] Modify Frontend/src/pages/DashboardContent.jsx: Add a feedback button in the welcome section and update the modal and submit logic for general feedback.
- [ ] Test the feedback submission.
- [ ] Run the application to verify the button works.
