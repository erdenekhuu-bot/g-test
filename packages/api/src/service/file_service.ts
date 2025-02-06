import path from "path";
import fs from "fs";

const ID_NEST_PROGRESS = ["K", "M", "B", "T"];

export function getServiceIdPath(
  serviceName: string,
  serviceId: number,
  progressLimit: number = 2
) {
  const index1 = 0;
  const index2 = index1 + progressLimit;

  const progress = ID_NEST_PROGRESS.slice(index1, index2).reverse();

  const step = 1000;
  let currentStep = 1;

  for (let i = 0; i < progress.length; i++) {
    currentStep = Math.floor(currentStep * step);
  }

  // let dirPath = path.join(ROOT_DIR, "public", "content", serviceName);
  let dirPath = path.join("public", "content", serviceName);
  let remain = serviceId;
  let range: number;
  let rangeName: string;

  for (const name of progress) {
    range = Math.floor(remain / currentStep);
    rangeName = `${range.toString().padStart(3, "0")}${name}`;
    remain = remain % currentStep;
    currentStep = currentStep / step;
    dirPath = path.join(dirPath, rangeName);
  }
  return dirPath;
}

export function createDirectoriesRecursive(dirPath: string) {
  if (fs.existsSync(dirPath)) {
    return;
  }
  const parts = dirPath.split(path.sep);
  for (let i = 1; i <= parts.length; i++) {
    const currentPath = path.join(...parts.slice(0, i));

    if (!fs.existsSync(currentPath)) {
      fs.mkdirSync(currentPath);
    }
  }
}

export function getFileTypeByMime(mimeType: string): string {
  const pieces = mimeType.split("/");
  let fileType: string = "unknown";
  if (pieces.length > 0) {
    fileType = pieces[0];
  }
  return fileType;
}
