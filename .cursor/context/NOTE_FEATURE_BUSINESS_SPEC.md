
# NOTE FEATURE — BUSINESS SPEC (INDEPENDENT, macOS NOTES–LIKE)

> Purpose  
This document defines the **business behavior and product expectations** for the **Notes feature**.  
It intentionally avoids technical implementation details and is designed to guide **AI coding agents and developers** without causing scope creep.

The Notes feature is **independent from Todo** in early phases.

---

## 1. Feature Positioning

### What Notes Are
- A personal thinking space
- Used for ideas, drafts, references, and quick writing
- Optimized for speed, safety, and low friction

### What Notes Are NOT
- Tasks
- Documents with workflows
- Collaborative content
- Wikis or knowledge bases

---

## 2. Core Product Principle

Write-first, save-always.

The Notes feature must feel like:
- macOS Notes
- Apple Notes on iOS

User expectation:
- Open and type immediately
- No Save button
- No fear of losing data

---

## 3. Core User Behaviors

### Create Note
- User can create a new note instantly
- New note opens in edit mode
- Empty notes are allowed

### Edit Note
- User edits freely
- Changes are saved automatically
- No explicit save action exists

### Auto-save (Critical)
- All edits are persisted automatically
- Reloading the page does not lose content

### Delete Note
- User can delete a note
- Deletion requires confirmation

---

## 4. Content Capabilities (Business Level)

### Supported Content
- Rich text formatting:
  - bold
  - italic
  - underline
  - bullet list
- Inline emoji
- Inline images

### Content Rules
- Content is free-form
- No enforced structure

---

## 5. Notes List Experience

- List of notes
- Each note shows:
  - title
  - last updated time
- Clicking a note opens it immediately

Search:
- Search by title (early phase)

---

## 6. Tier-Based Business Rules

### Normal
- Limited number of notes
- Rich text and emoji
- No image upload

### Premium
- Unlimited notes
- Image upload enabled

### Pro
- Unlimited notes
- Image upload
- Full content search (future)

---

## 7. Admin Interaction

Admin can:
- View note count per user
- Enforce note limits by tier
- Ban and unban users

Admin cannot:
- Read or edit note content

---

## 8. Real-time System Behavior

### Ban User
- User is logged out immediately
- Open note editor is closed
- Clear message is shown

### Update User Tier
- User remains logged in
- Note capabilities update immediately
- User receives notification

---

## 9. Data Safety Expectations

- Notes must not disappear unexpectedly
- Page refresh must not lose content
- Writing feels safe

---

## 10. Explicit Out of Scope

- Collaboration
- Version history
- Folders or advanced tagging
- Sharing or export
- Realtime multi-user editing

---

## 11. Success Criteria

- Users trust notes for daily writing
- No Save button is needed
- Notes are independent from Todo

---

END OF DOCUMENT
