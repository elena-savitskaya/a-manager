import { Loader } from "@/components/ui/loader";

export default function Loading() {
  return (
    <div className="flex-grow flex items-center justify-center">
      <Loader className="min-h-[60vh]" />
    </div>
  );
}
