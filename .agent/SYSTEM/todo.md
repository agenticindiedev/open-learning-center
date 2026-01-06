# todo.md

- [ ] Scaffold repo and write spec/todo/decisions
  Verify: `ls spec.md todo.md decisions.md`

- [ ] Run agent-folder-init
  Verify: `ls .agent/SYSTEM .agent/TASKS .agent/SESSIONS`

- [ ] Run fullstack-workspace-init with PRD brief
  Verify: `ls api frontend package.json`

- [ ] Run expo-architect for mobile
  Verify: `ls mobile/app`

- [ ] Implement core entities (community, course, lesson, membership, subscription, progress, event)
  Verify: `bun run test`

- [ ] Add Stripe subscription checkout + webhook gating
  Verify: `rg -n "webhooks/stripe|checkout" api`

- [ ] Add YouTube embed support in lessons
  Verify: `rg -n "youtube" frontend`

- [ ] Add Calendly booking page + events listing
  Verify: `rg -n "calendly|events" frontend`

- [ ] Build admin editor for communities/courses/lessons
  Verify: `rg -n "admin" frontend`

- [ ] Import content from skoolcom/communities
  Verify: `bun run seed`

- [ ] Build home page + community detail + course/lesson viewer
  Verify: `bun run lint && bun run test`
