# Example: Browser Launch Audit

Project: TaskFlow Dashboard (AI-generated Next.js app)

## Launch Verdict

Not ready. The main dashboard renders but two of four core interactions are non-functional, mobile layout breaks below 400px, and the console shows a hydration mismatch on every page load.

## Tested

- URL: http://localhost:3000
- Browser: Chrome 125, macOS
- Widths: 1440px (desktop), 768px (tablet), 390px (mobile)
- Main flows: Login → Dashboard → Create Task → Edit Task → Delete Task

## Critical Findings

- **P0: "Create Task" button opens an empty modal with no form.** The modal container renders but the form component inside returns null. The agent created `TaskForm.tsx` but never imported it into `CreateTaskModal.tsx`. A user clicking the primary CTA sees a blank white box with a close button.

- **P0: Hydration mismatch on every page load.** Console shows `Warning: Text content did not match. Server: "0 tasks" Client: "Loading..."`. The task count component renders server-side with a default value but the client replaces it immediately. This causes a visible flash and breaks React's hydration contract.

- **P1: Delete confirmation dialog says "Are you sure?" but the Cancel button does nothing.** The `onClick` handler references `onClose` which is not passed as a prop. Clicking Cancel does nothing; users must click outside the dialog or press Escape. This damages trust in every destructive action.

- **P1: Mobile layout breaks below 400px.** The sidebar navigation overlaps the main content area. The hamburger menu icon is present but does not toggle the sidebar — the click handler logs to console but never updates state.

- **P2: "Edit Task" saves successfully but does not refresh the task list.** The API call returns 200 and the toast notification says "Task updated" but the list still shows the old title until the user manually refreshes. The mutation hook does not invalidate the query cache.

- **P2: Dark mode toggle in settings switches the theme but the chart colors remain light-mode.** The bar chart uses hardcoded hex values instead of CSS custom properties, so it stays white-on-light-gray in dark mode.

## Browser Health

- **Console:** 1 hydration warning (every load), 2 React key warnings in task list, 1 failed source map request.
- **Network:** All API calls succeed (200). No CORS issues. Auth token refreshes correctly.
- **Rendering:** First paint at 1.2s, largest contentful paint at 2.4s. No blank screens. Font loads with visible swap.

## UX Trust Gaps

- **Ghost CTA.** The most prominent button on the page (Create Task) leads to a blank modal. A first-time user will assume the app is broken.
- **Unresponsive Cancel.** Users who hesitate before deleting a task cannot back out via the obvious path.
- **No empty state.** A new user with zero tasks sees a blank table with column headers and no guidance. There is no illustration, message, or onboarding prompt.
- **Footer says "Built with AI" but links to a 404.** The "Learn more" link in the footer points to `/about` which returns the Next.js default 404 page.

## Fix Plan

1. **Import TaskForm into CreateTaskModal** and wire the submit handler to the create-task API endpoint. Verify the modal shows the form, accepts input, and closes on success.
2. **Fix hydration mismatch** by using `useEffect` for the client-side task count or by making the server render a skeleton instead of "0 tasks".
3. **Pass onClose prop to delete dialog Cancel button.** One-line fix in the parent component.
4. **Wire the hamburger menu** to toggle sidebar state. The state variable exists but the handler never calls the setter.
5. **Invalidate the task list query** after a successful edit mutation.
6. **Replace hardcoded chart colors** with CSS custom properties that respond to `[data-theme="dark"]`.
7. **Add an empty state component** for the task list with a CTA pointing to Create Task.
8. **Fix or remove the footer link** to `/about`.

## Retest Checklist

- [ ] Create Task button opens a form, submits, and the new task appears in the list.
- [ ] Page loads without hydration warnings in the console.
- [ ] Delete dialog Cancel button closes the dialog.
- [ ] Mobile hamburger menu toggles the sidebar.
- [ ] Editing a task updates the list without a manual refresh.
- [ ] Dark mode renders charts with readable colors.
- [ ] Empty task list shows a helpful message.
- [ ] Footer link resolves or is removed.
