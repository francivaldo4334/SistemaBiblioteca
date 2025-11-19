export function useFetchFile() {
  const fetchFile = async (url: string): Promise<File> => {
    const response = await fetch(url);
    const blob = await response.blob();
    const u = new URL(url);
    const pathname = u.pathname;
    const filename = pathname.split("/").pop() || "image"
    const name = filename.split(".")[0]
    const ext = filename.split(".").pop()?.toLowerCase()
    const file = new File([blob],`${name}.${ext}`, {type: blob.type})
    return file;
  };
  return { fetchFile };
}
