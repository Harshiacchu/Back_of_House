# Back of House: Design Document

## 1. Project description

Boston publishes every restaurant health inspection, but the data is buried in cryptic violation
codes that nobody reads. Back of House turns it into something diners can actually use. Each
restaurant gets a plain-English kitchen report that decodes its violations, a severity score that
separates serious issues (pests, food temperature) from minor ones (missing signage), and a
trajectory showing whether the kitchen is **Improving**, **Steady**, or **Slipping** over time.
Users can keep a personal visit log that shows what a kitchen's inspection record looked like when
they ate there, and friends can create "Where are we eating?" polls with a side-by-side kitchen
comparison to decide together.

The database is seeded with 1,000+ real records from the City of Boston Food Establishment
Inspections dataset (Analyze Boston).

## 2. User personas

### Priya, grad student

Lives near campus and eats out several times a week. She wants to know how clean a kitchen really
is, not just whether it passed.

### Marcus, the group organizer

Always the one organizing group dinners. He wants an easy way to get everyone to agree on a place
that is actually safe.

### Dana, food blogger

Tracks where she has eaten and wants to see whether those kitchens are getting better or worse
over time.

## 3. User stories

### Kitchen Reports & Visit Log (Harshitha Seetharaman)

1. As **Priya**, I want to search and filter Boston restaurants by name, neighborhood, and
   trajectory (Improving/Steady/Slipping) so that I can find places near me with clean kitchens.
2. As **Priya**, I want to open a restaurant and see its violations decoded into plain English, its
   severity score, and its trajectory so that I can understand how serious its issues really are.
3. As **Dana**, I want to add, edit, and delete entries in my visit log (date, dish, rating, notes)
   and see the kitchen's inspection status at the time of each visit so that I can keep track of
   where I have eaten and how safe it was.

### Group Picks & My Spots (Ayush Nimeshkumar Patel)

4. As **Marcus**, I want to create, edit, and delete "Where are we eating?" polls with a few
   candidate restaurants so that my friends and I can decide together.
5. As **Marcus**, I want to share a poll link so my friends can log in, vote once each, and see a
   side-by-side comparison of each restaurant's severity score and trajectory so that we pick a
   place everyone trusts.
6. As **Dana**, I want to create, edit, and delete personal "My Spots" lists with notes so that I
   can organize restaurants I like or want to try.

## 4. Design mockups

Mockups live in [`docs/mockups/`](mockups/).

| Screen                | Mockup                                 |
| --------------------- | -------------------------------------- |
| Home + instructions   | _todo_ `mockups/home.png`              |
| Kitchen Reports       | _todo_ `mockups/restaurants.png`       |
| Kitchen Report detail | _todo_ `mockups/restaurant-detail.png` |
| Visit Log             | _todo_ `mockups/visits.png`            |
| Group Picks           | _todo_ `mockups/polls.png`             |
| Poll + comparison     | _todo_ `mockups/poll-detail.png`       |
| My Spots              | _todo_ `mockups/spots.png`             |
| Mobile                | _todo_ `mockups/mobile.png`            |
