export function AddWordHeader() {
  return (
    <div className="flex flex-col gap-2 items-center justify-center text-center">
      <h3 className="text-4xl font-extrabold tracking-tight">
        Додати Слово
      </h3>
      <p className="text-lg text-muted-foreground max-w-lg">
        Введіть слово англійською — AI запропонує переклад та приклади.
      </p>
    </div>
  );
}
