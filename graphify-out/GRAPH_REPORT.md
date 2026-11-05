# Graph Report - teradesk-ui-slicing  (2026-11-05)

## Corpus Check
- 147 files · ~256,026 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 56 file(s) not represented in the graph (top: .csv 53, (none) 2, .css 1)

## Summary
- 2409 nodes · 3382 edges · 140 communities (116 shown, 24 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 116 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7c525593`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ShadcnInstaller
- package.json
- scripts/core.py
- TeraDesk — Digital Workspace & Operating System Organisasi
- .oxlintrc.json
- html-token-validator.py
- ServiceDispatcher.jsx
- Findings List
- gray
- Tailwind CSS Utility Reference
- Brand Guidelines v1.0
- Design
- Canvas Design System
- pathlib
- slide_search_core.py
- Prerequisites
- TestSearchDomains
- spacing
- Form & Input Components
- Tailwind CSS Responsive Design
- Typography Specifications
- DesignSystemGenerator
- Logo Usage Rules
- Component Specifications
- re
- shadcn/ui Accessibility Patterns
- _palette_is_dark
- json
- render-html.py
- Asset Approval Checklist
- Logo AI Prompt Engineering
- Color Palette Management
- CIP Deliverable Guide
- States and Variants
- UI Styling Skill
- Workflow
- Design System
- Tailwind CSS Customization
- generate-slide.py
- _filter_anti_patterns_for_mode
- read_rows
- test_design_system_mode.py
- Routing by Task Type
- shadcn/ui Theming & Customization
- TestTailwindConfigGenerator
- Asset Organization Guide
- Primary Color Meanings
- Core Logo Types
- color
- Brand Consistency Checklist
- CIP Mockup Prompt Engineering
- Color Semantics
- Design Principles
- Design Principles
- cip/generate.py
- fontSize
- CIP Design Reference
- Icon Design Reference
- Copywriting Formulas
- Copywriting Formulas
- CatalogRefreshTest
- Banner Design - Multi-Format Creative Banner System
- Messaging Framework
- Brand Voice Framework
- Layout Patterns
- Tailwind Integration
- Layout Patterns
- TestWebStackFreshness
- update.md
- Logo Design Reference
- Token Architecture
- validate_data.py
- .test_node_check_parses_generated_config
- TestDomainDetection
- csv
- extract-colors.cjs
- validate-asset.cjs
- Primitive Tokens
- card
- Core Visual Elements
- CIP Design Style Guide
- App.jsx
- primitive
- cip/core.py
- Brand
- Slide Strategies
- Component Tokens
- embed-tokens.cjs
- validate-tokens.cjs
- Slide Strategies
- .test_full_configuration_typescript
- test_data_contracts.py
- inject-brand-context.cjs
- test_design_system_mode.py
- radius
- TestFixtureValidation
- sync-brand-to-tokens.cjs
- generate-tokens.cjs
- test_text_layout_resilience.py
- TestBm25CoreBehavior
- .validate_config
- TestTokenizer
- Slides Reference
- HTML Slide Template
- argparse
- HTML Slide Template
- test_data_contracts.py
- design-tokens-starter.json
- shadow
- Slides
- design_system.py
- md
- parse_decision_rules
- Brand Guidelines Template
- Action Summary
- button
- lg
- input
- $type
- radius
- padding-y
- none
- xl
- destructive
- AGENTS.md — Developer & AI Agent Context Guide
- destructive-foreground
- muted
- primary-foreground
- AdminDashboardPage.jsx
- ring
- slides-create.md
- create.md
- secondary-foreground
- TestThresholdGate
- TestLandingAndStackContract

## God Nodes (most connected - your core abstractions)
1. `TailwindConfigGenerator` - 58 edges
2. `TestTailwindConfigGenerator` - 35 edges
3. `DesignSystemGenerator` - 35 edges
4. `ShadcnInstaller` - 34 edges
5. `TestShadcnInstaller` - 26 edges
6. `react` - 24 edges
7. `lucide-react` - 21 edges
8. `ServicePageLayout()` - 21 edges
9. `UI Styling Skill` - 17 edges
10. `read_rows()` - 16 edges

## Surprising Connections (you probably didn't know these)
- `TestGeneratedConfigIsValidJs` --uses--> `TailwindConfigGenerator`  [INFERRED]
  .agents/skills/ui-styling/scripts/tests/test_tailwind_config_gen.py → .agents/skills/ui-styling/scripts/tailwind_config_gen.py
- `TestTailwindConfigGenerator` --uses--> `TailwindConfigGenerator`  [INFERRED]
  .agents/skills/ui-styling/scripts/tests/test_tailwind_config_gen.py → .agents/skills/ui-styling/scripts/tailwind_config_gen.py
- `TestReasoningContract` --uses--> `DesignSystemGenerator`  [INFERRED]
  .agents/skills/ui-ux-pro-max/scripts/tests/test_data_contracts.py → .agents/skills/ui-ux-pro-max/scripts/design_system.py
- `TestEndToEndCoherence` --uses--> `DesignSystemGenerator`  [INFERRED]
  .agents/skills/ui-ux-pro-max/scripts/tests/test_design_system_mode.py → .agents/skills/ui-ux-pro-max/scripts/design_system.py
- `TestShadcnInstaller` --uses--> `ShadcnInstaller`  [INFERRED]
  .agents/skills/ui-styling/scripts/tests/test_shadcn_add.py → .agents/skills/ui-styling/scripts/shadcn_add.py

## Import Cycles
- None detected.

## Communities (140 total, 24 thin omitted)

### Community 0 - "ShadcnInstaller"
Cohesion: 0.05
Nodes (3): main(), ShadcnInstaller, TestShadcnInstaller

### Community 1 - "package.json"
Cohesion: 0.08
Nodes (31): dependencies, lucide-react@^1.50.0, @qpokychuk/sf-pro-display@^1.0.2, react@^19.2.8, react-dom@^19.2.8, devDependencies, oxlint@^1.81.0, tailwindcss@^4.3.3 (+23 more)

### Community 2 - "scripts/core.py"
Cohesion: 0.06
Nodes (31): BM25, _contains_phrase(), detect_domain(), _domain_keywords(), _exact_match_diagnostic(), _exact_row_identity(), _exact_stack_identifier(), _file_signature() (+23 more)

### Community 3 - "TeraDesk — Digital Workspace & Operating System Organisasi"
Cohesion: 0.12
Nodes (15): 1. Install Dependencies, 1. Landing Page Modern & Responsif, 2. Jalankan Server Development, 2. Portal Katalog 10 Layanan Organisasi, 3. Dashboard Admin Eksekutif & Manajemen Data (`/admin`), 3. Pengecekan Kualitas Kode (Linting), 4. Build untuk Produksi, 4. Sistem Autentikasi & Keamanan Sesi (`/login`) (+7 more)

### Community 4 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 5 - "html-token-validator.py"
Cohesion: 0.13
Nodes (12): get_context(), is_allowed_exception(), is_allowed_rgba(), is_inside_block(), load_css_variables(), main(), print_result(), print_summary() (+4 more)

### Community 6 - "ServiceDispatcher.jsx"
Cohesion: 0.17
Nodes (23): lucide-react, react, ArchiveServicePage(), sampleDocs, AssetServicePage(), initialAssets, AttendanceServicePage(), sampleAttendanceList (+15 more)

### Community 7 - "Findings List"
Cohesion: 0.33
Nodes (5): Anti-Slop Audit Report #001, Findings List, Priority: HIGH (Hard Gate Violations), Priority: LOW (Quality Locks & Cleanliness), Priority: MEDIUM (Purpose-Gate Violations)

### Community 8 - "gray"
Cohesion: 0.05
Nodes (53): $type, $value, $type, $value, $type, $value, $type, $value (+45 more)

### Community 9 - "Tailwind CSS Utility Reference"
Cohesion: 0.05
Nodes (43): Arbitrary Values, Aspect Ratio, Background Colors, Border Color, Border Radius, Border Style, Border Width, Borders (+35 more)

### Community 10 - "Brand Guidelines v1.0"
Cohesion: 0.05
Nodes (37): 1. Color Palette, 2. Typography, 3. Logo Usage, 4. Voice & Tone, 5. Imagery Guidelines, 6. Design Components, Accessibility, AI Image Generation (+29 more)

### Community 11 - "Design"
Cohesion: 0.06
Nodes (35): Banner Design (Built-in), Banner: Design Rules, Banner: Quick Size Reference, Banner: Top Art Styles, Banner: Workflow, CIP Design (Built-in), CIP: Generate Brief, CIP: Generate Mockups (+27 more)

### Community 12 - "Canvas Design System"
Cohesion: 0.06
Nodes (35): 1. Visual Communication First, 2. Minimal Text Integration, 3. Expert Craftsmanship, 4. Systematic Patterns, Analog Meditation, Approach, Canvas Boundaries, Canvas Design System (+27 more)

### Community 13 - "pathlib"
Cohesion: 0.12
Nodes (5): test_sync_parses_bundled_starter_template(), main(), _run(), test_flags_hardcoded_hex_sharing_line_with_token(), test_token_only_line_reports_no_violation()

### Community 14 - "slide_search_core.py"
Cohesion: 0.08
Nodes (17): format_context(), format_result(), main(), BM25, calculate_pattern_break(), detect_domain(), get_background_config(), get_color_for_emotion() (+9 more)

### Community 15 - "Prerequisites"
Cohesion: 0.06
Nodes (34): Accessibility, Available Domains, Available Stacks, Common Rules for Professional UI, Common Sticking Points, Example Workflow, How to Use This Skill, Icons & Visual Elements (+26 more)

### Community 17 - "spacing"
Cohesion: 0.06
Nodes (34): $type, $value, $type, $value, $type, $value, $type, $value (+26 more)

### Community 18 - "Form & Input Components"
Cohesion: 0.06
Nodes (32): Accordion, Alert, Alert Dialog, Avatar, Badge, Button, Card, Checkbox (+24 more)

### Community 19 - "Tailwind CSS Responsive Design"
Cohesion: 0.06
Nodes (32): 1. Mobile-First Design, 2. Consistent Breakpoint Usage, 3. Test at Breakpoint Boundaries, 4. Use Container for Content Width, 5. Progressive Enhancement, 6. Avoid Too Many Breakpoints, Best Practices, Breakpoint System (+24 more)

### Community 20 - "Typography Specifications"
Cohesion: 0.06
Nodes (30): Accessibility, Base System, Best Practices, Clean & Modern, Common Font Pairings, Contrast Requirements, CSS Implementation, Editorial (+22 more)

### Community 22 - "Logo Usage Rules"
Cohesion: 0.07
Nodes (28): Absolute Don'ts, Approved Backgrounds, Before Using Logo, Clear Space, Co-branding, Color Rules, Color Usage, Color Variants (+20 more)

### Community 23 - "Component Specifications"
Cohesion: 0.07
Nodes (28): Alert, Anatomy, Anatomy, Anatomy, Anatomy, Anatomy, Badge, Button (+20 more)

### Community 24 - "re"
Cohesion: 0.10
Nodes (13): apply_color(), apply_viewbox_size(), extract_svgs(), generate_batch(), generate_icon(), generate_sizes(), load_env(), main() (+5 more)

### Community 25 - "shadcn/ui Accessibility Patterns"
Cohesion: 0.07
Nodes (28): Accordion, Alert, ARIA Labels, Checkbox and Radio, Color Contrast, Command Palette Navigation, Component-Specific Patterns, Dialog/Modal Navigation (+20 more)

### Community 26 - "_palette_is_dark"
Cohesion: 0.15
Nodes (5): _contrast_ratio(), _palette_is_dark(), _relative_luminance(), TestEndToEndCoherence, TestLuminance

### Community 27 - "json"
Cohesion: 0.16
Nodes (9): generate_css_for_background(), get_background_image(), get_curated_images(), get_overlay_css(), get_pexels_search_url(), load_backgrounds_config(), load_brand_colors(), main() (+1 more)

### Community 28 - "render-html.py"
Cohesion: 0.23
Nodes (4): generate_html(), get_deliverable_info(), get_image_base64(), main()

### Community 29 - "Asset Approval Checklist"
Cohesion: 0.08
Nodes (25): Accessibility, Archival, Asset Approval Checklist, Automation Support, Color Compliance, Common Issues & Fixes, Content Accessibility, Content Quality (+17 more)

### Community 30 - "Logo AI Prompt Engineering"
Cohesion: 0.08
Nodes (25): Common Pitfalls, Core Prompt Structure, Detailed Brief, Eco/Sustainable, Effective Keywords by Style, Fashion Brand, Healthcare, Industry-Specific Prompts (+17 more)

### Community 31 - "Color Palette Management"
Cohesion: 0.08
Nodes (24): Accessibility Requirements, Brand Compliance Validation, Checking Contrast, Color Documentation Format, Color Extraction, Color Palette Examples, Color Palette Management, Color System Structure (+16 more)

### Community 32 - "CIP Deliverable Guide"
Cohesion: 0.08
Nodes (24): Apparel, Business Card, Car/Sedan, CIP Deliverable Guide, Core Identity, Digital Assets, Email Signature, Envelope (+16 more)

### Community 33 - "States and Variants"
Cohesion: 0.08
Nodes (24): Accessibility, Accessibility Requirements, ARIA States, Color Contrast, Color Variants, Disabled States, Error Messages, Error States (+16 more)

### Community 34 - "UI Styling Skill"
Cohesion: 0.08
Nodes (24): Accessibility Patterns, Alternative: Tailwind-Only Setup, Best Practices, Common Patterns, Component Layer: shadcn/ui, Component Library Guide, Component + Styling Setup, Core Stack (+16 more)

### Community 35 - "Workflow"
Cohesion: 0.08
Nodes (23): Art Direction Styles (Reuse from Banner), Color & Contrast, Design Best Practices, HTML Design Rules, HTML Template Structure, Option A: Chrome Headless CLI (Recommended — zero dependencies), Option B: chrome-devtools skill, Option C: Playwright script (+15 more)

### Community 36 - "Design System"
Cohesion: 0.09
Nodes (22): Best Practices, Chart.js Integration, Command, Component Spec Pattern, Contextual Decision Flow, Decision System CSVs, Design System, Integration (+14 more)

### Community 37 - "Tailwind CSS Customization"
Cohesion: 0.09
Nodes (22): @apply Directive, Best Practices, Color Customization, Complete Tailwind Config, Configuration Examples, Content Configuration, Custom Color Palette, Custom Font Sizes (+14 more)

### Community 38 - "generate-slide.py"
Cohesion: 0.13
Nodes (11): _e(), generate_chart_slide(), generate_cta_slide(), generate_deck(), generate_metrics_slide(), generate_problem_slide(), generate_solution_slide(), generate_testimonial_slide() (+3 more)

### Community 40 - "read_rows"
Cohesion: 0.17
Nodes (3): _resolve_dial(), read_rows(), TestReasoningContract

### Community 41 - "test_design_system_mode.py"
Cohesion: 0.11
Nodes (5): _query_wants_dark(), _resolve_color_mode(), _style_is_dark_primary(), TestModeResolution, TestStyleTaxonomy

### Community 42 - "Routing by Task Type"
Cohesion: 0.10
Nodes (19): Banner Design Tasks, Brand Identity Tasks, Component Creation, Corporate Identity Program Tasks, Design Routing Guide, Design System Migration, Icon Design Tasks, Implementation Tasks (+11 more)

### Community 43 - "shadcn/ui Theming & Customization"
Cohesion: 0.10
Nodes (19): Base Color Presets, Best Practices, Color Customization, Color Format, Component Customization, CSS Variable System, Customize Styles, Customize Variants (+11 more)

### Community 45 - "Asset Organization Guide"
Cohesion: 0.11
Nodes (18): Asset Entry (manifest.json), Asset Organization Guide, By Campaign, By Status, By Type, Cleanup Workflow, Components, Directory Structure (+10 more)

### Community 46 - "Primary Color Meanings"
Cohesion: 0.11
Nodes (18): Accessibility Considerations, Analogous, Black, Blue, Color Combinations by Industry, Color Harmony Types, Complementary, Green (+10 more)

### Community 47 - "Core Logo Types"
Cohesion: 0.11
Nodes (18): 1. Wordmark (Logotype), 2. Lettermark (Monogram), 3. Pictorial Mark (Brand Mark), 4. Abstract Mark, 5. Mascot, 6. Emblem, 7. Combination Mark, Aesthetic Styles (+10 more)

### Community 48 - "color"
Cohesion: 0.11
Nodes (19): $type, $value, background, foreground, muted-foreground, primary, primary-hover, secondary (+11 more)

### Community 49 - "Brand Consistency Checklist"
Cohesion: 0.11
Nodes (17): Audit Frequency, Brand Consistency Checklist, Channel Audit, Collateral, Colors, Common Issues, Email, Imagery (+9 more)

### Community 50 - "CIP Mockup Prompt Engineering"
Cohesion: 0.11
Nodes (17): Apparel (Polo/T-Shirt), Base Prompt Structure, Business Card, CIP Mockup Prompt Engineering, Context Modifiers, Corporate Minimal, Deliverable-Specific Modifiers, Letterhead (+9 more)

### Community 51 - "Color Semantics"
Cohesion: 0.11
Nodes (17): Accent, Applying Semantic Tokens, Background & Foreground, Border & Ring, Color Semantics, Dark Mode Overrides, Destructive, Interactive States (+9 more)

### Community 52 - "Design Principles"
Cohesion: 0.12
Nodes (15): 22 Art Direction Styles, Banner Sizes & Art Direction Styles Reference, Complete Banner Sizes, CTA Rules, Design Principles, Pinterest Research Queries, Print, Print Specs (+7 more)

### Community 53 - "Design Principles"
Cohesion: 0.12
Nodes (15): 22 Art Direction Styles, Banner Sizes & Art Direction Styles Reference, Complete Banner Sizes, CTA Rules, Design Principles, Pinterest Research Queries, Print, Print Specs (+7 more)

### Community 54 - "cip/generate.py"
Cohesion: 0.19
Nodes (7): build_cip_prompt(), check_logo_required(), generate_cip_set(), generate_with_nano_banana(), load_env(), load_logo_image(), main()

### Community 55 - "fontSize"
Cohesion: 0.12
Nodes (16): $type, $value, $type, $value, $type, $value, $type, $value (+8 more)

### Community 57 - "CIP Design Reference"
Cohesion: 0.13
Nodes (14): CIP Brief (Start Here), CIP Design Reference, Commands, Deliverable Categories, Design Styles, Detailed References, Generate Mockups, HTML Presentation Features (+6 more)

### Community 58 - "Icon Design Reference"
Cohesion: 0.13
Nodes (14): Available Styles, CLI Options, Commands, Generate Batch Variations, Generate Multiple Sizes, Generate Single Icon, Icon Categories, Icon Design Reference (+6 more)

### Community 59 - "Copywriting Formulas"
Cohesion: 0.13
Nodes (14): AIDA (Attention-Interest-Desire-Action), Before-After-Bridge, Contrast Patterns, Copywriting Formulas, Core Formulas, Cost of Inaction, FAB (Features-Advantages-Benefits), Formula-to-Slide Mapping (+6 more)

### Community 60 - "Copywriting Formulas"
Cohesion: 0.13
Nodes (14): AIDA (Attention-Interest-Desire-Action), Before-After-Bridge, Contrast Patterns, Copywriting Formulas, Core Formulas, Cost of Inaction, FAB (Features-Advantages-Benefits), Formula-to-Slide Mapping (+6 more)

### Community 62 - "Banner Design - Multi-Format Creative Banner System"
Cohesion: 0.14
Nodes (13): Art Direction Styles (Top 10), Banner Design - Multi-Format Creative Banner System, Banner Size Quick Reference, Design Rules, Prerequisites, Security, Step 1: Gather Requirements (AskUserQuestion), Step 2: Research & Art Direction (+5 more)

### Community 63 - "Messaging Framework"
Cohesion: 0.14
Nodes (13): Core Statements, Elevator Pitches, Framework Structure, Message Architecture, Message by Audience, Message Testing, Messaging Framework, Mission Statement (+5 more)

### Community 64 - "Brand Voice Framework"
Cohesion: 0.14
Nodes (13): Brand Voice Framework, Character Spectrum, Emotion Spectrum, Language Spectrum, Step 1: Define Personality Traits, Step 2: Create Voice Chart, Step 3: Context Adaptation, Tone Spectrum (+5 more)

### Community 65 - "Layout Patterns"
Cohesion: 0.14
Nodes (13): Card Styles, Component Variants, CSS Structures, Feature Grid (3 columns), Layout Decision Flow, Layout Patterns, Layout Selection by Use Case, Metric Styles (+5 more)

### Community 66 - "Tailwind Integration"
Cohesion: 0.14
Nodes (13): Animation Tokens, Base Layer, Button Example, Component Classes, CSS Variables Setup, Dark Mode Toggle, HSL Format Benefits, shadcn/ui Alignment (+5 more)

### Community 67 - "Layout Patterns"
Cohesion: 0.14
Nodes (13): Card Styles, Component Variants, CSS Structures, Feature Grid (3 columns), Layout Decision Flow, Layout Patterns, Layout Selection by Use Case, Metric Styles (+5 more)

### Community 70 - "update.md"
Cohesion: 0.15
Nodes (12): Color Presets, Examples, Files Modified, Important, Overview, Skills Used, Step 1: Gather Brand Input, Step 2: Update Brand Guidelines (+4 more)

### Community 71 - "Logo Design Reference"
Cohesion: 0.15
Nodes (12): Available Styles, Color Psychology, Commands, Design Brief (Start Here), Detailed References, Generate Logo, Industry Defaults, Logo Design Reference (+4 more)

### Community 72 - "Token Architecture"
Cohesion: 0.15
Nodes (12): Categories, Dark Mode, File Organization, Layer 1: Primitive Tokens, Layer 2: Semantic Tokens, Layer 3: Component Tokens, Layer Overview, Migration from Flat Tokens (+4 more)

### Community 73 - "validate_data.py"
Cohesion: 0.06
Nodes (44): read_rows(), TestAccessibilityGuidance, TestChartsTypographyAndIcons, TestCurrentReactGuidance, TestSemanticColors, TestGeneratedCatalogContract, _catalog_date(), _check_app_interface_contract() (+36 more)

### Community 77 - "extract-colors.cjs"
Cohesion: 0.27
Nodes (9): calculateCompliance(), colorDistance(), displayPalette(), extractHexColors(), findNearestBrandColor(), generateImageMagickCommand(), hexToRgb(), main() (+1 more)

### Community 78 - "validate-asset.cjs"
Cohesion: 0.32
Nodes (11): checkManifest(), formatBytes(), formatOutput(), main(), parseFilename(), RULES, suggestFilename(), validateAsset() (+3 more)

### Community 79 - "Primitive Tokens"
Cohesion: 0.17
Nodes (11): Border Radius, Color Scales, Gray Scale, Motion / Duration, Primary Colors (Blue), Primitive Tokens, Shadows, Spacing Scale (+3 more)

### Community 80 - "card"
Cohesion: 0.20
Nodes (12): $type, $value, bg, bg, padding, shadow, card, bg (+4 more)

### Community 81 - "Core Visual Elements"
Cohesion: 0.18
Nodes (10): Color Palette, Colors, Core Visual Elements, Logo, Logo, Quick Checks, Typography, Typography (+2 more)

### Community 82 - "CIP Design Style Guide"
Cohesion: 0.18
Nodes (10): Bold Dynamic, CIP Design Style Guide, Classic Traditional, Color Psychology, Corporate Minimal, Fresh Modern, Luxury Premium, Modern Tech (+2 more)

### Community 83 - "App.jsx"
Cohesion: 0.15
Nodes (13): App(), aboutImages, AboutUs(), ContactModal(), Features(), featuresData, featuresData, FeaturesPortal() (+5 more)

### Community 84 - "primitive"
Cohesion: 0.18
Nodes (11): fast, normal, slow, $type, $value, $type, $value, primitive (+3 more)

### Community 85 - "cip/core.py"
Cohesion: 0.06
Nodes (13): BM25, detect_domain(), get_cip_brief(), _load_csv(), search(), search_all(), _search_csv(), BM25 (+5 more)

### Community 86 - "Brand"
Cohesion: 0.20
Nodes (9): Brand, Brand Sync Workflow, Quick Start, References, Routing, Scripts, Subcommands, Templates (+1 more)

### Community 87 - "Slide Strategies"
Cohesion: 0.20
Nodes (9): Common Structures, Duarte Sparkline Pattern, Matching Strategy to Context, Product Demo (6 slides), Sales Pitch (9 slides), Search Commands, Slide Strategies, Strategy Selection (+1 more)

### Community 88 - "Component Tokens"
Cohesion: 0.20
Nodes (9): Alert Tokens, Badge Tokens, Button Tokens, Card Tokens, Component Tokens, Dialog/Modal Tokens, Input Tokens, Table Tokens (+1 more)

### Community 89 - "embed-tokens.cjs"
Cohesion: 0.20
Nodes (6): args, minimal, MINIMAL_TOKENS, projectRoot, tokensPath, wrapStyle

### Community 90 - "validate-tokens.cjs"
Cohesion: 0.31
Nodes (9): extensions, formatReport(), getFiles(), main(), parseArgs(), patterns, scanFile(), shouldSkip() (+1 more)

### Community 92 - "Slide Strategies"
Cohesion: 0.20
Nodes (9): Common Structures, Duarte Sparkline Pattern, Matching Strategy to Context, Product Demo (6 slides), Sales Pitch (9 slides), Search Commands, Slide Strategies, Strategy Selection (+1 more)

### Community 95 - "test_data_contracts.py"
Cohesion: 0.47
Nodes (3): split_values(), style_identities(), TestStyleIdentityContract

### Community 96 - "inject-brand-context.cjs"
Cohesion: 0.42
Nodes (8): extractColorsFromTable(), extractCoreAttributes(), extractHexColors(), extractImageStyle(), extractTypography(), extractVoice(), generatePromptAddition(), main()

### Community 97 - "test_design_system_mode.py"
Cohesion: 0.29
Nodes (3): _derive_dark_palette(), _select_palette_for_mode(), TestPaletteSelection

### Community 98 - "radius"
Cohesion: 0.29
Nodes (8): $type, $value, $type, $value, radius, default, full, default

### Community 100 - "sync-brand-to-tokens.cjs"
Cohesion: 0.39
Nodes (5): adjustBrightness(), extractColorsFromMarkdown(), generateColorScale(), main(), updateDesignTokens()

### Community 101 - "generate-tokens.cjs"
Cohesion: 0.50
Nodes (7): flattenTokens(), generateCSS(), generateTailwind(), main(), parseArgs(), resolveReference(), toCssVarName()

### Community 102 - "test_text_layout_resilience.py"
Cohesion: 0.18
Nodes (3): read_rows(), TestTextLayoutDataContracts, TestTextLayoutRetrieval

### Community 107 - "Slides Reference"
Cohesion: 0.29
Nodes (6): Key Features, Knowledge Base, Slides Reference, Usage, When to Use, Workflow

### Community 108 - "HTML Slide Template"
Cohesion: 0.29
Nodes (6): Animation Classes, Background Images, Base Structure, Chart.js Integration, CSS Variables Reference, HTML Slide Template

### Community 109 - "argparse"
Cohesion: 0.15
Nodes (5): format_brief(), format_results(), main(), format_output(), generate_design_brief()

### Community 110 - "HTML Slide Template"
Cohesion: 0.29
Nodes (6): Animation Classes, Background Images, Base Structure, Chart.js Integration, CSS Variables Reference, HTML Slide Template

### Community 113 - "design-tokens-starter.json"
Cohesion: 0.15
Nodes (12): component, $type, $value, dark, semantic, $schema, $type, $value (+4 more)

### Community 114 - "shadow"
Cohesion: 0.47
Nodes (6): sm, shadow, sm, sm, $type, $value

### Community 115 - "Slides"
Cohesion: 0.33
Nodes (5): References (Knowledge Base), Routing, Slides, Subcommands, When to Use

### Community 116 - "design_system.py"
Cohesion: 0.06
Nodes (16): ansi_ljust(), _detect_page_type(), format_ascii_box(), format_markdown(), format_master_md(), format_page_override_md(), generate_design_system(), _generate_intelligent_overrides() (+8 more)

### Community 117 - "md"
Cohesion: 0.67
Nodes (4): $type, $value, md, md

### Community 118 - "parse_decision_rules"
Cohesion: 0.27
Nodes (4): apply_decision_rules(), _object_without_duplicates(), parse_decision_rules(), _validate_action()

### Community 119 - "Brand Guidelines Template"
Cohesion: 0.40
Nodes (4): Brand Guidelines Template, Document Structure, Extractable Fields, Usage

### Community 120 - "Action Summary"
Cohesion: 0.29
Nodes (6): 1. Hard Gate Fixes (Priority: HIGH), 2. Purpose-Gate Fixes (Priority: MEDIUM), 3. Quality Locks Fixes (Priority: LOW), Action Summary, Anti-Slop Resolution & Verification Report #001, Verification & Build Proof

### Community 121 - "button"
Cohesion: 0.20
Nodes (10): fg, font-size, hover-bg, button, $type, $value, $type, $value (+2 more)

### Community 122 - "lg"
Cohesion: 0.60
Nodes (5): lg, $type, $value, lg, lg

### Community 124 - "input"
Cohesion: 0.29
Nodes (8): padding-x, input, $type, $value, focus-ring, padding-x, $type, $value

### Community 125 - "$type"
Cohesion: 0.60
Nodes (5): $type, $value, border, border, border

### Community 126 - "radius"
Cohesion: 0.60
Nodes (5): radius, radius, radius, $type, $value

### Community 127 - "padding-y"
Cohesion: 0.67
Nodes (4): padding-y, padding-y, $type, $value

### Community 128 - "none"
Cohesion: 0.67
Nodes (4): $type, $value, none, none

### Community 129 - "xl"
Cohesion: 0.67
Nodes (4): xl, xl, $type, $value

### Community 130 - "destructive"
Cohesion: 0.67
Nodes (3): destructive, $type, $value

### Community 131 - "AGENTS.md — Developer & AI Agent Context Guide"
Cohesion: 0.20
Nodes (9): AGENTS.md — Developer & AI Agent Context Guide, ⚙️ Arsitektur Direktori & Konfigurasi Vite, 🎨 Asset Visual Aktif, Aturan Autentikasi & Keamanan:, ⚡ Cheat Sheet Perintah Terminal, 📦 Katalog 10 Modul Layanan (Wajib Konsisten), 📌 Ringkasan Proyek, 🧭 Sistem Navigasi & Routing (+1 more)

### Community 132 - "destructive-foreground"
Cohesion: 0.67
Nodes (3): destructive-foreground, $type, $value

### Community 133 - "muted"
Cohesion: 0.67
Nodes (3): muted, $type, $value

### Community 134 - "primary-foreground"
Cohesion: 0.67
Nodes (3): primary-foreground, $type, $value

### Community 135 - "AdminDashboardPage.jsx"
Cohesion: 0.47
Nodes (5): AdminDashboardPage(), availableServices, divisionsList, getDateStamp(), getTimestamp()

### Community 136 - "ring"
Cohesion: 0.67
Nodes (3): ring, $type, $value

### Community 139 - "secondary-foreground"
Cohesion: 0.67
Nodes (3): secondary-foreground, $type, $value

## Knowledge Gaps
- **24 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `TailwindConfigGenerator` connect `.validate_config` to `.recommend_plugins`, `.add_colors`, `.test_node_check_parses_generated_config`, `TestTailwindConfigGenerator`, `pathlib`, `.add_plugins`, `.generate_config_string`, `._base_config`, `.test_full_configuration_typescript`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `TailwindConfigGenerator` (e.g. with `TestGeneratedConfigIsValidJs` and `TestTailwindConfigGenerator`) actually correct?**
  _`TailwindConfigGenerator` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Should `ShadcnInstaller` be split into smaller, more focused modules?**
  _Cohesion score 0.053555750658472345 - nodes in this community are weakly interconnected._
- **Why does `ShadcnInstaller` connect `ShadcnInstaller` to `pathlib`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `DesignSystemGenerator` (e.g. with `TestReasoningMatch` and `TestReasoningContract`) actually correct?**
  _`DesignSystemGenerator` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.08143939393939394 - nodes in this community are weakly interconnected._
- **Why does `primitive` connect `primitive` to `radius`, `gray`, `design-tokens-starter.json`, `shadow`, `spacing`, `fontSize`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._