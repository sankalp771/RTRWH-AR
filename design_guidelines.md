# RTRWH/AR Rainwater Harvesting Assistant - Design 

## Design Approach
**Reference-Based Approach** inspired by environmental and utility applications like Tesla Solar, Nest, and government environmental portals. This application requires trust, professionalism, and clear data presentation while maintaining environmental awareness.

## Core Design Elements

### Color Palette
**Primary Colors:**
- Light Mode: Deep blue-green 195 65% 25% for headers and primary actions
- Dark Mode: Lighter blue-green 195 45% 65% for contrast
- Background: Clean whites (light) and rich dark grays 220 15% 12% (dark)

**Accent Colors:**
- Water blue: 205 85% 55% for water-related metrics
- Earth green: 145 40% 45% for environmental elements
- Warning amber: 35 85% 55% for alerts/recommendations

**Gradients:**
- Hero section: Subtle blue-to-green gradient 195 60% 40% to 170 50% 50%
- Card backgrounds: Very subtle gradients for depth

### Typography
- **Primary**: Inter or Source Sans Pro via Google Fonts
- **Headings**: Semi-bold (600) for section headers
- **Body**: Regular (400) for content, medium (500) for emphasis
- **Data Display**: Tabular figures for calculations

### Layout System
**Tailwind Spacing**: Primary units of 4, 6, 8, 12, 16 for consistent rhythm
- Component padding: p-6 or p-8
- Section margins: my-12 or my-16
- Card spacing: gap-6 between elements

### Component Library

**Navigation:**
- Clean horizontal navbar with logo and main sections
- Breadcrumb navigation for multi-step processes

**Forms:**
- Card-based sections for input groupings
- Clear labels with helper text for technical terms
- Input validation with inline feedback
- Progress indicators for multi-step forms

**Data Displays:**
- Metric cards with large numbers and clear units
- Results tables with alternating row colors
- Visual indicators for feasibility (green/amber/red)
- Collapsible sections for detailed calculations

**Actions:**
- Primary buttons in brand blue-green
- Secondary outline buttons for alternatives
- Download buttons with clear PDF icons

## Page Structure

### Landing Page (Single viewport focused)
- **Hero Section**: Clean headline with water droplet or roof illustration
- **Two-Path Selection**: Large cards for "Rainwater Harvesting" vs "Artificial Recharge"
- **Brief Value Props**: 3 key benefits with icons
- **Trust Indicators**: Government compliance notes

### Application Pages
- **Calculator Forms**: Step-by-step with clear progress
- **Results Dashboard**: Grid layout for key metrics
- **Report Preview**: Clean, printable layout design

## Images
- **Hero Image**: Abstract water/rain pattern or rooftop illustration (not required - solid gradient background preferred)
- **Icons**: Water droplets, building/roof outlines, earth symbols from Heroicons
- **Illustrations**: Simple line drawings for process explanations

## Key Principles
- **Trust First**: Professional appearance with government/environmental credibility
- **Data Clarity**: Clear hierarchy for calculations and recommendations
- **Progressive Disclosure**: Show summary first, details on demand
- **Mobile-First**: Responsive design for field usage