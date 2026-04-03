import { AddWordHeader } from "./add-word-header";
import { AddWordForm } from "./add-word-form";

export default function AddWordPage() {
  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8 py-8 w-full px-4 sm:px-5">
      <AddWordHeader />
      <AddWordForm />
    </div>
  );
}
