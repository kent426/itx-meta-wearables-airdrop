import mkdirp from "mkdirp";
import path from "path";
const parentFolderPath = path.resolve(__dirname, "../../../", "log");

export const mkdirLogFolder = async ({
  thisTimeFolder,
}: {
  thisTimeFolder: string;
}) => {
  const folderPath = path.resolve(parentFolderPath, thisTimeFolder);
  await mkdirp(folderPath);
  return folderPath;
};
