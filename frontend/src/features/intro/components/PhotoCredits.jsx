import { PHOTO_CREDITS } from '../photoCredits.js';
import './PhotoCredits.css';

export default function PhotoCredits() {
  return (
    <details className="photo-credits">
      <summary>Photo credits</summary>
      <ul>
        {PHOTO_CREDITS.map((credit) => (
          <li key={credit.source}>
            {credit.use}: <a href={credit.source}>{credit.author}</a>, {credit.license}, via
            Wikimedia Commons (resized).
          </li>
        ))}
      </ul>
    </details>
  );
}
