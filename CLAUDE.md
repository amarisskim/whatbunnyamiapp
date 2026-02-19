# CLAUDE.md — Project Context for Claude Desktop

## What This App Is

**whatbunnyamiapp** is a mobile-first web app. It's a personality and personal taste quiz where users discover "what bunny they are" based on their answers, then share and compare results with friends. Think: viral personality quiz with a social layer.

## The Builder

This app is being built by a non-engineer using Claude Desktop (vibe coding). Keep explanations clear and avoid jargon. Prefer simple, working solutions over clever or complex ones.

## Tech Stack

- **Framework:** Next.js (App Router)
- - **Styling:** Tailwind CSS
  - - **Database & Auth:** Supabase (add when needed — not set up yet)
    - - **Hosting:** Vercel (deploy from GitHub)
     
      - ## Project Conventions
     
      - - Use the Next.js App Router (not Pages Router)
        - - Use Tailwind CSS for all styling — no separate CSS files unless necessary
          - - Keep components small and focused
            - - Mobile-first design — the app should look great on phones first
              - - Use TypeScript if possible, but plain JavaScript is fine too
               
                - ## Core Features (to build)
               
                - 1. **Quiz flow** — series of personality/taste questions with multiple choice answers
                  2. 2. **Result screen** — reveals which bunny type you are, with a description and shareable image/card
                     3. 3. **Social sharing** — share your result via link or image (e.g. to Instagram Stories, iMessage)
                        4. 4. **Compare with friends** — see how your bunny type compares to a friend's result
                          
                           5. ## Current Status
                          
                           6. - Repo initialized, no Next.js app scaffolded yet
                              - - To start: run `npx create-next-app@latest .` in this repo directory
                               
                                - ## Notes for Claude
                               
                                - - Always check what files already exist before creating new ones
                                  - - When adding Supabase, use the `@supabase/supabase-js` client library
                                    - - Keep environment variables in `.env.local` (already gitignored)
                                      - - The app should feel fun, playful, and polished — not like a generic template
