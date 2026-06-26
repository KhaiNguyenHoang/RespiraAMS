import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <main className="flex justify-center items-center">
        <Button asChild={true}>
          <Link href={"/manager/antibiotic-spectra"}>To sample</Link>
        </Button>
      </main>
    </>
  );
}
