import React from 'react';

interface ArticleHeaderProps {
  title: string;
  publishedDate: string;
}

export const ArticleHeader = ({
  title,
  publishedDate,
}: ArticleHeaderProps) => {
  return (
    <header>
      <h1>
        {title}
      </h1>
      <p className="text-sm -mt-4 italic">
        {publishedDate}
      </p>
    </header>
  );
};
