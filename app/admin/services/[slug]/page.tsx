import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { getServiceBySlug } from "@/lib/services";
import ServiceFormClient from "@/components/admin/ServiceFormClient";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  await requireAuth();
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();
  return (
    <>
      <div className="admin-page-head">
        <h1>{service.tag}</h1>
        <span className="crumb">
          <Link href="/admin">Admin</Link> / <Link href="/admin/services">Services</Link> / {service.slug}
          {" · "}
          <Link href={`/services/${service.slug}`} target="_blank">Voir la page <i className="fa-solid fa-arrow-up-right-from-square" /></Link>
        </span>
      </div>
      <ServiceFormClient initial={service} />
    </>
  );
}
