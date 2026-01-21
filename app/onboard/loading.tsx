import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg">Loading...</p> <Spinner className="ml-2" />
    </div>
  );
}