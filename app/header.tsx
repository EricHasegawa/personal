import Link from 'next/link';

export function Header() {
  return (
    <header className="mb-8 flex items-center justify-between">
      <div>
        <Link
          href="/"
          className="text-xl font-medium text-black dark:text-white"
        >
          Root Function
        </Link>
        <p className="text-lg text-zinc-600 dark:text-zinc-500">
          Eric Hasegawa&apos;s thoughts and writings.
        </p>
      </div>
    </header>
  );
}
