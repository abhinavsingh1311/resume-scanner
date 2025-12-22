import Link from "next/link";
import Image from "next/image";
export default function Home() {
  return (
    <div className="h-screen flex flex-col items-center bg-amber-50 bg-[url(/bg-leaves.jpg)] bg-top bg-cover dark:bg-black">
      <div className="flex flex-col h-full w-full max-w-3xl bg-stone-200">
        <main className="flex-1 flex flex-col items-center justify-center p-4 lg:px-16">
          <div className="flex flex-col items-center">
            <Image src="/breadSlice.svg" alt="Logo" width={200} height={200} priority />
            <h1 className="font-bold text-2xl tracking-wide uppercase p-8 text-center text-brown-700">
              Resume scanner
            </h1>
          </div>
          <div className="w-full flex justify-center">
            <p className="font-semibold text-center tracking-wide mt-2 text-brown-500">
              Use this boring website to scan and analyze your resume.
              Uses Claude&apos;s api and some fancy prompts to compare your resume against the job and provides you a new resume that is ATS friendly and aligned to the job.
            </p>
          </div>
          <div className="w-full flex justify-center mt-6 mb-6">
            <Link href='/resume' className="text-center p-2 rounded-md bg-primary text-gray-100 hover:bg-secondary hover:text-[saddlebrown] focus:outline-2 focus:outline-offset-2 cursor-pointer">
              Upload Resume
            </Link>
          </div>

          <div className="w-full flex justify-center hidden md: inline lg:inline">
            <p className="text-center p-2 tracking-wide text-brown-100 text-sm font-light">Yes, that is a donut in the background :p </p>
          </div>
        </main>

        <footer className="flex flex-col items-center w-full bg-brown rounded-t-md p-3">
          <p className="text-slate-50">
            By <Link href="https://github.com/abhinavsingh1311" target="_blank" className="hover:text-[saddlebrown]">Abhinav</Link>
          </p>
          <p className="text-orange-300">
            Uses <Link href="https://console.anthropic.com" target="_blank" className="hover:text-[orange]">Claude API</Link>
          </p>

        </footer>
      </div>
    </div>
  );
}