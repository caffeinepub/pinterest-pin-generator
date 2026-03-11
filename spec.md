# Pinterest Pin Generator from Blog URL

## Current State
New project, no existing code.

## Requested Changes (Diff)

### Add
- Blog URL input form
- Backend: fetch blog page content via HTTP outcall, extract title/meta/content
- Generate 5 SEO-optimized Pinterest pin titles
- Generate 5 pin descriptions with semantic keywords, hashtag tags (non-spammy)
- Generate 5 image prompts each containing a top text headline and bottom text CTA ("Read Full Guide")
- Best posting time recommendations for US (EST/PST) and UK (GMT/BST) converted to IST
- Copy-to-clipboard for all generated fields
- Tabbed or card-based output UI

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Select http-outcalls component for backend blog fetching
2. Generate Motoko backend:
   - `fetchAndGeneratePins(url: Text)` - fetches blog URL, parses title/description/content, returns structured pin data
   - Returns: 5 titles, 5 descriptions with tags, 5 image prompts, posting time recommendations
3. Frontend:
   - URL input with validate & generate button
   - Loading state while processing
   - Results section: tabbed cards for Titles, Descriptions, Image Prompts, Posting Times
   - Copy buttons on each item
   - IST posting time schedule table
