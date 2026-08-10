import Image from "next/image";
import type { Provider, ProviderRegion } from "@/lib/types";
import { image } from "@/lib/tmdb";

const groups: { key: keyof ProviderRegion; label: string }[] = [
  { key: "free", label: "Free" },
  { key: "ads", label: "Free with ads" },
  { key: "flatrate", label: "Stream" },
  { key: "rent", label: "Rent" },
  { key: "buy", label: "Buy" },
];

function Logos({ providers }: { providers: Provider[] }) {
  return <div className="provider-list">{providers.map((provider) => <span className="provider" key={provider.provider_id} title={provider.provider_name}><Image src={image(provider.logo_path, "w342")} width={42} height={42} alt={provider.provider_name} /><b>{provider.provider_name}</b></span>)}</div>;
}

export default function WatchProviders({ data, region }: { data: ProviderRegion | null; region: string }) {
  const available = groups.filter(({ key }) => Array.isArray(data?.[key]) && (data?.[key] as Provider[]).length > 0);
  return (
    <aside className="watch-panel">
      <span className="eyebrow">Where to watch · {region}</span>
      <h2>{available.length ? "Available online" : "No streaming listing yet"}</h2>
      {available.map(({ key, label }) => <div className="provider-group" key={key}><small>{label}</small><Logos providers={data?.[key] as Provider[]} /></div>)}
      {data?.link && <a className="button provider-button" href={data.link} target="_blank" rel="noreferrer">See provider options ↗</a>}
      <p className="provider-note">Availability changes by region and provider. Jordflix links to legitimate provider listings instead of hosting video files.</p>
    </aside>
  );
}
