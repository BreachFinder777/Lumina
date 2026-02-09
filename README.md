# Form Input Showcase

A comprehensive form input showcase featuring modern UX patterns with React, TypeScript, and Tailwind CSS.

## Features

### 🎯 Floating Labels
- Smooth animations when inputs gain focus or have content
- Labels automatically float to the top when active
- Clear visual hierarchy and space efficiency

### ✨ Focus States
- Blue ring highlights on focus for standard inputs
- Red ring highlights for error states
- Smooth transitions between states
- Hover effects for better interactivity

### ✅ Validation Feedback
- Real-time validation on blur
- Comprehensive error messages with icons
- Helper text for additional guidance
- Success states for valid inputs

### 🔢 Character Counts
- Live character count display
- Visual warning when approaching limit (90%)
- Tabular numbers for consistent spacing
- Available for text inputs and textareas

### ♿ Accessibility
- Proper ARIA labels and attributes
- `aria-invalid` for error states
- `aria-describedby` linking errors and helper text
- Required field indicators
- Keyboard navigation support
- Screen reader friendly error announcements

## Components

### FloatingInput
Standard input field with floating label animation.

**Props:**
- `label` (string, required): Input label text
- `error` (string, optional): Error message to display
- `helperText` (string, optional): Helper text below input
- `maxLength` (number, optional): Maximum character length
- `showCharCount` (boolean, optional): Show character counter
- All standard HTML input attributes

### FloatingTextarea
Multi-line textarea with floating label.

**Props:**
- Same as FloatingInput
- `rows` (number, optional): Number of visible rows

### FloatingSelect
Dropdown select with floating label.

**Props:**
- `label` (string, required): Select label text
- `options` (array, required): Array of `{value, label}` objects
- `error` (string, optional): Error message
- `helperText` (string, optional): Helper text
- All standard HTML select attributes

## Validation Examples

The showcase includes validation for:
- **Email**: RFC-compliant email format
- **Password**: Min 8 chars, uppercase, lowercase, and number
- **Username**: Min 3 chars, alphanumeric + underscores only
- **Phone**: Valid phone number format
- **Website**: Valid URL format

## Accessibility Features

1. **Unique IDs**: Auto-generated using React's `useId()` hook
2. **Error Associations**: Errors linked via `aria-describedby`
3. **Invalid States**: `aria-invalid` attribute on error
4. **Required Fields**: Visual asterisk + `required` attribute
5. **Keyboard Support**: Full keyboard navigation
6. **Screen Readers**: Proper announcements with role="alert"

## Styling

All components use Tailwind CSS with:
- Custom focus rings
- Smooth transitions
- Responsive design
- Consistent spacing
- Modern color palette

## Usage Example

```tsx
<FloatingInput
  label="Email Address"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  onBlur={validateEmail}
  error={emailError}
  helperText="We'll never share your email"
  required
/>
```

## Browser Support

Works in all modern browsers with CSS Grid, Flexbox, and CSS Custom Properties support.
