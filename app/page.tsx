import WholeThing from "@/components/WholeThing";

export default async function Home() {
  return (
    <div>
      <WholeThing
        searchParams={{
          q: undefined,
        }}
      />
    </div>
  );
}
