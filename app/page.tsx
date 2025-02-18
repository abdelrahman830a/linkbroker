import BackgroundImage from "@/components/BackgroundImage";
import SearchImages from "@/components/SearchImages";

export default async function Home() {
  return (
    <div className="relative w-full h-screen">
      <BackgroundImage />

      <SearchImages
        searchParams={{
          q: undefined,
        }}
      />
    </div>
  );
}
