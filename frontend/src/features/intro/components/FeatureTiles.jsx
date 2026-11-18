import FeatureTile from './FeatureTile.jsx';
import Reveal from '../../../components/Reveal.jsx';
import groupDinner from '../../../assets/photos/group-dinner.webp';
import kitchenPass from '../../../assets/photos/kitchen-pass.webp';
import platedDish from '../../../assets/photos/plated-dish.webp';
import setTables from '../../../assets/photos/set-tables.webp';
import './FeatureTiles.css';

const TILES = [
  {
    image: kitchenPass,
    imageAlt: 'A chef working at the pass of a busy restaurant kitchen',
    label: 'Kitchen Reports',
    title: 'Every kitchen. No sugarcoating.',
    text: 'Search any restaurant in Boston. Filter by neighborhood or by which way it’s trending.',
    to: '/restaurants',
    linkLabel: 'Browse reports',
  },
  {
    image: platedDish,
    imageAlt: 'A plated dish in dark sauce on a white plate',
    label: 'Visit Log',
    title: 'Remember the meal. And the kitchen.',
    text: 'Log what you ate. We pin it to the inspection record from that day.',
    to: '/visits',
    linkLabel: 'Open your log',
  },
  {
    image: groupDinner,
    imageAlt: 'A group of friends sharing dinner at a crowded restaurant table',
    label: 'Group Picks',
    title: 'End the group-chat standoff.',
    text: 'Put a few places to a vote and compare their kitchens side by side.',
    to: '/polls',
    linkLabel: 'Start a poll',
  },
  {
    image: setTables,
    imageAlt: 'Two set tables in a dimly lit restaurant',
    label: 'My Spots',
    title: 'Your shortlist, vetted.',
    text: 'Save the places you love and the ones you want to try, with your own notes.',
    to: '/spots',
    linkLabel: 'See your spots',
  },
];

export default function FeatureTiles() {
  return (
    <section className="tiles" aria-labelledby="tiles-title">
      <div className="tiles__inner">
        <Reveal>
          <h2 id="tiles-title" className="tiles__title">
            Eat out like you’ve seen the back.
          </h2>
        </Reveal>
        <div className="tiles__grid">
          {TILES.map((tile, i) => (
            <Reveal key={tile.to} delay={(i % 2) * 100}>
              <FeatureTile {...tile} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// Takes no props.
FeatureTiles.propTypes = {};
