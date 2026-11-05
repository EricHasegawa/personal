import Link from 'next/link';

export function Header() {
  return (
    <header
      className="mb-10 border-b border-zinc-200 pb-6 dark:border-zinc-800"
      data-testid="header"
    >
      <Link href="/" className="group block">
        <p className="text-xl font-medium text-black dark:text-white">
          Thoughts and writings
        </p>
        <p className="mt-1 text-sm text-zinc-500 transition-colors group-hover:text-zinc-800 dark:text-zinc-400 dark:group-hover:text-zinc-200">
          Eric Hasegawa
        </p>
      </Link>
    </header>
  );
}
