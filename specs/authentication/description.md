# Authentication

As a visitor, I want to log in as one of a set of predefined demo users, so that I can access a personal dashboard to manage my own recipes.

## Scope

- The login screen lists a fixed set of demo users; picking one logs the user in for the session.
- There is no password — this is a demo-only authentication mechanism, not real auth.
- The session is remembered across a page refresh (persisted to localStorage).
- Anonymous users can still browse recipes, but cannot add, edit, or delete recipes.
- Accessing the dashboard while not logged in redirects to the login screen.

## Notes

- No backend/password validation of any kind is involved.
