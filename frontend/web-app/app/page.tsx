import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
    <div>
      <h3 className="text-2xl font-semibold">User Session Data:</h3>
      {session ? (<div><pre>{JSON.stringify(session, null, 2)}</pre></div>) : (<div>Not signed in</div>)}
    </div>
  );
}
