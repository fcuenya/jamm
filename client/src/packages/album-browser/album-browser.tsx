import Search from "./search";
import AlbumGrid from "./album-grid";

const AlbumBrowser = () => {
  return (
    <div className="flex grow flex-col">
      <div className="flex flex-col m-4 mt-8">
        <Search />
      </div>
      <div className="flex grow m-4 overflow-auto">
        <AlbumGrid />
      </div>
    </div>
  );
};

export default AlbumBrowser;
