---
sidebar_position: 4
---

# Content Editor

The Content Editor allows you to design engaging in-app content for your journeys without writing code. Create modals, banners, tooltips, and more with a visual editor and live preview.

## Overview

The Content Editor consists of three main areas:

```
┌─────────────────────────────────────────────────────────────┐
│                        Toolbar                               │
├─────────────────┬─────────────────────┬─────────────────────┤
│                 │                     │                     │
│    Templates    │    Canvas/Editor    │    Properties       │
│    & Elements   │                     │    Panel            │
│                 │                     │                     │
└─────────────────┴─────────────────────┴─────────────────────┘
```

## Templates

### Available Templates

| Template | Use Case |
|----------|----------|
| **Modal** | Important announcements, feature highlights |
| **Banner** | Promotions, alerts, updates |
| **Tooltip** | Feature tours, onboarding tips |
| **Slideout** | Surveys, feedback forms |
| **Fullscreen** | Welcome screens, onboarding flows |

### Template Structure

```typescript
interface Template {
  id: string;
  name: string;
  type: TemplateType;
  layout: LayoutConfig;
  defaultElements: Element[];
  thumbnail: string;
}

type TemplateType = 'modal' | 'banner' | 'tooltip' | 'slideout' | 'fullscreen';
```

## Elements

### Element Types

Build content by adding elements to your template:

#### Text Element

```typescript
interface TextElement {
  type: 'text';
  content: string;
  style: {
    fontSize: number;
    fontWeight: number;
    color: string;
    textAlign: 'left' | 'center' | 'right';
  };
}
```

#### Button Element

```typescript
interface ButtonElement {
  type: 'button';
  label: string;
  action: ButtonAction;
  style: {
    backgroundColor: string;
    textColor: string;
    borderRadius: number;
    size: 'small' | 'medium' | 'large';
  };
}

type ButtonAction = 
  | { type: 'dismiss' }
  | { type: 'navigate'; url: string }
  | { type: 'deep_link'; path: string }
  | { type: 'custom'; eventName: string };
```

#### Image Element

```typescript
interface ImageElement {
  type: 'image';
  src: string;
  alt: string;
  style: {
    width: number | 'auto';
    height: number | 'auto';
    objectFit: 'cover' | 'contain' | 'fill';
    borderRadius: number;
  };
}
```

#### Form Element

```typescript
interface FormElement {
  type: 'form';
  fields: FormField[];
  submitAction: ButtonAction;
  submitLabel: string;
}

interface FormField {
  name: string;
  type: 'text' | 'email' | 'number' | 'select' | 'rating';
  label: string;
  required: boolean;
  placeholder?: string;
  options?: string[]; // for select type
}
```

## Properties Panel

### Element Properties

Each element has configurable properties:

#### Style Properties

```typescript
interface BaseStyle {
  margin: Spacing;
  padding: Spacing;
  backgroundColor?: string;
  borderRadius?: number;
  border?: BorderConfig;
  shadow?: ShadowConfig;
}

interface Spacing {
  top: number;
  right: number;
  bottom: number;
  left: number;
}
```

#### Actions

Configure element interactions:

```typescript
interface ElementActions {
  onClick?: Action;
  onHover?: Action;
  onDismiss?: Action;
}

interface Action {
  type: ActionType;
  payload?: Record<string, unknown>;
  trackEvent?: boolean;
}
```

## Live Preview

### Device Frame

Preview content on different devices:

```tsx
<DeviceFrame 
  device="iphone" // 'iphone' | 'android' | 'tablet' | 'desktop'
  orientation="portrait" // 'portrait' | 'landscape'
>
  <ContentPreview elements={elements} />
</DeviceFrame>
```

### Preview Modes

| Mode | Description |
|------|-------------|
| **Edit** | Interactive editing with element selection |
| **Preview** | See how content appears to users |
| **Responsive** | Test at different breakpoints |

## Component Definitions

Content elements are defined in component definitions:

```json
// constants/componentDefinitions.json
{
  "components": [
    {
      "type": "text",
      "name": "Text",
      "icon": "TextFields",
      "defaultProps": {
        "content": "Enter text here",
        "fontSize": 16,
        "color": "#000000"
      },
      "editableProps": ["content", "fontSize", "color", "textAlign"]
    }
  ]
}
```

## Usage Example

### Creating Content

```tsx
import { ContentEditor } from './components/ContentEditor';

function JourneyContentStep() {
  const [content, setContent] = useState<ContentConfig>({
    template: 'modal',
    elements: [],
  });

  return (
    <ContentEditor
      value={content}
      onChange={setContent}
      onPreview={() => openPreviewModal(content)}
    />
  );
}
```

### Element Editor Component

```tsx
function ElementPropsEditor({ element, onChange }) {
  return (
    <div className="props-panel">
      <TextField
        label="Content"
        value={element.content}
        onChange={(e) => onChange({ ...element, content: e.target.value })}
      />
      
      <ColorPicker
        label="Color"
        value={element.style.color}
        onChange={(color) => onChange({
          ...element,
          style: { ...element.style, color }
        })}
      />
      
      <Slider
        label="Font Size"
        value={element.style.fontSize}
        min={12}
        max={48}
        onChange={(size) => onChange({
          ...element,
          style: { ...element.style, fontSize: size }
        })}
      />
    </div>
  );
}
```

## Best Practices

### Content Design

1. **Keep it concise** - Users have short attention spans
2. **Clear CTA** - One primary action per content piece
3. **Consistent branding** - Match your app's design system
4. **Mobile-first** - Design for smallest screen first

### Performance

1. **Optimize images** - Use appropriate sizes and formats
2. **Limit animations** - Keep them subtle and purposeful
3. **Test loading** - Ensure content loads quickly

### Accessibility

1. **Color contrast** - Ensure readable text
2. **Alt text** - Add descriptions to images
3. **Button labels** - Use descriptive action text
4. **Focus states** - Support keyboard navigation

