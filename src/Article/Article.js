import React from 'react';

function Article({ title, text }) {
  return (
    <article className="text-box">
      <h1>{title}</h1>
      <p>{text}</p>
    </article>
  );
}

export default Article;
