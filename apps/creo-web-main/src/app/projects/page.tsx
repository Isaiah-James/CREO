export default function ProjectsHomepage() {
  return (
    <div className="grid desktop:grid-cols-6 gap-4 w-full p-4">
      <div className="rounded-2xl border desktop:col-span-1 2xl:flex flex-col hidden"></div>
      <div className="rounded-2xl desktop:col-span-5 flex flex-col gap-4">
        <div className="flex h-1/3 border rounded-2xl"></div>
        <div className="flex h-2/3 border rounded-2xl"></div>
      </div>
    </div>
  );
}
