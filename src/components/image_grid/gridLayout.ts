export interface ImageFile {
  filename: string;
  width: number;
  height: number;
  displayName: string;
  blurDataURL?: string;
  isWide?: boolean;
  index?: number;
}

export interface LayoutGridCell {
  image: ImageFile;
  span: number;
}

export function layoutImages(
  images: ImageFile[],
  columnCount: number
): { layout: LayoutGridCell[]; rowEndings: number[] } {
  const gridCells: LayoutGridCell[] = [];
  const copiedImages = Array.from(images);
  const rowEndings: number[] = [];

  if (!columnCount) return { layout: gridCells, rowEndings };

  let currentCol = 0;
  while (copiedImages.length !== 0) {
    const remainingCols = columnCount - currentCol;

    let found = false;
    for (let j = 0; j < copiedImages.length && !found; j++) {
      const image = copiedImages[j];
      const colSpan = image.isWide ? 2 : 1;
      if (colSpan <= remainingCols) {
        gridCells.push({ image, span: colSpan });
        copiedImages.splice(j, 1);
        currentCol += colSpan;
        found = true;
      }
    }

    if (!found) {
      currentCol = 0;
      rowEndings.push(gridCells.length);
    } else if (currentCol === columnCount) {
      currentCol = 0;
      rowEndings.push(gridCells.length);
    } else if (currentCol > columnCount) {
      throw Error("Error in logic. This should never occur");
    }
  }

  rowEndings.unshift(0);
  return { layout: gridCells, rowEndings };
}