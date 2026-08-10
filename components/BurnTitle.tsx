import type { ReactNode } from "react";

type Props = {
  text: string;
};

function isWordCharacter(char: string) {
  return /[\p{L}\p{N}]/u.test(char);
}

function burnedCharacterIndexes(text: string) {
  const characters = Array.from(text);
  const wordIndexes = characters
    .map((char, index) => (isWordCharacter(char) ? index : -1))
    .filter(index => index >= 0);

  const selected = new Set<number>();
  const count = wordIndexes.length;

  if (!count) return selected;

  // Keep the treatment sparse: for "BURN" this resolves to B, R and N.
  selected.add(wordIndexes[0]);
  if (count >= 4) selected.add(wordIndexes[Math.floor(count * 0.55)]);
  if (count >= 11) selected.add(wordIndexes[Math.floor(count * 0.28)]);
  if (count >= 2) selected.add(wordIndexes[count - 1]);

  return selected;
}

export default function BurnTitle({ text }: Props) {
  const characters = Array.from(text);
  const burned = burnedCharacterIndexes(text);
  const parts: ReactNode[] = [];
  let plainText = "";
  let plainStart = 0;

  function flushPlainText() {
    if (!plainText) return;
    parts.push(<span key={`plain-${plainStart}`}>{plainText}</span>);
    plainText = "";
  }

  characters.forEach((char, index) => {
    if (!burned.has(index)) {
      if (!plainText) plainStart = index;
      plainText += char;
      return;
    }

    flushPlainText();
    parts.push(
      <span className="burn-title-char is-burned" key={`burn-${index}-${char}`}>
        {char}
      </span>,
    );
  });

  flushPlainText();
  return <>{parts}</>;
}
