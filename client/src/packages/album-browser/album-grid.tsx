import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useAlbumData, AlbumData } from "@packages/core/data";

interface AlbumItemProps {
  albumArt: string;
  title: string;
  artist: string;
}

const AlbumItem = ({ albumArt, title, artist }: AlbumItemProps) => (
  <div className="w-48 hover:brightness-50 cursor-pointer">
    <figure>
      <img src={albumArt} alt="Album Art" className="rounded" />
    </figure>
    <div>
      <h3 className="text-sm font-bold line-clamp-2">{title}</h3>
      <p className="text-xs line-clamp-2">{artist}</p>
    </div>
  </div>
);

interface SortableItemProps {
  album: AlbumData;
}

const SortableItem = ({ album }: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: album.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      data-key={`album-index-${album.id}`}
      key={`album-index-${album.id}`}
      className="focus-visible:outline-none"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <AlbumItem
        title={album.title}
        artist={album.artist}
        albumArt={album.albumArt}
      />
    </div>
  );
};

const AlbumGrid = () => {
  const { isLoading, data: albums } = useAlbumData();
  const [sortedAlbums, setSortedAlbums] = useState<AlbumData[]>([]);
  useEffect(() => {
    if (albums) setSortedAlbums(albums);
  }, [albums]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setSortedAlbums((prev) => {
        const oldIndex = prev.findIndex((album) => album.id === active.id);
        const newIndex = prev.findIndex((album) => album.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={sortedAlbums.map((album) => album.id)}>
        <div className="flex flex-row flex-wrap justify-between gap-3">
          {sortedAlbums.map((album) => (
            <SortableItem album={album} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default AlbumGrid;

/*

// import { useVirtualizer } from "@tanstack/react-virtual";

// Virtualizer setup
const parentRef = React.useRef(null);
const rowVirtualizer = useVirtualizer({
  count: albums.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 60, // Adjust height as needed
  overscan: 10, // Number of extra items rendered beyond the viewport for smoother scrolling
});

ref={parentRef}

<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
    gap: "8px",
    padding: "10px",
    height: rowVirtualizer.getTotalSize(),
    position: "relative",
  }}
>
  {
    rowVirtualizer.getVirtualItems().map(
      (virtualRow) => {
          const item = items[virtualRow.index];
        return (
          <div
            key={item.id}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              transform: `translateY(${virtualRow.start}px)`,
              width: "100%",
            }}
          >                    
        );
      }
    )
  }
</div> 

*/
