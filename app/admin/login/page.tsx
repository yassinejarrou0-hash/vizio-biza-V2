import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  if (await isAuthed()) redirect("/admin");
  const sp = await searchParams;
  const errored = sp.error === "1";
  const next = sp.next || "/admin";

  return (
    <div className="admin-login-wrap">
      <div className="admin-login">
        <h1>Connexion administrateur</h1>
        <p>Saisissez le mot de passe pour accéder au panneau d&apos;administration.</p>
        {errored && (
          <div className="admin-login-error">
            <i className="fa-solid fa-circle-exclamation" /> Mot de passe incorrect.
          </div>
        )}
        <form action="/api/admin/login" method="POST" className="admin-form">
          <input type="hidden" name="next" value={next} />
          <div className="admin-field">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              autoFocus
            />
          </div>
          <button type="submit" className="admin-btn admin-btn-primary" style={{ width: "100%", justifyContent: "center" }}>
            <i className="fa-solid fa-right-to-bracket" /> Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}
