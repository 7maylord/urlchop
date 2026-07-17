import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <section className="mx-auto flex max-w-lg flex-col items-center px-5 py-24 text-center">
      <p className="font-mono text-6xl font-bold text-accent">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold tracking-tight">
        This one got chopped a little too short.
      </h1>
      <p className="mt-3 text-muted">
        The page you&rsquo;re after doesn&rsquo;t exist — or the link expired.
      </p>
      <Link to="/" className="mt-8 uc-btn-accent">
        Back to shortening
      </Link>
    </section>
  );
};

export default NotFound;
