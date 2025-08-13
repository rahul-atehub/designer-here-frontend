import ArtworkCard from "@/components/ui/ArtworkCard";

const mockArtworks = [
  {
    id: 1,
    title: "Sunset Dreams",
    description: "A dreamy sunset over the ocean.",
    image:
      "https://res.cloudinary.com/dhsv1d1vn/image/upload/v1755061930/Screenshot_from_2025-08-13_10-33-25_mqlre7.png",
    visible: true,
    views: 153,
    uploadDate: "2025-08-01",
  },
  {
    id: 2,
    title: "Urban Nights",
    description: "The city lights at midnight.",
    image:
      "https://res.cloudinary.com/dhsv1d1vn/image/upload/v1755061930/Screenshot_from_2025-08-13_10-33-25_mqlre7.png",
    visible: false,
    views: 98,
    uploadDate: "2025-08-05",
  },
  {
    id: 3,
    title: "Forest Escape",
    description: "A peaceful walk in the woods.",
    image:
      "https://res.cloudinary.com/dhsv1d1vn/image/upload/v1755061930/Screenshot_from_2025-08-13_10-33-25_mqlre7.png",
    visible: true,
    views: 200,
    uploadDate: "2025-08-10",
  },
];
export default function Page() {
  return (
    <div className="container mx-auto flex flex-col sm:flex-row justify-center p-4 gap-8">
      {mockArtworks.map((art) => (
        <ArtworkCard key={art.id} artwork={art} isAdmin={true} />
      ))}
    </div>
  );
}
