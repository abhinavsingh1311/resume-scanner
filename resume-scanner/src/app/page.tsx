import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div>
          <div>
            <h1>Resume scanner</h1>
            <p>Use this boring website to scan and analyze your resume <br />
              Uses Claude's api and some fancy prompts to compare your resume against the job and provides you a new resume that is ATS friendly and aligned to the job.
            </p>
          </div>
          <div className="">
            <Link href='/resume' style={{ textDecoration: "underline", color: "LinkText", cursor: "pointer" }} >
              Upload a resume file here!
            </Link>
          </div>
        </div>

      </main>
    </div>
  );
}
